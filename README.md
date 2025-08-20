# IMS Frontend - Inventory Management System

## 📋 Overview
Modern React-based web application for the IMS (Inventory Management System) that provides an intuitive interface for college inventory management, eliminating traditional paper-based registers.

## ⚡ Tech Stack
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization and analytics

## ✨ Features
- **Dashboard** - Overview of inventory statistics
- **Inventory Management** - Add, edit, delete, and track items
- **Room & Floor Management** - Organize items by location
- **Category Management** - Hierarchical item classification
- **User Management** - Role-based access control
- **Analytics** - Visual reports and charts
- **Activity Logs** - Audit trail of all changes
- **Responsive Design** - Works on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone and navigate
git clone <repository-url>
cd ims-final/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
The app connects to the backend at `http://localhost:3000` via Vite proxy configuration.

## 📝 Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure
```
src/
├── app/           # Main application pages
├── components/    # Reusable UI components  
├── store/         # State management
├── utils/         # Helper functions
└── constants/     # App constants
```

## 🔧 Key Components
- **Authentication** - Login/logout with JWT tokens
- **Data Tables** - Sortable, filterable inventory lists
- **Charts & Analytics** - Visual data representation
- **Modal System** - Create/edit/delete operations
- **Responsive Layout** - Sidebar navigation with mobile support

---

*Modern, responsive frontend for streamlined college inventory management.*
