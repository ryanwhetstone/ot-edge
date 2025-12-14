'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Assessment = {
  id: number;
  uuid: string;
  assessmentDate: Date | null;
  createdAt: Date | null;
  notes: string | null;
};

export default function AssessmentsList({
  assessments,
  clientId,
}: {
  assessments: Assessment[];
  clientId: string;
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleConfirmDelete = async (assessmentUuid: string) => {
    setDeletingId(assessmentUuid);
    setConfirmingId(null);
    const toastId = toast.loading('Deleting assessment...');
    
    try {
      const response = await fetch(`/api/spm2-assessments?uuid=${assessmentUuid}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete assessment');
      }

      toast.success('Assessment deleted successfully', { id: toastId });
      router.refresh();
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast.error('Failed to delete assessment. Please try again.', { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  if (assessments.length === 0) {
    return (
      <p className="text-sm text-gray-600">
        No assessments completed yet. Click "New Assessment" to get started.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {assessments.map((assessment) => (
        <div
          key={assessment.id}
          className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium text-gray-900">
                  {assessment.assessmentDate 
                    ? new Date(assessment.assessmentDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'No date'}
                </p>
                {assessment.notes && (
                  <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                    {assessment.notes}
                  </p>
                )}
                {assessment.createdAt && (
                  <p className="mt-1 text-xs text-gray-500">
                    Completed {new Date(assessment.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/account/clients/${clientId}/assessments/${assessment.uuid}`}
              className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              View Results
            </Link>
            {confirmingId === assessment.uuid ? (
              <>
                <button
                  onClick={() => handleConfirmDelete(assessment.uuid)}
                  disabled={deletingId === assessment.uuid}
                  className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                >
                  {deletingId === assessment.uuid ? 'Deleting...' : 'Confirm Deletion'}
                </button>
                <button
                  onClick={() => setConfirmingId(null)}
                  disabled={deletingId === assessment.uuid}
                  className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setConfirmingId(assessment.uuid)}
                disabled={deletingId === assessment.uuid}
                className="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 disabled:opacity-50 cursor-pointer"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
