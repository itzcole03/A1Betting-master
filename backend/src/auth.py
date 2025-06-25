from datetime import datetime, timedelta
from typing import Any, Dict, Optional

import jwt
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

SECRET_KEY = "your-secret-key"  # TODO: Use env var in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

auth_router = APIRouter()

# Stub user database
FAKE_USERS_DB = {
    "admin": {
        "id": "1",
        "username": "admin",
        "email": "admin@example.com",
        "password": "password",  # In production, store hashed passwords!
    }
}


class User(BaseModel):
    id: str
    username: str
    email: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: User


def verify_user(username: str, password: str) -> Optional[Dict[str, Any]]:
    user = FAKE_USERS_DB.get(username)
    if user and user["password"] == password:
        return user
    return None


@auth_router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = verify_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": user["username"], "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return {
        "access_token": encoded_jwt,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
        },
    }
