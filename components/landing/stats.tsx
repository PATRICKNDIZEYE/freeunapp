import { Users, GraduationCap, FileText, Award } from 'lucide-react'

interface StatsProps {
  totalScholarships: number
  totalStudents: number
  totalApplications: number
  totalAwards: number
}

export function Stats({ totalScholarships, totalStudents, totalApplications, totalAwards }: StatsProps) {
  const stats = [
    {
      icon: GraduationCap,
      value: totalScholarships,
      label: 'Active Scholarships',
      description: 'Available opportunities'
    },
    {
      icon: Users,
      value: totalStudents,
      label: 'Students Helped',
      description: 'Successfully connected'
    },
    {
      icon: FileText,
      value: totalApplications,
      label: 'Applications',
      description: 'Total submissions'
    },
    {
      icon: Award,
      value: totalAwards,
      label: 'Awards Available',
      description: 'Total funding opportunities'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Students Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform connects ambitious students with life-changing scholarship opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-lg font-semibold text-gray-700 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-500">
                  {stat.description}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
