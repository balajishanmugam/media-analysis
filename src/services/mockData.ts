import { ComplianceReport } from '../types';

/**
 * Mock data generator for compliance reports
 * These simulate different scenarios: pass, partial_fail, and fail
 */

export const generateMockReport = (
  fileName: string,
  fileSize: number,
  duration?: number
): ComplianceReport => {
  const scenario = Math.random();

  // 30% pass, 40% partial_fail, 30% fail
  if (scenario < 0.3) {
    return generatePassReport(fileName, fileSize, duration);
  } else if (scenario < 0.7) {
    return generatePartialFailReport(fileName, fileSize, duration);
  } else {
    return generateFailReport(fileName, fileSize, duration);
  }
};

const generatePassReport = (
  fileName: string,
  fileSize: number,
  duration?: number
): ComplianceReport => ({
  summary: {
    status: 'pass',
    issuesCount: 0,
    recommendationsCount: 0,
    score: 95 + Math.floor(Math.random() * 5),
  },
  issues: [],
  metadata: {
    fileName,
    fileSize,
    durationSec: duration,
    checkedAt: new Date().toISOString(),
  },
});

const generatePartialFailReport = (
  fileName: string,
  fileSize: number,
  duration?: number
): ComplianceReport => ({
  summary: {
    status: 'partial_fail',
    issuesCount: 2,
    recommendationsCount: 2,
    score: 65 + Math.floor(Math.random() * 20),
  },
  issues: [
    {
      id: 'I-01',
      severity: 'medium',
      title: 'Potentially misleading statement detected',
      description:
        'The content contains a claim that may require additional context or citation to meet compliance standards.',
      timestamp: duration ? '00:01:23' : undefined,
      recommendation:
        'Add credible citations from authorized sources or rephrase the statement to include appropriate disclaimers.',
    },
    {
      id: 'I-02',
      severity: 'low',
      title: 'Missing disclosure information',
      description:
        'Required disclosure information is either missing or not prominently displayed.',
      timestamp: duration ? '00:02:45' : undefined,
      recommendation:
        'Include proper disclosure statements at the beginning or end of the content.',
    },
  ],
  metadata: {
    fileName,
    fileSize,
    durationSec: duration,
    checkedAt: new Date().toISOString(),
  },
});

const generateFailReport = (
  fileName: string,
  fileSize: number,
  duration?: number
): ComplianceReport => ({
  summary: {
    status: 'fail',
    issuesCount: 3,
    recommendationsCount: 4,
    score: 35 + Math.floor(Math.random() * 30),
  },
  issues: [
    {
      id: 'I-01',
      severity: 'high',
      title: 'Contains restricted political claim',
      description:
        'Content contains an unverified political claim that violates regulation X. This is a critical compliance issue.',
      timestamp: duration ? '00:01:23' : undefined,
      recommendation:
        'Remove the claim entirely or add credible citations from multiple authorized sources.',
    },
    {
      id: 'I-02',
      severity: 'high',
      title: 'Prohibited content detected',
      description:
        'The material includes content that is explicitly prohibited under current compliance guidelines.',
      timestamp: duration ? '00:03:12' : undefined,
      recommendation:
        'This section must be removed before publication. Consult legal team for guidance.',
    },
    {
      id: 'I-03',
      severity: 'medium',
      title: 'Unverified financial information',
      description:
        'Financial data presented without proper verification or sourcing, which may mislead viewers.',
      timestamp: duration ? '00:04:50' : undefined,
      recommendation:
        'Verify all financial information with official sources and add appropriate disclaimers.',
    },
  ],
  metadata: {
    fileName,
    fileSize,
    durationSec: duration,
    checkedAt: new Date().toISOString(),
  },
});

// Sample mock reports for different file types
export const mockReports = {
  pass: generatePassReport('sample-pass.mp4', 10485760, 120),
  partialFail: generatePartialFailReport('sample-warning.mp4', 15728640, 95),
  fail: generateFailReport('sample-fail.mp4', 20971520, 180),
};
