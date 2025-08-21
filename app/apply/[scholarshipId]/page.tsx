import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ApplicationForm } from '@/components/apply/application-form'
import { StudentNavigation } from '@/components/layout/student-navigation'

interface ApplyPageProps {
  params: {
    scholarshipId: string
  }
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Find the user
  const user = await prisma.user.findFirst({
    where: { email: session.user.email }
  })

  if (!user) {
    redirect('/auth/signin')
  }

  // Check if user is student (only students can apply)
  if (user.role !== 'STUDENT') {
    redirect('/dashboard')
  }

  // Fetch the scholarship
  const scholarship = await prisma.scholarship.findUnique({
    where: { id: params.scholarshipId },
    include: {
      admin: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })

  if (!scholarship) {
    notFound()
  }

  // Check if scholarship is active
  if (scholarship.status !== 'ACTIVE' || scholarship.approvalStatus !== 'APPROVED') {
    redirect('/scholarships')
  }

  // Check if deadline has passed
  if (new Date() > scholarship.deadline) {
    redirect('/scholarships')
  }

  // Check if user has already applied
  const existingApplication = await prisma.application.findFirst({
    where: {
      scholarshipId: params.scholarshipId,
      email: session.user.email!
    }
  })

  if (existingApplication) {
    redirect('/dashboard/applications')
  }

  // Get counts for navigation
  const [savedScholarships, notifications] = await Promise.all([
    prisma.savedScholarship.findMany({
      where: { userId: user.id }
    }),
    prisma.notification.findMany({
      where: { userId: user.id, read: false }
    })
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNavigation 
        notificationCount={notifications.length}
        applicationCount={0} // Will be fetched in component
        savedCount={savedScholarships.length}
      />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Apply for Scholarship
          </h1>
          <p className="text-gray-600">
            Complete your application for: <span className="font-semibold">{scholarship.title}</span>
          </p>
        </div>

        <ApplicationForm 
          scholarship={scholarship}
          user={user}
        />
      </div>
    </div>
  )
}
