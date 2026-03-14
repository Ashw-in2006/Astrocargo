OrbitOps - AI-Powered Space Cargo Monitoring System
https://img.shields.io/badge/Next.js-14-black
https://img.shields.io/badge/TypeScript-5.0-blue
https://img.shields.io/badge/Three.js-WebGL-green
https://img.shields.io/badge/TailwindCSS-3.0-38B2AC

OrbitOps is an AI-powered space cargo monitoring and orchestration platform for spacecraft modules and space stations. The system simulates how astronauts manage tools, food supplies, repair equipment, and scientific instruments inside spacecraft modules, with real-time tracking through a mission control dashboard.

https://via.placeholder.com/1200x600/0B0F1A/00E5FF?text=OrbitOps+Mission+Control+Dashboard

🚀 Features
Core Capabilities
AI-Powered Smart Search - Natural language queries to locate equipment instantly

3D Container Visualization - Interactive cargo modules with item-level details

Live Orbital Map - Real-time satellite and spacecraft tracking around Earth

Equipment Monitoring Dashboard - Track status, usage, and location of all items

Predictive Analytics - AI-driven shortage predictions and anomaly detection

Time Simulation - Simulate days, weeks, or months of mission operations

Quick Mark System - One-click status updates for equipment (used/moved/damaged)

Advanced Features
Digital Twin - Virtual replica of spacecraft modules with real-time updates

Autonomous Placement - AI recommendations for optimal cargo arrangement

Waste Management - Identify expired items and generate return plans

Activity Logging - Complete audit trail of all equipment movements

Multi-Module Support - Track equipment across multiple spacecraft sections

📋 Table of Contents
Technology Stack

Installation

Quick Start

Project Structure

API Reference

Database Schema

UI Components

Docker Deployment

Environment Variables

Testing

Contributing

License

💻 Technology Stack
Frontend
Technology	Purpose
Next.js 14	React framework with App Router
TypeScript	Type safety and better developer experience
TailwindCSS	Utility-first styling
Three.js + React Three Fiber	3D visualizations and orbital maps
Framer Motion	Smooth animations and transitions
Recharts	Data visualization and analytics
Lucide React	Icon library
React Hot Toast	Notification system
Backend (Mock Implementation)
Technology	Purpose
Next.js API Routes	RESTful API endpoints
LocalStorage	Client-side data persistence
In-memory Objects	Mock data store
Development Tools
Tool	Purpose
Vite	Development server and bundling
ESLint	Code linting
Prettier	Code formatting
Husky	Git hooks
📦 Installation
Prerequisites
Node.js v18 or higher

npm v9 or higher

Git

Clone Repository
bash
git clone https://github.com/yourusername/orbitops.git
cd orbitops
Install Dependencies
bash
npm install
Install Additional Packages
bash
# Core dependencies
npm install three @react-three/fiber @react-three/drei
npm install framer-motion recharts lucide-react react-hot-toast
npm install @types/three --save-dev
🚀 Quick Start
Development Mode
bash
npm run dev
Open http://localhost:3000 in your browser.

Build for Production
bash
npm run build
npm start
Available Scripts
Command	Description
npm run dev	Start development server
npm run build	Build for production
npm start	Start production server
npm run lint	Run ESLint
npm run format	Format code with Prettier
npm run type-check	Run TypeScript type checking
📁 Project Structure
text
orbitops/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   ├── dashboard/                 
│   │   └── page.tsx              # Mission control dashboard
│   ├── equipment/
│   │   └── page.tsx              # Equipment registry
│   ├── map/
│   │   └── page.tsx              # Orbital map
│   ├── search/
│   │   └── page.tsx              # AI search page
│   ├── container/
│   │   └── [id]/
│   │       └── page.tsx          # 3D container view
│   └── api/                       # API routes
│       ├── equipment/
│       ├── search/
│       ├── ai/
│       ├── dashboard/
│       └── simulate/
│
├── components/                    # React components
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── SpaceBackground.tsx
│   ├── dashboard/
│   │   ├── StatsCards.tsx
│   │   ├── ActivityFeed.tsx
│   │   ├── AlertsPanel.tsx
│   │   └── ModuleStatus.tsx
│   ├── equipment/
│   │   ├── EquipmentGrid.tsx
│   │   ├── EquipmentCard.tsx
│   │   ├── QuickActions.tsx
│   │   └── FilterPanel.tsx
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   ├── SearchResults.tsx
│   │   └── AIChat.tsx
│   ├── visualization/
│   │   ├── OrbitalMap.tsx
│   │   ├── Earth.tsx
│   │   ├── Satellite.tsx
│   │   ├── Container3D.tsx
│   │   └── ItemBlock.tsx
│   ├── simulation/
│   │   ├── TimeControls.tsx
│   │   └── SimulationStatus.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       └── Toast.tsx
│
├── lib/                           # Utilities and mock data
│   ├── mock-data.js               # Mock data store
│   ├── storage.js                 # localStorage helpers
│   ├── simulation.js              # Time simulation logic
│   ├── algorithms/                 # Optimization algorithms
│   │   ├── bin-packing.js
│   │   ├── path-optimization.js
│   │   └── priority-queue.js
│   └── utils.js
│
├── public/                        # Static assets
│   ├── textures/
│   │   └── earth.jpg
│   └── models/
│
├── styles/
│   └── globals.css                # Global styles
│
├── .env.example                    # Environment variables template
├── .eslintrc.json                  # ESLint configuration
├── .prettierrc                      # Prettier configuration
├── next.config.js                   # Next.js configuration
├── tailwind.config.js               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json
└── README.md
🔌 API Reference
All API endpoints return mock data and work without authentication.

