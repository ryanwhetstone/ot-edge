import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { elcObservationOfSkills } from "@/lib/observation-templates";

export const dynamic = 'force-dynamic';

export default async function ELCObservationFormPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-container {
            max-width: 100% !important;
            padding: 0 !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>

      <div className="container mx-auto px-4 py-8 print-container">
        <div className="no-print mb-6 flex justify-between items-center">
          <Link
            href="/account/print-outs"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Printouts
          </Link>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Print Form
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg border shadow-sm">
          {/* Header */}
          <div className="border-b-2 border-gray-800 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-center">
              {elcObservationOfSkills.name}
            </h1>
            <p className="text-center text-sm text-gray-600 mt-2">
              {elcObservationOfSkills.description}
            </p>
          </div>

          {/* Client Information */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b border-gray-300">
            <div>
              <label className="text-sm font-semibold">Client Name:</label>
              <div className="border-b border-gray-400 mt-1 h-6"></div>
            </div>
            <div>
              <label className="text-sm font-semibold">Date:</label>
              <div className="border-b border-gray-400 mt-1 h-6"></div>
            </div>
            <div>
              <label className="text-sm font-semibold">Observer:</label>
              <div className="border-b border-gray-400 mt-1 h-6"></div>
            </div>
            <div>
              <label className="text-sm font-semibold">Age:</label>
              <div className="border-b border-gray-400 mt-1 h-6"></div>
            </div>
          </div>

          {/* Sections */}
          {elcObservationOfSkills.sections.map((section, sectionIndex) => (
            <div key={section.id} className="mb-8 break-inside-avoid">
              <div className="bg-gray-100 px-4 py-2 mb-4">
                <h2 className="text-lg font-bold">{section.title}</h2>
                {section.description && (
                  <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                )}
              </div>

              <div className="space-y-4">
                {section.questions.map((question, questionIndex) => (
                  <div key={question.id} className="pl-4 break-inside-avoid">
                    <p className="font-medium text-sm mb-2">
                      {sectionIndex + 1}.{questionIndex + 1}. {question.text}
                    </p>
                    
                    {question.type === 'yes-no-not-established' ? (
                      <div className="flex gap-6 ml-4">
                        <label className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-gray-800 rounded-full"></div>
                          <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-gray-800 rounded-full"></div>
                          <span className="text-sm">No</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-gray-800 rounded-full"></div>
                          <span className="text-sm">Not Established</span>
                        </label>
                      </div>
                    ) : question.options ? (
                      <div className="flex flex-wrap gap-4 ml-4">
                        {question.options.map((option) => (
                          <label key={option} className="flex items-start gap-2 max-w-xs">
                            <div className="w-5 h-5 border-2 border-gray-800 rounded-full flex-shrink-0 mt-0.5"></div>
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Notes Section */}
          <div className="mt-8 pt-6 border-t-2 border-gray-800">
            <h2 className="text-lg font-bold mb-4">Notes / Additional Observations</h2>
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border-b border-gray-400 h-6"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
