# OverClocked - Gaming Hardware E-commerce Platform

> Your ultimate online store for RTX graphics cards, AMD processors, NVIDIA beasts, and all things gaming.

## 🚀 Features

- **User Authentication**: Secure JWT-based login/signup with role-based access
- **Product Management**: Full CRUD operations for gaming hardware products
- **Shopping Cart**: Add, remove, and checkout functionality
- **Admin Dashboard**: Product inventory management
- **Responsive Design**: Modern cyberpunk-themed UI with CSS modules
- **Security**: Rate limiting, input validation, password strength requirements
- **Professional Logging**: Winston-based logging system
- **API Documentation**: Swagger/OpenAPI documentation
- **Error Handling**: Comprehensive error boundaries and validation
- **Toast Notifications**: User-friendly feedback system

## 🛠️ Tech Stack

**Frontend:**
- React 19.1.0 with TypeScript
- React Router for navigation
- CSS Modules for styling
- Axios for API calls
- React Hot Toast for notifications
- Context API for state management

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- Winston for logging
- Helmet for security headers
- Express Rate Limit for API protection
- Express Validator for input validation
- Swagger for API documentation

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd OverClocked
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd src/backend
npm install
```

4. Set up environment variables
```bash
# Copy the example file
cp .env.example .env
# Edit .env with your configuration
```

5. Start the development servers
```bash
# Start backend (from src/backend directory)
npm start

# Start frontend (from root directory)
npm start
```

## 📚 API Documentation

Once the backend is running, visit `http://localhost:5000/api-docs` for interactive API documentation.

## 🔐 Security Features

- **Password Requirements**: 8+ characters with uppercase, lowercase, numbers, and special characters
- **Rate Limiting**: 100 requests per 15 minutes, 5 login attempts per 15 minutes
- **Input Validation**: Server-side validation for all endpoints
- **Security Headers**: Helmet.js for secure HTTP headers
- **JWT Token Expiration**: 1-hour token validity
- **CORS Configuration**: Proper cross-origin request handling
- **Cookie Security**: HttpOnly, Secure, SameSite cookies

## 🎨 Project Structure

```
OverClocked/
├── src/
│   ├── pages/              # React page components
│   ├── components/         # Reusable React components
│   ├── styles/             # CSS modules
│   ├── context/            # React context for state management
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Helper functions
│   └── backend/            # Express.js server
│       ├── controllers/    # Route handlers
│       ├── models/         # MongoDB schemas
│       ├── routes/         # API routes
│       ├── middleware/     # Custom middleware
│       ├── validators/     # Input validation
│       ├── utils/          # Utility functions
│       └── logs/           # Application logs
├── public/                 # Static assets
└── package.json
```

## 🔧 Available Scripts

**Frontend:**
- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## 🌟 Key Improvements Made

### Security Enhancements
- Password strength validation
- Rate limiting on authentication endpoints
- Input sanitization and validation
- Security headers with Helmet
- Professional error handling

### Code Quality
- TypeScript type safety
- Error boundaries
- Centralized error handling
- Professional logging system
- API documentation

### User Experience
- Toast notifications
- Loading states
- Form validation
- Better error messages
- Responsive design

## 🚀 Deployment

1. Set environment variables for production
2. Build the frontend: `npm run build`
3. Deploy backend to your preferred hosting service
4. Deploy frontend build to static hosting
5. Update CORS settings for production domain

## 📝 Environment Variables

See `src/backend/.env.example` for required environment variables.

## 📄 License

This project is part of an internship program and is for educational purposes.

---

**Built with ❤️ for learning full-stack development with modern security practices**
