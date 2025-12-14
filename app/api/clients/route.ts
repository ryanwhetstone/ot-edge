import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/drizzle';
import { users, clients } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { firstName, lastName, birthDate } = await request.json();

    // Validate input
    if (!firstName || !lastName || !birthDate) {
      return NextResponse.json(
        { error: 'First name, last name, and birth date are required' },
        { status: 400 }
      );
    }

    // Get user ID from email
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userId = user[0].id;

    // Create client
    const newClient = await db
      .insert(clients)
      .values({
        userId,
        firstName,
        lastName,
        birthDate,
      })
      .returning();

    return NextResponse.json({
      success: true,
      client: newClient[0]
    });
  } catch (error) {
    console.error('Create client error:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user ID from email
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userId = user[0].id;

    // Get all clients for this user
    const userClients = await db
      .select()
      .from(clients)
      .where(eq(clients.userId, userId))
      .orderBy(desc(clients.createdAt));

    return NextResponse.json({
      success: true,
      clients: userClients
    });
  } catch (error) {
    console.error('Get clients error:', error);
    return NextResponse.json(
      { error: 'Failed to get clients' },
      { status: 500 }
    );
  }
}
