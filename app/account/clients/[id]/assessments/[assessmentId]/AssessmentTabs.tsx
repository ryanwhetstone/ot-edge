'use client';

import { useState } from 'react';
import { spm2Sections } from '@/lib/spm2-questions';

type AssessmentTabsProps = {
  responses: Record<string, number>;
  notes: string | null;
};

export default function AssessmentTabs({ responses, notes }: AssessmentTabsProps) {
  const [activeTab, setActiveTab] = useState<'scores' | 'responses'>('scores');

  const calculateSectionScore = (sectionId: string) => {
    const section = spm2Sections.find(s => s.id === sectionId);
    if (!section) return 0;
    
    return section.questions.reduce((total, question) => {
      const response = responses[question.id] || 0;
      return total + response;
    }, 0);
  };

  const getResponseLabel = (value: number) => {
    const labels = ['Never', 'Occasionally', 'Frequently', 'Always'];
    return labels[value - 1] || 'N/A';
  };

  const getTotalScore = () => {
    return spm2Sections.reduce((total, section) => {
      return total + calculateSectionScore(section.id);
    }, 0);
  };

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('scores')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'scores'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Scores
          </button>
          <button
            onClick={() => setActiveTab('responses')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'responses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Responses
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'scores' && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Section
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Possible
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {spm2Sections.map((section) => {
                    const score = calculateSectionScore(section.id);
                    const possible = section.questions.length * 4; // Max is 4 (Always)
                    const percentage = ((score / possible) * 100).toFixed(1);
                    
                    return (
                      <tr key={section.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {section.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {section.questions.length} questions
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {score}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{possible}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 mr-2">
                              {percentage}%
                            </div>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">Total</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {getTotalScore()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {spm2Sections.length * 10 * 4}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {((getTotalScore() / (spm2Sections.length * 10 * 4)) * 100).toFixed(1)}%
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {notes && (
              <div className="rounded-lg border bg-blue-50 p-4">
                <h3 className="font-semibold text-blue-900">Notes</h3>
                <p className="mt-1 text-sm text-blue-800">{notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'responses' && (
          <div className="space-y-8">
            {spm2Sections.map((section) => (
              <div key={section.id} className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  {section.title}
                </h2>
                <p className="mb-4 text-sm text-gray-600">{section.description}</p>
                <div className="space-y-4">
                  {section.questions.map((question) => {
                    const response = responses[question.id];
                    return (
                      <div
                        key={question.id}
                        className="border-b pb-4 last:border-b-0 last:pb-0"
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {question.text}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">Response:</span>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              response === 1
                                ? 'bg-green-100 text-green-800'
                                : response === 2
                                ? 'bg-yellow-100 text-yellow-800'
                                : response === 3
                                ? 'bg-orange-100 text-orange-800'
                                : response === 4
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {getResponseLabel(response)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
