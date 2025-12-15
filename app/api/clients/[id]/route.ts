import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/drizzle';
import { users, clients } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

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

    // Get client by UUID and verify ownership
    const client = await db
      .select()
      .from(clients)
      .where(
        and(
          eq(clients.uuid, id),
          eq(clients.userId, user[0].id)
        )
      )
      .limit(1);

    if (client.length === 0) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(client[0]);
  } catch (error) {
    console.error('Get client error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
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

    // Verify client ownership
    const existingClient = await db
      .select()
      .from(clients)
      .where(
        and(
          eq(clients.uuid, id),
          eq(clients.userId, user[0].id)
        )
      )
      .limit(1);

    if (existingClient.length === 0) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Update client
    const updatedClient = await db
      .update(clients)
      .set({
        firstName,
        lastName,
        birthDate,
        updatedAt: new Date(),
      })
      .where(eq(clients.id, existingClient[0].id))
      .returning();

    return NextResponse.json({
      success: true,
      client: updatedClient[0]
    });
  } catch (error) {
    console.error('Update client error:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}
