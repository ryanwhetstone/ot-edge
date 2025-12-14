import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/drizzle';
import { users, clients, spm2Assessments } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user ID
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
    const body = await request.json();
    const { clientId, responses, notes } = body;

    if (!clientId || !responses) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify client belongs to user
    const client = await db
      .select({ id: clients.id })
      .from(clients)
      .where(
        and(
          eq(clients.uuid, clientId),
          eq(clients.userId, userId)
        )
      )
      .limit(1);

    if (client.length === 0) {
      return NextResponse.json(
        { error: 'Client not found or unauthorized' },
        { status: 404 }
      );
    }

    // Create assessment
    const newAssessment = await db
      .insert(spm2Assessments)
      .values({
        clientId: client[0].id,
        userId: userId,
        responses: responses,
        notes: notes || null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      assessment: newAssessment[0],
    });
  } catch (error) {
    console.error('Error creating SPM-2 assessment:', error);
    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user ID
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
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      // Get all assessments for user
      const assessments = await db
        .select()
        .from(spm2Assessments)
        .where(eq(spm2Assessments.userId, userId))
        .orderBy(desc(spm2Assessments.createdAt));

      return NextResponse.json({ assessments });
    }

    // Get client's database ID from UUID
    const client = await db
      .select({ id: clients.id })
      .from(clients)
      .where(
        and(
          eq(clients.uuid, clientId),
          eq(clients.userId, userId)
        )
      )
      .limit(1);

    if (client.length === 0) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Get assessments for specific client
    const assessments = await db
      .select()
      .from(spm2Assessments)
      .where(
        and(
          eq(spm2Assessments.clientId, client[0].id),
          eq(spm2Assessments.userId, userId)
        )
      )
      .orderBy(desc(spm2Assessments.createdAt));

    return NextResponse.json({ assessments });
  } catch (error) {
    console.error('Error fetching SPM-2 assessments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user ID
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
    const { searchParams } = new URL(request.url);
    const assessmentUuid = searchParams.get('uuid');

    if (!assessmentUuid) {
      return NextResponse.json(
        { error: 'Assessment UUID is required' },
        { status: 400 }
      );
    }

    // Verify assessment belongs to user before deleting
    const assessment = await db
      .select({ id: spm2Assessments.id })
      .from(spm2Assessments)
      .where(
        and(
          eq(spm2Assessments.uuid, assessmentUuid),
          eq(spm2Assessments.userId, userId)
        )
      )
      .limit(1);

    if (assessment.length === 0) {
      return NextResponse.json(
        { error: 'Assessment not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete the assessment
    await db
      .delete(spm2Assessments)
      .where(eq(spm2Assessments.uuid, assessmentUuid));

    return NextResponse.json({
      success: true,
      message: 'Assessment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting SPM-2 assessment:', error);
    return NextResponse.json(
      { error: 'Failed to delete assessment' },
      { status: 500 }
    );
  }
}
