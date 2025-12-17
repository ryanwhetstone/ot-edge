'use client';

import { useState } from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { elcObservationOfSkills } from '@/lib/observation-templates';

type ObservationTabsProps = {
  responses: Record<string, string>;
  notes: string | null;
  clientName: string;
  observationId: string;
};

export default function ObservationTabs({ responses, notes, clientName, observationId }: ObservationTabsProps) {
  const [activeTab, setActiveTab] = useState<'responses' | 'summary'>('responses');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  const generateSummary = () => {
    let summary = `ELC Observation of Skills - ${clientName}\n\n`;

    elcObservationOfSkills.sections.forEach(section => {
      summary += `${section.title}\n`;
      summary += '='.repeat(section.title.length) + '\n\n';

      section.questions.forEach(question => {
        const response = responses[question.id];
        if (response) {
          summary += `• ${question.text}: ${response}\n`;
        }
      });

      summary += '\n';
    });

    if (notes) {
      summary += `Notes\n`;
      summary += '=====\n\n';
      summary += notes + '\n';
    }

    return summary;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('responses')}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === 'responses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Responses
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === 'summary'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Summary
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'responses' && (
          <div className="space-y-8">
            {elcObservationOfSkills.sections.map(section => (
              <div key={section.id}>
                <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                {section.description && (
                  <p className="text-gray-600 mb-4">{section.description}</p>
                )}
                
                <div className="space-y-3">
                  {section.questions.map(question => {
                    const response = responses[question.id];
                    return (
                      <div key={question.id} className="border-b pb-3">
                        <p className="font-medium text-gray-900">{question.text}</p>
                        <p className={`mt-1 ${
                          response === 'Yes' || response === 'Snips independently' || response === 'Cuts on a line'
                            ? 'text-green-600 font-medium'
                            : response === 'No' || response === 'No exposure at home' || response === 'Not established'
                            ? 'text-red-600 font-medium'
                            : 'text-blue-600 font-medium'
                        }`}>
                          {response || 'Not answered'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {notes && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Notes</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{notes}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'summary' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Observation Summary</h2>
              <button
                onClick={() => copyToClipboard(generateSummary())}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Copy className="h-4 w-4" />
                Copy Summary
              </button>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {generateSummary()}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
