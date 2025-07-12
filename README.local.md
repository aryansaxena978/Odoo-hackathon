# Skill Swap Platform - Local Development Setup

## Prerequisites

Make sure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **MongoDB** (if you want to run the backend)

## Quick Start

### 1. Clone and Setup Frontend

```bash
# Create the project directory
mkdir skill-swap-platform
cd skill-swap-platform

# Copy all the provided files to this directory
# Make sure you have the complete file structure as shown

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add a background image (required)
mkdir -p src/assets
# Add your background image as src/assets/background.jpg
# You can download any suitable background image or use a solid color CSS background
```

### 2. Start the Frontend

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`

### 3. Optional: Setup Backend

If you want to connect to a real backend instead of using the demo mode:

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Setup MongoDB
# Make sure MongoDB is running on your system

# Seed the database with sample data
npm run seed

# Start the backend server
npm start
```

Backend will run on `http://localhost:5000`

## Project Structure

```
skill-swap-platform/
├── src/
│   ├── components/          # React components
│   ├── assets/             # Images and static files
│   ├── styles/             # CSS files
│   └── App.tsx             # Main application
├── backend/                # Node.js backend (optional)
├── public/                 # Public assets
└── package.json           # Dependencies
```

## Key Changes Made for Local Development

### 1. **Image Imports**
- Replaced `figma:asset/` imports with local image imports
- Added `ImageWithFallback` component for better error handling
- Created `src/assets/` directory for images

### 2. **Build System**
- Added Vite configuration for fast development
- Configured TypeScript with proper paths
- Added Tailwind CSS v4 configuration

### 3. **API Integration**
- API calls now try real backend first, then fallback to demo mode
- Environment variables for API configuration
- Proper error handling for offline development

### 4. **Dependencies**
- All required packages in package.json
- Proper React 18 setup
- ShadCN components with Radix UI

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## Demo Mode

The app works perfectly in demo mode without a backend:
- ✅ All UI features work
- ✅ Mock data for users and requests
- ✅ Local storage for authentication
- ✅ Beautiful animations and effects

## Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Missing Background Image
If you get errors about the background image:
1. Add any image as `src/assets/background.jpg`
2. Or update the import in `src/App.tsx` to use a different image
3. Or replace with a CSS gradient background

### API Connection Issues
- The app automatically falls back to demo mode if backend is unavailable
- Check console for connection status
- Verify `VITE_API_URL` in your `.env` file

### Build Errors
- Make sure all dependencies are installed: `npm install`
- Clear node_modules and reinstall if needed: `rm -rf node_modules && npm install`
- Check that all import paths use the new structure

## Features

✅ **Working Features:**
- User authentication (demo mode)
- Profile management
- Skill swap requests
- Real-time notifications
- Responsive design
- Dark theme
- Advanced animations
- Search and filtering

The app is fully functional in demo mode and ready for production deployment!