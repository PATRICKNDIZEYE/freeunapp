import { GraduationCap, Users, UserCheck, FileText, TrendingUp } from 'lucide-react'

interface DashboardStatsProps {
  totalScholarships: number
  totalStudents: number
  totalAdmins: number
  totalApplications: number
}

export function DashboardStats({ 
  totalScholarships, 
  totalStudents, 
  totalAdmins, 
  totalApplications 
}: DashboardStatsProps) {
  const stats = [
    {
      name: 'Total Scholarships',
      value: totalScholarships,
      icon: GraduationCap,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Active Students',
      value: totalStudents,
      icon: Users,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Admin Users',
      value: totalAdmins,
      icon: UserCheck,
      color: 'bg-purple-500',
      change: '+2',
      changeType: 'positive'
    },
    {
      name: 'Applications',
      value: totalApplications,
      icon: FileText,
      color: 'bg-orange-500',
      change: '+23%',
      changeType: 'positive'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
