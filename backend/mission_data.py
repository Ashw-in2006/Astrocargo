"""Space cargo mission dataset - Simulates real NASA-style mission data"""
MISSIONS = [
    {
        "id": "CARGO-1",
        "origin": "Earth Base Alpha",
        "destination": "International Space Station",
        "status": "Delayed",
        "reason": "Solar storm interference",
        "cargo": ["Oxygen tanks", "Food supplies", "Scientific experiments"],
        "launch_date": "2026-03-15",
        "eta": "2026-03-20"
    },
    {
        "id": "CARGO-2",
        "origin": "Moon Base",
        "destination": "Mars Colony",
        "status": "In Transit",
        "reason": "Optimal trajectory",
        "cargo": ["Mars rovers", "Habitat modules", "Water recycling system"],
        "launch_date": "2026-03-10",
        "eta": "2026-06-15"
    },
    {
        "id": "CARGO-3",
        "origin": "Earth Base Alpha",
        "destination": "Moon Base",
        "status": "Scheduled",
        "reason": "Waiting for launch window",
        "cargo": ["Scientific instruments", "Medical supplies", "Communication equipment"],
        "launch_date": "2026-03-25",
        "eta": "2026-03-28"
    },
    {
        "id": "CARGO-4",
        "origin": "Earth Base Alpha",
        "destination": "Mars Colony",
        "status": "Delayed",
        "reason": "Engine malfunction detected",
        "cargo": ["Food supplies", "3D printing materials", "Spare parts"],
        "launch_date": "2026-03-05",
        "eta": "2026-05-20"
    }
]

def get_mission(mission_id):
    """Get specific mission by ID"""
    for mission in MISSIONS:
        if mission["id"] == mission_id:
            return mission
    return None

def get_delayed_missions():
    """Get all delayed missions"""
    return [m for m in MISSIONS if m["status"] == "Delayed"]

def get_missions_by_destination(destination):
    """Get missions going to a specific destination"""
    return [m for m in MISSIONS if m["destination"].lower() == destination.lower()]
