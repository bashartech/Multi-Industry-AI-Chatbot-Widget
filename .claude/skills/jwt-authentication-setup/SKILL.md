---
name: "jwt-authentication-setup"
description: "Set up a complete JWT-based authentication system with MongoDB user management, protected routes, role-based access control, and frontend authentication context. Use when user needs to implement comprehensive MERN stack authentication with JWT tokens, password hashing, and role-based permissions."
---

# JWT Authentication Setup Skill

## When to Use This Skill
- User wants to implement JWT-based authentication (not OAuth/external providers)
- User needs MongoDB user management with password hashing
- User requires role-based access control (admin/student)
- User wants protected routes and authentication context
- User needs to set up complete authentication flow from login/signup to database with JWT tokens
- User needs password encryption, token management, and user profile updates

## Procedure

### 1. Database Model Setup
1. **Create User Model** (`backend/models/User.js`):
   - Define Mongoose schema with fields: `email` (String, required, unique, lowercase), `password` (String, required, min 6 chars), `role` (String, enum ['student', 'admin'], default: 'student')
   - Add optional fields: `firstName`, `lastName`, `profilePicture`, `enrolledCourses` (array of Course ObjectIds)
   - Include `isActive` boolean field (default: true)
   - Add `timestamps: true` for createdAt/updatedAt
   - Implement pre-save middleware to hash passwords using bcrypt with 10 salt rounds
   - Create custom `comparePassword` method to compare plaintext with hashed password
   - Export as default Mongoose model

### 2. Backend Authentication Controller
1. **Create Auth Controller** (`backend/controllers/authController.js`):
   - Create `generateToken` helper function that signs JWT with user ID, secret from env var, 30-day expiration
   - Create `registerUser` function (POST /api/auth/register):
     - Validate email and password presence
     - Check if user already exists by email
     - Create new user with provided details (default role to 'student')
     - Return user data with JWT token
   - Create `loginUser` function (POST /api/auth/login):
     - Validate email and password presence
     - Find user by email
     - Compare password using model's `comparePassword` method
     - Return user data with JWT token
   - Create `getUserProfile` function (GET /api/auth/profile):
     - Find user by ID from request (exclude password)
     - Return user profile data
   - Create `updateUserProfile` function (PUT /api/auth/profile):
     - Find user by ID from request
     - Update allowed fields: email, firstName, lastName, profilePicture
     - Save updated user
     - Return updated user data

### 3. Authentication Middleware
1. **Create Auth Middleware** (`backend/middleware/auth.js`):
   - Create `protect` middleware that:
     - Extracts Bearer token from Authorization header
     - Verifies JWT using secret from environment variable
     - Finds user by decoded ID and attaches to request (excluding password)
     - Checks if user is active
     - Returns 401 for invalid/unauthorized requests
   - Create `adminOnly` middleware that restricts access to admin users only
   - Create `studentOnly` middleware that restricts access to student users only
   - Create `restrictTo` middleware for generic role restriction

### 4. Authentication Routes
1. **Create Auth Routes** (`backend/routes/auth.js`):
   - Use Express Router
   - POST `/api/auth/register` → `registerUser`
   - POST `/api/auth/login` → `loginUser`
   - GET `/api/auth/profile` → `getUserProfile` (protected)
   - PUT `/api/auth/profile` → `updateUserProfile` (protected)
   - Export default router

### 5. Frontend Authentication Service
1. **Create Auth Service** (`src/services/authService.ts`):
   - Define TypeScript interfaces: `UserProfile`, `LoginCredentials`, `RegisterData`, `LoginResponse`, `RegisterResponse`
   - Create axios instance with base URL from environment variable
   - Add request interceptor to include JWT token in Authorization header from localStorage
   - Add response interceptor to handle 401 responses by removing token and redirecting to login
   - Implement service methods: `register`, `login`, `getCurrentUser`, `updateProfile`, `logout`
   - Export default axios instance

### 6. Authentication Context
1. **Create Auth Context** (`src/context/AuthContext.tsx`):
   - Define `AuthContextType` interface with user state, role, login, register, logout, updateProfile, isAuthenticated, loading
   - Create context with `createContext<AuthContextType>`
   - Create `useAuth` hook that throws error if not used within provider
   - Create `AuthProvider` component that:
     - Manages user, role, loading states with useState
     - Uses useEffect to check for existing token on initial load and verify user
     - Implements login function that calls authService.login, saves token, sets user state
     - Implements register function that calls authService.register, saves token, sets user state
     - Implements logout function that removes token, clears user state
     - Implements updateProfile function that updates user profile and state
     - Exposes value with all auth functions and states

