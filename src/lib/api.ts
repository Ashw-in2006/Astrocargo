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
  // Mission endpoints - FIXED to match backend
  async getMissions(): Promise<Mission[]> {
    try {
      // Try both possible endpoints
      let response = await fetch(`${API_BASE_URL}/missions`);
      if (!response.ok) {
        // Fallback to /tools/get_all_missions if needed
        response = await fetch(`${API_BASE_URL}/tools/get_all_missions`);
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data.missions || data.data || [];
    } catch (error) {
      console.error('Error fetching missions:', error);
      // Return mock data if backend doesn't have missions endpoint
      return [
        { id: "CARGO-1", name: "ISS Resupply Mission 1", status: "Completed", destination: "ISS", launch_date: "2024-01-15", cargo: ["Food", "Water", "Equipment"] },
        { id: "CARGO-2", name: "Lunar Gateway Supply", status: "In Transit", destination: "Lunar Gateway", launch_date: "2024-02-20", cargo: ["Fuel", "Materials"] },
        { id: "CARGO-3", name: "Mars Mission Prep", status: "Delayed", destination: "Mars Transit", launch_date: "2024-03-10", delay_reason: "Weather", cargo: ["Life Support"] }
      ];
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
      if (!response.ok) {
        // Fallback to MCP tool
        const chatResponse = await this.sendMessage("Show me delayed missions");
        return { delayed_missions: [chatResponse.reply], count: 1 };
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching delayed missions:', error);
      return { delayed_missions: [], count: 0 };
    }
  },

  async getCompletedMissions() {
    try {
      const response = await fetch(`${API_BASE_URL}/missions/status/completed`);
      if (!response.ok) {
        const chatResponse = await this.sendMessage("Show me completed missions");
        return { missions: [chatResponse.reply], count: 1 };
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching completed missions:', error);
      return { missions: [], count: 0 };
    }
  },

  // Chat endpoint - THIS IS CORRECT
  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      console.log(`Sending to: ${API_BASE_URL}/chat`); // Debug log
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
      console.log('Response:', data); // Debug log
      
      return {
        reply: data.reply || data.response || "I'm not sure how to answer that.",
        agent: data.agent || data.agent_type || 'AstroCargo AI',
        status: data.status || 'success',
        source: data.source
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        reply: `⚠️ Could not connect to AstroCargo AI backend at ${API_BASE_URL}. Make sure the backend server is running on port 8081.\n\nError details: ${error}`,
        status: 'error'
      };
    }
  },

  // Health and status - FIXED endpoint
  async health() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return { status: data.status === 'healthy' ? 'healthy' : 'unhealthy' };
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'unhealthy', error: String(error) };
    }
  },

  async getAgentStatus(): Promise<AgentStatus> {
    try {
      // Try multiple possible endpoints
      let response = await fetch(`${API_BASE_URL}/agent-status`);
      if (!response.ok) {
        response = await fetch(`${API_BASE_URL}/status`);
      }
      if (!response.ok) {
        response = await fetch(`${API_BASE_URL}/`);
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('Error getting agent status:', error);
      return { status: 'offline' };
    }
  }
};