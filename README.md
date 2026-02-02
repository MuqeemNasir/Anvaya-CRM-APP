# Anvaya CRM
> A specialized MERN stack Lead Management System designed for high-performance sales teams.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black.svg)](https://vercel.com/)

Anvaya is a comprehensive CRM built to manage the entire lifecycle of a lead. It features real-time data visualization, team workload tracking, and a collaborative interaction engine.

## Live Demo
- **Frontend:** [https://anvaya-crm-client.vercel.app](https://anvaya-crm-client.vercel.app)
- **Backend API:** [https://anvaya-crm-app-ashen.vercel.app/api](https://anvaya-crm-app-ashen.vercel.app/api)


## Quick Start
```bash
git clone https://github.com/MuqeemNasir/Anvaya-CRM-APP.git
cd Anvaya-CRM-APP

# Setup Backend
cd backend
npm install
npm run start  or node index.js

# Setup Frontend
cd ../frontend
npm install
npm run dev

```

## Technologies
- React 19 (Vite)
- React Router 7
- Node.js 
- Express
- MongoDB 
- Mongoose
- Chart.js 
- React-Chartjs-2
- Lucide-React Icons
- Bootstrap CSS

## Tech Stack

- **Frontend:** React 19, Vite, React Router 7, Axios, Lucide-React Icons.
- **Backend:** Node.js, Express.js, Express-Validator.
- **Database:** MongoDB Atlas with Mongoose ODM.
- **State Management:** React Context API (DataContext) with Memoization (`useMemo`).

## Demo Video
Watch a walkthrough of all major features of this app:
 
[GDrive Video Link](https://drive.google.com/file/d/1uXE-LFEGanxVc8y8ZEz3DQmF6ykRYlf3/view?usp=drive_link)

## Features

### Dashboard (Command Center)
- Visual summary cards for every lead stage (New, Contacted, Qualified, etc.)
- Dynamic "Team Workload" table calculating active leads per agent.
- "Recent Activity" feed showing the latest pipeline updates.

### Lead Management
- Full CRUD operations for leads with metadata (Source, Priority, Tags).
- **URL-based filtering**: Share specific filtered views via browser links.
- **Smart Sorting**: Weighted sorting by Priority (High to Low) and Closing Time.

### Lead Details & Interactions (Super Feature)
- **Collaboration Thread**: Chronological comment system for every lead.
- **Agent Attribution**: Select specific agents as authors for progress updates.
- **Inline Editing**: Toggle between view and edit modes without page refreshes.

### Performance Reports
- **Pipeline Balance**: Pie chart comparing active leads vs. closed deals.
- **Agent Success**: Bar chart visualizing leads "Won" per team member.
- **Status Distribution**: Global breakdown of lead volume across all stages.

### Administrative Settings
- Master list of all Agents and Leads.
- Secure deletion functionality with Custom UI Confirmation Modals.


## API Reference

### **GET /api/leads**

List all leads (Supports query filters: status, salesAgent)<br>
Sample Response:
```
[{ "_id": "...", "name": "Acme Corp", "status": "New", ... }]
```

### **POST /api/leads/:id/comments**

Add an agent-authored comment to a lead.<br>
Request Body:
```
{ "commentText": "...", "authorId": "..." }
```

### GET /api/report/pipeline
Get aggregated data for dashboard visualizations.<br>
Sample Response:
```
{ "totalLeadsInPipeline": 45 }
```

### GET /api/agents
Fetch all registered sales agents.<br>
Sample Response:
```
[{ "_id": "...", "name": "Alice Johnson", "email": "..." }]
```


## Contact
For bugs or feature requests, please reach out to mac786m@gmail.com

