/**
 * History Page - Media Compliance Check History
 * 
 * Features:
 * - 📊 Comprehensive table view of all compliance checks
 * - 🔍 Advanced search functionality (file name, ID)
 * - 🎯 Multi-filter support (Status, Checker Type)
 * - 📄 Pagination with smart navigation (10 items per page)
 * - 🔄 Sort by Date, Score, or Issues (ascending/descending)
 * - 📈 Quick stats dashboard (Total, Pass, Warning, Fail)
 * - 🔄 "Check Again" button - navigates back to appropriate checker
 * - 📋 "View Report" button - displays full report details
 * - 🗑️ Delete individual history items
 * - 📥 Export history as JSON
 * - 🧹 Clear all history option
 * - 🎨 Severity breakdown (High, Medium, Low issues)
 * - ⏰ Formatted date/time display
 * - 📊 Visual score progress bars
 * - 🌙 Full dark mode support
 * - 📱 Responsive design
 * 
 * TODO: Integrate with REST API (currently using mock data)
 */

import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

interface HistoryItem {
  id: string;
  fileName: string;
  fileType: 'video' | 'document' | 'news' | 'url';
  checkerType: 'video' | 'policy' | 'news';
  uploadDate: string;
  status: 'pass' | 'warning' | 'fail';
  score: number;
  issuesFound: number;
  highSeverity: number;
  mediumSeverity: number;
  lowSeverity: number;
  fileSize?: string;
  duration?: string;
}

