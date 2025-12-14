import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ClientsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="mt-2 text-gray-600">Manage your client list</p>
        </div>
        <Link
          href="/account/clients/new"
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + New Client
        </Link>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <p className="text-gray-600">
          No clients yet. Click "New Client" to add your first client.
        </p>
      </div>
    </div>
  );
}
