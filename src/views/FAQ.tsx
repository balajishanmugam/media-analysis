import React, { useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'video' | 'policy' | 'news' | 'technical' | 'reports';
  relatedIds?: string[];
  tags?: string[];
}

const faqData: FAQItem[] = [
  // General Questions
  {
    id: 'faq-1',
    category: 'general',
    question: 'What is TCS AI Media Compliance Checker?',
    answer: 'TCS AI Media Compliance Checker is an intelligent platform that analyzes media content (videos, documents, and news articles) to identify potential compliance issues, policy violations, and regulatory concerns. It provides detailed reports with severity ratings and actionable recommendations to ensure your content meets industry standards and guidelines.',
    relatedIds: ['faq-2', 'faq-4', 'faq-24'],
    tags: ['overview', 'platform', 'features'],
  },
  {
    id: 'faq-2',
    category: 'general',
    question: 'How does the compliance scoring system work?',
    answer: 'Our system uses a 0-100 scoring scale: Scores of 95-100 indicate full compliance (Pass), 65-94 indicate minor issues requiring attention (Warning), and 0-64 indicate critical issues that must be resolved (Fail). The score is calculated based on the number, severity, and type of issues detected in your content.',
    relatedIds: ['faq-19', 'faq-22', 'faq-23'],
    tags: ['scoring', 'compliance', 'rating'],
  },
  {
    id: 'faq-3',
    category: 'general',
    question: 'Is my data secure and private?',
    answer: 'Yes, we take data security seriously. All uploaded files are processed securely and are not stored permanently on our servers. In the current demo mode with mock API, all processing happens locally in your browser. When connected to a production backend, files are deleted immediately after analysis is complete.',
    relatedIds: ['faq-15', 'faq-18'],
    tags: ['security', 'privacy', 'data protection'],
  },
  {
    id: 'faq-4',
    category: 'general',
    question: 'What types of compliance issues can be detected?',
    answer: 'The system can detect various compliance issues including: unverified claims, missing disclosures, restricted content, political claims requiring citations, financial misinformation, copyright concerns, inappropriate language, and violations of industry-specific regulations. Each issue is categorized by severity (High, Medium, Low).',
    relatedIds: ['faq-11', 'faq-14', 'faq-19'],
    tags: ['issues', 'detection', 'violations'],
  },

  // Video Checker Questions
  {
    id: 'faq-5',
    category: 'video',
    question: 'What video formats are supported?',
    answer: 'We support the following video formats: MP4 (.mp4), WebM (.webm), MKV (.mkv), AVI (.avi), and MOV (.mov). The maximum file size is 500MB. If your video is larger, please compress it before uploading.',
    relatedIds: ['faq-6', 'faq-27'],
    tags: ['formats', 'upload', 'file types'],
  },
  {
    id: 'faq-6',
    category: 'video',
    question: 'How long does video analysis take?',
    answer: 'Analysis time depends on video length and file size. Typically, a 2-minute video takes 30-60 seconds to analyze in demo mode. In production with a real backend, processing times may vary based on server load and video complexity. You can monitor progress via the upload progress bar.',
    relatedIds: ['faq-5', 'faq-7', 'faq-17'],
    tags: ['processing', 'time', 'performance'],
  },
  {
    id: 'faq-7',
    category: 'video',
    question: 'Can I check multiple videos at once?',
    answer: 'Currently, the system processes one video at a time to ensure accurate analysis. After receiving your compliance report, you can immediately upload another video. We recommend checking videos individually to review each report thoroughly.',
    relatedIds: ['faq-6', 'faq-26'],
    tags: ['batch', 'multiple', 'workflow'],
  },
  {
    id: 'faq-8',
    category: 'video',
    question: 'What do the video timestamps in reports mean?',
    answer: 'Timestamps (e.g., "00:01:23") indicate the exact moment in your video where an issue was detected. This helps you quickly locate and address specific problems. You can use these timestamps with the video preview player to jump directly to problematic sections.',
    relatedIds: ['faq-19', 'faq-20'],
    tags: ['timestamps', 'navigation', 'reports'],
  },

  // Policy Checker Questions
  {
    id: 'faq-9',
    category: 'policy',
    question: 'What document formats can I upload for policy checking?',
    answer: 'The Policy Checker accepts PDF (.pdf), Microsoft Word (.docx), and Word 97-2003 (.doc) formats. Maximum file size is 100MB. Ensure your documents are text-readable (not scanned images) for accurate analysis.',
    relatedIds: ['faq-10', 'faq-27'],
    tags: ['documents', 'formats', 'upload'],
  },
  {
    id: 'faq-10',
    category: 'policy',
    question: 'Can the system read scanned PDFs?',
    answer: 'The effectiveness depends on your backend implementation. For best results, upload text-based PDFs rather than scanned images. If you have scanned documents, consider using OCR (Optical Character Recognition) software to convert them to searchable text PDFs first.',
    relatedIds: ['faq-9', 'faq-11'],
    tags: ['OCR', 'scanned', 'PDF'],
  },
  {
    id: 'faq-11',
    category: 'policy',
    question: 'What kind of policy violations are detected?',
    answer: 'The system analyzes policy documents for: contradictory statements, missing required clauses, unclear terminology, non-compliance with legal standards, outdated references, ambiguous language, and conflicts with industry regulations. Each violation includes specific recommendations for correction.',
    relatedIds: ['faq-4', 'faq-19', 'faq-24'],
    tags: ['violations', 'detection', 'policies'],
  },

  // News Checker Questions
  {
    id: 'faq-12',
    category: 'news',
    question: 'Can I check articles from any website?',
    answer: 'Yes, you can enter any publicly accessible URL. The system will fetch and analyze the article content. Make sure the URL is complete (including https://) and points to a specific article, not a homepage. Alternatively, you can paste the article text directly into the text area.',
    relatedIds: ['faq-13', 'faq-14'],
    tags: ['URL', 'articles', 'news'],
  },
  {
    id: 'faq-13',
    category: 'news',
    question: 'Should I use the URL field or text input?',
    answer: 'Use the URL field if you want to check a published article from a website. Use the text input if you\'re checking draft content, have copied text from a source, or the website is not publicly accessible. Only one input method is required—the system will use whichever you provide.',
    relatedIds: ['faq-12', 'faq-14'],
    tags: ['input', 'URL', 'text'],
  },
  {
    id: 'faq-14',
    category: 'news',
    question: 'What compliance issues are checked in news articles?',
    answer: 'News articles are analyzed for: factual accuracy concerns, missing source citations, biased language, unverified claims, sensationalized headlines, lack of balance, potential defamation, plagiarism indicators, and violations of journalistic ethics. The system flags areas requiring fact-checking or additional sourcing.',
    relatedIds: ['faq-4', 'faq-11', 'faq-23'],
    tags: ['journalism', 'fact-checking', 'ethics'],
  },

  // Technical Questions
  {
    id: 'faq-15',
    category: 'technical',
    question: 'Why am I seeing "mock data" in the reports?',
    answer: 'The application is currently running in demo mode with a mock API that generates sample compliance reports. This allows you to test the interface without a backend server. To connect to a real compliance API, update the baseURL in src/services/api.ts and disable the mock in src/main.tsx.',
    relatedIds: ['faq-16', 'faq-23'],
    tags: ['demo', 'mock', 'testing'],
  },
  {
    id: 'faq-16',
    category: 'technical',
    question: 'What does "CORS error" mean?',
    answer: 'CORS (Cross-Origin Resource Sharing) errors occur when your browser blocks requests to the backend API due to security policies. This is common when connecting to a real API. Your backend server needs to include proper CORS headers to allow requests from the frontend application.',
    relatedIds: ['faq-15', 'faq-17', 'faq-27'],
    tags: ['CORS', 'errors', 'backend'],
  },
  {
    id: 'faq-17',
    category: 'technical',
    question: 'My upload is stuck at 0%. What should I do?',
    answer: 'First, check your internet connection. Then, ensure the file size is within limits (500MB for videos, 100MB for documents). Try refreshing the page and uploading again. If using a real backend API, verify the endpoint is accessible and CORS is configured correctly.',
    relatedIds: ['faq-16', 'faq-18', 'faq-27'],
    tags: ['troubleshooting', 'upload', 'errors'],
  },
  {
    id: 'faq-18',
    category: 'technical',
    question: 'Can I use this app offline?',
    answer: 'No, the application requires an internet connection to communicate with the compliance API (or run the mock API server). The analysis backend needs to process your files, which cannot be done offline. Make sure you have a stable connection before uploading files.',
    relatedIds: ['faq-3', 'faq-17'],
    tags: ['offline', 'connectivity', 'requirements'],
  },

  // Report Questions
  {
    id: 'faq-19',
    category: 'reports',
    question: 'What does each severity level mean?',
    answer: 'High severity issues are critical violations that must be fixed immediately before publication. Medium severity issues should be addressed but may not block publication. Low severity issues are suggestions for improvement that can enhance compliance but are not mandatory. Focus on high-severity issues first.',
    relatedIds: ['faq-2', 'faq-22', 'faq-4'],
    tags: ['severity', 'priority', 'classification'],
  },
  {
    id: 'faq-20',
    category: 'reports',
    question: 'How do I download my compliance report?',
    answer: 'Click the "Download Report" button at the bottom of any compliance report. The report will be saved as a JSON file with a timestamp in the filename (e.g., compliance-report-2025-11-14.json). You can open this file in any text editor or import it into other tools for further analysis.',
    relatedIds: ['faq-21', 'faq-8'],
    tags: ['download', 'export', 'save'],
  },
  {
    id: 'faq-21',
    category: 'reports',
    question: 'Can I export reports as PDF or Word documents?',
    answer: 'Currently, reports are exported as JSON files for easy integration with other systems. PDF and Word export features can be added in future updates. For now, you can copy the report content from the screen or use a JSON-to-PDF converter tool.',
    relatedIds: ['faq-20'],
    tags: ['export', 'PDF', 'formats'],
  },
  {
    id: 'faq-22',
    category: 'reports',
    question: 'What should I do if I get a "Fail" status?',
    answer: 'A Fail status means critical compliance issues were detected. Review all high-severity issues first, implement the recommended changes, and re-check your content. Do not publish until all critical issues are resolved. Consider consulting with legal or compliance teams for guidance on complex issues.',
    relatedIds: ['faq-2', 'faq-19', 'faq-26'],
    tags: ['fail', 'remediation', 'compliance'],
  },
  {
    id: 'faq-23',
    category: 'reports',
    question: 'How accurate are the compliance reports?',
    answer: 'In demo mode with mock API, reports are randomly generated for testing purposes. With a production backend, accuracy depends on the AI models and compliance rules configured by your organization. Always review flagged issues with human judgment, especially for nuanced legal or ethical questions.',
    relatedIds: ['faq-15', 'faq-24'],
    tags: ['accuracy', 'AI', 'validation'],
  },

  // Additional Questions
  {
    id: 'faq-24',
    category: 'general',
    question: 'Can I customize the compliance rules?',
    answer: 'Customization of compliance rules happens at the backend API level. The frontend displays whatever the backend returns. Contact your system administrator or backend team to configure custom rules, industry-specific regulations, or organizational policies.',
    relatedIds: ['faq-1', 'faq-11'],
    tags: ['customization', 'rules', 'configuration'],
  },
  {
    id: 'faq-25',
    category: 'technical',
    question: 'What browsers are supported?',
    answer: 'The application works best on modern browsers including Chrome, Firefox, Edge, and Safari (latest versions). Internet Explorer is not supported. For optimal performance, ensure your browser is up to date and JavaScript is enabled.',
    relatedIds: ['faq-18'],
    tags: ['browsers', 'compatibility', 'requirements'],
  },
  {
    id: 'faq-26',
    category: 'general',
    question: 'How do I request a re-check after fixing issues?',
    answer: 'After addressing the issues in your content, simply upload the modified file again through the same checker. The system will perform a fresh analysis and generate a new compliance report. Compare scores to track your improvements.',
    relatedIds: ['faq-22', 'faq-7'],
    tags: ['re-check', 'workflow', 'iteration'],
  },
  {
    id: 'faq-27',
    category: 'technical',
    question: 'Why is my file upload failing?',
    answer: 'Common reasons include: file exceeds size limits (500MB for videos, 100MB for documents), unsupported file format, unstable internet connection, or backend server issues. Verify your file type and size, then try again. Check the browser console (F12) for detailed error messages.',
    relatedIds: ['faq-5', 'faq-9', 'faq-17'],
    tags: ['upload', 'errors', 'troubleshooting'],
  },
];

