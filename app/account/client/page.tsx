import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/drizzle";
import { users, clients } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function ClientsPage() {
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

  // Get all clients for this user
  const userClients = await db
    .select()
    .from(clients)
    .where(eq(clients.userId, user[0].id))
    .orderBy(desc(clients.createdAt));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="mt-2 text-gray-600">Manage your client list</p>
        </div>
        <Link
          href="/account/client/new"
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + New Client
        </Link>
      </div>

      {userClients.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-gray-600">
            No clients yet. Click "New Client" to add your first client.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                  Birth Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                  Added
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {userClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-100 transition-all cursor-pointer">
                  <td className="px-6 py-4 text-sm">
                    <Link
                      href={`/account/client/${client.uuid}`}
                      className="block"
                    >
                      {client.firstName} {client.lastName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <Link
                      href={`/account/client/${client.uuid}`}
                      className="block"
                    >
                      {new Date(client.birthDate).toLocaleDateString()}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <Link
                      href={`/account/client/${client.uuid}`}
                      className="block"
                    >
                      {new Date(client.createdAt!).toLocaleDateString()}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <Link
                      href={`/account/client/${client.uuid}`}
                      className="block text-blue-600"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
