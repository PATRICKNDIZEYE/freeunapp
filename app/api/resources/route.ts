import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the user
    const user = await prisma.user.findFirst({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is admin
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, type, category, fileUrl } = body

    // Validate required fields
    if (!title || !type || !category || !fileUrl) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, type, category, and fileUrl are required' 
      }, { status: 400 })
    }

    // Validate enum values
    const validTypes = ['GUIDE', 'ESSAY_EXAMPLE', 'APPLICATION_TIP', 'OTHER']
    const validCategories = ['COMPUTER_SCIENCE', 'ENGINEERING', 'MEDICINE', 'BUSINESS', 'ARTS', 'SOCIAL_SCIENCES', 'NATURAL_SCIENCES', 'MATHEMATICS', 'LAW', 'EDUCATION', 'OTHER']

    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid resource type' }, { status: 400 })
    }

    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    // Create resource
    const resource = await prisma.resource.create({
      data: {
        title,
        description: description || null,
        type: type as any,
        category: category as any,
        fileUrl,
        adminId: user.id
      },
      include: {
        admin: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Resource created successfully',
      resource
    })
  } catch (error) {
    console.error('Error creating resource:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    let where: any = {}

    if (category) {
      where.category = category
    }

    if (type) {
      where.type = type
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const resources = await prisma.resource.findMany({
      where,
      include: {
        admin: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ resources })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      resources: []
    }, { status: 500 })
  }
}
