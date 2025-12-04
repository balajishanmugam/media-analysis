import React from 'react';
import clsx from 'clsx';

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = '',
  showPercentage = true,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  return (
    <div className={clsx('w-full', className)}>
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading...</span>
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">{clampedProgress.toFixed(0)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
