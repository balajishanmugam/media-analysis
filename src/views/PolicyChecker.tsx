import React, { useState } from 'react';
import UploadBox from '../components/UploadBox';
import ReportView from '../components/ReportView';
import { uploadDocument } from '../services/api';
import { isValidDocumentFile, isValidFileSize } from '../utils/validators';
import { ComplianceReport } from '../types';

const PolicyChecker: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const handleFileSelected = (file: File) => {
    setError(null);
    setReport(null);

    // Validate file type
    if (!isValidDocumentFile(file)) {
      setError('Invalid file type. Only .pdf, .docx, .doc files are allowed.');
      setSelectedFile(null);
      return;
    }

    // Validate file size
    if (!isValidFileSize(file, 100)) {
      setError('File size exceeds 100MB limit.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };
  const handleGenerateReport = async () => {
    if (!selectedFile) return;

    setIsGeneratingReport(true);
    setError(null);

    try {
      const result = await uploadDocument(selectedFile);
      setReport(result);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setError(null);
    setReport(null);
  };

  const getFileIcon = () => {
    if (!selectedFile) return null;

    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') {
      return (
        <svg className="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    }

    return (
      <svg className="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    );
  };
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Policy Document Checker</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload a policy document to check for compliance issues and receive detailed recommendations.
        </p>
      </div>      {!report ? (
        <>
          {/* Upload Section */}
          <div className="card">            {/* Supported Formats Label */}
            <div className="mb-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Supported formats:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                .PDF
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                .DOCX
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                .DOC
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(Max 100MB)</span>
            </div>

            <UploadBox
              accept={{
                'application/pdf': ['.pdf'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                'application/msword': ['.doc'],
              }}              onFileSelected={handleFileSelected}
              maxSize={100 * 1024 * 1024}
              label="Drag and drop your document here"
              selectedFile={selectedFile}
              error={error}
            />

            {/* Document Preview */}
            {selectedFile && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Document Information</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 flex items-center gap-4">
                  {getFileIcon()}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {selectedFile.name.split('.').pop()?.toUpperCase()} Document
                    </p>
                  </div>
                </div>
              </div>
            )}{/* Generate Report Button */}
            {selectedFile && !error && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
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
                <button onClick={handleReset} className="btn btn-secondary">
                  Clear
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Report View */}
          <ReportView report={report} />
          
          {/* Check Another File */}
          <div className="text-center">
            <button onClick={handleReset} className="btn btn-secondary">
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Check Another Document
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PolicyChecker;