Equipment Management
Method	Endpoint	Description	Response
GET	/api/equipment	List all equipment	Array of equipment items
GET	/api/equipment/:id	Get single equipment	Equipment object
POST	/api/equipment	Add new equipment	Created equipment
PUT	/api/equipment/:id	Update equipment	Updated equipment
DELETE	/api/equipment/:id	Remove equipment	Success message
Equipment Actions
Method	Endpoint	Description
POST	/api/equipment/:id/retrieve	Mark equipment as retrieved
POST	/api/equipment/:id/place	Mark equipment as placed
POST	/api/equipment/:id/move	Move equipment to new location
POST	/api/equipment/:id/maintenance	Send to maintenance
POST	/api/equipment/:id/damaged	Report as damaged
Search
Method	Endpoint	Description
GET	/api/search?q=query	Basic keyword search
POST	/api/ai/search	Natural language AI search
GET	/api/search/suggestions?q=partial	Autocomplete suggestions
AI Services
Method	Endpoint	Description
POST	/api/ai/predict/shortage	Predict supply shortages
POST	/api/ai/predict/anomaly	Detect usage anomalies
GET	/api/ai/insights	Generate usage insights
POST	/api/ai/chat	AI assistant chat
Waste Management
Method	Endpoint	Description
GET	/api/waste	List waste items
POST	/api/waste/identify	Identify items for disposal
POST	/api/waste/return-plan	Create return plan
POST	/api/waste/complete-undocking	Complete disposal
Simulation
Method	Endpoint	Description
POST	/api/simulate/day	Simulate one day
POST	/api/simulate/range	Simulate date range
GET	/api/simulate/status	Get simulation status
Dashboard
Method	Endpoint	Description
GET	/api/dashboard/stats	Dashboard statistics
GET	/api/dashboard/activity	Recent activity feed
GET	/api/dashboard/alerts	Active AI alerts
🗄️ Database Schema
Mock Data Structure
javascript
// Astronauts
{
  id: "ast-001",
  name: "Commander Sarah Chen",
  role: "Commander",
  specialization: "Mission Operations",
  currentModule: "HAB-01",
  active: true
}

// Modules
{
  id: "mod-001",
  name: "Habitation Module",
  code: "HAB-01",
  volumeCubicMeters: 120,
  weightCapacityKg: 5000,
  currentWeightKg: 2450,
  coordinates: { x: 0, y: 0, z: 0 }
}

// Containers
{
  id: "cont-001",
  moduleId: "mod-001",
  name: "Food Storage A",
  containerCode: "CONT-HAB-A1",
  gridPosition: { x: 1, y: 1, z: 1 },
  dimensions: { width: 2, height: 2, depth: 2 },
  capacityKg: 200,
  currentWeightKg: 145
}

// Equipment Items
{
  id: "eq-001",
  name: "Oxygen Repair Kit",
  category: "Tools",
  serialNumber: "TOOL-4421",
  containerId: "cont-001",
  moduleId: "mod-001",
  status: "available", // available, in_use, maintenance, damaged
  condition: "good",
  priority: 1, // 1=critical, 5=low
  usageCount: 23,
  lastUsed: "2025-03-10T14:30:00Z",
  expiryDate: null,
  storedPosition: { x: 2, y: 3, z: 1 }
}

