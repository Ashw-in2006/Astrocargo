"""Space cargo mission dataset - Simulates real NASA-style mission data"""

MISSIONS = [
    {
        "id": "CARGO-1",
        "name": "Supply Mission to ISS",
        "status": "In Transit",
        "launch_date": "2026-03-15",
        "destination": "International Space Station",
        "cargo": ["Food supplies", "Science equipment", "Spare parts"],
        "progress": "85% complete"
    },
    {
        "id": "CARGO-2",
        "name": "Satellite Deployment",
        "status": "Delayed",
        "launch_date": "2026-03-20",
        "destination": "Low Earth Orbit",
        "cargo": ["Communication satellites"],
        "delay_reason": "Weather conditions",
        "estimated_new_date": "2026-03-25"
    },
    {
        "id": "CARGO-3",
        "name": "Lunar Supply",
        "status": "Scheduled",
        "launch_date": "2026-04-10",
        "destination": "Lunar Gateway",
        "cargo": ["Habitat modules", "Scientific instruments"],
        "mission_duration": "30 days"
    },
    {
        "id": "CARGO-4",
        "name": "Mars Rover Supplies",
        "status": "Completed",
        "launch_date": "2026-02-01",
        "destination": "Mars",
        "cargo": ["Rover parts", "Scientific equipment"],
        "completed_date": "2026-03-01"
    }
]

def get_mission(mission_id):
    for mission in MISSIONS:
        if mission["id"] == mission_id.upper():
            return mission
    return None


def get_delayed_missions():
    return [m for m in MISSIONS if m["status"] == "Delayed"]


def get_missions_by_destination(destination):
    return [
        m for m in MISSIONS
        if destination.lower() in m["destination"].lower()
    ]