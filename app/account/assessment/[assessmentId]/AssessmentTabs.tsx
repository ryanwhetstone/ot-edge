'use client';

import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Copy } from 'lucide-react';
import { spm2Sections } from '@/lib/spm2-questions';
import { getScoreCategory, getCategoryColor, getTScore } from '@/lib/spm2-scoring';

type AssessmentTabsProps = {
  responses: Record<string, number>;
  notes: string | null;
  clientName: string;
  assessmentId: string;
};

export default function AssessmentTabs({ responses, notes, clientName, assessmentId }: AssessmentTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'scores' | 'responses' | 'copy1' | 'copy2'>('scores');
  const [takeaways, setTakeaways] = useState<Record<string, string>>({});
  const [loadingTakeaways, setLoadingTakeaways] = useState<Record<string, boolean>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedResponses, setEditedResponses] = useState<Record<string, number>>(responses);
  const [isSaving, setIsSaving] = useState(false);

  const s = '●';

  const copyTableToClipboard = (tableId: string) => {
    const table = document.getElementById(tableId);
    if (!table) return;

    // Create a range and selection
    const range = document.createRange();
    const selection = window.getSelection();
    
    // Select the table
    range.selectNode(table);
    selection?.removeAllRanges();
    selection?.addRange(range);

    try {
      // Copy to clipboard
      document.execCommand('copy');
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy');
    }

    // Clear selection
    selection?.removeAllRanges();
  };

  const calculateSectionScore = (sectionId: string, useEdited = false) => {
    const section = spm2Sections.find(s => s.id === sectionId);
    if (!section) return 0;
    
    const responsesToUse = useEdited ? editedResponses : responses;
    const isReversedScoring = sectionId === 'social-participation';
    
    return section.questions.reduce((total, question) => {
      const response = responsesToUse[question.id] || 0;
      // For social-participation section: Never=4, Occasionally=3, Frequently=2, Always=1
      const score = isReversedScoring ? (5 - response) : response;
      return total + score;
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

  const generateTakeaway = (sectionId: string) => {
    const section = spm2Sections.find(s => s.id === sectionId);
    if (!section) return;

    const isSocialSection = sectionId === 'social-participation';
    const groupedResponses: Record<string, string[]> = {
      never: [],
      occasionally: [],
      frequently: [],
      always: [],
    };

    section.questions.forEach(question => {
      const response = responses[question.id];
      
      // For social section, highlight Never (1) and Occasionally (2)
      // For other sections, highlight Frequently (3) and Always (4)
      const shouldHighlight = isSocialSection 
        ? (response === 1 || response === 2)
        : (response === 3 || response === 4);

      if (shouldHighlight) {
        const responseLabel = getResponseLabel(response).toLowerCase();
        // Capitalize first character of the question text
        const capitalizedText = question.text.charAt(0).toUpperCase() + question.text.slice(1).toLowerCase();
        groupedResponses[responseLabel].push(capitalizedText);
      }
    });

    const takeawayParts: string[] = [];
    
    // Build the takeaway with grouped responses in specific order
    const orderedLabels = ['never', 'occasionally', 'always', 'frequently'];
    orderedLabels.forEach(label => {
      const questions = groupedResponses[label];
      if (questions && questions.length > 0) {
        takeawayParts.push(`${clientName} ${label}: ${questions.join(' | ')}`);
      }
    });

    const takeaway = takeawayParts.length > 0
      ? takeawayParts.join('\n')
      : 'No significant responses in this section.';

    setTakeaways(prev => ({ ...prev, [sectionId]: takeaway }));
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
          <button
            onClick={() => setActiveTab('copy1')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium cursor-pointer ${
              activeTab === 'copy1'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Copy Option 1
          </button>
          <button
            onClick={() => setActiveTab('copy2')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium cursor-pointer ${
              activeTab === 'copy2'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Copy Option 2
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
                      T
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responses
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {spm2Sections.slice(0, 6).map((section) => {
                    const score = calculateSectionScore(section.id, isEditing);
                    const tScore = getTScore(section.id, score);
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
                          <div className="text-sm font-semibold text-gray-900">
                            {tScore ?? '-'}
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
                            <div className="text-sm text-gray-700 max-w-xl whitespace-pre-line">
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
                      <div className="text-sm font-bold text-gray-900">
                        {getTScore('sensory-total', getSensoryTotal(isEditing)) ?? '-'}
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
                  {spm2Sections.slice(6).map((section) => {
                    const score = calculateSectionScore(section.id, isEditing);
                    const tScore = getTScore(section.id, score);
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
                          <div className="text-sm font-semibold text-gray-900">
                            {tScore ?? '-'}
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
                            <div className="text-sm text-gray-700 max-w-xl whitespace-pre-line">
                              {takeaway || 'No takeaways available.'}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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

        {activeTab === 'copy1' && (
          <div className="space-y-6">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => copyTableToClipboard('copy-table-1')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                Copy to Clipboard
              </button>
            </div>
            <div className="bg-white">
              <table id="copy-table-1" border={1} className="min-w-full">
                <style dangerouslySetInnerHTML={{__html: `
                  <style>
                    table {
                        border-collapse: collapse;  /* Makes borders join cleanly */
                        width: 100%;                /* Optional: adjust as needed */
                    }
                    th, td {
                        border: 1px solid black;    /* Visible solid border */
                        padding: 8px;               /* Improves readability */
                        text-align: left;           /* Optional alignment */
                    }
                    /* Optional: make headers stand out */
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
                `}} />
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left">
                      Section
                    </th>
                    <th className="px-6 py-3 text-left">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left">
                      T
                    </th>
                    <th className="px-6 py-3 text-left">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left">
                      Responses
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {spm2Sections.slice(0, 6).map((section) => {
                    const score = calculateSectionScore(section.id, false);
                    const tScore = getTScore(section.id, score);
                    const category = getScoreCategory(section.id, score);
                    const takeaway = takeaways[section.id];
                    
                    return (
                      <tr key={section.id}>
                        <td className="px-6 py-4">
                          {section.short_title}
                        </td>
                        <td className="px-6 py-4">
                          {score}
                        </td>
                        <td className="px-6 py-4">
                          {tScore ?? '-'}
                        </td>
                        <td className="px-6 py-4">
                          {category}
                        </td>
                        <td className="px-6 py-4 whitespace-pre-line">
                          {takeaway || 'No takeaways available.'}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="px-6 py-4">Sensory Total</td>
                    <td className="px-6 py-4">
                      {getSensoryTotal(false)}
                    </td>
                    <td className="px-6 py-4">
                      {getTScore('sensory-total', getSensoryTotal(false)) ?? '-'}
                    </td>
                    <td className="px-6 py-4">
                      {getScoreCategory('sensory-total', getSensoryTotal(false))}
                    </td>
                    <td className="px-6 py-4">
                      Combined sensory processing across all sensory domains
                    </td>
                  </tr>
                  {spm2Sections.slice(6).map((section) => {
                    const score = calculateSectionScore(section.id, false);
                    const tScore = getTScore(section.id, score);
                    const category = getScoreCategory(section.id, score);
                    const takeaway = takeaways[section.id];
                    
                    return (
                      <tr key={section.id}>
                        <td className="px-6 py-4">
                          {section.short_title}
                        </td>
                        <td className="px-6 py-4">
                          {score}
                        </td>
                        <td className="px-6 py-4">
                          {tScore ?? '-'}
                        </td>
                        <td className="px-6 py-4">
                          {category}
                        </td>
                        <td className="px-6 py-4 whitespace-pre-line">
                          {takeaway || 'No takeaways available.'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'copy2' && (
          <div className="space-y-6">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => copyTableToClipboard('copy-table-2')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                Copy to Clipboard
              </button>
            </div>
            <div className="bg-white">
              <table id="copy-table-2" border={1} className="min-w-full">
                <style dangerouslySetInnerHTML={{__html: `
                  <style>
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    .bold {
                      font-weight: bold;
                    }
                </style>
                `}} />
                <tbody>
                  {spm2Sections.slice(0, 6).map((section) => {
                    const score = calculateSectionScore(section.id, false);
                    const tScore = getTScore(section.id, score);
                    const category = getScoreCategory(section.id, score);
                    const takeaway = takeaways[section.id];
                    
                    return (
                      <Fragment key={section.id}>
                        <tr>
                          <td className="px-6 py-4" style={{ whiteSpace: 'pre-line' }}>
                            <span className="bold">{section.short_title} {s} {category} {s} Raw Score: {score} {s} T Score: {tScore ?? '-'}</span><br />
                            <span className="bold">Responses:</span> {takeaway || 'No takeaways available.'}
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })}
                  <tr>
                    <td className="px-6 py-4">
                      <span className="bold">Sensory Total {s} {getScoreCategory('sensory-total', getSensoryTotal(false))} {s} {getSensoryTotal(false)} {s} {getTScore('sensory-total', getSensoryTotal(false)) ?? '-'}</span><br />
                      Combined sensory processing across all sensory domains
                    </td>
                  </tr>
                  {spm2Sections.slice(6).map((section) => {
                    const score = calculateSectionScore(section.id, false);
                    const tScore = getTScore(section.id, score);
                    const category = getScoreCategory(section.id, score);
                    const takeaway = takeaways[section.id];
                    
                    return (
                      <Fragment key={section.id}>
                        <tr>
                          <td className="px-6 py-4" style={{ whiteSpace: 'pre-line' }}>
                            <span className="bold">{section.short_title} {s} {category} {s} Raw Score: {score} {s} T Score: {tScore ?? '-'}</span><br />
                            <span className="bold">Responses:</span> {takeaway || 'No takeaways available.'}
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
