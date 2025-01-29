import { client } from '../../../sanity/lib/client'
import Image from 'next/image'

interface SocialMedia {
  instagram?: string
  facebook?: string
  youtube?: string
}

interface InstructorData {
  name: string
  title: string
  image: {
    url: string
    alt?: string
  }
  bio: string[]
  achievements: string[]
  certifications: string[]
  socialMedia: SocialMedia
}

// Development fallback data
const devInstructorData: InstructorData = {
  name: "Markangelo Lovitt",
  title: "Head Instructor & Founder",
  image: {
    url: "/assets/images/instructor/mark.jpg",
    alt: "Markangelo Lovitt"
  },
  bio: [
    "Markangelo Lovitt is a dedicated Brazilian Jiu-Jitsu practitioner and instructor with over a decade of experience on the mats.",
    "His teaching philosophy emphasizes technical precision, practical application, and creating a supportive learning environment for students of all levels."
  ],
  achievements: [
    "Black Belt under Professor John Doe",
    "Multiple-time IBJJF competitor",
    "10+ years of teaching experience"
  ],
  certifications: [
    "IBJJF Certified Black Belt",
    "First Aid and CPR Certified",
    "Kids BJJ Instructor Certification"
  ],
  socialMedia: {
    instagram: "https://instagram.com/lovittsbjj",
    facebook: "https://facebook.com/lovittsbjj"
  }
}

async function getInstructorData(): Promise<InstructorData> {
  try {
    // In development, return the hardcoded data
    if (process.env.NODE_ENV === 'development') {
      return devInstructorData
    }

    const query = `*[_type == "instructor"][0]{
      name,
      title,
      "image": {
        "url": image.asset->url,
        "alt": image.alt
      },
      bio,
      achievements,
      certifications,
      "socialMedia": {
        "instagram": socialMedia.instagram,
        "facebook": socialMedia.facebook,
        "youtube": socialMedia.youtube
      }
    }`
    const data = await client.fetch(query)
    
    if (!data) {
      console.log('No data from Sanity, using development data')
      return devInstructorData
    }

    return data
  } catch (error) {
    console.error('Error fetching instructor data:', error)
    return devInstructorData
  }
}

export default async function InstructorPage() {
  const instructorData = await getInstructorData()

  return (
    <main className="min-h-[calc(70vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Instructor Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg shadow-lg">
            <Image
              src={instructorData.image.url}
              alt={instructorData.image.alt || instructorData.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Instructor Info */}
          <div>
            <h1 className="text-4xl font-[--font-bebas-neue] text-white mb-2 tracking-wider">
              {instructorData.name}
            </h1>
            <h2 className="text-xl text-blue-500 mb-6">{instructorData.title}</h2>

            {/* Biography */}
            <div className="mb-8">
              <h3 className="text-2xl font-[--font-bebas-neue] text-white mb-4 tracking-wider">Biography</h3>
              {instructorData.bio.map((paragraph, index) => (
                <p key={index} className="text-gray-300 mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Achievements */}
            <div className="mb-8">
              <h3 className="text-2xl font-[--font-bebas-neue] text-white mb-4 tracking-wider">Achievements</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                {instructorData.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>

            {/* Certifications */}
            <div className="mb-8">
              <h3 className="text-2xl font-[--font-bebas-neue] text-white mb-4 tracking-wider">Certifications</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                {instructorData.certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </div>

            {/* Social Media */}
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
          </div>
        </div>
      </div>
    </main>
  )
}
