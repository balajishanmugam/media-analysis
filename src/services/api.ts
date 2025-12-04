import axios from 'axios';
import { ComplianceReport, TextCheckPayload, DirectorySubmissionResponse, ChatMessageResponse } from '../types';
import { BackendResponse, transformResponse } from '../utils/responseMapper';

/**
 * Axios instance with base configuration
 * 
 * TO SWITCH TO REAL BACKEND:
 * 1. Change baseURL to your actual API endpoint
 * 2. Remove the import of './mock' in main.tsx or conditionally import it
 * 3. Add any required authentication headers here
 */
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/',
  timeout: 300000, // 5 minutes (increased from 30 seconds to prevent cancellation)
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Enable if you need to send cookies with requests
});

/**
 * Request interceptor to add CORS headers
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add CORS headers to all requests
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle CORS errors
 */
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Request successful:', response.config.url);
    return response;
  },
  (error) => {
    // Check if request was cancelled
    if (axios.isCancel(error)) {
      console.warn('⚠️ Request was cancelled:', error.message);
      return Promise.reject(new Error('Request cancelled'));
    }
    
    // Check for timeout
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timeout - Backend took too long to respond (>5 minutes)');
      console.error('💡 Your backend might be processing a large file or stuck');
      return Promise.reject(new Error('Request timeout. Backend is taking too long.'));
    }
    
    // Check for network/CORS errors
    if (error.message === 'Network Error') {
      console.error('❌ Network Error - Possible causes:');
      console.error('  1. Backend not running on', apiClient.defaults.baseURL);
      console.error('  2. CORS not configured on backend');
      console.error('  3. Firewall blocking the connection');
      console.error('📍 Backend URL:', apiClient.defaults.baseURL);
      console.error('🔍 Check if backend is running on the correct port.');
      return Promise.reject(new Error('Unable to connect to server. Check if backend is running.'));
    }
    
    // Log detailed error information
    if (error.response) {
      console.error('📛 Server Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('📛 No response received from server');
    }
    
    return Promise.reject(error);
  }
);

// Local store: ========== NEW API ENDPOINTS FOR LOCAL STORAGE & CHATBOT ==========

// Local store: Toggle for mock/real API - set to true for development, false for production
const USE_MOCK_RESPONSES = true; // TODO: Set to false when backend is ready

/**
 * Local store: Submit local directory path to backend
 * After files are saved to local directory, send the directory path to backend for processing
 * 
 * HOW TO USE WITH REAL BACKEND:
 * 1. Set USE_MOCK_RESPONSES = false
 * 2. Ensure backend endpoint POST /submit-directory exists
 * 3. Backend should accept: { directoryPath: string, timestamp: string }
 * 4. Backend should return: { sessionId: string, message: string }
 * 
 * @param directoryPath - Path to the local directory containing saved media files
 * @returns Backend response with session ID and initial message
 */
export const submitLocalDirectory = async (
  directoryPath: string
): Promise<DirectorySubmissionResponse> => {
  // Local store: MOCK RESPONSE - Remove this block when backend is ready
  if (USE_MOCK_RESPONSES) {
    console.log('🔧 MOCK MODE: Simulating backend response for directory submission');
    console.log('📁 Directory path:', directoryPath);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      sessionId: `mock_session_${Date.now()}`,
      message: 'Hello! I\'m your AI assistant. I\'ve received your media file. How can I help you analyze it?',
      directoryPath: directoryPath
    };
  }

  // Local store: REAL API CALL - This will be used when USE_MOCK_RESPONSES = false
  try {
    // Local store: POST request to backend with directory path
    const response = await apiClient.post('/submit-directory', {
      directoryPath: directoryPath,
      timestamp: new Date().toISOString()
    });

    // Local store: Extract session ID and welcome message from backend response
    return {
      success: true,
      sessionId: response.data.sessionId || `session_${Date.now()}`,
      message: response.data.message || 'Directory submitted successfully. How can I help you?',
      directoryPath: directoryPath
    };
  } catch (error) {
    console.error('❌ Failed to submit directory:', error);
    throw new Error('Failed to submit directory to backend. Please try again.');
  }
};

