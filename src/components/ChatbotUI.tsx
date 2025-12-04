// Local store: Chatbot UI component for interactive conversation after directory submission
import { useState, useEffect, useRef } from 'react';
import { ChatMessage, ChatbotState } from '../types';
import { sendChatMessage } from '../services/api';

interface ChatbotUIProps {
  sessionId: string | null;
  initialMessage?: string;
  onNewSession?: () => void; // Local store: Callback to start new session
}

// Local store: Chatbot component that handles REST API calls for chat messages
export const ChatbotUI = ({ sessionId, initialMessage, onNewSession }: ChatbotUIProps) => {
  // Local store: Chatbot state management
  const [chatState, setChatState] = useState<ChatbotState>({
    messages: [],
    isLoading: false,
    sessionId: sessionId,
    error: null,
  });

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Local store: Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  // Local store: Add initial assistant message when chatbot loads
  useEffect(() => {
    if (initialMessage && chatState.messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: initialMessage,
        timestamp: new Date().toISOString(),
      };
      setChatState((prev) => ({
        ...prev,
        messages: [welcomeMessage],
      }));
    }
  }, [initialMessage]);

  // Local store: Handle sending user message and getting AI response via REST API
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    // Local store: Add user message to chat
    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    setInputMessage('');

    try {
      // Local store: Send message to backend REST API
      const response = await sendChatMessage(userMessage.content, chatState.sessionId || undefined);

      // Local store: Add assistant response to chat
      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: response.message,
        timestamp: response.timestamp,
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      // Local store: Handle API error
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setChatState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  // Local store: Handle Enter key press to send message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="card mt-6">
      {/* Local store: Chatbot header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Assistant
          </h3>
        </div>
        {chatState.sessionId && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Session: {chatState.sessionId.slice(-8)}
          </span>
        )}
      </div>

      {/* Local store: Messages display area */}
      <div className="h-96 overflow-y-auto mb-4 space-y-3 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
        {chatState.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {/* Local store: Loading indicator */}
        {chatState.isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Local store: Error display */}
      {chatState.error && (
        <div className="error-box mb-4">
          <p className="text-sm">{chatState.error}</p>
        </div>
      )}

      {/* Local store: Input area */}
      <div className="flex gap-2 mb-4">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
          className="input-field resize-none"
          rows={2}
          disabled={chatState.isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || chatState.isLoading}
          className="btn btn-primary px-6 self-end"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>

      {/* Local store: New Session button - allows user to start over with new upload */}
      {onNewSession && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onNewSession}
            className="btn btn-secondary w-full flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Start New Session
          </button>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
            Upload a new file and chat with AI
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatbotUI;
