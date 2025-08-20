import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, phone } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if already exists
    const existingSignup = await prisma.marketingSignup.findFirst({
      where: { email }
    })

    if (existingSignup) {
      return NextResponse.json({ 
        message: 'Already subscribed',
        success: true 
      })
    }

    // Create new signup
    await prisma.marketingSignup.create({
      data: {
        email,
        phone: phone || null
      }
    })

    return NextResponse.json({ 
      message: 'Successfully subscribed',
      success: true 
    })
  } catch (error) {
    console.error('Error in marketing signup:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
