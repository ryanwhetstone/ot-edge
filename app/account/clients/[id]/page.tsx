import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/drizzle";
import { users, clients } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

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

  const clientData = client[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/account/clients"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Clients
        </Link>
        <h1 className="mt-4 text-3xl font-bold">
          {clientData.firstName} {clientData.lastName}
        </h1>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Client Information</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-600">First Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{clientData.firstName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Last Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{clientData.lastName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Birth Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(clientData.birthDate).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Added</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(clientData.createdAt!).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Sessions</h2>
          <p className="text-sm text-gray-600">
            No sessions yet. Sessions feature coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
