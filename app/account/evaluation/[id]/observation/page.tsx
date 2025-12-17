import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/drizzle";
import { users, evaluations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { elcObservationOfSkills, getTotalQuestions } from "@/lib/observation-templates";
import ObservationForm from "./ObservationForm";

export const dynamic = 'force-dynamic';

export default async function NewObservationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  // Get evaluation by UUID and verify ownership
  const evaluation = await db
    .select()
    .from(evaluations)
    .where(
      and(
        eq(evaluations.uuid, id),
        eq(evaluations.userId, user[0].id)
      )
    )
    .limit(1);

  if (evaluation.length === 0) {
    notFound();
  }

  const evaluationData = evaluation[0];
  const template = elcObservationOfSkills;
  const totalQuestions = getTotalQuestions(template);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href={`/account/evaluation/${id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Evaluation
        </Link>
        <h1 className="mt-4 text-3xl font-bold">
          {template.name}
        </h1>
        <p className="mt-2 text-gray-600">
          {evaluationData.name}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          This observation contains {totalQuestions} questions across {template.sections.length} sections.
        </p>
      </div>

      <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h2 className="font-semibold text-blue-900">Instructions</h2>
        <ul className="mt-2 space-y-1 text-sm text-blue-800">
          <li>• Observe and document the child's skills and behaviors</li>
          <li>• Answer all questions based on your observations</li>
          <li>• Complete all questions in each section before proceeding</li>
        </ul>
      </div>

      <ObservationForm 
        template={template} 
        evaluationId={evaluationData.id}
        evaluationUuid={id}
      />
    </div>
  );
}
