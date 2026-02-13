const { createClient } = require('@sanity/client')
const dotenv = require('dotenv')

dotenv.config()

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-27',
})

const targetClasses = [
  { dayOfWeek: 'Tuesday', startTime: '17:00', name: 'Tiny Kids BJJ', duration: 30, type: ['tiny-kids'], uniform: ['Gi'] },
  { dayOfWeek: 'Tuesday', startTime: '17:30', name: 'Kids BJJ', duration: 60, type: ['kids'], uniform: ['Gi'] },
  { dayOfWeek: 'Tuesday', startTime: '18:30', name: 'Kids BJJ 13+', duration: 60, type: ['kids-13'], uniform: ['Gi'] },
  { dayOfWeek: 'Wednesday', startTime: '17:30', name: 'Kids BJJ', duration: 60, type: ['kids'], uniform: ['No Gi'] },
  { dayOfWeek: 'Wednesday', startTime: '18:30', name: 'Kids BJJ 13+', duration: 60, type: ['kids-13'], uniform: ['No Gi'] },
  { dayOfWeek: 'Thursday', startTime: '17:00', name: 'Tiny Kids BJJ', duration: 30, type: ['tiny-kids'], uniform: ['Gi'] },
  { dayOfWeek: 'Thursday', startTime: '17:30', name: 'Kids BJJ', duration: 60, type: ['kids'], uniform: ['Gi'] },
  { dayOfWeek: 'Thursday', startTime: '18:30', name: 'Kids BJJ 13+', duration: 60, type: ['kids-13'], uniform: ['Gi'] },
  { dayOfWeek: 'Friday', startTime: '17:30', name: 'Kids BJJ', duration: 60, type: ['kids'], uniform: ['Gi'] },
  { dayOfWeek: 'Friday', startTime: '18:30', name: 'Kids BJJ 13+', duration: 60, type: ['kids-13'], uniform: ['Gi'] },
]

const targetDays = ['Tuesday', 'Wednesday', 'Thursday', 'Friday']
const youthTypes = ['tiny-kids', 'kids', 'kids-13']

const defaultKidsPlans = [
  {
    name: 'Kids Monthly',
    price: '120',
    perMonth: true,
    features: ['Month-to-Month Commitment', 'Unlimited BJJ Classes'],
    highlighted: false,
  },
  {
    name: 'Kids Annual',
    price: '100',
    perMonth: true,
    features: ['Best Value - Save $240/year', 'Unlimited BJJ Classes', 'Lovitts BJJ Gi'],
    highlighted: true,
  },
  {
    name: 'Drop-In Class',
    price: '25',
    perMonth: false,
    features: ['Single Class Access', 'No Commitment', 'Great for Visitors'],
    highlighted: false,
  },
]

function normalizeStringArray(value) {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') return [value]
  return []
}

function getTargetClassId(dayOfWeek, startTime) {
  const dayKey = dayOfWeek.toLowerCase()
  const timeKey = startTime.replace(':', '-')
  return `class-kids-update-${dayKey}-${timeKey}`
}

function classKey(dayOfWeek, startTime) {
  return `${dayOfWeek}|${startTime}`
}

function shallowArrayEqual(a, b) {
  if (a.length !== b.length) return false
  return a.every((v, i) => v === b[i])
}

