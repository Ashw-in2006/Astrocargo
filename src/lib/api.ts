// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

export interface Mission {
  id: string;
  name: string;
  status: string;
  destination?: string;
  launch_date?: string;
  delay_reason?: string;
  cargo?: string[];
  progress?: string;
  origin?: string;
}

export interface ChatResponse {
  reply: string;
  agent?: string;
  status?: string;
  source?: string;
}

export interface AgentStatus {
  status: string;
  agent?: string;
  apis?: Record<string, string>;
  external_apis_status?: string;
  missions_loaded?: string;
}

export const api = {
  // Mission endpoints
  async getMissions(): Promise<Mission[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/missions`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data.missions || data;
    } catch (error) {
      console.error('Error fetching missions:', error);
      return [];
    }
  },

  async getMission(id: string): Promise<Mission | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/missions/${id}`);
      if (!response.ok) return null;
      return response.json();
    } catch (error) {
      console.error('Error fetching mission:', error);
      return null;
    }
  },

  async getDelayedMissions() {
    try {
      const response = await fetch(`${API_BASE_URL}/missions/status/delayed`);
      return response.json();
    } catch (error) {
      console.error('Error fetching delayed missions:', error);
      return { delayed_missions: [], count: 0 };
    }
  },

  async getCompletedMissions() {
    try {
      const response = await fetch(`${API_BASE_URL}/missions/status/completed`);
      return response.json();
    } catch (error) {
      console.error('Error fetching completed missions:', error);
      return { missions: [], count: 0 };
    }
  },

  // Chat endpoint
  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        reply: data.reply || data.response || "I'm not sure how to answer that.",
        agent: data.agent || 'AstroCargo AI',
        status: data.status || 'success',
        source: data.source
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        reply: `⚠️ Could not connect to AstroCargo AI backend at ${API_BASE_URL}. Make sure the backend server is running on port 8081.`,
        status: 'error'
      };
    }
  },

  // Health and status
  async health() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.json();
    } catch (error) {
      return { status: 'unhealthy', error: String(error) };
    }
  },

  async getAgentStatus(): Promise<AgentStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}/agent-status`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('Error getting agent status:', error);
      return { status: 'offline' };
    }
  }
};