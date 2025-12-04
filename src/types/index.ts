// Local store: Legacy compliance types (deprecated - kept for reference)
export type SeverityLevel = 'high' | 'medium' | 'low';
export type StatusType = 'pass' | 'partial_fail' | 'fail';

export interface Issue {
  id: string;
  severity: SeverityLevel;
  title: string;
  description: string;
  timestamp?: string;
  recommendation: string;
}

export interface ReportSummary {
  status: StatusType;
  issuesCount: number;
  recommendationsCount: number;
  score: number;
}

export interface ReportMetadata {
  fileName: string;
  fileSize: number;
  durationSec?: number;
  checkedAt: string;
}

export interface ComplianceReport {
  summary: ReportSummary;
  issues: Issue[];
  metadata: ReportMetadata;
}

export interface TextCheckPayload {
  text?: string;
  url?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Local store: New types for media storage and chatbot functionality

export type MediaType = 'video' | 'audio' | 'image' | 'document' | 'text';
export type InputMode = 'file' | 'text';
export type MessageRole = 'user' | 'assistant' | 'system';

// Local store: Represents uploaded or typed media content
export interface MediaFile {
  id: string;
  name: string;
  type: MediaType;
  size: number;
  file?: File;
  content?: string; // For text input
  createdAt: string;
}

// Local store: Directory handle for File System Access API
export interface DirectoryInfo {
  handle: FileSystemDirectoryHandle | null;
  path: string; // Display path for user
  isSelected: boolean;
}

// Local store: Chat message structure
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

// Local store: Chatbot state management
export interface ChatbotState {
  messages: ChatMessage[];
  isLoading: boolean;
  sessionId: string | null;
  error: string | null;
}

// Local store: Backend response for directory submission
export interface DirectorySubmissionResponse {
  success: boolean;
  sessionId: string;
  message: string;
  directoryPath: string;
}

// Local store: Backend response for chat messages
export interface ChatMessageResponse {
  success: boolean;
  message: string;
  timestamp: string;
}
