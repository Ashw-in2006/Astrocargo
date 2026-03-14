export interface Module {
  id: string;
  name: string;
  code: string;
  volumeCubicMeters: number;
  weightCapacityKg: number;
  currentWeightKg: number;
}

export interface Container {
  id: string;
  moduleId: string;
  name: string;
  containerCode: string;
  gridPosition: { x: number; y: number; z: number };
  capacityKg: number;
  currentWeightKg: number;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  serialNumber: string;
  containerCode: string;
  moduleCode: string;
  status: 'available' | 'in_use' | 'maintenance' | 'damaged' | 'expired';
  conditionStatus: 'good' | 'worn' | 'needs_maintenance' | 'damaged';
  priorityLevel: number;
  usageCount: number;
  lastUsed: string;
  assignedAstronaut?: string;
  description: string;
  weightKg: number;
}

export interface Astronaut {
  id: string;
  name: string;
  role: string;
  specialization: string;
  currentModule: string;
  avatar: string;
}

export interface ActivityLog {
  id: string;
  astronaut: string;
  action: string;
  equipment: string;
  module: string;
  timestamp: string;
}

export interface AIAlert {
  id: string;
  type: 'shortage' | 'anomaly' | 'maintenance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  resolved: boolean;
  timestamp: string;
}

export const modules: Module[] = [
  { id: '1', name: 'Habitation Module', code: 'HAB-01', volumeCubicMeters: 120, weightCapacityKg: 5000, currentWeightKg: 3200 },
  { id: '2', name: 'Laboratory Module', code: 'LAB-01', volumeCubicMeters: 95, weightCapacityKg: 4200, currentWeightKg: 2800 },
  { id: '3', name: 'Storage Module', code: 'STR-01', volumeCubicMeters: 150, weightCapacityKg: 8000, currentWeightKg: 5600 },
  { id: '4', name: 'Docking Node', code: 'NODE-01', volumeCubicMeters: 60, weightCapacityKg: 3000, currentWeightKg: 1200 },
];

export const astronauts: Astronaut[] = [
  { id: '1', name: 'Cmdr. Sarah Chen', role: 'Commander', specialization: 'Mission Operations', currentModule: 'HAB-01', avatar: '👩‍🚀' },
  { id: '2', name: 'Dr. James Okonkwo', role: 'Science Officer', specialization: 'Astrophysics', currentModule: 'LAB-01', avatar: '👨‍🔬' },
  { id: '3', name: 'Eng. Maria Santos', role: 'Flight Engineer', specialization: 'Life Support', currentModule: 'HAB-01', avatar: '👩‍🔧' },
  { id: '4', name: 'Spec. Alex Volkov', role: 'Mission Specialist', specialization: 'Robotics', currentModule: 'LAB-01', avatar: '🧑‍🚀' },
  { id: '5', name: 'Dr. Priya Sharma', role: 'Medical Officer', specialization: 'Emergency Medicine', currentModule: 'HAB-01', avatar: '👩‍⚕️' },
];

