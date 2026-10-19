from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.auth import UserRegister, UserLogin, TokenResponse, RegisterSuccessResponse


class AuthService:
    @staticmethod
    def register_user(db: Session, user_in: UserRegister) -> RegisterSuccessResponse:
        """Register a new user account if email is not already taken"""
        existing_user = db.query(User).filter(User.email == user_in.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered",
            )

        new_user = User(
            email=user_in.email,
            hashed_password=hash_password(user_in.password),
            full_name=user_in.full_name,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return RegisterSuccessResponse(
            message="Account created successfully! Please sign in to continue.",
            email=new_user.email,
        )

    @staticmethod
    def authenticate_user(db: Session, login_data: UserLogin) -> TokenResponse:
        """Verify user credentials and generate JWT access token"""
        user = db.query(User).filter(User.email == login_data.email).first()
        if not user or not verify_password(login_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email}
        )

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=user,
        )
