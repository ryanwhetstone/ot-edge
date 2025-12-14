import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/drizzle';
import { users, spm2Assessments } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ assessmentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from email
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, session.user.email));

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { assessmentId } = await context.params;
    const { responses } = await request.json();

    if (!responses || typeof responses !== 'object') {
      return NextResponse.json({ error: 'Invalid responses data' }, { status: 400 });
    }

    // Verify the assessment belongs to the current user
    const [assessment] = await db
      .select()
      .from(spm2Assessments)
      .where(
        and(
          eq(spm2Assessments.uuid, assessmentId),
          eq(spm2Assessments.userId, user.id)
        )
      );

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Update the assessment responses
    await db
      .update(spm2Assessments)
      .set({
        responses,
        updatedAt: new Date(),
      })
      .where(eq(spm2Assessments.uuid, assessmentId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating assessment:', error);
    return NextResponse.json(
      { error: 'Failed to update assessment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ assessmentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from email
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, session.user.email));

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { assessmentId } = await context.params;

    // Verify the assessment belongs to the current user before deleting
    const [assessment] = await db
      .select()
      .from(spm2Assessments)
      .where(
        and(
          eq(spm2Assessments.uuid, assessmentId),
          eq(spm2Assessments.userId, user.id)
        )
      );

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Delete the assessment
    await db
      .delete(spm2Assessments)
      .where(eq(spm2Assessments.uuid, assessmentId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    return NextResponse.json(
      { error: 'Failed to delete assessment' },
      { status: 500 }
    );
  }
}
