import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function PrintOutsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/account/dashboard"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold">Printouts</h1>
        <p className="mt-2 text-gray-600">
          Access printable resources and templates for your practice
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Assessment Forms</h2>
          <p className="text-sm text-gray-600 mb-4">
            Printable forms for various assessments
          </p>
          <div className="space-y-2">
            <Link
              href="/account/print-outs/spm2-form"
              className="block text-sm text-blue-600 hover:underline"
            >
              SPM-2 Assessment Form
            </Link>
            <Link
              href="/account/print-outs/elc-observation-form"
              className="block text-sm text-blue-600 hover:underline"
            >
              ELC Observation of Skills Form
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Client Resources</h2>
          <p className="text-sm text-gray-600 mb-4">
            Resources and handouts for clients
          </p>
          <div className="space-y-2">
            <Link
              href="/account/print-outs/sensory-strategies"
              className="block text-sm text-blue-600 hover:underline"
            >
              Sensory Strategies Handout
            </Link>
            <Link
              href="/account/print-outs/home-exercises"
              className="block text-sm text-blue-600 hover:underline"
            >
              Home Exercise Programs
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Templates</h2>
          <p className="text-sm text-gray-600 mb-4">
            Document templates for your practice
          </p>
          <div className="space-y-2">
            <Link
              href="/account/print-outs/progress-note"
              className="block text-sm text-blue-600 hover:underline"
            >
              Progress Note Template
            </Link>
            <Link
              href="/account/print-outs/session-plan"
              className="block text-sm text-blue-600 hover:underline"
            >
              Session Plan Template
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Visual Supports</h2>
          <p className="text-sm text-gray-600 mb-4">
            Visual aids and schedules
          </p>
          <div className="space-y-2">
            <Link
              href="/account/print-outs/visual-schedule"
              className="block text-sm text-blue-600 hover:underline"
            >
              Visual Schedule Cards
            </Link>
            <Link
              href="/account/print-outs/emotion-cards"
              className="block text-sm text-blue-600 hover:underline"
            >
              Emotion Recognition Cards
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Regulatory Tools</h2>
          <p className="text-sm text-gray-600 mb-4">
            Self-regulation resources
          </p>
          <div className="space-y-2">
            <Link
              href="/account/print-outs/zones-of-regulation"
              className="block text-sm text-blue-600 hover:underline"
            >
              Zones of Regulation
            </Link>
            <Link
              href="/account/print-outs/calming-strategies"
              className="block text-sm text-blue-600 hover:underline"
            >
              Calming Strategies Poster
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Fine Motor Activities</h2>
          <p className="text-sm text-gray-600 mb-4">
            Printable fine motor practice sheets
          </p>
          <div className="space-y-2">
            <Link
              href="/account/print-outs/cutting-practice"
              className="block text-sm text-blue-600 hover:underline"
            >
              Cutting Practice Sheets
            </Link>
            <Link
              href="/account/print-outs/tracing-activities"
              className="block text-sm text-blue-600 hover:underline"
            >
              Tracing Activities
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg border bg-blue-50 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Coming Soon</h3>
        <p className="text-sm text-blue-800">
          More printable resources and templates will be added soon. Check back regularly for new materials!
        </p>
      </div>
    </div>
  );
}
