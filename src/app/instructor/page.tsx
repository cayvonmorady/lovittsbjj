import { client } from '../../../sanity/lib/client'
import Image from 'next/image'
import ScrollIndicator from '@/components/ScrollIndicator'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

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

interface InstructorData {
  name: string
  title: string
  image?: SanityImage
  bio?: any[]
  achievements?: string[]
  certifications?: string[]
  socialMedia?: SocialMedia
}

async function getInstructorData(): Promise<InstructorData | null> {
  try {
    const query = `*[_type == "instructor"][0]{
      name,
      title,
      image,
      bio,
      achievements,
      certifications,
      socialMedia
    }`
    const data = await client.fetch(query)
    return data || null
  } catch (error) {
    console.error('Error fetching instructor data:', error)
    return null
  }
}

export default async function InstructorPage() {
  const instructorData = await getInstructorData()

  if (!instructorData) {
    return (
      <main className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-4xl font-[--font-bebas-neue] text-white mb-2 tracking-wider">
            No instructor data available
          </h1>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <ScrollIndicator />
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Instructor Image */}
          {instructorData.image?.asset && (
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
              <Image
                src={urlFor(instructorData.image).url()}
                alt={instructorData.image.alt || instructorData.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          )}

          {/* Instructor Info */}
          <div>
            <h1 className="text-4xl font-[--font-bebas-neue] text-white mb-2 tracking-wider">
              {instructorData.name}
            </h1>
            <h2 className="text-xl text-blue-500 mb-6">{instructorData.title}</h2>

            {/* Biography */}
            {instructorData.bio && instructorData.bio.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-[--font-bebas-neue] text-white mb-4 tracking-wider">Biography</h3>
                {instructorData.bio.map((block, index) => (
                  <p key={index} className="text-gray-300 mb-4">
                    {block.children?.map((child: any) => child.text).join('')}
                  </p>
                ))}
              </div>
            )}

            {/* Achievements */}
            {instructorData.achievements && instructorData.achievements.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-[--font-bebas-neue] text-white mb-4 tracking-wider">Achievements</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  {instructorData.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Certifications */}
            {instructorData.certifications && instructorData.certifications.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-[--font-bebas-neue] text-white mb-4 tracking-wider">Certifications</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  {instructorData.certifications.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Social Media */}
            {instructorData.socialMedia && Object.values(instructorData.socialMedia).some(Boolean) && (
              <div className="mb-8">
                <h3 className="text-2xl font-[--font-bebas-neue] text-white mb-4 tracking-wider">Social Media</h3>
                <ul className="list-none list-inside text-gray-300 space-y-2">
                  {instructorData.socialMedia.instagram && (
                    <li key="instagram">
                      <a href={instructorData.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                        Instagram
                      </a>
                    </li>
                  )}
                  {instructorData.socialMedia.facebook && (
                    <li key="facebook">
                      <a href={instructorData.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                        Facebook
                      </a>
                    </li>
                  )}
                  {instructorData.socialMedia.youtube && (
                    <li key="youtube">
                      <a href={instructorData.socialMedia.youtube} target="_blank" rel="noopener noreferrer">
                        YouTube
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
