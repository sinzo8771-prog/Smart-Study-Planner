import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { uid, email, name, image, provider } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase()

    // Check if user exists
    let user = await db.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (!user) {
      // Create new user
      user = await db.user.create({
        data: {
          id: uid, // Use Firebase UID
          email: normalizedEmail,
          name: name || email.split('@')[0],
          image: image,
          role: 'student',
          emailVerified: new Date(),
        }
      })
    } else {
      // Update existing user with new info
      user = await db.user.update({
        where: { email: normalizedEmail },
        data: {
          image: image || user.image,
          name: name || user.name,
          // Mark email verified if they sign in with OAuth
          emailVerified: provider ? new Date() : user.emailVerified,
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      }
    })
  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    )
  }
}
