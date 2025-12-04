// Local store: Unified MediaChecker view - supports uploading any media type or text input
// Local store: Saves content to local directory, submits directory path to backend, enables chatbot
import { useState } from 'react';
import UploadBox from '../components/UploadBox';
import ChatbotUI from '../components/ChatbotUI';
import { submitLocalDirectory } from '../services/api';
import { InputMode } from '../types';
import { getMediaType, isValidMediaFile } from '../utils/validators';

// Local store: Check if browser supports File System Access API
const supportsFileSystemAccess = 'showDirectoryPicker' in window;

const MediaChecker = () => {
  // Local store: Input mode state (file upload or text input)
  const [inputMode, setInputMode] = useState<InputMode>('file');
  
  // Local store: File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  
  // Local store: Text input state
  const [textContent, setTextContent] = useState<string>('');
  const [textError, setTextError] = useState<string | null>(null);
  
  // Local store: Directory selection state
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [directoryPath, setDirectoryPath] = useState<string>('');
  
  // Local store: Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  // Local store: Chatbot state (shown after successful submission)
  const [showChatbot, setShowChatbot] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chatbotMessage, setChatbotMessage] = useState<string>('');

  // Local store: Handle file selection from upload box
  const handleFileSelected = (file: File) => {
    setFileError(null);
    
    // Local store: Validate that it's a supported media file
    if (!isValidMediaFile(file)) {
      setFileError('Unsupported file type. Please upload a video, audio, image, or document file.');
      setSelectedFile(null);
      return;
    }
    
    setSelectedFile(file);
  };

  // Local store: Request directory access from user using File System Access API
  const handleSelectDirectory = async () => {
    if (!supportsFileSystemAccess) {
      setSubmissionError('Your browser does not support local file storage. Please use Chrome or Edge.');
      return;
    }

    try {
      // Local store: Show directory picker dialog
      const handle = await window.showDirectoryPicker({
        mode: 'readwrite',
      });
      
      setDirectoryHandle(handle);
      setDirectoryPath(handle.name); // Display directory name
      setSubmissionError(null);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setSubmissionError('Failed to select directory. Please try again.');
      }
    }
  };

  // Local store: Save file to selected directory using File System Access API
  const saveFileToDirectory = async (file: File, dirHandle: FileSystemDirectoryHandle): Promise<string> => {
    try {
      // Local store: Create file in selected directory
      const fileHandle = await dirHandle.getFileHandle(file.name, { create: true });
      
      // Local store: Write file content
      const writable = await fileHandle.createWritable();
      await writable.write(file);
      await writable.close();
      
      return file.name;
    } catch (error) {
      console.error('Failed to save file:', error);
      throw new Error('Failed to save file to directory');
    }
  };

  // Local store: Save text content to selected directory
  const saveTextToDirectory = async (text: string, dirHandle: FileSystemDirectoryHandle): Promise<string> => {
    try {
      const fileName = `text-input-${Date.now()}.txt`;
      
      // Local store: Create text file in selected directory
      const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
      
      // Local store: Write text content
      const writable = await fileHandle.createWritable();
      await writable.write(text);
      await writable.close();
      
      return fileName;
    } catch (error) {
      console.error('Failed to save text:', error);
      throw new Error('Failed to save text to directory');
    }
  };

  // Local store: Handle form submission - save to directory and send to backend
  const handleSubmit = async () => {
    setSubmissionError(null);

    // Local store: Validate that directory is selected
    if (!directoryHandle) {
      setSubmissionError('Please select a directory first.');
      return;
    }

    // Local store: Validate that either file or text is provided
    if (inputMode === 'file' && !selectedFile) {
      setFileError('Please select a file to upload.');
      return;
    }

    if (inputMode === 'text' && !textContent.trim()) {
      setTextError('Please enter some text.');
      return;
    }

    setIsSubmitting(true);

    try {
      let savedFileName: string;

      // Local store: Save file or text to selected directory
      if (inputMode === 'file' && selectedFile) {
        savedFileName = await saveFileToDirectory(selectedFile, directoryHandle);
      } else {
        savedFileName = await saveTextToDirectory(textContent, directoryHandle);
      }

      // Local store: Construct directory path for backend (use directory name + file name)
      const fullPath = `${directoryPath}/${savedFileName}`;

      // Local store: Send directory path to backend via POST call
      const response = await submitLocalDirectory(fullPath);

      // Local store: Enable chatbot after successful submission
      setSessionId(response.sessionId);
      setChatbotMessage(response.message);
      setShowChatbot(true);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit';
      setSubmissionError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Local store: Reset form to initial state
  const handleReset = () => {
    setSelectedFile(null);
    setFileError(null);
    setTextContent('');
    setTextError(null);
    setDirectoryHandle(null);
    setDirectoryPath('');
    setSubmissionError(null);
    setShowChatbot(false);
    setSessionId(null);
    setChatbotMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Media Storage & Analysis
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload any media file or enter text, save to your local directory, and chat with AI assistant
        </p>
      </div>

      {/* Local store: Browser compatibility warning */}
      {!supportsFileSystemAccess && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg dark:bg-yellow-900/30 dark:border-yellow-700">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Browser Not Supported
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Local file storage requires Chrome or Edge browser. Please switch to a supported browser.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        {/* Local store: Input mode toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setInputMode('file')}
            className={`btn ${inputMode === 'file' ? 'btn-primary' : 'btn-secondary'}`}
            disabled={isSubmitting || showChatbot}
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload File
          </button>
          <button
            onClick={() => setInputMode('text')}
            className={`btn ${inputMode === 'text' ? 'btn-primary' : 'btn-secondary'}`}
            disabled={isSubmitting || showChatbot}
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Enter Text
          </button>
        </div>

        {/* Local store: File upload mode */}
        {inputMode === 'file' && (
          <div className="mb-6">
            <UploadBox
              label="Upload any media file (video, audio, image, document)"
              onFileSelected={handleFileSelected}
              selectedFile={selectedFile}
              error={fileError}
              disabled={isSubmitting || showChatbot}
              maxSize={500 * 1024 * 1024}
            />
            
            {/* Local store: Show file type indicator */}
            {selectedFile && !fileError && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Type: <span className="font-medium capitalize">{getMediaType(selectedFile)}</span>
              </div>
            )}
          </div>
        )}

        {/* Local store: Text input mode */}
        {inputMode === 'text' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter your text content
            </label>
            <textarea
              value={textContent}
              onChange={(e) => {
                setTextContent(e.target.value);
                setTextError(null);
              }}
              placeholder="Type or paste your text here..."
              className="input-field resize-none"
              rows={8}
              disabled={isSubmitting || showChatbot}
            />
            {textError && (
              <div className="mt-2 error-box">
                <p className="text-sm">{textError}</p>
              </div>
            )}
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {textContent.length} characters
            </div>
          </div>
        )}

        {/* Local store: Directory selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select local directory to save media
          </label>
          <div className="flex gap-3 items-center">
            <button
              onClick={handleSelectDirectory}
              className="btn btn-secondary"
              disabled={isSubmitting || showChatbot || !supportsFileSystemAccess}
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              Choose Directory
            </button>
            {directoryPath && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                  {directoryPath}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Local store: Submission error */}
        {submissionError && (
          <div className="mb-6 error-box">
            <p className="text-sm font-medium">{submissionError}</p>
          </div>
        )}

        {/* Local store: Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || showChatbot || !directoryHandle}
            className="btn btn-primary flex-1"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving & Submitting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Save to Directory & Submit
              </>
            )}
          </button>
        </div>
      </div>

      {/* Local store: Chatbot UI - shown after successful submission */}
      {showChatbot && (
        <ChatbotUI 
          sessionId={sessionId}
          initialMessage={chatbotMessage}
          onNewSession={handleReset}
        />
      )}
    </div>
  );
};

export default MediaChecker;
