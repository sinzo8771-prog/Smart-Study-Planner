import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

const staticUsers = [
  {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@studyplanner.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 'student-001',
    name: 'John Student',
    email: 'john@student.com',
    password: 'student123',
    role: 'student',
  },
  {
    id: 'student-002',
    name: 'Jane Student',
    email: 'jane@student.com',
    password: 'student123',
    role: 'student',
  },
  {
    id: 'student-003',
    name: 'Mike Johnson',
    email: 'mike@student.com',
    password: 'student123',
    role: 'student',
  },
  {
    id: 'student-004',
    name: 'Sarah Williams',
    email: 'sarah@student.com',
    password: 'student123',
    role: 'student',
  },
  {
    id: 'student-005',
    name: 'David Brown',
    email: 'david@student.com',
    password: 'student123',
    role: 'student',
  },
]

export async function GET(request: NextRequest) {
  try {
    
    const authHeader = request.headers.get('authorization')
    const secretKey = process.env.SEED_SECRET || 'seed-secret-2024'
    
    if (authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const results = {
      created: [] as string[],
      updated: [] as string[],
      errors: [] as string[],
    }

    for (const user of staticUsers) {
      try {
        const hashedPassword = await bcrypt.hash(user.password, 10)
        
        const existingUser = await db.user.findUnique({
          where: { id: user.id },
        })
        
        if (existingUser) {
          await db.user.update({
            where: { id: user.id },
            data: {
              name: user.name,
              email: user.email,
              password: hashedPassword,
              role: user.role,
            },
          })
          results.updated.push(user.email)
        } else {
          await db.user.create({
            data: {
              id: user.id,
              name: user.name,
              email: user.email,
              password: hashedPassword,
              role: user.role,
            },
          })
          results.created.push(user.email)
        }
      } catch (error) {
        console.error(`Error seeding user ${user.email}:`, error)
        results.errors.push(user.email)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      results,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database', details: String(error) },
      { status: 500 }
    )
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { autoSeed } = body
    
    if (!autoSeed) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    
    const adminExists = await db.user.findUnique({
      where: { id: 'admin-001' },
    })

    if (adminExists) {
      return NextResponse.json({ 
        success: true, 
        message: 'Admin already exists',
        seeded: false 
      })
    }

    
    const adminUser = staticUsers[0]
    const hashedPassword = await bcrypt.hash(adminUser.password, 10)
    
    await db.user.create({
      data: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        password: hashedPassword,
        role: adminUser.role,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user seeded',
      seeded: true,
    })
  } catch (error) {
    console.error('Auto-seed error:', error)
    return NextResponse.json(
      { error: 'Failed to auto-seed', details: String(error) },
      { status: 500 }
    )
  }
}
