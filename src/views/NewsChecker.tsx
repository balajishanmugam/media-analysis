import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ReportView from '../components/ReportView';
import { checkText } from '../services/api';
import { isValidURL } from '../utils/validators';
import { ComplianceReport } from '../types';

interface FormData {
  url: string;
  text: string;
}

const NewsChecker: React.FC = () => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ComplianceReport | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      url: '',
      text: '',
    },
  });

  const urlValue = watch('url');
  const textValue = watch('text');

  const onSubmit = async (data: FormData) => {
    setIsGeneratingReport(true);
    setError(null);

    try {
      const payload = data.url.trim()
        ? { url: data.url.trim() }
        : { text: data.text.trim() };

      const result = await checkText(payload);
      setReport(result);
    } catch (err) {
      setError('Failed to generate report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleReset = () => {
    reset();
    setError(null);
    setReport(null);
  };

  const isFormValid = () => {
    const hasUrl = urlValue && urlValue.trim().length > 0;
    const hasText = textValue && textValue.trim().length > 0;
    return hasUrl || hasText;
  };
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">News Content Checker</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Enter a URL or paste text content to check for compliance issues and receive detailed recommendations.
        </p>
      </div>

      {!report ? (
        <>          {/* Input Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="card">              {/* Supported Input Types Label */}
              <div className="mb-6 flex flex-wrap gap-2 items-center bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Supported input types:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                  Article URL
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                  Plain Text
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(Provide one)</span>
              </div>              {/* URL Input */}
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Article URL
                </label>
                <input
                  id="url"
                  type="text"
                  {...register('url', {
                    validate: (value) => {
                      if (!value || value.trim().length === 0) return true;
                      return isValidURL(value) || 'Please enter a valid URL';
                    },
                  })}
                  placeholder="https://example.com/article"
                  className="input-field"
                />
                {errors.url && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.url.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enter a URL to fetch and analyze the article content
                </p>
              </div>              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">OR</span>
                </div>
              </div>

              {/* Text Input */}
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Article Text
                </label>
                <textarea
                  id="text"
                  {...register('text')}
                  rows={12}
                  placeholder="Paste the article text here..."
                  className="input-field resize-none"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Or paste the full text content directly
                </p>
              </div>

              {/* Info Box */}
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">How it works</p>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      Provide either a URL or paste the text directly. The system will analyze the content
                      for compliance with media guidelines and regulations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 error-box">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={!isFormValid() || isGeneratingReport}
                  className="btn btn-primary"
                >
                  {isGeneratingReport ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Report...
                    </>
                  ) : (
                    'Generate Compliance Report'
                  )}
                </button>
                <button type="button" onClick={() => reset()} className="btn btn-secondary">
                  Clear
                </button>
              </div>
            </div>
          </form>
        </>
      ) : (
        <>
          {/* Report View */}
          <ReportView report={report} />
          
          {/* Check Another */}
          <div className="text-center">
            <button onClick={handleReset} className="btn btn-secondary">
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Check Another Article
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NewsChecker;
