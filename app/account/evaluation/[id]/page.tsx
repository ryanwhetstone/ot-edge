import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/drizzle";
import { users, clients, evaluations, spm2Assessments, observations } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getObservationTemplate } from "@/lib/observation-templates";

export const dynamic = 'force-dynamic';

export default async function EvaluationDetailPage({
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
    .select({
      id: evaluations.id,
      uuid: evaluations.uuid,
      name: evaluations.name,
      createdAt: evaluations.createdAt,
      clientId: evaluations.clientId,
      userId: evaluations.userId,
    })
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

  // Get client details
  const client = await db
    .select()
    .from(clients)
    .where(eq(clients.id, evaluationData.clientId))
    .limit(1);

  if (client.length === 0) {
    notFound();
  }

  const clientData = client[0];

  // Get assessments for this evaluation
  const assessments = await db
    .select()
    .from(spm2Assessments)
    .where(eq(spm2Assessments.evaluationId, evaluationData.id))
    .orderBy(desc(spm2Assessments.createdAt));

  // Get observations for this evaluation
  const evaluationObservations = await db
    .select()
    .from(observations)
    .where(eq(observations.evaluationId, evaluationData.id))
    .orderBy(desc(observations.createdAt));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href={`/account/client/${clientData.uuid}`}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to {clientData.firstName} {clientData.lastName}
        </Link>
        <div className="mt-4">
          <h1 className="text-3xl font-bold">{evaluationData.name}</h1>
          <p className="mt-2 text-gray-600">
            For {clientData.firstName} {clientData.lastName} • Created {evaluationData.createdAt ? new Date(evaluationData.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* SPM-2 Assessments Section */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">SPM-2 Assessments</h2>
              <Link
                href={`/account/assessment/new?clientId=${clientData.uuid}&evaluationId=${evaluationData.id}`}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + New SPM-2 Assessment
              </Link>
            </div>
          </div>
          <div className="p-6">
            {assessments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No SPM-2 assessments yet.</p>
                <p className="mt-2 text-sm text-gray-500">
                  Click "New SPM-2 Assessment" to create your first assessment for this evaluation.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {assessments.map((assessment) => (
                  <Link
                    key={assessment.id}
                    href={`/account/assessment/${assessment.uuid}`}
                    className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">SPM-2 Assessment</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Completed {assessment.createdAt ? new Date(assessment.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <span className="text-sm text-blue-600 font-medium">
                        View Details →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Observations Section */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Observations</h2>
              <Link
                href={`/account/evaluation/${id}/observation`}
                className="inline-flex items-center rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
              >
                + New ELC Observation
              </Link>
            </div>
          </div>
          <div className="p-6">
            {evaluationObservations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No observations yet.</p>
                <p className="mt-2 text-sm text-gray-500">
                  Click "New ELC Observation" to create your first observation for this evaluation.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {evaluationObservations.map((observation) => {
                  const template = getObservationTemplate(observation.observationType);
                  return (
                    <Link
                      key={observation.id}
                      href={`/account/observation/${observation.uuid}`}
                      className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {template?.name || observation.observationType}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Completed {observation.createdAt ? new Date(observation.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          View Details →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
