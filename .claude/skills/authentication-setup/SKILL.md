---
name: "authentication-setup"
description: "Set up a complete authentication system with Clerk for authentication, backend verification, MongoDB user synchronization, protected routes, and authenticated data display. Use when user needs to implement comprehensive MERN stack authentication with Clerk integration."
---

# Authentication Setup Skill

## When to Use This Skill
- User wants to implement comprehensive authentication with Clerk
- User needs backend verification of Clerk tokens
- User requires MongoDB user synchronization with Clerk data
- User wants protected routes and authenticated data display
- User needs to set up complete authentication flow from frontend to backend with fallback mechanisms
- User needs to handle Clerk token verification, user profile sync, and internal JWT generation

## Procedure

### 1. Frontend Setup
1. **Install Clerk Dependencies**:
   - `npm install @clerk/clerk-react @clerk/clerk-js`
   - `npm install @clerk/backend` (for backend verification)

2. **Configure Environment Variables**:
   - Add `VITE_CLERK_PUBLISHABLE_KEY` to frontend .env
   - Add `VITE_BACKEND_URL` for API communication
   - Example:
     ```
     VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
     VITE_BACKEND_URL=http://localhost:5000
     ```

3. **Configure Clerk in Main App Component**:
   - Wrap application with `<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>`
   - Ensure ClerkProvider is at the top level of the application
   - Set up proper fallback for when Clerk is not loaded

4. **Create Comprehensive AuthContext**:
   - Define TypeScript interfaces for `UserType` and `AuthContextType`
   - Include fields: `_id`, `clerkId`, `email`, `username`, `firstName`, `lastName`, `avatar`, `role`, `preferences`, etc.
   - State management for: `user`, `token`, `loading`, `isAuthenticated`, `isClerkLoaded`, `clerkUser`, `hasBackendSyncFailed`, `isBackendSyncInProgress`
   - Implement `syncUserWithBackend` function that:
     - Gets Clerk JWT token using `getToken()`
     - Makes POST request to `/api/auth/profile` with `Authorization: Bearer {clerkToken}`
     - Stores internal JWT token in localStorage and sets as default axios header
     - Updates authUser state with backend response
     - Handles fallback user creation if backend sync fails
   - Implement `verifyToken` function that:
     - Checks existing internal token against backend `/api/auth/verify`
     - Updates authUser state with verified user data
     - Handles fallback scenarios when token verification fails
   - Use useEffect hooks to handle:
     - Initial token verification when app loads
     - Clerk authentication state changes (sign in/sign out)
     - Backend sync process management
   - Define authentication status logic: `isAuthenticated: !!authUser && !!token && !hasBackendSyncFailed`

5. **Create Login Page**:
   - Use Clerk's `SignIn` component with proper configuration
   - Include routing, redirect URLs, and appearance customization
   - Implement loading states with proper UI during authentication checks
   - Add navigation to signup page
   - Redirect to dashboard when already authenticated
   - Handle Clerk loading states using `useAuth()` context

6. **Create Signup Page**:
   - Use Clerk's `SignUp` component with proper configuration
   - Include routing, redirect URLs, and appearance customization
   - Implement loading states with proper UI during authentication checks
   - Add navigation to login page
   - Redirect to dashboard when already authenticated
   - Handle Clerk loading states using `useAuth()` context

7. **Create Protected Route Component**:
   - Accept children and check authentication status
   - Display loading state while checking authentication
   - Use auth context values: `loading`, `isClerkLoaded`, `isClerkSignedIn`, `hasBackendSyncFailed`
   - Determine authorization: `isAuthorized = isClerkSignedIn && !hasBackendSyncFailed`
   - Redirect to `/login` if not authorized
   - Render children if authorized

