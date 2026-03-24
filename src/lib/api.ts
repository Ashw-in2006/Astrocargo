const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

export interface Mission {
  id: string;
  name: string;
  status: string;
  destination?: string;
  launch_date?: string;
  delay_reason?: string;
  cargo?: string[];
}

export const api = {
  async getMissions(): Promise<Mission[]> {
    try {
      const response = await fetch(`${API_URL}/missions`);
      const data = await response.json();
      return data.missions || data;
    } catch (error) {
      console.error('Error fetching missions:', error);
      return [];
    }
  },

  async getMission(id: string): Promise<Mission | null> {
    try {
      const response = await fetch(`${API_URL}/missions/${id}`);
      if (!response.ok) return null;
      return response.json();
    } catch (error) {
      console.error('Error fetching mission:', error);
      return null;
    }
  },

  async getDelayedMissions() {
    try {
      const response = await fetch(`${API_URL}/missions/status/delayed`);
      return response.json();
    } catch (error) {
      console.error('Error fetching delayed missions:', error);
      return { delayed_missions: [], count: 0 };
    }
  },

  async chat(message: string): Promise<string> {
    try {
      const response = await fetch(`${API_URL}/chat`, {
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
      return data.reply || data.response || "Sorry, I couldn't process that request.";
    } catch (error) {
      console.error('Error in chat:', error);
      return `Error: Could not connect to backend at ${API_URL}. Make sure backend is running.`;
    }
  },

  async health() {
    try {
      const response = await fetch(`${API_URL}/health`);
      return response.json();
    } catch (error) {
      return { status: 'unhealthy', error: String(error) };
    }
  }
};