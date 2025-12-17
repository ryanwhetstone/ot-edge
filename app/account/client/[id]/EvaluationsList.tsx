'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

type Evaluation = {
  id: number;
  uuid: string;
  name: string;
  createdAt: Date | null;
};

type EvaluationsListProps = {
  evaluations: Evaluation[];
  clientId: string;
  clientInternalId: number;
};

export default function EvaluationsList({ evaluations, clientId, clientInternalId }: EvaluationsListProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationName, setEvaluationName] = useState('');

  const handleCreateEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!evaluationName.trim()) {
      toast.error('Please enter an evaluation name');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Creating evaluation...');

    try {
      const response = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: clientInternalId,
          name: evaluationName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create evaluation');
      }

      toast.success('Evaluation created successfully', { id: toastId });
      setIsModalOpen(false);
      setEvaluationName('');
      router.refresh();
    } catch (error) {
      console.error('Error creating evaluation:', error);
      toast.error('Failed to create evaluation', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          {evaluations.length === 0 ? 'No evaluations yet.' : `${evaluations.length} evaluation${evaluations.length === 1 ? '' : 's'}`}
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          + New Evaluation
        </button>
      </div>

      {evaluations.length > 0 && (
        <div className="space-y-3">
          {evaluations.map((evaluation) => (
            <div
              key={evaluation.id}
              className="rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{evaluation.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Created {evaluation.createdAt ? new Date(evaluation.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => toast('Evaluation details coming soon')}
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold">Create New Evaluation</h2>
            <form onSubmit={handleCreateEvaluation}>
              <div className="mb-4">
                <label htmlFor="evaluationName" className="block text-sm font-medium text-gray-700 mb-2">
                  Evaluation Name
                </label>
                <input
                  type="text"
                  id="evaluationName"
                  value={evaluationName}
                  onChange={(e) => setEvaluationName(e.target.value)}
                  placeholder="e.g., Winter 2025 Evaluation"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEvaluationName('');
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Evaluation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
