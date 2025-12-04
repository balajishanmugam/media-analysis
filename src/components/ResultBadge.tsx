import React from 'react';
import clsx from 'clsx';
import { StatusType, SeverityLevel } from '../types';

interface ResultBadgeProps {
  status?: StatusType;
  severity?: SeverityLevel;
  className?: string;
}

const ResultBadge: React.FC<ResultBadgeProps> = ({ status, severity, className = '' }) => {
  if (status) {
    return (
      <span
        className={clsx(
          'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
          status === 'pass' && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
          status === 'partial_fail' && 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
          status === 'fail' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
          className
        )}
      >
        {status === 'pass' && '✅ Pass'}
        {status === 'partial_fail' && '⚠️ Warning'}
        {status === 'fail' && '⛔ Fail'}
      </span>
    );
  }

  if (severity) {
    return (
      <span
        className={clsx(
          'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium uppercase tracking-wide',
          severity === 'high' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
          severity === 'medium' && 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
          severity === 'low' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
          className
        )}
      >
        {severity}
      </span>
    );
  }

  return null;
};

export default ResultBadge;
