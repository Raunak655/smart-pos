# from django.db import router
# from fastapi import Depends, HTTPException
# from fastapi.security import HTTPBearer
# from jose import jwt
# from app.utils.jwt import SECRET_KEY
# # from app.dependencies.auth_guard import get_current_user

# security = HTTPBearer()

# def verify_token(token=Depends(security)):
#     try:
#         payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=["HS256"])
#         return payload
#     except:
#         raise HTTPException(status_code=401, detail="Invalid token")
# @router.get("/protected")
# def protected(user=Depends(get_current_user)):
#     return {
#         "msg": "Authorized",
#         "user": user
#     }
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from app.utils.jwt import SECRET_KEY

security = HTTPBearer()

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return verify_token(credentials.credentials)