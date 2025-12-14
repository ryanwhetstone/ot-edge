import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/drizzle";
import { users, clients, spm2Assessments } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { spm2Sections } from "@/lib/spm2-questions";

export default async function AssessmentViewPage({
  params,
}: {
  params: Promise<{ clientId: string; assessmentId: string }>;
}) {
  const { clientId, assessmentId } = await params;
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
        eq(clients.uuid, clientId),
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

  const getResponseLabel = (value: number) => {
    const labels = ['Never', 'Occasionally', 'Frequently', 'Always'];
    return labels[value - 1] || 'N/A';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href={`/account/clients/${clientId}`}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Client
        </Link>
        <h1 className="mt-4 text-3xl font-bold">
          {client[0].firstName} {client[0].lastName} - SPM-2 Assessment
        </h1>
        <p className="mt-2 text-gray-600">
          Completed on {new Date(assessmentData.assessmentDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {assessmentData.notes && (
        <div className="mb-6 rounded-lg border bg-blue-50 p-4">
          <h3 className="font-semibold text-blue-900">Notes</h3>
          <p className="mt-1 text-sm text-blue-800">{assessmentData.notes}</p>
        </div>
      )}

      <div className="space-y-8">
        {spm2Sections.map((section) => (
          <div key={section.id} className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              {section.title}
            </h2>
            <p className="mb-4 text-sm text-gray-600">{section.description}</p>
            <div className="space-y-4">
              {section.questions.map((question) => {
                const response = responses[question.id];
                return (
                  <div
                    key={question.id}
                    className="border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {question.text}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">Response:</span>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          response === 1
                            ? 'bg-green-100 text-green-800'
                            : response === 2
                            ? 'bg-yellow-100 text-yellow-800'
                            : response === 3
                            ? 'bg-orange-100 text-orange-800'
                            : response === 4
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {getResponseLabel(response)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href={`/account/clients/${clientId}`}
          className="inline-flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Back to Client
        </Link>
      </div>
    </div>
  );
}
