# SmartPOS Authentication Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ App.jsx                                                   │  │
│  │ - validateToken() on startup                             │  │
│  │ - Check token validity                                   │  │
│  │ - Auto-logout if expired                                │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           ↓                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Login/Signup Pages                                       │  │
│  │ - api.auth.login()                                       │  │
│  │ - api.auth.signup()                                      │  │
│  │ - api.auth.logout()                                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           ↓                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ API Service (services/api.js)                            │  │
│  │ - Adds Bearer token to headers                           │  │
│  │ - Handles errors (401 = logout)                          │  │
│  │ - localStorage: token, user                              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           ↓                                      │
└─────────────────────────────────────────────────────────────────┘
         HTTP + Authorization: Bearer <TOKEN>
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI)                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Auth Routes (routes/auth.py)                             │  │
│  │ POST   /auth/signup  → Create user                       │  │
│  │ POST   /auth/login   → Return JWT token                  │  │
│  │ GET    /auth/me      → Validate token                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           ↓                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Auth Guard (dependencies/auth_guard.py)                  │  │
│  │ - Verify JWT signature                                   │  │
│  │ - Check expiration                                       │  │
│  │ - Extract user data                                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           ↓                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Protected Routes                                         │  │
│  │ GET    /products                                         │  │
│  │ POST   /products                                         │  │
│  │ PUT    /products/{id}                                    │  │
│  │ DELETE /products/{id}                                    │  │
│  │ (All require valid token via auth_guard)                │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           ↓                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Database (MongoDB)                                       │  │
│  │ - users collection                                       │  │
│  │ - password: bcrypt hash                                  │  │
│  │ - products collection (protected)                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Request/Response Flow

### Signup Flow
```
Frontend Form
    ↓
[name, email, password]
    ↓
POST /auth/signup
    ↓
Backend: Check if user exists
    ├─ Yes → 400 "User already exists"
    └─ No → Hash password, insert into DB
    ↓
201 Created
{ message: "User created", success: true }
    ↓
Frontend: Redirect to login
```

### Login Flow
```
Frontend Form
    ↓
[email, password]
    ↓
POST /auth/login
    ↓
Backend: Find user
    ├─ Not found → 401 "Invalid email or password"
    └─ Found → Verify password
              ├─ Wrong → 401 "Invalid email or password"
              └─ Correct → Create JWT token
    ↓
200 OK
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: { email, name },
  success: true
}
    ↓
Frontend: Store token + user in localStorage
    ↓
Redirect to dashboard
```

### Protected Route Flow
```
Frontend requests GET /products
    ↓
Add header: Authorization: Bearer <TOKEN>
    ↓
Backend: Extract token from header
    ↓
Verify token:
    ├─ Invalid/Expired → 401 "Invalid token"
    ├─ Valid → Extract user email
    │
    └─ Fetch products for this user
    ↓
200 OK
[{ id, name, price, stock, ... }]
    ↓
Frontend: Display products
```

### Token Validation on Startup
```
App starts
    ↓
Check localStorage for token
    ├─ No token → Show login page
    └─ Token exists → GET /auth/me
              ↓
    Verify token with backend
              ├─ Valid → Get user data
              │   ↓
              │   Show dashboard
              └─ Invalid → Clear localStorage
                  ↓
                  Show login page
```

## JWT Token Structure

```
JWT Token = Header.Payload.Signature

Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "email": "john@example.com",
  "exp": 1234567890,  // Unix timestamp (2 hours from now)
  "iat": 1234567890   // Issued at
}

Signature: HMAC(Header + Payload, SECRET_KEY)

Complete Token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJleHAiOjE3MTQ5OTk5OTl9.signature_here
```

## Security Flow

```
┌─────────────────────────────────┐
│ Signup: Password Security       │
├─────────────────────────────────┤
│ 1. User enters password         │
│ 2. Frontend validates length    │
│ 3. Send to backend via HTTPS    │
│ 4. Backend: Hash with bcrypt    │
│ 5. Store hash in DB (not pwd)   │
│ 6. Never send password back     │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Login: Token Security           │
├─────────────────────────────────┤
│ 1. User submits credentials     │
│ 2. Backend verifies password    │
│ 3. Generate JWT token           │
│ 4. Sign with SECRET_KEY         │
│ 5. Send token to frontend       │
│ 6. Frontend stores in localStorage
│ 7. Include in all requests      │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Protected Routes: Verification  │
├─────────────────────────────────┤
│ 1. Request includes Authorization
│ 2. Backend extracts token       │
│ 3. Verify signature with secret │
│ 4. Check expiration time        │
│ 5. Extract user email from token
│ 6. Allow/Deny request           │
└─────────────────────────────────┘
```

## Files Involved

```
Backend:
├── app/
│   ├── routes/
│   │   └── auth.py           ← Auth endpoints
│   ├── dependencies/
│   │   └── auth_guard.py     ← Token verification
│   ├── utils/
│   │   ├── hash.py           ← Bcrypt functions
│   │   └── jwt.py            ← JWT creation/verification
│   ├── database.py           ← MongoDB connection
│   └── main.py               ← FastAPI app setup
├── .env                       ← Configuration
├── .env.example              ← Template
└── requirements.txt          ← Dependencies

Frontend:
├── src/
│   ├── services/
│   │   └── api.js            ← API calls + auth methods
│   ├── pages/
│   │   ├── Login.jsx         ← Login form
│   │   ├── Signup.jsx        ← Signup form
│   │   ├── Dashboard.jsx     ← Protected page
│   │   └── ...
│   └── App.jsx               ← Token validation on startup
└── localStorage              ← Stores token + user
```

## Data Flow Summary

```
User Registration
└─ User Data
   ├─ name
   ├─ email (unique)
   └─ password (bcrypt hash)
      ↓ stored in MongoDB

User Authentication
└─ Credentials (email, password)
   ├─ Verified against DB
   └─ Generate JWT token
      ├─ Contains: email, expiry
      ├─ Signed with SECRET_KEY
      └─ Valid for 2 hours

Protected Resources
└─ Token in Authorization header
   ├─ Signature verified
   ├─ Expiration checked
   ├─ User extracted from token
   └─ Allow access to resources
```

## Environment Variables

```
.env file:
├── SECRET_KEY          ← Sign tokens (keep secret!)
├── ALGORITHM           ← "HS256"
├── ACCESS_TOKEN_EXPIRE_HOURS ← "2"
├── MONGODB_URL         ← Database connection
└── ALLOWED_ORIGINS     ← Frontend domain
```

## Status Codes

```
200 OK                  ← Success (login, get user, etc.)
201 Created             ← Signup success
400 Bad Request         ← Invalid input, duplicate user
401 Unauthorized        ← Invalid credentials, expired token
403 Forbidden           ← Valid token but no permission
404 Not Found           ← User not found
500 Server Error        ← Backend error
```

## Common Security Issues & Solutions

```
Issue: Password visible in localStorage
Solution: Use httpOnly cookies (frontend framework dependent)

Issue: Token never expires
Solution: Check exp field in JWT (implemented: 2 hours)

Issue: Anyone can make unlimited login attempts
Solution: Add rate limiting (recommended)

Issue: Password too weak
Solution: Enforce minimum length (implemented: 6 chars)

Issue: No email verification
Solution: Send verification email on signup (recommended)

Issue: Token exposed in network traffic
Solution: Use HTTPS in production (REQUIRED)

Issue: JWT secret hardcoded
Solution: Use environment variables (implemented)
```
