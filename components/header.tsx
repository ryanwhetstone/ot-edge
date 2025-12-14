import Link from "next/link";
import { auth } from "@/auth";
import AccountMenu from "./AccountMenu";

export default async function Header() {
  let session = null;
  
  try {
    session = await auth();
  } catch (error) {
    // Handle invalid session (e.g., after AUTH_SECRET change)
    console.error("Session error:", error);
  }

  return (
    <header className="border-b">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold">
          OT Edge
        </Link>
        <div className="flex items-center gap-6">
          {session?.user ? (
            <>
              <Link
                href="/account/dashboard"
                className="font-bold text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <AccountMenu user={session.user} />
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="text-sm font-medium hover:underline"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
