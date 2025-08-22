import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')
    const category = searchParams.get('category')
    const degreeLevel = searchParams.get('degreeLevel')
    const amountType = searchParams.get('amountType')
    const deadline = searchParams.get('deadline')

    console.log('GET /api/scholarships - Search params:', { search, limit, category, degreeLevel, amountType, deadline })

    // Build where clause
    const where: any = { 
      status: 'ACTIVE',
      approvalStatus: 'APPROVED'
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (degreeLevel && degreeLevel !== 'all') {
      where.degreeLevel = degreeLevel
    }

    if (amountType && amountType !== 'all') {
      where.amountType = amountType
    }

    if (deadline && deadline !== 'all') {
      const days = parseInt(deadline)
      if (!isNaN(days)) {
        const deadlineDate = new Date()
        deadlineDate.setDate(deadlineDate.getDate() + days)
        where.deadline = { lte: deadlineDate }
      }
    }

    console.log('WHERE clause:', JSON.stringify(where, null, 2))

    const scholarships = await prisma.scholarship.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        degreeLevel: true,
        amount: true,
        amountType: true,
        deadline: true,
        status: true,
        admin: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit ? parseInt(limit) : 10
    })

    console.log(`Found ${scholarships.length} scholarships`)

    return NextResponse.json({ scholarships })
  } catch (error) {
    console.error('Error fetching scholarships:', error)
    console.error('Error details:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error',
      scholarships: []
    }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      title,
      description,
      detailedDescription,
      amount,
      amountType,
      categories,
      degreeLevels,
      deadline,
      eligibilityCriteria,
      applicationProcess,
      qualificationBasis,
      awardsAvailable,
      contactInfo,
      referenceUrl,
      logoUrl,
      status
    } = body

    // Find the admin user by email since session.user.id might be undefined
    const adminUser = await prisma.user.findFirst({
      where: { email: session.user.email }
    })

    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 })
    }

    const scholarship = await prisma.scholarship.create({
      data: {
        title,
        description,
        detailedDescription,
        amount,
        amountType,
        category: categories[0], // Use first category as primary
        degreeLevel: degreeLevels[0], // Use first degree level as primary
        deadline: new Date(deadline),
        eligibilityCriteria,
        applicationProcess,
        qualificationBasis,
        awardsAvailable: awardsAvailable ? parseInt(awardsAvailable) : null,
        contactInfo,
        referenceUrl,
        logoUrl,
        status,
        admin: {
          connect: {
            id: adminUser.id
          }
        },
        approvalStatus: 'APPROVED'
      }
    })

    return NextResponse.json(scholarship)
  } catch (error) {
    console.error('Error creating scholarship:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