const categories = [
  { id: 'all', label: 'All Questions', icon: '📚', count: 0 },
  { id: 'general', label: 'General', icon: '❓', count: 0 },
  { id: 'video', label: 'Video Checker', icon: '📹', count: 0 },
  { id: 'policy', label: 'Policy Checker', icon: '📄', count: 0 },
  { id: 'news', label: 'News Checker', icon: '📰', count: 0 },
  { id: 'reports', label: 'Reports', icon: '📊', count: 0 },
  { id: 'technical', label: 'Technical', icon: '⚙️', count: 0 },
];

const ITEMS_PER_PAGE = 10;

const FAQ: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'default' | 'compact' | 'print'>('default');
  const [showRelated, setShowRelated] = useState<string | null>(null);

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('faq-bookmarks');
    if (saved) {
      try {
        setBookmarkedItems(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Failed to load bookmarks:', e);
      }
    }
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('faq-bookmarks', JSON.stringify(Array.from(bookmarkedItems)));
  }, [bookmarkedItems]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Handle URL hash for direct question links
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setExpandedItems(new Set([hash]));
      }
    }
  }, []);

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newBookmarks = new Set(bookmarkedItems);
    if (newBookmarks.has(id)) {
      newBookmarks.delete(id);
    } else {
      newBookmarks.add(id);
    }
    setBookmarkedItems(newBookmarks);
  };

  const expandAll = () => {
    setExpandedItems(new Set(filteredFaqs.map((faq) => faq.id)));
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  const copyLinkToClipboard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      // You could show a toast notification here
      alert('Link copied to clipboard!');
    });
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const filteredFaqs = useMemo(() => {
    return faqData.filter((faq) => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const categoriesWithCounts = useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      count: cat.id === 'all' ? faqData.length : faqData.filter(faq => faq.category === cat.id).length
    }));
  }, []);

  const totalPages = Math.ceil(filteredFaqs.length / ITEMS_PER_PAGE);
  const paginatedFaqs = filteredFaqs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getRelatedQuestions = (relatedIds?: string[]) => {
    if (!relatedIds) return [];
    return faqData.filter(faq => relatedIds.includes(faq.id));
  };

  const jumpToQuestion = (id: string) => {
    const faq = faqData.find(f => f.id === id);
    if (faq) {
      setSelectedCategory(faq.category);
      setSearchQuery('');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setExpandedItems(new Set([id]));
        }
      }, 100);
    }
  };
  return (
    <div className={clsx('max-w-5xl mx-auto p-6 space-y-6', viewMode === 'print' && 'print:p-0')}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find answers to common questions about TCS AI Media Compliance Checker
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button
            onClick={() => setViewMode(viewMode === 'compact' ? 'default' : 'compact')}
            className="px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title={viewMode === 'compact' ? 'Default View' : 'Compact View'}
          >
            {viewMode === 'compact' ? '📋' : '📑'}
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Print FAQ"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{faqData.length}</div>
          <div className="text-sm text-blue-600 dark:text-blue-500">Total Questions</div>
        </div>
        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="text-2xl font-bold text-green-700 dark:text-green-400">{categories.length - 1}</div>
          <div className="text-sm text-green-600 dark:text-green-500">Categories</div>
        </div>
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">{bookmarkedItems.size}</div>
          <div className="text-sm text-purple-600 dark:text-purple-500">Bookmarked</div>
        </div>
        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">{filteredFaqs.length}</div>
          <div className="text-sm text-orange-600 dark:text-orange-500">Matching</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card print:hidden">
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
            placeholder="Search questions, answers, or tags..."
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
      </div>

      {/* Bookmarked Questions Quick Access */}
      {bookmarkedItems.size > 0 && (
        <div className="card bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 print:hidden">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">⭐</span>
            <h3 className="font-semibold text-amber-900 dark:text-amber-300">Your Bookmarks</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from(bookmarkedItems).map(id => {
              const faq = faqData.find(f => f.id === id);
              return faq ? (
                <button
                  key={id}
                  onClick={() => jumpToQuestion(id)}
                  className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors text-amber-900 dark:text-amber-300"
                >
                  {faq.question.slice(0, 50)}{faq.question.length > 50 ? '...' : ''}
                </button>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="card print:hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Filter by Category</h3>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              Expand All
            </button>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <button
              onClick={collapseAll}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              Collapse All
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {categoriesWithCounts.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative',
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              )}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
              <span className={clsx(
                'ml-2 px-1.5 py-0.5 text-xs rounded-full',
                selectedCategory === category.id
                  ? 'bg-white/20'
                  : 'bg-gray-200 dark:bg-gray-600'
              )}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="card text-center py-12">
            <svg
              className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">No questions found matching your search.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2 print:hidden">
              <span>
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredFaqs.length)} of {filteredFaqs.length} question
                {filteredFaqs.length !== 1 ? 's' : ''}
              </span>
              {totalPages > 1 && (
                <span>Page {currentPage} of {totalPages}</span>
              )}
            </div>
            {paginatedFaqs.map((faq) => {
              const isExpanded = expandedItems.has(faq.id);
              const isBookmarked = bookmarkedItems.has(faq.id);
              const relatedQuestions = getRelatedQuestions(faq.relatedIds);
              
              return (
                <div
                  key={faq.id}
                  id={faq.id}
                  className={clsx(
                    'card hover:shadow-lg transition-shadow duration-200',
                    viewMode === 'compact' && 'py-3'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={clsx(
                          'w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer',
                          isExpanded ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-gray-100 dark:bg-gray-700'
                        )}
                        onClick={() => toggleItem(faq.id)}
                      >
                        <svg
                          className={clsx(
                            'w-5 h-5 transition-all duration-200',
                            isExpanded
                              ? 'text-primary-600 dark:text-primary-400 rotate-180'
                              : 'text-gray-500 dark:text-gray-400'
                          )}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3
                          className={clsx(
                            'font-semibold mb-1 cursor-pointer',
                            isExpanded ? 'text-primary-900 dark:text-primary-300' : 'text-gray-900 dark:text-white'
                          )}
                          onClick={() => toggleItem(faq.id)}
                        >
                          {highlightText(faq.question, searchQuery)}
                        </h3>
                        <div className="flex gap-1 print:hidden">
                          <button
                            onClick={(e) => toggleBookmark(faq.id, e)}
                            className={clsx(
                              'p-1.5 rounded-lg transition-colors',
                              isBookmarked
                                ? 'text-amber-500 hover:text-amber-600'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                            )}
                            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this question'}
                          >
                            <svg className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => copyLinkToClipboard(faq.id, e)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            title="Copy link to this question"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Category Badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                          {categories.find(c => c.id === faq.category)?.icon} {categories.find(c => c.id === faq.category)?.label}
                        </span>
                      </div>

                      {isExpanded && (
                        <div className="animate-fade-in">
                          <p className="text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">
                            {highlightText(faq.answer, searchQuery)}
                          </p>
                          
                          {/* Tags */}
                          {faq.tags && faq.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3 print:hidden">
                              {faq.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Related Questions */}
                          {relatedQuestions.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 print:hidden">
                              <button
                                onClick={() => setShowRelated(showRelated === faq.id ? null : faq.id)}
                                className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
                              >
                                <svg className={clsx('w-4 h-4 transition-transform', showRelated === faq.id && 'rotate-90')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                Related Questions ({relatedQuestions.length})
                              </button>
                              {showRelated === faq.id && (
                                <div className="mt-2 space-y-2 pl-5">
                                  {relatedQuestions.map(related => (
                                    <button
                                      key={related.id}
                                      onClick={() => jumpToQuestion(related.id)}
                                      className="block text-sm text-left text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                      → {related.question}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 print:hidden">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={clsx(
                    'px-3 py-2 rounded-lg font-medium transition-colors',
                    currentPage === 1
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  )}
                >
                  ← Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Show first page, last page, current page, and pages around current
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
                            'px-3 py-2 rounded-lg font-medium transition-colors min-w-[40px]',
                            currentPage === page
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          )}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="px-2 py-2 text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={clsx(
                    'px-3 py-2 rounded-lg font-medium transition-colors',
                    currentPage === totalPages
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  )}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Help Section */}
      <div className="card bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary-600 dark:text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-primary-800 mb-4">
              If you couldn't find the answer you're looking for, check our detailed
              documentation or contact our support team.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  // You could navigate to a contact form or open documentation
                }}
              >
                Contact Support
              </a>
              <a
                href="#"
                className="btn btn-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  // Navigate to documentation
                }}
              >
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
