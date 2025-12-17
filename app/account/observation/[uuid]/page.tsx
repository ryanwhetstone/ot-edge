import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/drizzle";
import { users, observations, evaluations, clients } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import ObservationTabs from "./ObservationTabs";

export const dynamic = 'force-dynamic';

export default async function ObservationDetailPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
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

  // Get observation by UUID and verify ownership
  const observation = await db
    .select()
    .from(observations)
    .where(
      and(
        eq(observations.uuid, uuid),
        eq(observations.userId, user[0].id)
      )
    )
    .limit(1);

  if (observation.length === 0) {
    notFound();
  }

  const observationData = observation[0];

  // Get evaluation information
  const evaluation = await db
    .select()
    .from(evaluations)
    .where(eq(evaluations.id, observationData.evaluationId))
    .limit(1);

  if (evaluation.length === 0) {
    notFound();
  }

  // Get client information
  const client = await db
    .select()
    .from(clients)
    .where(eq(clients.id, evaluation[0].clientId))
    .limit(1);

  if (client.length === 0) {
    notFound();
  }

  const responses = observationData.responses as Record<string, string>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <Link
              href={`/account/evaluation/${evaluation[0].uuid}`}
              className="text-sm text-blue-600 hover:underline"
            >
              ← Back to Evaluation
            </Link>
            <h1 className="mt-4 text-3xl font-bold">
              {client[0].firstName} {client[0].lastName} - ELC Observation of Skills
            </h1>
            <p className="mt-2 text-gray-600">
              Completed on {observationData.createdAt 
                ? new Date(observationData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Unknown date'}
            </p>
            <p className="mt-1 text-gray-600">
              Evaluation: {evaluation[0].name}
            </p>
          </div>
        </div>
      </div>

      <ObservationTabs 
        responses={responses} 
        notes={observationData.notes}
        clientName={client[0].firstName}
        observationId={observationData.uuid}
      />

    </div>
  );
}
