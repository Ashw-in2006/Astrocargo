import { useEffect, useState } from 'react';
import { api, Mission } from '../lib/api';

export function MissionsList() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      const data = await api.getMissions();
      setMissions(data);
    } catch (error) {
      console.error('Failed to load missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delayed': return 'text-yellow-400 bg-yellow-400/10';
      case 'in transit': return 'text-blue-400 bg-blue-400/10';
      case 'completed': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading missions...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">🚀 Space Cargo Missions</h2>
      
      <div className="grid gap-4">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className="bg-gray-900 rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition"
            onClick={() => setSelectedMission(mission)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-white">{mission.name}</h3>
                <p className="text-gray-400 text-sm">ID: {mission.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(mission.status)}`}>
                {mission.status}
              </span>
            </div>
            
            {mission.destination && (
              <p className="text-gray-300 mt-2">📍 Destination: {mission.destination}</p>
            )}
            
            {mission.launch_date && (
              <p className="text-gray-400 text-sm">📅 Launch: {mission.launch_date}</p>
            )}
            
            {mission.delay_reason && (
              <p className="text-yellow-400 text-sm mt-2">⚠️ {mission.delay_reason}</p>
            )}
          </div>
        ))}
      </div>

      {/* Mission Details Modal */}
      {selectedMission && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setSelectedMission(null)}>
          <div className="bg-gray-900 rounded-lg p-6 max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">{selectedMission.name}</h3>
            <div className="space-y-3">
              <p><span className="text-gray-400">Mission ID:</span> {selectedMission.id}</p>
              <p><span className="text-gray-400">Status:</span> <span className={getStatusColor(selectedMission.status)}>{selectedMission.status}</span></p>
              {selectedMission.destination && <p><span className="text-gray-400">Destination:</span> {selectedMission.destination}</p>}
              {selectedMission.launch_date && <p><span className="text-gray-400">Launch Date:</span> {selectedMission.launch_date}</p>}
              {selectedMission.delay_reason && <p><span className="text-yellow-400">⚠️ {selectedMission.delay_reason}</span></p>}
              {selectedMission.cargo && selectedMission.cargo.length > 0 && (
                <div>
                  <p className="text-gray-400">Cargo Manifest:</p>
                  <ul className="list-disc list-inside ml-4">
                    {selectedMission.cargo.map((item, i) => (
                      <li key={i} className="text-white">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedMission(null)}
              className="mt-6 w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}