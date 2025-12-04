// Local store: Updated UploadBox component to accept ALL media types (video, audio, image, document)
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import { formatFileSize } from '../utils/formatters';

interface UploadBoxProps {
  accept?: Record<string, string[]>; // Local store: Made optional - if not provided, accepts all files
  onFileSelected: (file: File) => void;
  maxSize?: number;
  label: string;
  selectedFile?: File | null;
  error?: string | null;
  disabled?: boolean;
}

const UploadBox: React.FC<UploadBoxProps> = ({
  accept, // Local store: No default value - will accept all types if undefined
  onFileSelected,
  maxSize = 500 * 1024 * 1024, // 500MB default
  label,
  selectedFile,
  error,
  disabled = false,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0]);
      }
    },
    [onFileSelected]
  );

  // Local store: Configure dropzone to accept all file types if accept prop is not provided
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: accept, // Local store: Undefined accept means all file types allowed
    maxSize,
    multiple: false,
    disabled,
  });

  return (
    <div className="w-full">      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
          isDragActive && !isDragReject && 'border-primary-500 bg-primary-50 dark:bg-primary-900/20',
          isDragReject && 'border-red-500 bg-red-50 dark:bg-red-900/20',
          !isDragActive && !error && 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50',
          error && 'border-red-400 bg-red-50 dark:bg-red-900/20',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-3">
          {/* Icon */}
          <svg
            className={clsx(
              'w-12 h-12',
              isDragActive && !isDragReject && 'text-primary-500',
              isDragReject && 'text-red-500',
              !isDragActive && !error && 'text-gray-400 dark:text-gray-500',
              error && 'text-red-500'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          {/* Text */}
          <div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {isDragActive ? 'Drop file here' : label}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              or click to browse
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Max file size: {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      </div>

      {/* Selected File Info */}
      {selectedFile && !error && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default UploadBox;
