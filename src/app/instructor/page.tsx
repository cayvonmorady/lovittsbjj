import { Metadata } from 'next'
import { client } from '../../../sanity/lib/client'
import Image from 'next/image'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const metadata: Metadata = {
  title: "Our Instructors | Lovitts BJJ",
  description: "Meet our expert Brazilian Jiu-Jitsu instructors at Lovitts BJJ in Concord. Learn from experienced professionals in a supportive environment.",
  keywords: "BJJ instructors, Brazilian Jiu-Jitsu coaches, Concord BJJ instructors, martial arts teachers, Lovitts BJJ coaches",
  openGraph: {
    title: "Our Instructors | Lovitts BJJ",
    description: "Meet our expert Brazilian Jiu-Jitsu instructors at Lovitts BJJ in Concord.",
    url: "https://lovittsbjj.com/instructor",
    type: "profile",
  },
};

// Add revalidation
export const revalidate = 0 // revalidate this page on every request

const builder = imageUrlBuilder(client)

function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

interface SocialMedia {
  instagram?: string
  facebook?: string
  youtube?: string
}

interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
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
  image?: SanityImage
  bio?: SanityBlockContent[]
  achievements?: string[]
  certifications?: string[]
  socialMedia?: SocialMedia
}

async function getInstructorsData(): Promise<InstructorData[]> {
  try {
    const query = `*[_type == "instructor"] | order(order asc){
      _id,
      name,
      title,
      secondaryTitle,
      order,
      image,
      bio,
      achievements,
      certifications,
      socialMedia
    }`
    const data = await client.fetch(query)
    return data || []
  } catch (error) {
    console.error('Error fetching instructor data:', error)
    return []
  }
}

export default async function InstructorPage() {
  const instructorsData = await getInstructorsData()

  if (!instructorsData || instructorsData.length === 0) {
    return (
      <main className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-4xl font-[--font-bebas-neue] text-text mb-2 tracking-wider">
            No instructor data available
          </h1>
        </div>
      </main>
    )
  }

  // Create pairs of instructors for the grid layout
  const instructorPairs = []
  for (let i = 0; i < instructorsData.length; i += 2) {
    instructorPairs.push(instructorsData.slice(i, i + 2))
  }

  return (
    <main className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-5xl font-[--font-bebas-neue] text-text mb-8 tracking-wider text-center">
          Our Instructors
        </h1>
        
        <div className="space-y-20">
          {instructorPairs.map((pair, pairIndex) => (
            <div key={`pair-${pairIndex}`} className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {pair.map((instructor) => (
                <div key={instructor._id} className="flex flex-col items-center">
                  {/* Instructor Image - Full width with adjusted height */}
                  {instructor.image?.asset && (
                    <div className="w-full aspect-[2/2] relative overflow-hidden rounded-lg shadow-lg mb-6">
                      <Image
                        src={urlFor(instructor.image).url()}
                        alt={instructor.image.alt || instructor.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  )}

                  {/* Instructor Info - Below image, centered with margins */}
                  <div className="w-full flex flex-col items-center text-center">
                    <h2 className="text-3xl font-[--font-bebas-neue] text-text mb-2 tracking-wider">
                      {instructor.name}
                    </h2>
                    <h3 className="text-xl text-brand mb-2">{instructor.title}</h3>
                    {instructor.secondaryTitle && (
                      <h4 className="text-lg text-muted mb-6">{instructor.secondaryTitle}</h4>
                    )}
                    {!instructor.secondaryTitle && <div className="mb-6"></div>}

                    {/* Content with margins */}
                    <div className="w-full px-8">
                      {/* Biography - without title */}
                      {instructor.bio && instructor.bio.length > 0 && (
                        <div className="mb-8">
                          {instructor.bio.map((block, index) => (
                            <p key={index} className="text-text2 mb-4">
                              {block.children?.map((child: SanityBlockChild) => child.text).join('')}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Achievements */}
                      {instructor.achievements && instructor.achievements.length > 0 && (
                        <div className="mb-8">
                          <h4 className="text-2xl font-[--font-bebas-neue] text-text mb-4 tracking-wider text-center">Achievements</h4>
                          <ul className="space-y-2 text-left">
                            {instructor.achievements.map((achievement, index) => (
                              <li key={index} className="flex items-start gap-2 text-text2">
                                <span className="text-brand mt-1 flex-shrink-0">•</span>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Certifications */}
                      {instructor.certifications && instructor.certifications.length > 0 && (
                        <div className="mb-8">
                          <h4 className="text-2xl font-[--font-bebas-neue] text-text mb-4 tracking-wider text-center">Certifications</h4>
                          <ul className="space-y-2 text-left">
                            {instructor.certifications.map((cert, index) => (
                              <li key={index} className="flex items-start gap-2 text-text2">
                                <span className="text-brand mt-1 flex-shrink-0">•</span>
                                <span>{cert}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Social Media */}
                      {instructor.socialMedia && Object.values(instructor.socialMedia).some(Boolean) && (
                        <div className="mb-8">
                          <h4 className="text-2xl font-[--font-bebas-neue] text-text mb-4 tracking-wider text-center">Social Media</h4>
                          <div className="flex flex-wrap gap-3 justify-center">
                            {instructor.socialMedia.instagram && (
                              <a
                                key="instagram"
                                href={instructor.socialMedia.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline px-4 py-2 text-sm font-sans tracking-normal"
                              >
                                Instagram
                              </a>
                            )}
                            {instructor.socialMedia.facebook && (
                              <a
                                key="facebook"
                                href={instructor.socialMedia.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline px-4 py-2 text-sm font-sans tracking-normal"
                              >
                                Facebook
                              </a>
                            )}
                            {instructor.socialMedia.youtube && (
                              <a
                                key="youtube"
                                href={instructor.socialMedia.youtube}
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
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
