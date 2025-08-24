import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, DollarSign, Calendar, Globe } from "lucide-react"

const stats = [
  // {
  //   icon: DollarSign,
  //   value: "$2.5M+",
  //   label: "Total Funding Available",
  //   description: "Cumulative scholarship value",
  //   color: "text-green-600"
  // },
  {
    icon: Calendar,
    value: "250+",
    label: "New This Month",
    description: "Fresh opportunities added",
    color: "text-blue-600"
  },
  {
    icon: Globe,
    value: "45+",
    label: "Countries",
    description: "Global opportunities",
    color: "text-purple-600"
  },
  {
    icon: TrendingUp,
    value: "87%",
    label: "Match Rate",
    description: "Students find relevant scholarships",
    color: "text-orange-600"
  }
]

export function StatsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Students Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform connects ambitious students with life-changing scholarship opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4 ${stat.color}`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-800 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}