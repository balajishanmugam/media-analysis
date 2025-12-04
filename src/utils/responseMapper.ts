import { ComplianceReport, Issue, StatusType, SeverityLevel } from '../types';

/**
 * Backend response format
 */
export interface BackendResponse {
  plan: {
    tool: string | null;
    args: Record<string, any>;
  };
  tool_output: any;
  llm_response: string;
}

/**
 * Extract issues from LLM response text
 * Parses the text to find issues, severity levels, and recommendations
 */
const extractIssuesFromText = (text: string): Issue[] => {
  const issues: Issue[] = [];
  
  // Common patterns for issues in compliance reports
  const issuePatterns = [
    // Pattern 1: "ISSUE: title - description"
    /(?:ISSUE|Problem|Warning|Error):\s*([^\n-]+)(?:\s*-\s*([^\n]+))?/gi,
    // Pattern 2: "- Critical/High/Medium/Low: description"
    /[-•]\s*(?:(Critical|High|Medium|Low)):\s*([^\n]+)/gi,
    // Pattern 3: Numbered lists "1. Issue description"
    /\d+\.\s*([^\n]+)/g,
  ];

  let issueId = 1;
  
  // Try to extract structured issues
  issuePatterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const severity = determineSeverity(match[0]);
      const title = match[1]?.trim() || `Issue ${issueId}`;
      const description = match[2]?.trim() || match[1]?.trim() || match[0].trim();
      
      issues.push({
        id: `issue-${issueId}`,
        severity,
        title: title.substring(0, 100), // Limit title length
        description: description.substring(0, 500), // Limit description length
        recommendation: extractRecommendation(match[0]) || 'Please review and address this issue.',
      });
      
      issueId++;
    }
  });

  // If no structured issues found, create a general issue from the response
  if (issues.length === 0 && text.trim().length > 0) {
    const severity = determineSeverity(text);
    issues.push({
      id: 'issue-1',
      severity,
      title: 'Compliance Review',
      description: text.substring(0, 500),
      recommendation: 'Please review the analysis and take appropriate action.',
    });
  }

  return issues;
};

/**
 * Determine severity level from text
 */
const determineSeverity = (text: string): SeverityLevel => {
  const lowerText = text.toLowerCase();
  
  if (
    lowerText.includes('critical') ||
    lowerText.includes('severe') ||
    lowerText.includes('violation') ||
    lowerText.includes('illegal') ||
    lowerText.includes('prohibited')
  ) {
    return 'high';
  }
  
  if (
    lowerText.includes('warning') ||
    lowerText.includes('concern') ||
    lowerText.includes('issue') ||
    lowerText.includes('problem')
  ) {
    return 'medium';
  }
  
  return 'low';
};

/**
 * Extract recommendation from issue text
 */
const extractRecommendation = (text: string): string | null => {
  const recommendationPatterns = [
    /(?:Recommendation|Suggest|Should|Must|Need to):\s*([^\n]+)/i,
    /(?:Fix|Resolve|Address):\s*([^\n]+)/i,
  ];

  for (const pattern of recommendationPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
};

/**
 * Calculate compliance score based on issues
 */
const calculateScore = (issues: Issue[]): number => {
  if (issues.length === 0) return 100;

  const penalties = {
    high: 30,
    medium: 15,
    low: 5,
  };

  const totalPenalty = issues.reduce((sum, issue) => {
    return sum + penalties[issue.severity];
  }, 0);

  const score = Math.max(0, 100 - totalPenalty);
  return Math.round(score);
};

/**
 * Determine overall status based on score and issues
 */
const determineStatus = (score: number, issues: Issue[]): StatusType => {
  const hasHighSeverity = issues.some((issue) => issue.severity === 'high');
  
  if (hasHighSeverity || score < 50) {
    return 'fail';
  }
  
  if (issues.length > 0 || score < 80) {
    return 'partial_fail';
  }
  
  return 'pass';
};

/**
 * Transform backend response to ComplianceReport format
 * 
 * @param backendResponse - Response from backend API
 * @param fileName - Name of the file being checked
 * @param fileSize - Size of the file in bytes
 * @param durationSec - Optional duration for video files
 * @returns ComplianceReport formatted for frontend
 */
export const transformBackendResponse = (
  backendResponse: BackendResponse,
  fileName: string,
  fileSize: number,
  durationSec?: number
): ComplianceReport => {
  // Extract issues from LLM response
  const llmText = backendResponse.llm_response || '';
  const issues = extractIssuesFromText(llmText);
  
  // Calculate score and status
  const score = calculateScore(issues);
  const status = determineStatus(score, issues);
  
  // Count recommendations (each issue has a recommendation)
  const recommendationsCount = issues.length;

  return {
    summary: {
      status,
      issuesCount: issues.length,
      recommendationsCount,
      score,
    },
    issues,
    metadata: {
      fileName,
      fileSize,
      durationSec,
      checkedAt: new Date().toISOString(),
    },
  };
};

/**
 * Alternative transformer if backend provides structured data in tool_output
 * 
 * @param backendResponse - Response from backend API
 * @param fileName - Name of the file being checked
 * @param fileSize - Size of the file in bytes
 * @param durationSec - Optional duration for video files
 * @returns ComplianceReport formatted for frontend
 */
export const transformStructuredResponse = (
  backendResponse: BackendResponse,
  fileName: string,
  fileSize: number,
  durationSec?: number
): ComplianceReport => {
  const toolOutput = backendResponse.tool_output;
  
  // If tool_output has structured issues, use them
  if (toolOutput && Array.isArray(toolOutput.issues)) {
    const issues: Issue[] = toolOutput.issues.map((issue: any, index: number) => ({
      id: issue.id || `issue-${index + 1}`,
      severity: (issue.severity || 'medium') as SeverityLevel,
      title: issue.title || `Issue ${index + 1}`,
      description: issue.description || '',
      timestamp: issue.timestamp,
      recommendation: issue.recommendation || 'Please review this issue.',
    }));

    const score = toolOutput.score || calculateScore(issues);
    const status = toolOutput.status || determineStatus(score, issues);

    return {
      summary: {
        status,
        issuesCount: issues.length,
        recommendationsCount: issues.length,
        score,
      },
      issues,
      metadata: {
        fileName,
        fileSize,
        durationSec,
        checkedAt: new Date().toISOString(),
      },
    };
  }

  // Fallback to text parsing
  return transformBackendResponse(backendResponse, fileName, fileSize, durationSec);
};

/**
 * Smart transformer that tries structured format first, then falls back to text parsing
 */
export const transformResponse = (
  backendResponse: BackendResponse,
  fileName: string,
  fileSize: number,
  durationSec?: number
): ComplianceReport => {
  // Try structured format first
  if (backendResponse.tool_output && typeof backendResponse.tool_output === 'object') {
    try {
      return transformStructuredResponse(backendResponse, fileName, fileSize, durationSec);
    } catch (error) {
      console.warn('⚠️ Failed to parse structured response, falling back to text parsing', error);
    }
  }

  // Fall back to text parsing
  return transformBackendResponse(backendResponse, fileName, fileSize, durationSec);
};