export const equipmentItems: EquipmentItem[] = [
  { id: '1', name: 'Oxygen Repair Kit', category: 'Tools', subcategory: 'Life Support', serialNumber: 'SN-TOOL-4421', containerCode: 'CONT-HAB-A1', moduleCode: 'HAB-01', status: 'available', conditionStatus: 'good', priorityLevel: 1, usageCount: 12, lastUsed: '2 hours ago', description: 'Emergency repair tools for oxygen systems', weightKg: 4.5 },
  { id: '2', name: 'Food Pack - Freeze Dried', category: 'Consumables', subcategory: 'Food', serialNumber: 'SN-FOOD-8812', containerCode: 'CONT-HAB-A2', moduleCode: 'HAB-01', status: 'available', conditionStatus: 'good', priorityLevel: 3, usageCount: 45, lastUsed: '6 hours ago', description: 'Freeze-dried meal pack', weightKg: 0.8 },
  { id: '3', name: 'Medical Emergency Kit', category: 'Medical', subcategory: 'First Aid', serialNumber: 'SN-MED-1193', containerCode: 'CONT-HAB-A1', moduleCode: 'HAB-01', status: 'in_use', conditionStatus: 'good', priorityLevel: 1, usageCount: 8, lastUsed: '1 hour ago', assignedAstronaut: 'Dr. Priya Sharma', description: 'Complete medical emergency supplies', weightKg: 3.2 },
  { id: '4', name: 'Space Suit Repair Tool', category: 'Tools', subcategory: 'EVA', serialNumber: 'SN-TOOL-5567', containerCode: 'CONT-LAB-B1', moduleCode: 'LAB-01', status: 'available', conditionStatus: 'worn', priorityLevel: 2, usageCount: 34, lastUsed: '1 day ago', description: 'Specialized tool for suit repairs', weightKg: 2.1 },
  { id: '5', name: 'Water Regulator', category: 'Equipment', subcategory: 'Life Support', serialNumber: 'SN-EQUIP-7734', containerCode: 'CONT-HAB-A1', moduleCode: 'HAB-01', status: 'maintenance', conditionStatus: 'needs_maintenance', priorityLevel: 2, usageCount: 67, lastUsed: '3 hours ago', description: 'Water system pressure regulator', weightKg: 1.8 },
  { id: '6', name: 'Navigation Sensor', category: 'Scientific', subcategory: 'Navigation', serialNumber: 'SN-SCI-2241', containerCode: 'CONT-LAB-B1', moduleCode: 'LAB-01', status: 'available', conditionStatus: 'good', priorityLevel: 2, usageCount: 21, lastUsed: '5 hours ago', description: 'High-precision positioning sensor', weightKg: 3.7 },
  { id: '7', name: 'Battery Module - Type C', category: 'Power', subcategory: 'Batteries', serialNumber: 'SN-PWR-3356', containerCode: 'CONT-STR-C1', moduleCode: 'STR-01', status: 'available', conditionStatus: 'good', priorityLevel: 3, usageCount: 15, lastUsed: '2 days ago', description: 'Rechargeable power cell', weightKg: 5.2 },
  { id: '8', name: 'Experiment Sample Container', category: 'Scientific', subcategory: 'Samples', serialNumber: 'SN-SCI-8890', containerCode: 'CONT-LAB-B1', moduleCode: 'LAB-01', status: 'in_use', conditionStatus: 'good', priorityLevel: 4, usageCount: 9, lastUsed: '30 min ago', assignedAstronaut: 'Dr. James Okonkwo', description: 'Sealed container for experiments', weightKg: 1.2 },
  { id: '9', name: 'Robotic Arm Attachment', category: 'Tools', subcategory: 'Robotics', serialNumber: 'SN-TOOL-1124', containerCode: 'CONT-STR-C1', moduleCode: 'STR-01', status: 'available', conditionStatus: 'good', priorityLevel: 2, usageCount: 28, lastUsed: '4 hours ago', description: 'Interchangeable robotic tool head', weightKg: 8.4 },
  { id: '10', name: 'Communication Antenna', category: 'Equipment', subcategory: 'Comms', serialNumber: 'SN-EQUIP-6671', containerCode: 'CONT-STR-C1', moduleCode: 'STR-01', status: 'damaged', conditionStatus: 'damaged', priorityLevel: 3, usageCount: 42, lastUsed: '12 hours ago', description: 'Spare antenna module', weightKg: 3.1 },
  { id: '11', name: 'Thermal Regulation Suit', category: 'Clothing', subcategory: 'EVA', serialNumber: 'SN-CLO-9912', containerCode: 'CONT-HAB-A2', moduleCode: 'HAB-01', status: 'available', conditionStatus: 'good', priorityLevel: 2, usageCount: 18, lastUsed: '1 day ago', description: 'Temperature-controlled suit liner', weightKg: 2.8 },
  { id: '12', name: 'Emergency Oxygen Tank', category: 'Life Support', subcategory: 'Oxygen', serialNumber: 'SN-LS-4478', containerCode: 'CONT-HAB-A1', moduleCode: 'HAB-01', status: 'available', conditionStatus: 'good', priorityLevel: 1, usageCount: 3, lastUsed: '5 days ago', description: 'Portable oxygen supply', weightKg: 6.5 },
];

