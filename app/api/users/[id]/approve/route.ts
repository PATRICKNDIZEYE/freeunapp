import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the current user
    const currentUser = await prisma.user.findFirst({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only super admins can approve users
    if (currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = params.id

    // Find the user to approve
    const userToApprove = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!userToApprove) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user approval status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { approved: true }
    })

    return NextResponse.json({
      message: 'User approved successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        approved: updatedUser.approved
      }
    })
  } catch (error) {
    console.error('Error approving user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
