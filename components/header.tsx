import Link from "next/link";
import { auth } from "@/auth";

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
        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <span className="text-sm text-gray-600">
                {session.user.email}
              </span>
              <form
                action={async () => {
                  "use server";
                  const { signOut } = await import("@/auth");
                  await signOut();
                }}
              >
                <button
                  type="submit"
                  className="rounded bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300"
                >
                  Sign Out
                </button>
              </form>
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
