import React, { useState } from 'react';
import { ComplianceReport } from '../types';
import ResultBadge from './ResultBadge';
import { formatFileSize, formatDuration, formatDate, downloadJSON } from '../utils/formatters';
import clsx from 'clsx';

interface ReportViewProps {
  report: ComplianceReport;
}

const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());

  const toggleIssue = (issueId: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  const handleDownloadReport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    downloadJSON(report, `compliance-report-${timestamp}.json`);
  };

  const getStatusMessage = () => {
    switch (report.summary.status) {
      case 'pass':
        return `✅ This content meets compliance guidelines. Score: ${report.summary.score}/100`;
      case 'partial_fail':
        return `⚠️ Some issues found—please review the highlighted sections and apply suggested changes.`;
      case 'fail':
        return `⛔ Critical compliance issues detected. Stop publishing until these are resolved.`;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Compliance Report</h2>
            <p className="text-gray-600 dark:text-gray-400">{getStatusMessage()}</p>
          </div>
          <ResultBadge status={report.summary.status} className="text-lg px-4 py-2" />
        </div>

        {/* Score and Counts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Compliance Score</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{report.summary.score}/100</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Issues Found</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{report.summary.issuesCount}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Recommendations</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{report.summary.recommendationsCount}</p>
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">File Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">File:</span>
              <span className="ml-2 text-gray-900 dark:text-white font-medium">{report.metadata.fileName}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Size:</span>
              <span className="ml-2 text-gray-900 dark:text-white font-medium">{formatFileSize(report.metadata.fileSize)}</span>
            </div>
            {report.metadata.durationSec && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                <span className="ml-2 text-gray-900 dark:text-white font-medium">{formatDuration(report.metadata.durationSec)}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500 dark:text-gray-400">Checked:</span>
              <span className="ml-2 text-gray-900 dark:text-white font-medium">{formatDate(report.metadata.checkedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Issues List */}
      {report.issues.length > 0 ? (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Issues & Recommendations</h3>
          <div className="space-y-3">
            {report.issues.map((issue) => {
              const isExpanded = expandedIssues.has(issue.id);
              return (
                <div
                  key={issue.id}
                  className={clsx(
                    'border rounded-lg overflow-hidden transition-all duration-200',
                    issue.severity === 'high' && 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20',
                    issue.severity === 'medium' && 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20',
                    issue.severity === 'low' && 'border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                  )}
                >
                  {/* Issue Header */}
                  <button
                    onClick={() => toggleIssue(issue.id)}
                    className="w-full px-4 py-3 flex items-start gap-3 text-left hover:opacity-80 transition-opacity"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <ResultBadge severity={issue.severity} />
                        <span className="text-xs text-gray-500 dark:text-gray-400">{issue.id}</span>
                        {issue.timestamp && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">• {issue.timestamp}</span>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{issue.title}</h4>
                    </div>
                    <svg
                      className={clsx(
                        'w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform flex-shrink-0 mt-1',
                        isExpanded && 'rotate-180'
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Issue Details (Collapsible) */}
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="pt-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{issue.description}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 bg-opacity-60 dark:bg-opacity-60 rounded p-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">💡 Recommendation:</p>
                        <p className="text-sm text-gray-900 dark:text-white">{issue.recommendation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-300">No Issues Found</h3>
              <p className="text-sm text-green-700 dark:text-green-400">This content fully complies with all guidelines.</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button onClick={handleDownloadReport} className="btn btn-primary">
          <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Report
        </button>
        {report.summary.status === 'fail' && (
          <button className="btn bg-red-600 text-white hover:bg-red-700">
            Request Re-check
          </button>
        )}
        {report.summary.status === 'partial_fail' && (
          <button className="btn bg-amber-600 text-white hover:bg-amber-700">
            Accept Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportView;
