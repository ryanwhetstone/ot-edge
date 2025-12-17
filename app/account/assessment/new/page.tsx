import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/drizzle";
import { users, clients, evaluations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import SPM2AssessmentForm from "./SPM2AssessmentForm";
import { getTotalQuestions } from "@/lib/spm2-questions";

export const dynamic = 'force-dynamic';

export default async function NewAssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string; evaluationId?: string }>;
}) {
  const { clientId, evaluationId } = await searchParams;
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  if (!clientId) {
    redirect("/account/client-list");
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
        eq(clients.uuid, clientId),
        eq(clients.userId, user[0].id)
      )
    )
    .limit(1);

  if (client.length === 0) {
    notFound();
  }

  const clientData = client[0];

  // If evaluationId is provided, verify it exists and belongs to this client
  let evaluationData = null;
  if (evaluationId) {
    const evaluation = await db
      .select()
      .from(evaluations)
      .where(
        and(
          eq(evaluations.id, parseInt(evaluationId)),
          eq(evaluations.clientId, clientData.id),
          eq(evaluations.userId, user[0].id)
        )
      )
      .limit(1);

    if (evaluation.length > 0) {
      evaluationData = evaluation[0];
    }
  }

  const totalQuestions = getTotalQuestions();
  const backUrl = evaluationData 
    ? `/account/evaluation/${evaluationData.uuid}`
    : `/account/client/${clientId}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href={backUrl}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back
        </Link>
        <h1 className="mt-4 text-3xl font-bold">
          New SPM-2 Assessment
        </h1>
        <p className="mt-2 text-gray-600">
          Client: {clientData.firstName} {clientData.lastName}
        </p>
        {evaluationData && (
          <p className="mt-1 text-sm text-gray-500">
            Evaluation: {evaluationData.name}
          </p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          This assessment contains {totalQuestions} questions across multiple sections.
        </p>
      </div>

      <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h2 className="font-semibold text-blue-900">Instructions</h2>
        <ul className="mt-2 space-y-1 text-sm text-blue-800">
          <li>• Answer all questions based on typical behavior</li>
          <li>• Use the following scale: Never, Occasionally, Frequently, Always</li>
          <li>• Complete all questions in each section before proceeding</li>
        </ul>
      </div>

      <SPM2AssessmentForm 
        clientId={clientId} 
        evaluationId={evaluationId ? parseInt(evaluationId) : undefined} 
      />
    </div>
  );
}
