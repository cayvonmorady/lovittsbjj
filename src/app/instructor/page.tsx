import { Metadata } from 'next'
import { client } from '../../../sanity/lib/client'
import Image from 'next/image'
import { endTimer, startTimer, timeAsync, timeSync } from '@/lib/serverTiming'

export const metadata: Metadata = {
  title: "Our Instructors | Lovitts BJJ",
  description: "Meet the Brazilian Jiu-Jitsu instructors at Lovitt's BJJ in Concord. Train with experienced coaches serving students from Concord and nearby East Bay cities.",
  keywords: "BJJ instructors, Brazilian Jiu-Jitsu coaches, Concord BJJ instructors, Pleasant Hill martial arts, Walnut Creek BJJ coaches, Lovitts BJJ coaches",
  alternates: {
    canonical: "/instructor",
  },
  openGraph: {
    title: "Our Instructors | Lovitts BJJ",
    description: "Meet the BJJ instructors coaching students in Concord and nearby East Bay communities.",
    url: "https://lovittsbjj.com/instructor",
    type: "profile",
  },
};

// Add revalidation
export const revalidate = 0 // revalidate this page on every request

interface SocialMedia {
  instagram?: string
  facebook?: string
  youtube?: string
}

// Define the block content interface for Sanity's rich text
interface SanityBlockContent {
  _type: string
  children: SanityBlockChild[]
  style?: string
  markDefs?: unknown[]
}

interface SanityBlockChild {
  _type: string
  text: string
  marks?: string[]
}

interface InstructorData {
  _id: string
  name: string
  title: string
  secondaryTitle?: string
  order?: number
  bio?: SanityBlockContent[]
  achievements?: string[]
  certifications?: string[]
  socialMedia?: SocialMedia
}

const fallbackMarkInstructor: InstructorData = {
  _id: 'markangelo-lovitt',
  name: 'Markangelo Lovitt',
  title: 'Owner and Head Instructor',
  secondaryTitle: 'Brazilian Jiu-Jitsu Brown Belt',
  bio: [
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'Markangelo Lovitt owns and coaches Lovitts BJJ, bringing more than 10 years of training experience to students in Concord.',
        },
      ],
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'He trained under David Freeman, a black belt under Caio Terra, and opened the gym in 2018.',
        },
      ],
    },
  ],
}

function blockToText(block: SanityBlockContent): string {
  return block.children?.map((child) => child.text).join('') || ''
}

function getMarkInstructor(instructors: InstructorData[]): InstructorData {
  return (
    instructors.find((instructor) =>
      /mark|lovitt/i.test(instructor.name || '')
    ) ||
    fallbackMarkInstructor
  )
}

async function getInstructorsData(): Promise<InstructorData[]> {
  try {
    const query = `*[_type == "instructor"] | order(order asc){
      _id,
      name,
      title,
      secondaryTitle,
      order,
      bio,
      achievements,
      certifications,
      socialMedia
    }`
    const data = await timeAsync(
      'GET /instructor Sanity query',
      () => client.fetch(query)
    )
    return data || []
  } catch (error) {
    console.error('Error fetching instructor data:', error)
    return []
  }
}

export default async function InstructorPage() {
  const totalLabel = startTimer('GET /instructor total')

  try {
    const instructorsData = await getInstructorsData()
    const markInstructor = timeSync('GET /instructor select-mark', () =>
      getMarkInstructor(instructorsData || [])
    )

    return (
    <main className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <h1
          className="text-5xl uppercase tracking-widest text-text mb-2"
          style={{ fontFamily: 'var(--font-bebas-neue)' }}
        >
          Our Instructors
        </h1>
        <p className="text-muted mb-8">Meet the coach behind Lovitts BJJ.</p>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(280px,0.82fr)_minmax(0,1.18fr)] lg:gap-12 lg:items-start">
          <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-border bg-surface shadow-lg sm:min-h-[680px] lg:min-h-[760px]">
            <Image
              src="/assets/images/mark.jpg"
              alt="Markangelo Lovitt in a Brazilian Jiu-Jitsu gi"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority
            />
          </div>

          <div className="flex min-h-full flex-col justify-center py-2 lg:py-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand">
              Head Instructor
            </p>
            <h2 className="text-4xl font-[--font-bebas-neue] text-text tracking-wider sm:text-5xl">
              {markInstructor.name}
            </h2>
            <h3 className="mt-2 text-2xl text-brand">{markInstructor.title}</h3>
            {markInstructor.secondaryTitle && (
              <h4 className="mt-2 text-lg text-muted">{markInstructor.secondaryTitle}</h4>
            )}

            {markInstructor.bio && markInstructor.bio.length > 0 && (
              <div className="mt-8 max-w-3xl space-y-4">
                {markInstructor.bio.map((block, index) => {
                  const text = blockToText(block)

                  if (!text) {
                    return null
                  }

                  return (
                    <p key={index} className="text-lg leading-8 text-text2">
                      {text}
                    </p>
                  )
                })}
              </div>
            )}

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {markInstructor.achievements && markInstructor.achievements.length > 0 && (
                <div>
                  <h4 className="mb-4 text-2xl font-[--font-bebas-neue] text-text tracking-wider">
                    Achievements
                  </h4>
                  <ul className="space-y-2">
                    {markInstructor.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-2 text-text2">
                        <span className="mt-1 flex-shrink-0 text-brand">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {markInstructor.certifications && markInstructor.certifications.length > 0 && (
                <div>
                  <h4 className="mb-4 text-2xl font-[--font-bebas-neue] text-text tracking-wider">
                    Certifications
                  </h4>
                  <ul className="space-y-2">
                    {markInstructor.certifications.map((cert, index) => (
                      <li key={index} className="flex items-start gap-2 text-text2">
                        <span className="mt-1 flex-shrink-0 text-brand">•</span>
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {markInstructor.socialMedia && Object.values(markInstructor.socialMedia).some(Boolean) && (
              <div className="mt-10">
                <h4 className="mb-4 text-2xl font-[--font-bebas-neue] text-text tracking-wider">
                  Social Media
                </h4>
                <div className="flex flex-wrap gap-3">
                  {markInstructor.socialMedia.instagram && (
                    <a
                      key="instagram"
                      href={markInstructor.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline px-4 py-2 text-sm font-sans tracking-normal"
                    >
                      Instagram
                    </a>
                  )}
                  {markInstructor.socialMedia.facebook && (
                    <a
                      key="facebook"
                      href={markInstructor.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline px-4 py-2 text-sm font-sans tracking-normal"
                    >
                      Facebook
                    </a>
                  )}
                  {markInstructor.socialMedia.youtube && (
                    <a
                      key="youtube"
                      href={markInstructor.socialMedia.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline px-4 py-2 text-sm font-sans tracking-normal"
                    >
                      YouTube
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
    )
  } finally {
    endTimer(totalLabel)
  }
}