function isStandardKidsTitle(title) {
  return /^Kids BJJ(\b|\s|\n|\(|$)/.test((title || '').trim())
}

async function publishDraftIfExists(id) {
  const draftId = `drafts.${id}`
  const draft = await client.fetch('*[_id == $draftId][0]', { draftId })
  if (!draft) return false

  await client
    .transaction()
    .createOrReplace({ ...draft, _id: id })
    .delete(draftId)
    .commit()
  return true
}

async function upsertSchedule() {
  const targetByKey = new Map(targetClasses.map((entry) => [classKey(entry.dayOfWeek, entry.startTime), entry]))
  const existing = await client.fetch(
    `*[_type == "class" && dayOfWeek in $days && (count(type[@ in $types]) > 0)]{
      _id, name, dayOfWeek, startTime, duration, type, uniform
    }`,
    { days: targetDays, types: youthTypes }
  )

  const deleted = []
  for (const doc of existing) {
    const day = doc.dayOfWeek || ''
    const time = doc.startTime || ''
    const key = classKey(day, time)
    const expected = targetByKey.get(key)
    if (!expected) {
      await client.delete(doc._id)
      deleted.push(doc._id)
      continue
    }

    const existingTypes = normalizeStringArray(doc.type)
    const existingUniform = normalizeStringArray(doc.uniform)
    const matchesExpected =
      doc.name === expected.name &&
      doc.duration === expected.duration &&
      shallowArrayEqual(existingTypes, expected.type) &&
      shallowArrayEqual(existingUniform, expected.uniform)

    if (!matchesExpected) {
      await client.delete(doc._id)
      deleted.push(doc._id)
    }
  }

  const upserted = []
  const published = []
  for (const entry of targetClasses) {
    const id = getTargetClassId(entry.dayOfWeek, entry.startTime)
    await client.createOrReplace({
      _id: id,
      _type: 'class',
      name: entry.name,
      dayOfWeek: entry.dayOfWeek,
      startTime: entry.startTime,
      duration: entry.duration,
      type: entry.type,
      uniform: entry.uniform,
    })
    upserted.push(id)
    if (await publishDraftIfExists(id)) {
      published.push(id)
    }
  }

  const staleDrafts = await client.fetch(
    '*[_id in path("drafts.**") && _type == "class" && dayOfWeek in $days && (count(type[@ in $types]) > 0)]{_id}',
    { days: targetDays, types: youthTypes }
  )
  for (const draft of staleDrafts) {
    await client.delete(draft._id)
    deleted.push(draft._id)
  }

  return { upserted, deleted, published }
}

async function upsertKidsPricing() {
  const existing = await client.fetch('*[_type == "pricing" && category == "kids"][0]{_id, category, plans}')

  if (existing && existing._id) {
    await client.patch(existing._id).set({ category: 'kids' }).commit()
    const published = await publishDraftIfExists(existing._id)
    return { id: existing._id, created: false, published }
  }

  const createdId = 'pricing-kids'
  await client.createOrReplace({
    _id: createdId,
    _type: 'pricing',
    category: 'kids',
    plans: defaultKidsPlans,
  })
  const published = await publishDraftIfExists(createdId)
  return { id: createdId, created: true, published }
}

function withKeys(programs) {
  return programs.map((program, index) => ({
    _key: program._key || `program-${index + 1}`,
    ...program,
  }))
}

function patchKidsPrograms(programs) {
  const existing = withKeys(Array.isArray(programs) ? programs : [])
  let hasKids13 = false

  const updated = existing.map((program) => {
    const title = program.title || ''
    const description = (program.description || '').toLowerCase()

    if (title.includes('Kids BJJ 13+')) {
      hasKids13 = true
      return program
    }

    // Recover tiny-kids title if it was accidentally overwritten in an earlier run.
    if (isStandardKidsTitle(title) && (description.includes('youngest') || description.includes('coordination'))) {
      return {
        ...program,
        title: 'Tiny Kids BJJ (Ages 4-5)',
      }
    }

    if (isStandardKidsTitle(title) && !title.includes('Tiny')) {
      return {
        ...program,
        title: 'Kids BJJ\n(Ages 7-12)',
      }
    }
    return program
  })

  if (!hasKids13) {
    const kidsProgram = existing.find((program) => isStandardKidsTitle(program.title || ''))
    updated.push({
      _key: 'kids-13',
      title: 'Kids BJJ 13+',
      description:
        'Our Kids BJJ 13+ classes are designed for older youth ready for more advanced technique development, positional awareness, and structured sparring in a supportive, disciplined environment.',
      image: kidsProgram ? kidsProgram.image : undefined,
    })
  }

  return updated
}

async function upsertHomepagePrograms() {
  const homepage = await client.fetch('*[_type == "homepage"] | order(_updatedAt desc)[0]{_id, programs}')
  const homepageId = (homepage && homepage._id) || 'homepage'
  const programs = patchKidsPrograms(homepage ? homepage.programs : [])

  await client
    .patch(homepageId)
    .setIfMissing({ _type: 'homepage' })
    .set({ programs })
    .commit()

  const published = await publishDraftIfExists(homepageId)
  return { id: homepageId, patched: true, published }
}

async function verifyOutcome() {
  const classCheck = await client.fetch(
    `*[_type == "class" && !(_id in path("drafts.**")) && dayOfWeek in $days && name in ["Tiny Kids BJJ", "Kids BJJ", "Kids BJJ 13+"]] | order(dayOfWeek asc, startTime asc) {
      _id, name, dayOfWeek, startTime, duration, type, uniform
    }`,
    { days: targetDays }
  )

  const homepageCheck = await client.fetch(
    `*[_type == "homepage"] | order(_updatedAt desc)[0]{
      _id,
      "programTitles": programs[].title
    }`
  )

  const pricingCheck = await client.fetch('*[_type == "pricing" && category == "kids"][0]{_id, category}')

  return { classCheck, homepageCheck, pricingCheck }
}

async function main() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    throw new Error('Missing required Sanity env vars: NEXT_PUBLIC_SANITY_PROJECT_ID and/or SANITY_API_TOKEN')
  }

  console.log('Starting Kids 13+ Sanity population update...')
  const scheduleResult = await upsertSchedule()
  const pricingResult = await upsertKidsPricing()
  const homepageResult = await upsertHomepagePrograms()
  const verification = await verifyOutcome()

  console.log('Update complete.')
  console.log(`Classes upserted: ${scheduleResult.upserted.length}`)
  console.log(`Classes deleted (conflicts): ${scheduleResult.deleted.length}`)
  console.log(`Homepage patched: ${homepageResult.patched ? 'yes' : 'no'}`)
  console.log('Touched IDs:', {
    classIds: scheduleResult.upserted,
    deletedClassIds: scheduleResult.deleted,
    pricingId: pricingResult.id,
    homepageId: homepageResult.id,
  })
  console.log('Published from drafts:', [
    ...scheduleResult.published,
    ...(pricingResult.published ? [pricingResult.id] : []),
    ...(homepageResult.published ? [homepageResult.id] : []),
  ])
  console.log('Verification snapshot:', JSON.stringify(verification, null, 2))
}

main().catch((error) => {
  console.error('Kids 13+ Sanity population failed:', error)
  process.exit(1)
})
