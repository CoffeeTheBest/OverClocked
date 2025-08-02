# OverClocked - Gaming Hardware E-commerce Platform

> Your ultimate online store for RTX graphics cards, AMD processors, NVIDIA beasts, and all things gaming.

## 🚀 Features


- **User Authentication**: Secure JWT-based login/signup with role-based access
- **Product Management**: Full CRUD operations for gaming hardware products
- **Shopping Cart**: Add, remove, and checkout functionality
- **Payment Processing**: Stripe integration for secure payments
- **Order Management**: Complete order lifecycle with status tracking
- **Admin Dashboard**: Product inventory management
- **Responsive Design**: Modern cyberpunk-themed UI with CSS modules
- **Security**: Rate limiting, input validation, password strength requirements
- **Professional Logging**: Organized Winston-based logging system with separate log files
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
- Stripe Elements for payment processing

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- Winston for organized logging
- Helmet for security headers
- Express Rate Limit for API protection
- Express Validator for input validation
- Swagger for API documentation
- Stripe for payment processing

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Stripe account for payments
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/CoffeeTheBest/OverClocked
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

**Backend (.env in src/backend/):**
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/overclocked
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
HTTPS=false
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

**Frontend (.env in root directory):**
```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
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

- **Password Requirements**: 10+ characters with uppercase, lowercase, numbers, and special characters
- **Rate Limiting**: 100 requests per 15 minutes, 5 login attempts per 15 minutes
- **Input Validation**: Server-side validation for all endpoints
- **Security Headers**: Helmet.js for secure HTTP headers
- **JWT Token Expiration**: 1-hour token validity
- **CORS Configuration**: Proper cross-origin request handling
- **Cookie Security**: HttpOnly, Secure, SameSite cookies
- **Payment Security**: PCI DSS compliant payment processing

## 📊 Logging System

The application features an organized logging system with separate log files for different types of events:

### Log Files
- **`general.log`** - General application activities
- **`payments.log`** - Payment-related activities (Stripe events)
- **`auth.log`** - User authentication (login, signup, logout)
- **`orders.log`** - Order management (creation, updates, retrieval)
- **`products.log`** - Product management activities
- **`errors.log`** - Application errors and exceptions
- **`security.log`** - Security events (failed logins, lockouts)
- **`api.log`** - API requests and responses

### Log Management Commands
```bash
# List all log files with descriptions
npm run logs:list

# View specific log types
npm run logs:view payments
npm run logs:view auth
npm run logs:view orders

# Search for specific events
npm run logs:search auth "login failed"
npm run logs:search payments "payment failed"

# Get statistics
npm run logs:stats

# Clean old logs
npm run logs:clean
```

## 🎨 Project Structure

```
OverClocked/
├── src/
│   ├── pages/              # React page components
│   │   ├── Login.tsx       # User authentication
│   │   ├── Signup.tsx      # User registration
│   │   ├── Home.tsx        # Landing page
│   │   ├── Products.tsx    # Product catalog
│   │   ├── Cart.tsx        # Shopping cart
│   │   ├── UserDashboard.tsx # User profile
│   │   └── AdminDashboard.tsx # Admin panel
│   ├── components/         # Reusable React components
│   │   ├── PaymentForm.tsx # Stripe payment form
│   │   ├── ProductCard.tsx # Product display
│   │   └── Navigation.tsx  # Navigation bar
│   ├── styles/             # CSS modules
│   ├── context/            # React context for state management
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Helper functions
│   └── backend/            # Express.js server
│       ├── controllers/    # Route handlers
│       │   ├── authController.js
│       │   ├── productController.js
│       │   └── orderController.js
│       ├── models/         # MongoDB schemas
│       │   ├── User.js
│       │   ├── Product.js
│       │   └── Order.js
│       ├── routes/         # API routes
│       ├── middleware/     # Custom middleware
│       ├── validators/     # Input validation
│       ├── utils/          # Utility functions
│       │   └── logger.js   # Organized logging system
│       ├── scripts/        # Log management scripts
│       └── logs/           # Application logs (separated by type)
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
- `npm run logs:list` - List all log files
- `npm run logs:view [type]` - View specific log type
- `npm run logs:search [type] [term]` - Search logs
- `npm run logs:stats` - Show log statistics
- `npm run logs:clean` - Clean old logs

## 💳 Payment Integration

The application includes full Stripe payment integration:

- **Payment Intent Creation**: Secure payment intent generation
- **Card Element Integration**: Stripe Elements for secure card input
- **Address Management**: Shipping address collection and storage
- **Order Processing**: Complete order lifecycle with payment verification
- **Error Handling**: Comprehensive payment error handling
- **Security**: PCI DSS compliant payment processing

## 🌟 Key Improvements Made

### Security Enhancements
- Password strength validation (10+ characters)
- Rate limiting on authentication endpoints
- Input sanitization and validation
- Security headers with Helmet
- Professional error handling
- Stripe payment security

### Code Quality
- TypeScript type safety
- Error boundaries
- Centralized error handling
- Organized logging system with separate files
- API documentation
- Comprehensive testing

### User Experience
- Toast notifications
- Loading states
- Form validation
- Better error messages
- Responsive design
- Payment form with address management

### Logging System
- Separate log files for different concerns
- Easy log management commands
- Search functionality
- Log rotation and cleanup
- Security event tracking
- Payment activity monitoring

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
   ```bash
   NODE_ENV=production
   HTTPS=true
   CORS_ORIGIN=https://your-domain.com
   STRIPE_SECRET_KEY=sk_live_your_live_key
   ```

2. **Build Frontend**
   ```bash
   npm run build
   ```

3. **Deploy Backend**
   - Deploy to your preferred hosting service (Heroku, AWS, etc.)
   - Set up MongoDB Atlas or similar
   - Configure environment variables

4. **Deploy Frontend**
   - Deploy build folder to static hosting (Netlify, Vercel, etc.)
   - Update API base URL to production backend

5. **SSL Certificate**
   - Ensure HTTPS is enabled
   - Set up SSL certificate for your domain

## 🔍 Troubleshooting

### Common Issues

1. **"Failed to initialize payment"**
   - Check if backend server is running
   - Verify Stripe keys are correct
   - Ensure user is logged in

2. **"Unknown error"**
   - Check browser console for detailed errors
   - Verify all environment variables are set
   - Check log files for server errors

3. **Authentication Issues**
   - Clear browser cookies
   - Check JWT_SECRET is set
   - Verify HTTPS settings

### Log Analysis
```bash
# Check for payment errors
npm run logs:view payments

# Check for authentication errors
npm run logs:view auth

# Search for specific errors
npm run logs:search errors "payment"
```

## 📄 License

This project is part of an internship program and is for educational purposes.

---

**Built with ❤️ for learning full-stack development with modern security practices and professional logging**
