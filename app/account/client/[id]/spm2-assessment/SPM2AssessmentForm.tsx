'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { spm2Sections, type SPM2Section } from '@/lib/spm2-questions';
import toast from 'react-hot-toast';

type Responses = Record<string, number>;

export default function SPM2AssessmentForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [responses, setResponses] = useState<Responses>({});
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentSection = spm2Sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === spm2Sections.length - 1;
  const progress = ((currentSectionIndex + 1) / spm2Sections.length) * 100;

  const handleResponse = (questionId: string, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const isCurrentSectionComplete = () => {
    return currentSection.questions.every(q => responses[q.id] !== undefined);
  };

  const handleNext = () => {
    if (isCurrentSectionComplete()) {
      setCurrentSectionIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      toast.error('Please answer all questions in this section before continuing.');
    }
  };

  const handlePrevious = () => {
    setCurrentSectionIndex(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!isCurrentSectionComplete()) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Saving assessment...');
    
    try {
      const response = await fetch('/api/spm2-assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          responses,
          notes: notes.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save assessment');
      }

      const data = await response.json();
      toast.success('Assessment saved successfully!', { id: toastId });
      router.push(`/account/assessment/${data.assessment.uuid}`);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast.error('Failed to save assessment. Please try again.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
          <span>Section {currentSectionIndex + 1} of {spm2Sections.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{currentSection.title}</h2>
        <p className="mt-2 text-sm text-gray-600">{currentSection.description}</p>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {currentSection.questions.map((question, index) => (
          <div
            key={question.id}
            className="rounded-lg border bg-white p-6 shadow-sm"
          >
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-500">
                Question {index + 1} of {currentSection.questions.length}
              </span>
              <h3 className="mt-1 text-lg font-medium text-gray-900">
                {question.text}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {question.options.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleResponse(question.id, option.value)}
                  className={`rounded-lg border-2 px-4 py-3 text-sm font-medium cursor-pointer transition-colors ${
                    responses[question.id] === option.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Notes Section (only on last section) */}
      {isLastSection && (
        <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Additional Notes (Optional)
          </label>
          <textarea
            id="notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Any additional observations or comments..."
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentSectionIndex === 0}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Previous
        </button>

        {!isLastSection ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!isCurrentSectionComplete()}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Section
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isCurrentSectionComplete() || isSubmitting}
            className="rounded-md bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
          </button>
        )}
      </div>
    </div>
  );
}
