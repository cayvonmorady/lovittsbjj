export default function InstructorPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Instructor Image */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            {/* Add instructor image here */}
            <div className="bg-[#1c1c23] border border-gray-800 h-[400px] flex items-center justify-center">
              <span className="text-gray-400">Instructor Image</span>
            </div>
          </div>

          {/* Instructor Info */}
          <div className="space-y-6 text-center">
            <h2 className="text-3xl font-[--font-bebas-neue] text-white tracking-wide">
              Markangelo Lovitt
            </h2>
            <div className="space-y-4 text-gray-300 max-w-2xl mx-auto">
              <p>
                Markangelo, the owner and primary instructor at Lovitt&apos;s Jiu Jitsu, has dedicated over 12 years to the art of jiu jitsu and the pursuit of mastery. A brown belt on the path to black, his journey is fueled by a deep passion for the sport and its transformative power. For Markangelo, jiu jitsu is more than technique—it is a forge where integrity and self-control are shaped. Through his teachings, he seeks to inspire both young and old to carry these virtues beyond the mat, into every corner of their lives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
