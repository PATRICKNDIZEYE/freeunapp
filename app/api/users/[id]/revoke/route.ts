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
    
    // Check if user is authenticated and is a super admin
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Super Admin access required' }, { status: 401 })
    }

    const userId = params.id

    // Find the user to revoke
    const userToRevoke = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!userToRevoke) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is an admin
    if (userToRevoke.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Can only revoke admin users' }, { status: 400 })
    }

    // Revoke the user (set approved to false)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { approved: false }
    })

    return NextResponse.json({ 
      message: 'User revoked successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        approved: updatedUser.approved
      }
    })
  } catch (error) {
    console.error('Error revoking user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
