import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/drizzle";
import { users, clients, spm2Assessments } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import AssessmentsList from "./AssessmentsList";

export default async function ClientDetailPage({
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
  let user;
  try {
    user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);
  } catch (error) {
    console.error('Database error fetching user:', error);
    throw new Error(`Failed to fetch user: ${error}`);
  }

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

  const clientData = client[0];

  // Get assessments for this client
  const assessments = await db
    .select()
    .from(spm2Assessments)
    .where(
      and(
        eq(spm2Assessments.clientId, clientData.id),
        eq(spm2Assessments.userId, user[0].id)
      )
    )
    .orderBy(desc(spm2Assessments.createdAt));

  // Calculate age
  const birthDate = new Date(clientData.birthDate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/account/client-list"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Clients
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {clientData.firstName} {clientData.lastName}
            </h1>
            <p className="mt-2 text-gray-600">
              {birthDate.toLocaleDateString()} • {age} years old
            </p>
          </div>
          <Link
            href={`/account/client/${id}/edit`}
            className="rounded bg-gray-600 px-4 py-2 font-medium text-white hover:bg-gray-700"
          >
            Edit Client
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        {/* Treatments Section */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Treatments</h2>
              <button
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                disabled
              >
                + New Treatment
              </button>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600">
              No treatments yet. Treatments feature coming soon.
            </p>
          </div>
        </div>

        {/* Evaluations Section */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Evaluations</h2>
              <button
                className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                disabled
              >
                + New Evaluation
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Evaluations help track client progress over time. Each evaluation can contain multiple assessments.
              </p>
              <div className="rounded-md bg-blue-50 border border-blue-200 p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Temporary: Direct SPM-2 Assessments</h3>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-blue-800">
                    These assessments will soon be organized under evaluations.
                  </p>
                  <Link
                    href={`/account/client/${id}/spm2-assessment`}
                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    + New SPM-2 Assessment
                  </Link>
                </div>
                <AssessmentsList assessments={assessments} clientId={id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
