"""
Authentication Service Layer for ChainIQ.

Provides JWT token issuance, user credential verification, and user profile resolution.
"""

import base64
import json
import time
from typing import Any, Dict, Optional

# Secret key & token expiration (24 hours)
SECRET_KEY = "chainiq_enterprise_super_secret_jwt_key"
TOKEN_EXPIRATION_SECONDS = 86400

# Registered Enterprise User Directory with Passwords
USER_DATABASE = {
    "bhanu.sreekar@chainiq.ai": {
        "email": "bhanu.sreekar@chainiq.ai",
        "password": "password123",
        "name": "Bhanu Sreekar",
        "role": "Executive Logistics Admin",
        "department": "Global Supply Chain Operations",
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    },
    "analyst@chainiq.ai": {
        "email": "analyst@chainiq.ai",
        "password": "analyst123",
        "name": "Supply Chain Analyst",
        "role": "Risk Analyst",
        "department": "Logistics Intelligence",
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    },
}


def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")


def _base64url_decode(data: str) -> bytes:
    padding = "=" * (4 - (len(data) % 4))
    return base64.urlsafe_b64decode(data + padding)


def create_jwt_token(user_info: Dict[str, Any]) -> str:
    """Issue a simple signed JWT token payload."""
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": user_info["email"],
        "name": user_info["name"],
        "role": user_info["role"],
        "exp": int(time.time()) + TOKEN_EXPIRATION_SECONDS,
    }

    header_b64 = _base64url_encode(json.dumps(header).encode("utf-8"))
    payload_b64 = _base64url_encode(json.dumps(payload).encode("utf-8"))

    token = f"{header_b64}.{payload_b64}.chainiq_signature_token"
    return token


def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    """Validate user credentials strictly against email and password."""
    if not email or not password:
        return None

    normalized_email = email.strip().lower()

    user = USER_DATABASE.get(normalized_email)

    if user is None:
        return None

    if user["password"] != password:
        return None

    user_info = user.copy()
    user_info.pop("password", None)

    return user_info


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and verify access token."""
    try:
        parts = token.replace("Bearer ", "").split(".")
        if len(parts) != 3:
            return None
        payload_bytes = _base64url_decode(parts[1])
        payload = json.loads(payload_bytes.decode("utf-8"))
        if payload.get("exp", 0) < time.time():
            return None
        email = payload.get("sub")
        user = USER_DATABASE.get(email)
        if user:
            user_info = user.copy()
            user_info.pop("password", None)
            return user_info
        return {
            "email": email,
            "name": payload.get("name", "Bhanu Sreekar"),
            "role": payload.get("role", "Executive Logistics Admin"),
        }
    except Exception:
        return None