### 7. UI Components
1. **Create Login Component** (`src/components/Login.tsx`):
   - Form with email and password fields
   - State management for form data, error, loading
   - Handle form submission with validation and error handling
   - Call auth context login method
   - Redirect based on user role (admin/student)
   - Link to register page
   - Loading and error states

2. **Create Register Component** (`src/components/Register.tsx`):
   - Form with email, password, firstName, lastName, role selection
   - State management for form data, error, loading
   - Handle form submission with validation and error handling
   - Call auth context register method
   - Redirect based on user role (admin/student)
   - Link to login page
   - Loading and error states

3. **Create Profile Component** (`src/components/Profile.tsx`):
   - Display user profile information
   - Form for updating profile fields
   - Use auth context updateProfile method
   - Loading and error states

4. **Create Protected Route Component** (`src/components/ProtectedRoute.tsx`):
   - Accept children and role props
   - Check authentication status
   - Validate user role if specified
   - Show loading state during auth checks
   - Redirect unauthorized users
   - Render children for authorized users

### 8. Environment Configuration
1. **Configure Environment Variables**:
   - Backend: `JWT_SECRET` for token signing, `MONGODB_URI` for database connection
   - Frontend: `VITE_API_URL` for backend API base URL
   - Example backend `.env`:
     ```
     JWT_SECRET=your_jwt_secret_key_here
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
     ```
   - Example frontend `.env`:
     ```
     VITE_API_URL=http://localhost:5000
     ```

### 9. Integration Points
1. **Connect Backend Routes**:
   - Import auth routes in main server file
   - Mount at `/api/auth` path: `app.use('/api/auth', authRoutes)`
   - Ensure routes are loaded before other API routes

2. **Connect Frontend**:
   - Wrap main App component with `AuthProvider`
   - Use `useAuth` hook in components that need authentication
   - Apply `ProtectedRoute` to restricted pages

## Output Format

**Backend Files Created/Modified**:
- `backend/models/User.js` - Complete user schema with password hashing and comparison methods
- `backend/controllers/authController.js` - Full authentication logic with JWT generation, login, registration, profile management
- `backend/middleware/auth.js` - Authentication and role-based access control middleware
- `backend/routes/auth.js` - Authentication API routes
- `backend/server.js` - Route integration and configuration

**Frontend Files Created/Modified**:
- `src/services/authService.ts` - API service with JWT token management and axios interceptors
- `src/context/AuthContext.tsx` - Authentication state management with login, register, logout functionality
- `src/components/Login.tsx` - Login form with validation and error handling
- `src/components/Register.tsx` - Registration form with role selection
- `src/components/Profile.tsx` - User profile display and update functionality
- `src/components/ProtectedRoute.tsx` - Route protection with role-based access control
- `src/App.tsx` - AuthProvider integration and protected route configuration

**Configuration Files**:
- Backend `.env` with JWT secret and MongoDB URI
- Frontend `.env` with API URL configuration

## Quality Criteria
- Passwords securely hashed using bcrypt with 10 salt rounds
- JWT tokens properly signed with secret key and appropriate expiration
- User data validated and sanitized before database operations
- Authentication state properly managed across the entire application
- Protected routes correctly restrict access with proper loading states
- Role-based access control enforced at both frontend and backend
- Comprehensive error handling for authentication failures and network issues
- Proper loading states during authentication operations
- Secure token storage and transmission with proper header management
- Clean separation between authentication logic and application components
- Input validation and sanitization at all entry points
- Consistent user experience during authentication flows

## Example

**Input**: "Set up complete JWT authentication system with MongoDB, protected routes, role-based access, and error handling"

**Output**:
- Complete JWT-based authentication system with secure password handling
- Backend verification of JWT tokens with proper middleware
- User data persisted in MongoDB with password hashing and role management
- Protected routes that require authentication with role-based restrictions
- User profile accessible throughout the application via AuthContext
- Comprehensive error handling for all authentication scenarios
- Secure token management with JWT stored in localStorage
- Proper environment configuration for development and production
- API service configured for authenticated requests with token refresh
- Frontend components for login, registration, and profile management
- Role-based access controls with admin and student permissions