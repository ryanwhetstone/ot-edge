import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {session.user?.name || session.user?.email}!
        </p>
      </div>

      <div className="mb-6">
        <Link
          href="/account/client-list/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          <span className="text-xl">+</span>
          New Client
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/account/client-list"
          className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md hover:bg-gray-100 transition-all cursor-pointer"
        >
          <h2 className="mb-2 text-lg font-semibold">Clients</h2>
          <p className="text-sm text-gray-600">
            View and manage your client list
          </p>
          <div className="mt-4 inline-block text-blue-600">
            View clients →
          </div>
        </Link>

        <Link
          href="/account/profile"
          className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md hover:bg-gray-100 transition-all cursor-pointer"
        >
          <h2 className="mb-2 text-lg font-semibold">Profile</h2>
          <p className="text-sm text-gray-600">
            Manage your account settings and preferences
          </p>
          <div className="mt-4 inline-block text-blue-600">
            View profile →
          </div>
        </Link>

        <Link
          href="/account/activity"
          className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md hover:bg-gray-100 transition-all cursor-pointer"
        >
          <h2 className="mb-2 text-lg font-semibold">Activity</h2>
          <p className="text-sm text-gray-600">
            View your recent activity and history
          </p>
          <div className="mt-4 inline-block text-blue-600">
            View activity →
          </div>
        </Link>

        <Link
          href="/account/settings"
          className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md hover:bg-gray-100 transition-all cursor-pointer"
        >
          <h2 className="mb-2 text-lg font-semibold">Settings</h2>
          <p className="text-sm text-gray-600">
            Configure your account preferences
          </p>
          <div className="mt-4 inline-block text-blue-600">
            Manage settings →
          </div>
        </Link>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Quick Stats</h2>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Sessions</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last Login</span>
              <span className="font-medium">Today</span>
            </div>
          </div>
        </div>

        <Link
          href="/account/notifications"
          className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md hover:bg-gray-100 transition-all cursor-pointer"
        >
          <h2 className="mb-2 text-lg font-semibold">Notifications</h2>
          <p className="text-sm text-gray-600">
            You have no new notifications
          </p>
          <div className="mt-4 inline-block text-blue-600">
            View all →
          </div>
        </Link>

        <Link
          href="/help"
          className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md hover:bg-gray-100 transition-all cursor-pointer"
        >
          <h2 className="mb-2 text-lg font-semibold">Help & Support</h2>
          <p className="text-sm text-gray-600">
            Get help with your account or report issues
          </p>
          <div className="mt-4 inline-block text-blue-600">
            Get help →
          </div>
        </Link>
      </div>
    </div>
  );
}
