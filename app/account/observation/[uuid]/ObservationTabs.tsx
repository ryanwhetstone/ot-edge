'use client';

import { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { elcObservationOfSkills } from '@/lib/observation-templates';

type ObservationTabsProps = {
  responses: Record<string, string>;
  notes: string | null;
  clientName: string;
  observationId: string;
};

export default function ObservationTabs({ responses, notes, clientName, observationId }: ObservationTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'responses' | 'summary'>('responses');
  const [isEditing, setIsEditing] = useState(false);
  const [editedResponses, setEditedResponses] = useState<Record<string, string>>(responses);
  const [isSaving, setIsSaving] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Saving changes...');

    try {
      const response = await fetch(`/api/observations/${observationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses: editedResponses,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save changes');
      }

      toast.success('Changes saved successfully', { id: toastId });
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save changes', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedResponses(responses);
    setIsEditing(false);
  };

  const handleResponseChange = (questionId: string, value: string) => {
    setEditedResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  useEffect(() => {
    setEditedResponses(responses);
  }, [responses]);

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
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white rounded-lg border p-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {isEditing ? 'Edit Mode' : 'View Mode'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isEditing ? 'Make changes to responses below and click Save' : 'Click Edit to modify responses'}
                </p>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Edit Responses
                  </button>
                )}
              </div>
            </div>

            {elcObservationOfSkills.sections.map(section => (
              <div key={section.id} className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                {section.description && (
                  <p className="text-gray-600 mb-4">{section.description}</p>
                )}
                
                <div className="space-y-4">
                  {section.questions.map(question => {
                    const response = isEditing ? editedResponses[question.id] : responses[question.id];
                    return (
                      <div key={question.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <p className="text-sm font-medium text-gray-900">{question.text}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">Response:</span>
                          {isEditing ? (
                            <select
                              value={response || ''}
                              onChange={(e) => handleResponseChange(question.id, e.target.value)}
                              className="rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                              <option value="">Select...</option>
                              {question.type === 'yes-no-not-established' ? (
                                <>
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                  <option value="Not Established">Not Established</option>
                                </>
                              ) : question.options ? (
                                question.options.map(option => (
                                  <option key={option} value={option}>{option}</option>
                                ))
                              ) : null}
                            </select>
                          ) : (
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              response === 'Yes' || response === 'Snips independently' || response === 'Cuts on a line'
                                ? 'bg-green-100 text-green-800'
                                : response === 'No' || response === 'No exposure at home' || response === 'Not established'
                                ? 'bg-red-100 text-red-800'
                                : response === 'Not Established'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {response || 'Not answered'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {notes && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
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