8. **Create API Client Utility**:
   - Create `src/utils/api.ts` with methods for GET, POST, PUT, DELETE
   - Include authentication token in Authorization header for Clerk tokens
   - Include x-auth-token header for internal JWT tokens
   - Support both Clerk Bearer tokens and internal x-auth-token format
   - Include admin-specific API methods with proper authentication headers
   - Handle proper content-type headers and request options

### 2. Backend Setup
1. **Install Backend Dependencies**:
   - `npm install @clerk/backend jsonwebtoken mongoose`
   - `npm install @clerk/express` (if using Express middleware)
   - Install other required packages: `cors`, `express`, `dotenv`

2. **Configure Environment Variables**:
   - Set up `CLERK_SECRET_KEY` for backend token verification
   - Set up `CLERK_PUBLISHABLE_KEY` for frontend
   - Configure `JWT_SECRET` for internal token generation (use strong secret)
   - Set up `MONGODB_URI` for database connection
   - Configure `VITE_BACKEND_URL` for frontend API calls
   - Example:
     ```
     CLERK_SECRET_KEY=sk_test_...
     CLERK_PUBLISHABLE_KEY=pk_test_...
     JWT_SECRET=your_strong_secret_here
     MONGODB_URI=mongodb+srv://...
     VITE_BACKEND_URL=http://localhost:5000
     ```

3. **Create Comprehensive User Model**:
   - Use Mongoose schema with fields:
     - `clerkId`: String, required: true, unique: true (primary identifier from Clerk)
     - `email`: String, required: false, unique: false (optional, can be empty)
     - `username`: String, unique: true, trim: true, minlength: 3, maxlength: 30
     - `firstName`, `lastName`: String with trim and maxlength
     - `avatar`: String with default value
     - `role`: String enum ['user', 'admin'], default: 'user'
     - `isActive`: Boolean, default: true
     - `lastLoginAt`: Date field
     - `preferences`: Nested object with theme, fontSize, language
   - Add `timestamps: true` for createdAt/updatedAt
   - Add indexes: `userSchema.index({ role: 1 })` for role-based queries
   - Create instance method `updateLastLogin()` that updates lastLoginAt and saves user
   - Export as default Mongoose model

4. **Create Auth Controller with Error Handling**:
   - Create helper function `fetchClerkUser(clerkId)` that:
     - Creates Clerk client with `createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })`
     - Fetches user from Clerk API: `clerkClient.users.getUser(clerkId)`
     - Maps Clerk API response to standardized user object with clerkId, email, firstName, lastName, avatar, username
     - Handles errors gracefully and returns null on failure
   - Create `getUserProfile` function (POST /api/auth/profile):
     - Extract Clerk JWT from `req.headers.authorization` (remove 'Bearer ' prefix)
     - Verify Clerk token using `verifyClerkToken()` with secret key and clock skew tolerance
     - Handle clock skew errors by decoding JWT manually as fallback
     - Extract user claims (sub, email, first_name, last_name, etc.)
     - Fetch complete user profile from Clerk API using helper function
     - Use Clerk API data if available, fall back to JWT claims
     - Check if user exists in database using `User.findOne({ clerkId })`
     - If user doesn't exist: create new user with Clerk data, handle duplicate key errors
     - If user exists: update user fields with fresh Clerk data, update last login
     - Generate internal JWT using `jwt.sign()` with userId, clerkId, email and expiration
     - Return success response with internal token and user data
     - Include comprehensive error handling for all scenarios
   - Create `verifyToken` function (GET /api/auth/verify):
     - Extract internal JWT from `req.header('x-auth-token')`
     - Verify token using `jwt.verify()` with JWT_SECRET
     - Find user in database by decoded userId
     - Return user data if valid, error if invalid
   - Create `getUserByClerkId` function (GET /api/auth/user/:clerkId):
     - Find user by clerkId parameter
     - Return user data or not found error

5. **Create Auth Routes**:
   - Create `backend/routes/auth.js` using Express Router
   - POST `/profile` route for user sync and token generation
   - GET `/verify` route for token validation
   - GET `/user/:clerkId` route for user lookup by Clerk ID
   - Export default router