// Mock data for demonstration
const mockHistoryData: HistoryItem[] = [
  {
    id: 'hist-001',
    fileName: 'corporate-training-video.mp4',
    fileType: 'video',
    checkerType: 'video',
    uploadDate: '2025-12-05T10:30:00',
    status: 'pass',
    score: 97,
    issuesFound: 2,
    highSeverity: 0,
    mediumSeverity: 1,
    lowSeverity: 1,
    fileSize: '45.2 MB',
    duration: '5:23',
  },
  {
    id: 'hist-002',
    fileName: 'privacy-policy-2025.pdf',
    fileType: 'document',
    checkerType: 'policy',
    uploadDate: '2025-12-05T09:15:00',
    status: 'warning',
    score: 78,
    issuesFound: 8,
    highSeverity: 0,
    mediumSeverity: 5,
    lowSeverity: 3,
    fileSize: '2.3 MB',
  },
  {
    id: 'hist-003',
    fileName: 'Tech Industry News Article',
    fileType: 'url',
    checkerType: 'news',
    uploadDate: '2025-12-05T08:45:00',
    status: 'pass',
    score: 92,
    issuesFound: 3,
    highSeverity: 0,
    mediumSeverity: 2,
    lowSeverity: 1,
  },
  {
    id: 'hist-004',
    fileName: 'product-demo-final.mov',
    fileType: 'video',
    checkerType: 'video',
    uploadDate: '2025-12-04T16:20:00',
    status: 'fail',
    score: 58,
    issuesFound: 15,
    highSeverity: 4,
    mediumSeverity: 7,
    lowSeverity: 4,
    fileSize: '128.5 MB',
    duration: '12:45',
  },
  {
    id: 'hist-005',
    fileName: 'employee-handbook-v3.docx',
    fileType: 'document',
    checkerType: 'policy',
    uploadDate: '2025-12-04T14:10:00',
    status: 'warning',
    score: 82,
    issuesFound: 6,
    highSeverity: 1,
    mediumSeverity: 3,
    lowSeverity: 2,
    fileSize: '1.8 MB',
  },
  {
    id: 'hist-006',
    fileName: 'marketing-campaign-video.mp4',
    fileType: 'video',
    checkerType: 'video',
    uploadDate: '2025-12-04T11:30:00',
    status: 'pass',
    score: 95,
    issuesFound: 3,
    highSeverity: 0,
    mediumSeverity: 2,
    lowSeverity: 1,
    fileSize: '67.8 MB',
    duration: '8:15',
  },
  {
    id: 'hist-007',
    fileName: 'Financial Report Q4 2025',
    fileType: 'url',
    checkerType: 'news',
    uploadDate: '2025-12-03T15:45:00',
    status: 'warning',
    score: 71,
    issuesFound: 9,
    highSeverity: 2,
    mediumSeverity: 4,
    lowSeverity: 3,
  },
  {
    id: 'hist-008',
    fileName: 'terms-and-conditions.pdf',
    fileType: 'document',
    checkerType: 'policy',
    uploadDate: '2025-12-03T13:20:00',
    status: 'pass',
    score: 88,
    issuesFound: 5,
    highSeverity: 0,
    mediumSeverity: 3,
    lowSeverity: 2,
    fileSize: '3.1 MB',
  },
  {
    id: 'hist-009',
    fileName: 'safety-training-module-2.mp4',
    fileType: 'video',
    checkerType: 'video',
    uploadDate: '2025-12-02T10:00:00',
    status: 'fail',
    score: 62,
    issuesFound: 12,
    highSeverity: 3,
    mediumSeverity: 6,
    lowSeverity: 3,
    fileSize: '92.4 MB',
    duration: '15:30',
  },
  {
    id: 'hist-010',
    fileName: 'Breaking News: Market Update',
    fileType: 'url',
    checkerType: 'news',
    uploadDate: '2025-12-02T09:30:00',
    status: 'pass',
    score: 96,
    issuesFound: 2,
    highSeverity: 0,
    mediumSeverity: 1,
    lowSeverity: 1,
  },
  {
    id: 'hist-011',
    fileName: 'data-privacy-guidelines.pdf',
    fileType: 'document',
    checkerType: 'policy',
    uploadDate: '2025-12-01T16:15:00',
    status: 'warning',
    score: 75,
    issuesFound: 7,
    highSeverity: 1,
    mediumSeverity: 4,
    lowSeverity: 2,
    fileSize: '4.5 MB',
  },
  {
    id: 'hist-012',
    fileName: 'quarterly-review-presentation.mp4',
    fileType: 'video',
    checkerType: 'video',
    uploadDate: '2025-12-01T14:00:00',
    status: 'pass',
    score: 93,
    issuesFound: 4,
    highSeverity: 0,
    mediumSeverity: 2,
    lowSeverity: 2,
    fileSize: '156.2 MB',
    duration: '18:42',
  },
  {
    id: 'hist-013',
    fileName: 'customer-testimonial-final.mov',
    fileType: 'video',
    checkerType: 'video',
    uploadDate: '2025-11-30T11:20:00',
    status: 'pass',
    score: 98,
    issuesFound: 1,
    highSeverity: 0,
    mediumSeverity: 0,
    lowSeverity: 1,
    fileSize: '34.7 MB',
    duration: '3:15',
  },
  {
    id: 'hist-014',
    fileName: 'Healthcare Policy Update',
    fileType: 'url',
    checkerType: 'news',
    uploadDate: '2025-11-30T09:45:00',
    status: 'warning',
    score: 69,
    issuesFound: 10,
    highSeverity: 2,
    mediumSeverity: 5,
    lowSeverity: 3,
  },
  {
    id: 'hist-015',
    fileName: 'compliance-manual-2025.docx',
    fileType: 'document',
    checkerType: 'policy',
    uploadDate: '2025-11-29T15:30:00',
    status: 'fail',
    score: 55,
    issuesFound: 18,
    highSeverity: 5,
    mediumSeverity: 8,
    lowSeverity: 5,
    fileSize: '6.2 MB',
  },
];

const ITEMS_PER_PAGE = 10;

