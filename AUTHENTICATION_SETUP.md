# SmartPOS Authentication Setup Guide

## ✅ What's Been Implemented

### Backend Improvements
1. **Proper HTTP Status Codes**
   - 201: Signup successful
   - 400: Bad request (duplicate user, weak password)
   - 401: Unauthorized (invalid credentials)
   - 404: User not found

2. **Enhanced Auth Routes**
   ```
   POST /auth/signup    - Register new user
   POST /auth/login     - Login with email/password
   GET  /auth/me        - Validate token & get user data
   ```

3. **User Data with Token**
   - Returns `{ token, user: { email, name }, success: true }`
   - User info stored on frontend in localStorage

4. **Environment Variables**
   - Secret key moved to `.env` file (not hardcoded)
   - Configurable token expiry
   - Database URL in config

5. **Password Validation**
   - Minimum 6 characters required
   - Bcrypt hashing with salt

### Frontend Improvements
1. **Token Validation on App Startup**
   - Checks if token is still valid
   - Automatically logs out if expired
   - Shows loading screen while validating

2. **Better Error Messages**
   - Specific error messages from backend
   - User-friendly error display

3. **User Data Management**
   - Stores user info in localStorage
   - User name displayed in navbar/sidebar

4. **New Auth Methods**
   - `api.auth.login()` - Login
   - `api.auth.signup()` - Register
   - `api.auth.validateToken()` - Check if logged in
   - `api.auth.logout()` - Logout

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

### 3. Run Backend
```bash
cd backend
uvicorn app.main:app --reload
```

### 4. Test Authentication
**Signup:**
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "john@example.com",
    "name": "John Doe"
  },
  "success": true
}
```

**Validate Token:**
```bash
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer <TOKEN_HERE>"
```

## 🔒 Security Recommendations

### Phase 1: Complete (Essential)
- ✅ Environment variables for secrets
- ✅ Proper HTTP status codes
- ✅ Password hashing with bcrypt
- ✅ JWT token validation

### Phase 2: Recommended for Production
- [ ] Email verification on signup
- [ ] Password strength meter (frontend)
- [ ] Rate limiting on login (5 attempts → 15 min lockout)
- [ ] Refresh token strategy (current tokens valid for 2 hours)
- [ ] HTTPS only (in production)
- [ ] Secure cookies for tokens (instead of localStorage)

### Phase 3: Advanced (Optional)
- [ ] Two-factor authentication (2FA)
- [ ] OAuth integration (Google, GitHub login)
- [ ] Password reset via email
- [ ] Session management (remember me)
- [ ] Audit logging (track login attempts)

## 🐛 Known Limitations & Future Improvements

1. **Token Storage**
   - Currently: localStorage (vulnerable to XSS)
   - Better: Secure httpOnly cookies
   - Recommendation: Use third-party auth library

2. **No Refresh Tokens**
   - Users get logged out after 2 hours
   - Add refresh token endpoint + rotation logic

3. **No Rate Limiting**
   - Anyone can try unlimited login attempts
   - Add: Redis-based rate limiter

4. **No Email Verification**
   - Signup doesn't verify email exists
   - Add: Verification email with OTP

## 📝 How It Works

### Login Flow
```
User enters email/password
        ↓
Frontend: POST /auth/login
        ↓
Backend: Find user, verify password, create JWT
        ↓
Return: { token, user, success }
        ↓
Frontend: Store token + user in localStorage
        ↓
Frontend: Redirect to dashboard
```

### Protected Route Flow
```
Frontend requests /products (with token)
        ↓
Backend: Check Authorization header
        ↓
Backend: Verify JWT signature & expiry
        ↓
Valid: Return products data
Invalid/Expired: Return 401 Unauthorized
        ↓
Frontend: Logout if 401, show error
```

## 🧪 Test Scenarios

### Test 1: Successful Login
1. Go to login page
2. Enter: `john@example.com` / `password123`
3. Expected: Redirect to dashboard

### Test 2: Invalid Password
1. Enter wrong password
2. Expected: Error message "Invalid email or password"

### Test 3: Non-existent User
1. Enter non-registered email
2. Expected: Error message "Invalid email or password"

### Test 4: Token Expiration
1. Login, wait 2+ hours
2. Refresh page
3. Expected: Auto logout, redirect to login

### Test 5: Duplicate Signup
1. Try signup with existing email
2. Expected: Error "User with this email already exists"

## 📞 Troubleshooting

**"Could not connect to backend"**
- Check: `python -c "import uvicorn; uvicorn.run('app.main:app')"` running on port 8000

**"Invalid token"**
- Check: Token is valid (not expired, correct format)
- Solution: Clear localStorage, login again

**"CORS error"**
- Check: Backend CORS is configured for your frontend URL
- Solution: Update ALLOWED_ORIGINS in .env

**"User not found after login"**
- Check: MongoDB is running
- Solution: Reseed database: `python backend/seed_products.py`
