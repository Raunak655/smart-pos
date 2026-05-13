# SmartPOS Authentication - Quick Reference

## API Endpoints

### Signup
```
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "message": "User created successfully. Please login.",
  "success": true
}

Errors:
- 400: User already exists
- 400: Password too short
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "john@example.com",
    "name": "John Doe"
  },
  "success": true
}

Errors:
- 401: Invalid email or password
```

### Validate Token
```
GET /auth/me
Authorization: Bearer <TOKEN>

Response: 200 OK
{
  "email": "john@example.com",
  "name": "John Doe",
  "success": true
}

Errors:
- 401: Invalid token
```

## Frontend Usage

### Login
```javascript
const res = await api.auth.login("john@example.com", "password123");
// Returns: { token, user, success }
// Auto-stores token + user in localStorage
```

### Check if Logged In
```javascript
const user = await api.auth.validateToken();
if (user) {
  // Logged in, user object has: { email, name }
} else {
  // Not logged in, redirect to login
}
```

### Logout
```javascript
await api.auth.logout();
// Clears localStorage, redirects to login
```

## Token Format
- **Type**: JWT (JSON Web Token)
- **Expiry**: 2 hours
- **Storage**: localStorage (key: "token")
- **Usage**: Add to all protected requests
  ```
  Authorization: Bearer <TOKEN_HERE>
  ```

## User Data Format
```javascript
{
  email: "john@example.com",
  name: "John Doe"
}
```

## Protected Routes
All these endpoints require `Authorization: Bearer <TOKEN>` header:
- GET /products
- POST /products
- PUT /products/{id}
- DELETE /products/{id}
- GET /billing
- POST /billing/generateBill
- GET /analytics/*

If token is invalid/expired:
- Response: 401 Unauthorized
- Frontend: Auto logout + redirect to login

## Workflow

### First Time (Signup)
```
1. User clicks "Create Account"
2. Fills name, email, password
3. Frontend: POST /auth/signup
4. Success: Redirect to login page
5. User logs in with credentials
```

### Regular Login
```
1. User visits app
2. Frontend: GET /auth/me (validate existing token)
3. Token valid: Show dashboard
4. Token invalid: Show login page
5. User enters email/password
6. Frontend: POST /auth/login
7. Success: Store token + redirect to dashboard
```

### Token Expiration
```
1. User is logged in
2. After 2 hours: Token expires
3. Next request: 401 response
4. Frontend: Clear localStorage, redirect to login
5. User must login again
```

## Security Best Practices

✅ **Good Practices (Implemented)**
- Password hashing with bcrypt
- JWT token with signature
- HTTP status codes (401, 403, 400, 500)
- Password minimum length (6 chars)
- Environment variables for secrets

⚠️ **To Improve**
- Email verification on signup
- Rate limiting on login (prevent brute force)
- Refresh tokens (extend session without re-login)
- HTTPS only (in production)
- Secure httpOnly cookies (instead of localStorage)

🔒 **For Production**
- Generate strong SECRET_KEY (50+ chars)
- Set DEBUG=False
- Use HTTPS only
- Implement rate limiting
- Add email verification
- Enable CORS only for your frontend domain

## Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid email or password" | Wrong email or password | Check credentials |
| "User with this email already exists" | Email already registered | Use different email or login |
| "Password must be at least 6 characters" | Password too short | Use longer password |
| "Invalid token" | Token expired or corrupted | Login again |
| "CORS error" | Frontend not in allowed origins | Check .env ALLOWED_ORIGINS |
| "Cannot connect to backend" | Backend not running | Start: `uvicorn app.main:app --reload` |

## Testing Checklist

- [ ] Can signup with new email
- [ ] Cannot signup with duplicate email
- [ ] Cannot signup with password < 6 chars
- [ ] Can login with correct credentials
- [ ] Cannot login with wrong password
- [ ] Cannot login with non-existent email
- [ ] Token auto-validated on app startup
- [ ] Auto-logout if token expired
- [ ] User data displays in navbar
- [ ] Can logout successfully
- [ ] Protected routes require token
