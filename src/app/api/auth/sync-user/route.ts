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

    
    let user = await db.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (!user) {
      
      user = await db.user.create({
        data: {
          id: uid, 
          email: normalizedEmail,
          name: name || email.split('@')[0],
          image: image,
          role: 'student',
          emailVerified: new Date(),
        }
      })
    } else {
      
      user = await db.user.update({
        where: { email: normalizedEmail },
        data: {
          image: image || user.image,
          name: name || user.name,
          
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
