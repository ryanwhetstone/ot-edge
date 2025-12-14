import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/account/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex flex-col items-center justify-center space-y-8 text-center">
        <h1 className="text-5xl font-bold">
          OT Edge
        </h1>
        <p className="text-xl text-gray-600">
          Your comprehensive OT platform
        </p>
        <div className="flex gap-4">
          <Link
            href="/auth/signup"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            href="/auth/signin"
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50"
          >
            Sign In
          </Link>
        </div>
      </main>
    </div>
  );
}
