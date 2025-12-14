'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

type DeleteButtonProps = {
  assessmentId: string;
  clientId: string;
};

export default function DeleteButton({ assessmentId, clientId }: DeleteButtonProps) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const toastId = toast.loading('Deleting assessment...');

    try {
      const response = await fetch(`/api/assessments/${assessmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete assessment');
      }

      toast.success('Assessment deleted successfully', { id: toastId });
      router.push(`/account/clients/${clientId}`);
      router.refresh();
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete assessment', { id: toastId });
      setIsDeleting(false);
      setIsConfirming(false);
    }
  };

  if (isConfirming) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => setIsConfirming(false)}
          disabled={isDeleting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 cursor-pointer"
    >
      Delete Assessment
    </button>
  );
}