// Movements
{
  id: "mov-001",
  equipmentId: "eq-001",
  equipmentName: "Oxygen Repair Kit",
  astronautId: "ast-001",
  astronautName: "Commander Sarah Chen",
  action: "retrieve", // retrieve, place, move, transfer
  fromContainerId: "cont-001",
  toContainerId: "cont-003",
  timestamp: "2025-03-14T09:15:00Z"
}

// AI Predictions
{
  id: "pred-001",
  type: "shortage", // shortage, anomaly, maintenance, trend
  equipmentId: "eq-002",
  equipmentName: "Food Pack",
  moduleId: "mod-001",
  severity: "high", // low, medium, high, critical
  message: "Food shortage predicted in Habitation Module within 6 days",
  details: { confidence: 87, currentStock: 42, dailyConsumption: 7 },
  resolved: false,
  createdAt: "2025-03-14T00:00:00Z"
}
🎨 UI Components
Color Palette
css
--space-black: #0B0F1A;
--space-dark-blue: #0F172A;
--space-deep-purple: #1E1A3A;
--neon-cyan: #00E5FF;
--neon-blue: #2979FF;
--space-purple: #7C4DFF;
--glow-pink: #FF4081;
--warning-orange: #FF6D00;
--alert-red: #FF3D00;
--success-green: #00C853;
--glass-bg: rgba(15, 23, 42, 0.7);
Typography
Headings: Orbitron (Google Fonts)

Body: Inter

Monospace: JetBrains Mono for logs and coordinates

Component Library
Cards: Glassmorphism with backdrop-blur, neon glow on hover

Buttons: Gradient backgrounds, rounded-full, glow effect

Badges: Pill-shaped with severity colors

Icons: Lucide icons with neon drop-shadow

Charts: Recharts with custom neon theme

🐳 Docker Deployment
Build Image
bash
docker build -t orbitops:latest .
Run Container
bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -v orbitops-data:/app/data \
  --name orbitops \
  orbitops:latest
Docker Compose
yaml
version: '3.8'
services:
  orbitops:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - orbitops-data:/app/data
    restart: unless-stopped

volumes:
  orbitops-data:
Dockerfile
dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
🌍 Environment Variables
Create a .env.local file:

env
# App Configuration
NEXT_PUBLIC_APP_NAME=OrbitOps
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Feature Flags
NEXT_PUBLIC_ENABLE_3D=true
NEXT_PUBLIC_ENABLE_AI_SIMULATION=true
NEXT_PUBLIC_ENABLE_REAL_API=false

# API Configuration (for future use)
# GEMINI_API_KEY=your_key_here
# SUPABASE_URL=your_url_here
# SUPABASE_ANON_KEY=your_key_here
# MONGODB_URI=your_uri_here
🧪 Testing
Run Tests
bash
npm run test
Test Structure
text
__tests__/
├── components/
│   ├── EquipmentCard.test.tsx
│   └── SearchBar.test.tsx
├── api/
│   ├── equipment.test.js
│   └── search.test.js
└── algorithms/
    ├── bin-packing.test.js
    └── path-optimization.test.js
🤝 Contributing
Fork the repository

Create feature branch (git checkout -b feature/amazing-feature)

Commit changes (git commit -m 'Add amazing feature')

Push to branch (git push origin feature/amazing-feature)

Open a Pull Request

Development Guidelines
Follow TypeScript best practices

Write unit tests for new features

Update documentation

Use conventional commits

Ensure all tests pass

📄 License
MIT License - see LICENSE file for details

🙏 Acknowledgments
NASA for inspiration on spacecraft logistics

SpaceX for UI/UX design inspiration

Three.js community for 3D visualization tools

Next.js team for the amazing framework

📞 Support
Documentation: docs.orbitops.space

Issues: GitHub Issues

Email: support@orbitops.space 

# One-line setup and run
npx create-next-app@latest orbitops --typescript --tailwind --app --eslint && \
cd orbitops && \
npm install three @react-three/fiber @react-three/drei framer-motion recharts lucide-react react-hot-toast && \
npm run dev

OrbitOps - AI-Powered Space Cargo Monitoring for Next-Generation Space Missions 🌌🛰️

