import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json()
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate role
    const validRoles = ['STUDENT', 'ADMIN']
    const userRole = validRoles.includes(role) ? role : 'STUDENT'

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashed = await hash(password, 12)
    
    // For admin users, they need approval from super admin
    const approved = userRole === 'STUDENT' ? true : false
    
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashed,
        role: userRole,
        approved: approved,
        emailVerified: new Date()
      }
    })

    // If admin user registered, notify super admins
    if (userRole === 'ADMIN') {
      const superAdmins = await prisma.user.findMany({
        where: {
          role: 'SUPER_ADMIN',
          approved: true
        }
      })

      // Create notifications for super admins
      await Promise.all(
        superAdmins.map(superAdmin =>
          prisma.notification.create({
            data: {
              message: `New admin registration: ${name} (${email}) is waiting for approval`,
              type: 'SYSTEM',
              userId: superAdmin.id,
              read: false
            }
          })
        )
      )
    }

    return NextResponse.json({ 
      ok: true, 
      message: userRole === 'ADMIN' 
        ? 'Account created successfully. Please wait for admin approval.' 
        : 'Account created successfully!' 
    })
  } catch (e) {
    console.error('Signup error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