const History: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pass' | 'warning' | 'fail'>('all');
  const [checkerTypeFilter, setCheckerTypeFilter] = useState<'all' | 'video' | 'policy' | 'news'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'issues'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and search logic
  const filteredData = useMemo(() => {
    let result = mockHistoryData.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesChecker = checkerTypeFilter === 'all' || item.checkerType === checkerTypeFilter;
      
      return matchesSearch && matchesStatus && matchesChecker;
    });

    // Sort data
    result.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'date':
          compareValue = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
          break;
        case 'score':
          compareValue = a.score - b.score;
          break;
        case 'issues':
          compareValue = a.issuesFound - b.issuesFound;
          break;
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return result;
  }, [searchQuery, statusFilter, checkerTypeFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, checkerTypeFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pass: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
      warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      fail: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    };
    
    return (
      <span className={clsx('px-2 py-1 text-xs font-semibold rounded-full border', styles[status as keyof typeof styles])}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getCheckerIcon = (type: string) => {
    const icons = {
      video: '📹',
      policy: '📄',
      news: '📰',
    };
    return icons[type as keyof typeof icons] || '📁';
  };

  const handleCheckAgain = (item: HistoryItem) => {
    // Navigate to the appropriate checker page
    const routes = {
      video: '/video-checker',
      policy: '/policy-checker',
      news: '/news-checker',
    };
    navigate(routes[item.checkerType]);
  };

  const handleViewReport = (item: HistoryItem) => {
    // This would typically load the full report
    // For now, we'll just show an alert
    alert(`View full report for: ${item.fileName}\nScore: ${item.score}\nIssues: ${item.issuesFound}`);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this history item?')) {
      // In a real application, this would call an API to delete the item
      alert(`Deleted item: ${id}`);
    }
  };

  const clearAllHistory = () => {
    if (confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      alert('All history cleared (mock action)');
    }
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(filteredData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compliance-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Compliance Check History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your media compliance check history
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportHistory}
            className="btn btn-secondary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
          <button
            onClick={clearAllHistory}
            className="btn bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {mockHistoryData.length}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-500">Total Checks</div>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                {mockHistoryData.filter(item => item.status === 'pass').length}
              </div>
              <div className="text-sm text-green-600 dark:text-green-500">Passed</div>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                {mockHistoryData.filter(item => item.status === 'warning').length}
              </div>
              <div className="text-sm text-yellow-600 dark:text-yellow-500">Warnings</div>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                {mockHistoryData.filter(item => item.status === 'fail').length}
              </div>
              <div className="text-sm text-red-600 dark:text-red-500">Failed</div>
            </div>
            <div className="text-3xl">❌</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card space-y-4">
        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by file name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-gray-900 dark:text-white bg-transparent placeholder-gray-400 dark:placeholder-gray-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pass">Pass</option>
              <option value="warning">Warning</option>
              <option value="fail">Fail</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Checker:</label>
            <select
              value={checkerTypeFilter}
              onChange={(e) => setCheckerTypeFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Checkers</option>
              <option value="video">Video Checker</option>
              <option value="policy">Policy Checker</option>
              <option value="news">News Checker</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="date">Date</option>
              <option value="score">Score</option>
              <option value="issues">Issues</option>
            </select>
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} results
        </div>
      </div>

      {/* History Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  File / Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Checker
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Issues
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No history found</p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getCheckerIcon(item.checkerType)}</div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {item.fileName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {item.fileSize && <span>{item.fileSize}</span>}
                            {item.duration && <span> • {item.duration}</span>}
                            {!item.fileSize && !item.duration && <span>URL Content</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {item.checkerType.charAt(0).toUpperCase() + item.checkerType.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(item.uploadDate)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-16">
                          <div
                            className={clsx(
                              'h-2 rounded-full',
                              item.score >= 95 ? 'bg-green-500' : item.score >= 65 ? 'bg-yellow-500' : 'bg-red-500'
                            )}
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white min-w-[3ch]">
                          {item.score}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.issuesFound} total
                        </div>
                        <div className="flex gap-2 text-xs">
                          {item.highSeverity > 0 && (
                            <span className="text-red-600 dark:text-red-400">H:{item.highSeverity}</span>
                          )}
                          {item.mediumSeverity > 0 && (
                            <span className="text-yellow-600 dark:text-yellow-400">M:{item.mediumSeverity}</span>
                          )}
                          {item.lowSeverity > 0 && (
                            <span className="text-blue-600 dark:text-blue-400">L:{item.lowSeverity}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewReport(item)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          title="View Report"
                        >
                          📋 View
                        </button>
                        <button
                          onClick={() => handleCheckAgain(item)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                          title="Check Again"
                        >
                          🔄 Check Again
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={clsx(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                currentPage === 1
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              )}
            >
              ← Previous
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={clsx(
                        'px-4 py-2 rounded-lg font-medium transition-colors min-w-[44px]',
                        currentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      )}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 py-2 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={clsx(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                currentPage === totalPages
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              )}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
