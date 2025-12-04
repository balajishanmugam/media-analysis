import React, { useState } from 'react';
import UploadBox from '../components/UploadBox';
import ReportView from '../components/ReportView';
import { uploadVideo, checkYouTubeVideo } from '../services/api';
import { isValidVideoFile, isValidFileSize, isValidYouTubeURL } from '../utils/validators';
import { ComplianceReport } from '../types';
import ReactPlayer from 'react-player';
import clsx from 'clsx';

type InputMode = 'file' | 'youtube';

const VideoChecker: React.FC = () => {
  const [inputMode, setInputMode] = useState<InputMode>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleModeChange = (mode: InputMode) => {
    setInputMode(mode);
    setError(null);
    setReport(null);
    setSelectedFile(null);
    setYoutubeUrl('');
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl(null);
    }
  };
  const handleFileSelected = (file: File) => {
    setError(null);
    setReport(null);
    setVideoUrl(null);

    // Validate file type
    if (!isValidVideoFile(file)) {
      setError('Invalid file type. Only .mp4, .webm, .mkv, .avi, .mov files are allowed.');
      setSelectedFile(null);
      return;
    }

    // Validate file size
    if (!isValidFileSize(file, 500)) {
      setError('File size exceeds 500MB limit.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setVideoUrl(URL.createObjectURL(file));
  };  const handleGenerateReport = async () => {
    if (inputMode === 'file' && !selectedFile) return;
    if (inputMode === 'youtube' && !youtubeUrl.trim()) return;

    setIsGeneratingReport(true);
    setError(null);

    try {
      let result: ComplianceReport;

      if (inputMode === 'file' && selectedFile) {
        result = await uploadVideo(selectedFile);
      } else if (inputMode === 'youtube') {
        // Validate YouTube URL
        if (!isValidYouTubeURL(youtubeUrl)) {
          setError('Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=...)');
          setIsGeneratingReport(false);
          return;
        }
        result = await checkYouTubeVideo(youtubeUrl);
        setVideoUrl(youtubeUrl); // Set the YouTube URL for preview
      } else {
        throw new Error('Invalid input mode');
      }

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
    setYoutubeUrl('');
    setError(null);
    setReport(null);
    if (videoUrl && inputMode === 'file') {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
  };

  const canGenerateReport = () => {
    if (inputMode === 'file') {
      return selectedFile && !isGeneratingReport && !error;
    } else {
      return youtubeUrl.trim().length > 0 && !isGeneratingReport;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Video Compliance Checker</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload a video file or provide a YouTube URL to check for compliance issues and receive detailed recommendations.
        </p>
      </div>

      {!report ? (
        <>
          {/* Input Mode Selector */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Choose Input Method</h3>
            <div className="flex gap-4">
              <button
                onClick={() => handleModeChange('file')}
                className={clsx(
                  'flex-1 px-6 py-4 rounded-lg border-2 transition-all duration-200 text-left',
                  inputMode === 'file'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    inputMode === 'file' ? 'border-primary-600' : 'border-gray-400 dark:border-gray-500'
                  )}>
                    {inputMode === 'file' && (
                      <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Upload Video File</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">MP4, WebM, MKV, AVI, MOV (max 500MB)</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleModeChange('youtube')}
                className={clsx(
                  'flex-1 px-6 py-4 rounded-lg border-2 transition-all duration-200 text-left',
                  inputMode === 'youtube'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    inputMode === 'youtube' ? 'border-primary-600' : 'border-gray-400 dark:border-gray-500'
                  )}>
                    {inputMode === 'youtube' && (
                      <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">YouTube URL</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Paste a YouTube video link</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* File Upload Section */}
          {inputMode === 'file' && (
            <div className="card">
              {/* Supported Formats Label */}
              <div className="mb-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Supported formats:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  .MP4
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  .WebM
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  .MKV
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  .AVI
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  .MOV
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(Max 500MB)</span>
              </div>

              <UploadBox
                accept={{
                  'video/mp4': ['.mp4'],
                  'video/webm': ['.webm'],
                  'video/x-matroska': ['.mkv'],
                  'video/x-msvideo': ['.avi'],
                  'video/quicktime': ['.mov'],
                }}                onFileSelected={handleFileSelected}
                maxSize={500 * 1024 * 1024}
                label="Drag and drop your video file here"
                selectedFile={selectedFile}
                error={error}
              />

              {/* Video Preview */}
              {selectedFile && videoUrl && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Video Preview</h3>
                  <div className="rounded-lg overflow-hidden bg-black">
                    <ReactPlayer
                      url={videoUrl}
                      controls
                      width="100%"
                      height="400px"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* YouTube URL Section */}
          {inputMode === 'youtube' && (
            <div className="card">
              <div className="mb-4 flex flex-wrap gap-2 items-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">YouTube Video Analysis</span>
              </div>

              <div>
                <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  YouTube Video URL
                </label>
                <input
                  id="youtubeUrl"
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="input-field"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...)
                </p>
              </div>

              {/* YouTube Preview */}
              {youtubeUrl && isValidYouTubeURL(youtubeUrl) && !report && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Video Preview</h3>
                  <div className="rounded-lg overflow-hidden bg-black">
                    <ReactPlayer
                      url={youtubeUrl}
                      controls
                      width="100%"
                      height="400px"
                    />
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">How it works</p>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      The system will fetch and analyze the YouTube video content for compliance issues. Make sure the video is publicly accessible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && inputMode === 'youtube' && (
            <div className="error-box">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Generate Report Button */}
          {canGenerateReport() && (
            <div className="flex gap-3">
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
        </>
      ) : (
        <>
          {/* Report View */}
          <ReportView report={report} />
          
          {/* Check Another Video */}
          <div className="text-center">
            <button onClick={handleReset} className="btn btn-secondary">
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Check Another Video
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoChecker;
