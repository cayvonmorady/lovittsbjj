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
    url: "/assets/images/instructor.jpg",
    alt: "Markangelo Lovitt"
  },
  bio: [
    "Professor Lovitt began his martial arts journey at a young age, dedicating himself to the art of Brazilian Jiu-Jitsu.",
    "With over 15 years of experience in BJJ, he has developed a teaching style that emphasizes technical precision and practical application.",
    "His passion for BJJ extends beyond competition to creating a positive and inclusive training environment where students of all levels can thrive."
  ],
  achievements: [
    "Brown Belt under renowned instructor",
    "Multiple-time competition champion",
    "Certified instructor with extensive teaching experience",
    "Active competitor in major tournaments"
  ],
  certifications: [
    "Brazilian Jiu-Jitsu Brown Belt",
    "First Aid and CPR Certified",
    "Fitness Training Specialist"
  ],
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
      certifications
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
          </div>
        </div>
      </div>
    </main>
  )
}