6. **Integrate Auth Routes in Main Server**:
   - Import auth routes in main server file
   - Mount at `/api/auth` path: `app.use('/api/auth', authRoutes)`
   - Ensure routes are loaded before other API routes

### 3. Advanced Integration Features
1. **Handle Authentication State Management**:
   - Implement loading states during Clerk initialization
   - Handle backend sync in progress states
   - Implement fallback user creation when backend sync fails
   - Manage token verification and renewal processes
   - Handle sign-out procedures (clear localStorage, remove axios headers)

2. **Error Handling and Fallbacks**:
   - Handle Clerk token verification failures
   - Implement fallback user objects when backend sync fails
   - Manage clock skew issues in JWT verification
   - Handle MongoDB duplicate key errors during user creation
   - Gracefully degrade when services are temporarily unavailable

3. **Security Measures**:
   - Validate Clerk tokens before trusting user data
   - Use secure JWT signing with strong secrets
   - Implement proper CORS configuration
   - Sanitize user input and prevent injection attacks
   - Use HTTPS in production environments

4. **Data Consistency**:
   - Synchronize user data between Clerk and internal database
   - Update user profiles when Clerk data changes
   - Maintain consistent user identifiers (clerkId as primary reference)
   - Handle username length constraints (max 30 characters)

## Output Format

**Frontend Files Created/Modified**:
- `src/contexts/AuthContext.tsx` - Comprehensive authentication context with state management, Clerk integration, token handling, and fallback mechanisms
- `src/pages/Login.tsx` - Login page with Clerk SignIn component, loading states, and redirects
- `src/pages/Signup.tsx` - Signup page with Clerk SignUp component, loading states, and redirects
- `src/utils/api.ts` - API client utility with proper authentication headers for both Clerk and internal tokens
- `src/components/ProtectedRoute.tsx` - Route protection component with authentication checks
- `src/App.tsx` - ClerkProvider integration and route configuration

**Backend Files Created/Modified**:
- `backend/models/User.js` - Complete user schema with clerkId, email, username, profile fields, preferences, and methods
- `backend/controllers/authController.js` - Full authentication logic with Clerk verification, user sync, JWT generation, and error handling
- `backend/routes/auth.js` - Authentication API routes
- `backend/server.js` - Route integration and configuration

**Configuration Files**:
- Frontend `.env` with Clerk publishable key and backend URL
- Backend `.env` with Clerk secret key, JWT secret, MongoDB URI, and other configurations

## Quality Criteria
- Authentication state properly managed across the entire application with loading states
- Clerk tokens verified and synchronized with backend database
- User data persisted in MongoDB with clerkId as primary reference and consistent mapping
- Protected routes correctly restrict access with proper loading states
- Comprehensive error handling for authentication failures, network issues, and service degradations
- Proper loading states during Clerk initialization, token verification, and backend sync
- Secure token storage and transmission with proper header management
- Clean separation between Clerk authentication and application logic
- Fallback mechanisms for when backend services are unavailable
- Clock skew tolerance for JWT verification in development environments
- Proper user data validation and sanitization
- Consistent user experience during authentication flows

## Example

**Input**: "Set up complete MERN authentication with Clerk, MongoDB user sync, protected routes, and error handling"

**Output**:
- Complete authentication system with Clerk for identity management
- Backend verification of Clerk tokens with fallback mechanisms
- Real-time user synchronization between Clerk and MongoDB
- Protected routes that require authentication with proper loading states
- User data accessible throughout the application via AuthContext
- Comprehensive error handling for all authentication scenarios
- Secure token management with both Clerk and internal JWT systems
- Proper environment configuration for development and production
- API client configured for authenticated requests
- Fallback user creation when backend sync fails
- Last login tracking and user profile updates
- Role-based access controls with admin capabilities