/**
 * Local store: Send chat message to backend and receive AI response
 * Used for chatbot conversation after directory submission
 * 
 * HOW TO USE WITH REAL BACKEND:
 * 1. Set USE_MOCK_RESPONSES = false
 * 2. Ensure backend endpoint POST /chat exists
 * 3. Backend should accept: { message: string, sessionId: string, timestamp: string }
 * 4. Backend should return: { message: string, timestamp: string }
 * 
 * @param message - User's chat message
 * @param sessionId - Session ID from directory submission
 * @returns Backend response with AI message
 */
export const sendChatMessage = async (
  message: string,
  sessionId?: string
): Promise<ChatMessageResponse> => {
  // Local store: MOCK RESPONSE - Remove this block when backend is ready
  if (USE_MOCK_RESPONSES) {
    console.log('🔧 MOCK MODE: Simulating AI response');
    console.log('💬 User message:', message);
    console.log('🔑 Session ID:', sessionId);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Local store: Mock AI responses based on user message
    const mockResponses = [
      'That\'s an interesting question! Based on the media you uploaded, I can help you analyze it.',
      'I understand your query. The file you submitted contains valuable information.',
      'Great question! Let me help you with that. The media file shows various elements that we can explore.',
      'I\'ve analyzed the content. Here are some insights from your uploaded file.',
      'Thanks for asking! The media you shared has been processed successfully.'
    ];
    
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    return {
      success: true,
      message: randomResponse,
      timestamp: new Date().toISOString()
    };
  }

  // Local store: REAL API CALL - This will be used when USE_MOCK_RESPONSES = false
  try {
    // Local store: POST request to backend with user's chat message
    const response = await apiClient.post('/chat', {
      message: message,
      sessionId: sessionId || null,
      timestamp: new Date().toISOString()
    });

    // Local store: Extract AI response message from backend
    return {
      success: true,
      message: response.data.message || response.data.response || 'I received your message.',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Failed to send chat message:', error);
    throw new Error('Failed to send message. Please try again.');
  }
};

// Local store: ========== LEGACY COMPLIANCE API (DEPRECATED) ==========
// Local store: The following functions are deprecated and kept only for reference
// Local store: They will be removed in future updates

/**
 * @deprecated Local store: Use submitLocalDirectory instead
 */
export const uploadVideo = async (
  file: File
): Promise<ComplianceReport> => {
  const message = `Video file: ${file.name} (${file.size} bytes, ${file.type})`;
  
  const response = await apiClient.post<BackendResponse>('/run', {
    message: message
  });

  return transformResponse(response.data, file.name, file.size);
};

/**
 * @deprecated Local store: Use submitLocalDirectory instead
 */
export const checkYouTubeVideo = async (youtubeUrl: string): Promise<ComplianceReport> => {
  const message = `YouTube URL: ${youtubeUrl}`;
  
  const response = await apiClient.post<BackendResponse>('/run', {
    message: message
  });

  return transformResponse(response.data, youtubeUrl, 0);
};

/**
 * @deprecated Local store: Use submitLocalDirectory instead
 */
export const uploadDocument = async (
  file: File
): Promise<ComplianceReport> => {
  const message = `Document file: ${file.name} (${file.size} bytes, ${file.type})`;
  
  const response = await apiClient.post<BackendResponse>('/run', {
    message: message
  });

  return transformResponse(response.data, file.name, file.size);
};

/**
 * @deprecated Local store: Use submitLocalDirectory instead
 */
export const checkText = async (payload: TextCheckPayload): Promise<ComplianceReport> => {
  const message = payload.text 
    ? `Text content: ${payload.text.substring(0, 100)}...` 
    : payload.url 
    ? `URL: ${payload.url}` 
    : 'Unknown content';
  
  const response = await apiClient.post<BackendResponse>('/run', {
    message: message
  });
  
  const fileName = payload.url || 'text-input.txt';
  const fileSize = payload.text?.length || 0;
  
  return transformResponse(response.data, fileName, fileSize);
};

export default apiClient;
