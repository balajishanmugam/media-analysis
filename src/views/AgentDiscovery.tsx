// Local store: Agent Discovery Page - Check and display agent status
import { useState } from 'react';

// Local store: Agent status type definition
interface Agent {
  agentName: string;
  status: 'Active' | 'Not Active';
}

// Local store: API response type (prepared for backend integration)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface AgentCheckResponse {
  agents: Agent[];
}

const AgentDiscovery = () => {
  // Local store: State for agents list
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  // Local store: Check agents function - calls REST API
  const handleCheckAgents = async () => {
    setIsChecking(true);
    setError(null);

    try {
      // Local store: MOCK API RESPONSE - Replace with real API call
      // TODO: When backend is ready, uncomment the real API call below
      
      /* 
      // Local store: REAL API CALL (uncomment when backend is ready)
      const response = await fetch('http://localhost:8000/check-agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: 'Hello'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to check agents');
      }

      const data: AgentCheckResponse = await response.json();
      setAgents(data);
      */

      // Local store: MOCK RESPONSE - Simulating API delay
      console.log('🔧 MOCK MODE: Checking agents with payload:', { symbol: 'Hello' });
      
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Local store: Mock agent data
      const mockAgents: Agent[] = [
        { agentName: 'Chat_agent', status: 'Active' },
        { agentName: 'Media_agent', status: 'Not Active' },
      ];

      console.log('✅ MOCK RESPONSE:', mockAgents);
      setAgents(mockAgents);
      setHasChecked(true);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check agents';
      setError(errorMessage);
      console.error('❌ Error checking agents:', err);
    } finally {
      setIsChecking(false);
    }
  };

  // Local store: Get status color classes
  const getStatusColor = (status: string) => {
    return status === 'Active'
      ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/20 border-green-300 dark:border-green-700'
      : 'bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/30 dark:to-rose-900/20 border-red-300 dark:border-red-700';
  };

  // Local store: Get status badge color
  const getStatusBadgeColor = (status: string) => {
    return status === 'Active'
      ? 'bg-green-500 text-white'
      : 'bg-red-500 text-white';
  };

  // Local store: Get status icon
  const getStatusIcon = (status: string) => {
    if (status === 'Active') {
      return (
        <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Local store: Page header with gradient background */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 mb-4 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Agent Discovery
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover and monitor the status of AI agents in your system
        </p>
      </div>

      {/* Local store: Check agents button with rich styling */}
      <div className="card max-w-md mx-auto mb-8 text-center">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-3">
            <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            System Health Check
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click the button below to check all agents
          </p>
        </div>

        <button
          onClick={handleCheckAgents}
          disabled={isChecking}
          className="btn btn-primary w-full text-lg py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          {isChecking ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking Agents...
            </>
          ) : (
            <>
              <svg className="w-6 h-6 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Check Agents
            </>
          )}
        </button>

        {/* Local store: API payload info */}
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            POST payload: {'{ symbol: "Hello" }'}
          </p>
        </div>
      </div>

      {/* Local store: Error display */}
      {error && (
        <div className="max-w-2xl mx-auto mb-8">
          <div className="error-box flex items-start gap-3">
            <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Error checking agents</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Local store: Agents display - Rich card grid */}
      {hasChecked && agents.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Agent Status
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {agents.filter(a => a.status === 'Active').length} of {agents.length} agents are active
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agents.map((agent, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-xl border-2 ${getStatusColor(agent.status)} p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
              >
                {/* Local store: Status indicator pulse animation */}
                <div className="absolute top-4 right-4">
                  <div className="relative">
                    <div className={`w-4 h-4 rounded-full ${getStatusBadgeColor(agent.status)}`}></div>
                    {agent.status === 'Active' && (
                      <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
                    )}
                  </div>
                </div>

                {/* Local store: Agent icon and name */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(agent.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">
                      {agent.agentName.replace('_', ' ')}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(agent.status)}`}>
                        {agent.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Local store: Agent details */}
                <div className="space-y-2 mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Agent ID:</span>
                    <span className="font-mono text-gray-900 dark:text-white">{agent.agentName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Last Check:</span>
                    <span className="text-gray-900 dark:text-white">{new Date().toLocaleTimeString()}</span>
                  </div>
                  {agent.status === 'Active' ? (
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 mt-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">Ready to serve requests</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400 mt-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="font-medium">Requires attention</span>
                    </div>
                  )}
                </div>

                {/* Local store: Decorative gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 opacity-50"></div>
              </div>
            ))}
          </div>

          {/* Local store: Summary stats */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="card text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {agents.filter(a => a.status === 'Active').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Agents</p>
            </div>
            <div className="card text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {agents.filter(a => a.status === 'Not Active').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Inactive Agents</p>
            </div>
          </div>
        </div>
      )}

      {/* Local store: Empty state before checking */}
      {!hasChecked && !isChecking && (
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Ready to Discover Agents
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Click the "Check Agents" button above to scan your system
          </p>
        </div>
      )}
    </div>
  );
};

export default AgentDiscovery;
