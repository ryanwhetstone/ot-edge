import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/drizzle';
import { users, observations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { responses, notes } = body;

    // Update observation - verify ownership
    const [updatedObservation] = await db
      .update(observations)
      .set({
        responses,
        notes: notes !== undefined ? notes : undefined,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(observations.uuid, uuid),
          eq(observations.userId, user[0].id)
        )
      )
      .returning();

    if (!updatedObservation) {
      return NextResponse.json(
        { error: 'Observation not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedObservation);
  } catch (error) {
    console.error('Error updating observation:', error);
    return NextResponse.json(
      { error: 'Failed to update observation' },
      { status: 500 }
    );
  }
}
