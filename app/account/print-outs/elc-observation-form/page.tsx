import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { elcObservationOfSkills } from "@/lib/observation-templates";
import PrintButton from "./PrintButton";

export const dynamic = 'force-dynamic';

export default async function ELCObservationFormPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8 print-container">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .no-print {
            display: none !important;
          }
          .print-container {
            max-width: 100% !important;
            padding: 0.5rem !important;
          }
          .print-sections {
            column-count: 2;
            column-gap: 1rem;
          }
          .section-block {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            font-size: 10pt;
          }
          .print-header {
            column-span: all;
          }
          .print-notes {
            column-span: all;
          }
        }
        @media screen {
          .print-sections {
            column-count: 2;
            column-gap: 1.5rem;
          }
        }
      `}} />
        <div className="no-print mb-6 flex justify-between items-center">
          <Link
            href="/account/print-outs"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Printouts
          </Link>
          <PrintButton />
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          {/* Header */}
          <div className="border-b-2 border-gray-800 pb-2 mb-3 print-header">
            <h1 className="text-xl font-bold text-center">
              {elcObservationOfSkills.name}
            </h1>
          </div>

          {/* Client Information */}
          <div className="grid grid-cols-4 gap-2 mb-3 pb-2 border-b border-gray-300 print-header text-xs">
            <div>
              <label className="font-semibold">Name:</label>
              <div className="border-b border-gray-400 mt-1 h-5"></div>
            </div>
            <div>
              <label className="font-semibold">Age:</label>
              <div className="border-b border-gray-400 mt-1 h-5"></div>
            </div>
            <div>
              <label className="font-semibold">Observer:</label>
              <div className="border-b border-gray-400 mt-1 h-5"></div>
            </div>
            <div>
              <label className="font-semibold">Date:</label>
              <div className="border-b border-gray-400 mt-1 h-5"></div>
            </div>
          </div>

          {/* Sections in Columns */}
          <div className="print-sections">
            {elcObservationOfSkills.sections.map((section, sectionIndex) => (
              <div key={section.id} className="mb-4 section-block">
                <div className="bg-gray-100 px-2 py-1 mb-2">
                  <h2 className="text-sm font-bold">{section.title}</h2>
                </div>

                <div className="space-y-2">
                  {section.questions.map((question, questionIndex) => (
                    <div key={question.id} className="pl-2 text-xs">
                      <p className="font-medium mb-1">
                        {sectionIndex + 1}.{questionIndex + 1}. {question.text}
                      </p>
                      
                      {question.type === 'yes-no-not-established' ? (
                        <div className="flex gap-3 ml-2">
                          <label className="flex items-center gap-1">
                            <div className="w-3 h-3 border-2 border-gray-800 rounded-full"></div>
                            <span className="text-xs">Y</span>
                          </label>
                          <label className="flex items-center gap-1">
                            <div className="w-3 h-3 border-2 border-gray-800 rounded-full"></div>
                            <span className="text-xs">N</span>
                          </label>
                          <label className="flex items-center gap-1">
                            <div className="w-3 h-3 border-2 border-gray-800 rounded-full"></div>
                            <span className="text-xs">NE</span>
                          </label>
                        </div>
                      ) : question.options ? (
                        <div className="ml-2 space-y-1">
                          {question.options.map((option) => (
                            <label key={option} className="flex items-start gap-1">
                              <div className="w-3 h-3 border-2 border-gray-800 rounded-full flex-shrink-0 mt-0.5"></div>
                              <span className="text-xs leading-tight">{option}</span>
                            </label>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Notes Section */}
          <div className="mt-3 pt-2 border-t-2 border-gray-800 print-notes">
            <h2 className="text-sm font-bold mb-2">Notes</h2>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border-b border-gray-400 h-4"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}
