import axios from 'axios';
import { BackendResponse } from '../utils/responseMapper';

/**
 * Mock API interceptors using axios
 * 
 * This file simulates backend responses for development purposes.
 * 
 * TO DISABLE MOCKING:
 * - Remove the import of this file from main.tsx
 * - Or set NODE_ENV to production
 */

// Helper function to simulate network latency
const simulateLatency = (): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, 800));
};

/**
 * Generate a mock backend response in the actual backend format
 */
const generateMockBackendResponse = (contentType: string): BackendResponse => {
  const responses: Record<string, string> = {
    video: `Analysis of video content reveals the following compliance issues:

ISSUE: Inappropriate Language - Multiple instances of profanity detected at 00:45 and 01:23.
Recommendation: Remove or bleep profane language to meet platform guidelines.

ISSUE: Copyright Concern - Background music may be copyrighted material.
Recommendation: Verify licensing or replace with royalty-free music.

- Medium: Video quality drops below 720p in several segments.
Recommendation: Re-encode video maintaining minimum 720p resolution throughout.`,

    document: `Policy document review completed. The following issues were identified:

ISSUE: Outdated References - Document references regulations from 2018 that have been updated.
Recommendation: Update all regulatory references to current versions.

ISSUE: Missing Signatures - Section 4.2 requires authorized signatures which are absent.
Recommendation: Obtain required signatures from department heads.

- Low: Formatting inconsistencies in section headings.
Recommendation: Apply consistent heading styles throughout the document.`,

    youtube: `YouTube video compliance check completed:

ISSUE: Age-Restricted Content - Video contains content requiring age verification.
Recommendation: Enable age restrictions on the video or edit content.

- Medium: Thumbnail may be clickbait and violate community guidelines.
Recommendation: Update thumbnail to accurately represent video content.`,

    url: `Article content analysis shows:

ISSUE: Factual Inaccuracy - Claims made in paragraph 3 lack proper citation.
Recommendation: Add credible sources or remove unverified claims.

- Low: Grammar and spelling errors detected in multiple sections.
Recommendation: Run spell check and review for grammatical correctness.`,

    text: `Text content review findings:

- Medium: Potentially misleading statements detected.
Recommendation: Clarify ambiguous statements and provide supporting evidence.

- Low: Tone may not be appropriate for professional context.
Recommendation: Adjust language to maintain professional standards.`,
  };

  const llmResponse = responses[contentType] || responses.text;

  return {
    plan: {
      tool: null,
      args: {},
    },
    tool_output: null,
    llm_response: llmResponse,
  };
};

/**
 * Setup mock interceptors for /run endpoint
 */
export const setupMockAPI = () => {
  // Intercept all /run endpoint requests
  axios.interceptors.request.use(async (config) => {
    console.log('🔍 Intercepting request:', config.url);

    if (config.url?.includes('/run')) {
      // All requests now send { message: "..." } format
      const payload = config.data;
      
      if (payload && payload.message) {
        const message = payload.message as string;
        console.log('📝 Message received:', message);
        
        // Determine type based on message content
        const isVideo = message.includes('Video file:');
        const isDocument = message.includes('Document file:');
        const isYouTube = message.includes('YouTube URL:');
        const isURL = message.includes('URL:') && !isYouTube;
        const isText = message.includes('Text content:');
        
        // Log the type
        if (isVideo) {
          console.log('📹 Processing video message');
        } else if (isDocument) {
          console.log('📄 Processing document message');
        } else if (isYouTube) {
          console.log('🎥 Processing YouTube URL message');
        } else if (isURL) {
          console.log('🔗 Processing URL message');
        } else if (isText) {
          console.log('📝 Processing text message');
        }
          // Simulate latency
        await simulateLatency();

        // Determine content type for mock response
        const contentType = isVideo ? 'video'
          : isDocument ? 'document'
          : isYouTube ? 'youtube'
          : isURL ? 'url'
          : 'text';
        
        // Generate mock backend response (in backend format)
        const mockBackendResponse = generateMockBackendResponse(contentType);
        console.log('✅ Mock backend response generated');

        // Return mock response without actually making the request
        config.adapter = () => {
          return Promise.resolve({
            data: mockBackendResponse,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          });
        };
      }
    }

    return config;
  });

  console.log('🧪 Mock API interceptors enabled - All API calls to /run will return mock data');
};
