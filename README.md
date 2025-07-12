# 🔄 Skill Swap Platform

A modern skill exchange platform where users can swap their expertise with others. Built with React, Node.js, and MongoDB.

## 🚀 Quick Start - Demo Mode

The app includes a **demo mode** that works without any backend setup:

### Demo Credentials
```
Email: any valid email address (e.g., alex@example.com, sarah@example.com)
Password: password123
```

**Available Demo Users:**
- **alex@example.com** - Full-stack developer (JavaScript, React, Node.js)
- **sarah@example.com** - Data scientist (Python, Data Science, TensorFlow)
- **marcus@example.com** - Creative designer (Photoshop, Illustrator, UI Design)

## 🛠️ Full Backend Setup

### Prerequisites
- Node.js 16+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. MongoDB Setup

**Option A: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Add your IP to whitelist

**Option B: Local MongoDB**
```bash
# Install MongoDB Community Edition
# On macOS with Homebrew:
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

### 2. Backend Configuration

Create `/backend/.env`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/skillswap
# Or for Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/skillswap

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

### 3. Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies (if needed)
cd ..
npm install
```

### 4. Seed Sample Data

```bash
cd backend
npm run seed
```

### 5. Start Backend Server

```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

### 6. Frontend Configuration

Create `/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🔐 Authentication

### Demo Mode
- Use any email with password `password123`
- No backend required
- Sample data included

### Production Mode
- Register new accounts through the app
- All passwords are bcrypt hashed
- JWT tokens for session management

## 📧 Sample User Accounts (Backend)

When you run the seed script, these accounts are created:

```
Email: alex.rodriguez@skillswap.com
Password: password123
Skills: JavaScript, React, Node.js

Email: sarah.chen@skillswap.com  
Password: password123
Skills: Python, Data Science, TensorFlow

Email: marcus.johnson@skillswap.com
Password: password123
Skills: Photoshop, Illustrator, UI Design

Email: elena.vasquez@skillswap.com
Password: password123
Skills: Java, Spring Boot, Microservices

Email: david.kim@skillswap.com
Password: password123
Skills: Angular, TypeScript, RxJS
```

## 🚨 Environment Variables

### Required Backend Variables
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Optional Frontend Variables
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Get all users (with filters)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/skills` - Get all skills

### Requests
- `GET /api/requests` - Get user's requests
- `POST /api/requests` - Send skill swap request
- `PUT /api/requests/:id/accept` - Accept request
- `PUT /api/requests/:id/reject` - Reject request
- `DELETE /api/requests/:id` - Cancel request

## 🎨 Features

### ✅ Implemented
- **User Authentication** - Registration, login, JWT tokens
- **User Profiles** - Skills offered/wanted, bio, availability
- **Skill Matching** - Find users with complementary skills
- **Request System** - Send, accept, reject skill swap requests
- **Real-time Updates** - Dynamic request status updates
- **Responsive Design** - Works on desktop and mobile
- **Dark Theme** - Modern glassmorphism UI
- **Demo Mode** - Works offline with sample data

### 🔮 Future Enhancements
- Real-time messaging between users
- Video call integration for skill sessions
- Rating and review system
- Skill verification badges
- Group skill sessions
- Calendar integration
- Push notifications

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```bash
# Check if MongoDB is running
brew services list | grep mongodb
# Restart if needed
brew services restart mongodb/brew/mongodb-community
```

**2. JWT Token Issues**
- Clear localStorage in browser
- Check JWT_SECRET in backend .env

**3. CORS Errors**
- Verify CLIENT_URL in backend .env
- Check frontend REACT_APP_API_URL

**4. Demo Mode Not Working**
- App automatically falls back to demo mode
- Check browser console for API errors

## 📱 Usage Guide

### Getting Started
1. **Demo Mode**: Just open the app and use any email + "password123"
2. **Full Setup**: Follow backend setup, then register/login

### Core Workflows
1. **Register/Login** → **Complete Profile** → **Browse Users** → **Send Requests**
2. **View Requests** → **Accept/Reject** → **Start Skill Exchange**

### Tips
- Add multiple skills to increase match opportunities
- Write detailed messages when sending requests
- Keep your availability updated
- Rate users after successful exchanges

## 🔒 Security

- Passwords are bcrypt hashed
- JWT tokens for secure authentication
- Input validation and sanitization
- CORS protection
- Rate limiting on API endpoints
- MongoDB injection protection

## 📄 License

MIT License - Feel free to use this project for learning and development.

---

**Happy Skill Swapping! 🎯**