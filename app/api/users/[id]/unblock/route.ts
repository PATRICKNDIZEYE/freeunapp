import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Super Admin access required' }, { status: 401 })
    }

    const userId = params.id

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Unblock user by setting approved to true
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        approved: true,
        // Note: We'll need to add a 'blocked' field to the User model in the schema
        // For now, we'll use approved: true as a way to unblock users
      }
    })

    return NextResponse.json({
      message: 'User unblocked successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        approved: updatedUser.approved
      }
    })
  } catch (error) {
    console.error('Error unblocking user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
