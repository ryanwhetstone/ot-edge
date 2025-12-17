'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ObservationTemplate, ObservationQuestion } from '@/lib/observation-templates';
import toast from 'react-hot-toast';

type Responses = Record<string, string>;

type ObservationFormProps = {
  template: ObservationTemplate;
  evaluationId: number;
  evaluationUuid: string;
};

export default function ObservationForm({ template, evaluationId, evaluationUuid }: ObservationFormProps) {
  const router = useRouter();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [responses, setResponses] = useState<Responses>({});
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentSection = template.sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === template.sections.length - 1;
  const progress = ((currentSectionIndex + 1) / template.sections.length) * 100;

  const handleResponse = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const isCurrentSectionComplete = () => {
    return currentSection.questions.every(q => responses[q.id] !== undefined && responses[q.id] !== '');
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
    const toastId = toast.loading('Saving observation...');
    
    try {
      const response = await fetch('/api/observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evaluationId,
          observationType: template.id,
          responses,
          notes: notes.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save observation');
      }

      toast.success('Observation saved successfully!', { id: toastId });
      router.push(`/account/evaluation/${evaluationUuid}`);
    } catch (error) {
      console.error('Error submitting observation:', error);
      toast.error('Failed to save observation. Please try again.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: ObservationQuestion) => {
    const value = responses[question.id] || '';

    if (question.type === 'yes-no-not-established') {
      return (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">{question.text}</p>
          <div className="flex gap-3">
            {['Yes', 'No', 'Not Established'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleResponse(question.id, option)}
                className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                  value === option
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (question.type === 'multiple-choice' && question.options) {
      return (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">{question.text}</p>
          <div className="space-y-2">
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleResponse(question.id, option)}
                className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-all ${
                  value === option
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
          <span>Section {currentSectionIndex + 1} of {template.sections.length}</span>
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
        {currentSection.description && (
          <p className="mt-2 text-sm text-gray-600">{currentSection.description}</p>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6 rounded-lg border bg-white p-6 shadow-sm">
        {currentSection.questions.map((question) => (
          <div key={question.id} className="border-b pb-6 last:border-b-0 last:pb-0">
            {renderQuestion(question)}
          </div>
        ))}
      </div>

      {/* Notes Section (Last Section Only) */}
      {isLastSection && (
        <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Add any additional observations or notes..."
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentSectionIndex === 0}
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        
        {isLastSection ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !isCurrentSectionComplete()}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Submit Observation'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled={!isCurrentSectionComplete()}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next Section
          </button>
        )}
      </div>
    </div>
  );
}
