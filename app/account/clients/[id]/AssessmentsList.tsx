'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Assessment = {
  id: number;
  uuid: string;
  assessmentDate: Date;
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

  const handleDelete = async (assessmentUuid: string) => {
    if (!confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
      return;
    }

    setDeletingId(assessmentUuid);
    try {
      const response = await fetch(`/api/spm2-assessments?uuid=${assessmentUuid}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete assessment');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting assessment:', error);
      alert('Failed to delete assessment. Please try again.');
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
                  {new Date(assessment.assessmentDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                {assessment.notes && (
                  <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                    {assessment.notes}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Completed {new Date(assessment.createdAt!).toLocaleDateString()}
                </p>
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
            <button
              onClick={() => handleDelete(assessment.uuid)}
              disabled={deletingId === assessment.uuid}
              className="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 disabled:opacity-50"
            >
              {deletingId === assessment.uuid ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
