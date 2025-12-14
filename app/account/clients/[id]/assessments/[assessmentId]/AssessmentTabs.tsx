'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { spm2Sections } from '@/lib/spm2-questions';
import { getScoreCategory, getCategoryColor } from '@/lib/spm2-scoring';

type AssessmentTabsProps = {
  responses: Record<string, number>;
  notes: string | null;
  clientName: string;
  assessmentId: string;
};

export default function AssessmentTabs({ responses, notes, clientName, assessmentId }: AssessmentTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'scores' | 'responses'>('scores');
  const [takeaways, setTakeaways] = useState<Record<string, string>>({});
  const [loadingTakeaways, setLoadingTakeaways] = useState<Record<string, boolean>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedResponses, setEditedResponses] = useState<Record<string, number>>(responses);
  const [isSaving, setIsSaving] = useState(false);

  const calculateSectionScore = (sectionId: string, useEdited = false) => {
    const section = spm2Sections.find(s => s.id === sectionId);
    if (!section) return 0;
    
    const responsesToUse = useEdited ? editedResponses : responses;
    return section.questions.reduce((total, question) => {
      const response = responsesToUse[question.id] || 0;
      return total + response;
    }, 0);
  };

  const getResponseLabel = (value: number) => {
    const labels = ['Never', 'Occasionally', 'Frequently', 'Always'];
    return labels[value - 1] || 'N/A';
  };

  const getTotalScore = (useEdited = false) => {
    return spm2Sections.reduce((total, section) => {
      return total + calculateSectionScore(section.id, useEdited);
    }, 0);
  };

  const getSensoryTotal = (useEdited = false) => {
    // Sum of VIS, HEA, TOU, T&S, BOD, BAL (excluding PLA and SOC)
    const sensorySections = ['vision', 'hearing', 'touch', 'taste-smell', 'body-awareness', 'balance-motion'];
    return sensorySections.reduce((total, sectionId) => {
      return total + calculateSectionScore(sectionId, useEdited);
    }, 0);
  };

  const generateTakeaway = async (sectionId: string) => {
    setLoadingTakeaways(prev => ({ ...prev, [sectionId]: true }));
    
    try {
      const response = await fetch('/api/generate-takeaway', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sectionId,
          responses,
          clientName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate takeaway');
      }

      const data = await response.json();
      setTakeaways(prev => ({ ...prev, [sectionId]: data.takeaway }));
    } catch (error) {
      console.error('Error generating takeaway:', error);
      setTakeaways(prev => ({ ...prev, [sectionId]: 'Unable to generate takeaway at this time.' }));
    } finally {
      setLoadingTakeaways(prev => ({ ...prev, [sectionId]: false }));
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Saving changes...');

    try {
      const response = await fetch(`/api/assessments/${assessmentId}`, {
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
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to save changes');
      }

      toast.success('Changes saved successfully', { id: toastId });
      setIsEditing(false);
      
      // Refresh the page to update scores and takeaways
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

  const handleResponseChange = (questionId: string, value: number) => {
    setEditedResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  useEffect(() => {
    // Generate takeaways for all sections when component mounts
    spm2Sections.forEach(section => {
      generateTakeaway(section.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Reset edited responses when original responses change
    setEditedResponses(responses);
  }, [responses]);

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('scores')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium cursor-pointer ${
              activeTab === 'scores'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Scores
          </button>
          <button
            onClick={() => setActiveTab('responses')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium cursor-pointer ${
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
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Takeaways
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {spm2Sections.map((section) => {
                    const score = calculateSectionScore(section.id, isEditing);
                    const category = getScoreCategory(section.id, score);
                    const takeaway = takeaways[section.id];
                    const isLoading = loadingTakeaways[section.id];
                    
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
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(category)}`}>
                            {category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {isLoading ? (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Generating...
                            </div>
                          ) : (
                            <div className="text-sm text-gray-700 max-w-xl">
                              {takeaway || 'No takeaways available.'}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-blue-50 border-t-2 border-blue-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">Sensory Total</div>
                      <div className="text-xs text-gray-500">
                        VIS + HEA + TOU + T&S + BOD + BAL
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {getSensoryTotal(isEditing)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(getScoreCategory('sensory-total', getSensoryTotal(isEditing)))}`}>
                        {getScoreCategory('sensory-total', getSensoryTotal(isEditing))}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        Combined sensory processing across all sensory domains
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">Total</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {getTotalScore(isEditing)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Overall</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        Summary of all section findings
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
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    Edit Responses
                  </button>
                )}
              </div>
            </div>
            {spm2Sections.map((section) => (
              <div key={section.id} className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  {section.title}
                </h2>
                <p className="mb-4 text-sm text-gray-600">{section.description}</p>
                <div className="space-y-4">
                  {section.questions.map((question) => {
                    const response = isEditing ? editedResponses[question.id] : responses[question.id];
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
                          {isEditing ? (
                            <select
                              value={response}
                              onChange={(e) => handleResponseChange(question.id, Number(e.target.value))}
                              className="rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                              <option value={1}>Never</option>
                              <option value={2}>Occasionally</option>
                              <option value={3}>Frequently</option>
                              <option value={4}>Always</option>
                            </select>
                          ) : (
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
                          )}
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
