import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/drizzle";
import { users, clients, spm2Assessments } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import AssessmentTabs from "./AssessmentTabs";
import DeleteButton from "./DeleteButton";

export default async function AssessmentViewPage({
  params,
}: {
  params: Promise<{ id: string; assessmentId: string }>;
}) {
  const { id, assessmentId } = await params;
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  // Get user ID
  const user = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (user.length === 0) {
    redirect("/auth/signin");
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
    notFound();
  }

  // Get assessment by UUID and verify ownership
  const assessment = await db
    .select()
    .from(spm2Assessments)
    .where(
      and(
        eq(spm2Assessments.uuid, assessmentId),
        eq(spm2Assessments.userId, user[0].id),
        eq(spm2Assessments.clientId, client[0].id)
      )
    )
    .limit(1);

  if (assessment.length === 0) {
    notFound();
  }

  const assessmentData = assessment[0];
  const responses = assessmentData.responses as Record<string, number>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <Link
              href={`/account/clients/${id}`}
              className="text-sm text-blue-600 hover:underline"
            >
              ← Back to Client
            </Link>
            <h1 className="mt-4 text-3xl font-bold">
              {client[0].firstName} {client[0].lastName} - SPM-2 Assessment
            </h1>
            <p className="mt-2 text-gray-600">
              Completed on {assessmentData.assessmentDate 
                ? new Date(assessmentData.assessmentDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Unknown date'}
            </p>
          </div>
          <DeleteButton assessmentId={assessmentData.uuid} clientId={id} />
        </div>
      </div>

      <AssessmentTabs 
        responses={responses} 
        notes={assessmentData.notes}
        clientName={client[0].firstName}
        assessmentId={assessmentData.uuid}
      />

      <div className="mt-8">
        <Link
          href={`/account/clients/${id}`}
          className="inline-flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Back to Client
        </Link>
      </div>
    </div>
  );
}
