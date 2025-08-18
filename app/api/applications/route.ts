import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      name, email, phone, message, scholarshipId,
      dateOfBirth, nationality, currentInstitution, fieldOfStudy, currentYear, gpa,
      expectedGraduation, intendedUniversity, intendedProgram, intendedCountry,
      financialNeed, achievements, extracurricular, workExperience, researchExperience,
      publications, awards, references, motivation, futureGoals, additionalInfo
    } = body

    // Validate required fields
    if (!name || !email || !message || !scholarshipId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if scholarship exists and is active
    const scholarship = await prisma.scholarship.findUnique({
      where: { id: scholarshipId }
    })

    if (!scholarship) {
      return NextResponse.json({ error: 'Scholarship not found' }, { status: 404 })
    }

    if (scholarship.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Scholarship is not active' }, { status: 400 })
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        status: 'APPLIED',
        scholarshipId,
        appliedAt: new Date(),
        // Additional fields
        dateOfBirth: dateOfBirth || null,
        nationality: nationality || null,
        currentInstitution: currentInstitution || null,
        fieldOfStudy: fieldOfStudy || null,
        currentYear: currentYear || null,
        gpa: gpa ? parseFloat(gpa) : null,
        expectedGraduation: expectedGraduation || null,
        intendedUniversity: intendedUniversity || null,
        intendedProgram: intendedProgram || null,
        intendedCountry: intendedCountry || null,
        financialNeed: financialNeed || null,
        achievements: achievements || null,
        extracurricular: extracurricular || null,
        workExperience: workExperience || null,
        researchExperience: researchExperience || null,
        publications: publications || null,
        awards: awards || null,
        references: references || null,
        motivation: motivation || null,
        futureGoals: futureGoals || null,
        additionalInfo: additionalInfo || null
      }
    })

    // Create notification for admin
              await prisma.notification.create({
            data: {
              message: `${name} applied for ${scholarship.title}`,
              type: 'APPLICATION_UPDATE',
              userId: scholarship.adminId,
              read: false
            }
          })

    return NextResponse.json({
      message: 'Application submitted successfully',
      applicationId: application.id
    })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