export const activityLogs: ActivityLog[] = [
  { id: '1', astronaut: 'Cmdr. Sarah Chen', action: 'Retrieved', equipment: 'Oxygen Repair Kit', module: 'HAB-01', timestamp: '14:32 UTC' },
  { id: '2', astronaut: 'Dr. Priya Sharma', action: 'Using', equipment: 'Medical Emergency Kit', module: 'HAB-01', timestamp: '14:15 UTC' },
  { id: '3', astronaut: 'Dr. James Okonkwo', action: 'Retrieved', equipment: 'Experiment Sample Container', module: 'LAB-01', timestamp: '13:48 UTC' },
  { id: '4', astronaut: 'Eng. Maria Santos', action: 'Sent to Maintenance', equipment: 'Water Regulator', module: 'HAB-01', timestamp: '13:22 UTC' },
  { id: '5', astronaut: 'Spec. Alex Volkov', action: 'Moved', equipment: 'Robotic Arm Attachment', module: 'STR-01 → LAB-01', timestamp: '12:55 UTC' },
  { id: '6', astronaut: 'Cmdr. Sarah Chen', action: 'Placed', equipment: 'Navigation Sensor', module: 'LAB-01', timestamp: '12:30 UTC' },
  { id: '7', astronaut: 'Dr. Priya Sharma', action: 'Reported Damaged', equipment: 'Communication Antenna', module: 'STR-01', timestamp: '11:45 UTC' },
];

export const aiAlerts: AIAlert[] = [
  { id: '1', type: 'shortage', severity: 'high', title: 'Food Shortage Predicted', message: 'Freeze-dried food packs in HAB-01 will be depleted in ~6 days at current consumption rate. Confidence: 87%', resolved: false, timestamp: '14:00 UTC' },
  { id: '2', type: 'anomaly', severity: 'critical', title: 'Anomalous Equipment Movement', message: 'Oxygen Repair Kit moved 8 times in past 24h. Normal rate: 2-3 times. Investigate usage pattern.', resolved: false, timestamp: '13:30 UTC' },
  { id: '3', type: 'maintenance', severity: 'medium', title: 'Maintenance Due', message: 'Water Regulator has exceeded 60 usage cycles. Scheduled maintenance recommended.', resolved: false, timestamp: '12:00 UTC' },
  { id: '4', type: 'shortage', severity: 'low', title: 'Battery Stock Low', message: 'Type C batteries at 30% reserve. Consider resupply within 30 days.', resolved: true, timestamp: '08:00 UTC' },
];

export const usageTrendData = [
  { day: 'Mon', tools: 24, consumables: 45, medical: 8, scientific: 15 },
  { day: 'Tue', tools: 28, consumables: 42, medical: 12, scientific: 18 },
  { day: 'Wed', tools: 32, consumables: 38, medical: 6, scientific: 22 },
  { day: 'Thu', tools: 22, consumables: 50, medical: 14, scientific: 16 },
  { day: 'Fri', tools: 35, consumables: 44, medical: 9, scientific: 20 },
  { day: 'Sat', tools: 18, consumables: 36, medical: 5, scientific: 12 },
  { day: 'Sun', tools: 15, consumables: 40, medical: 7, scientific: 10 },
];

export const moduleCapacityData = [
  { name: 'HAB-01', used: 3200, capacity: 5000, fill: '#00E5FF' },
  { name: 'LAB-01', used: 2800, capacity: 4200, fill: '#7C4DFF' },
  { name: 'STR-01', used: 5600, capacity: 8000, fill: '#2979FF' },
  { name: 'NODE-01', used: 1200, capacity: 3000, fill: '#FF4081' },
];

export const categoryDistribution = [
  { name: 'Tools', value: 35, fill: '#00E5FF' },
  { name: 'Consumables', value: 28, fill: '#FF6D00' },
  { name: 'Medical', value: 12, fill: '#FF4081' },
  { name: 'Scientific', value: 18, fill: '#7C4DFF' },
  { name: 'Equipment', value: 22, fill: '#2979FF' },
  { name: 'Life Support', value: 15, fill: '#00C853' },
];
