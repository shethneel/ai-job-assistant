from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_db
from app.models import User, UserProfile
from app.schemas import UserProfileRead, UserProfileUpdate
from app.api.routes_auth import get_current_user  # same pattern as other routes

router = APIRouter(
    prefix="/user/profile",
    tags=["user-profile"],
)


@router.get("", response_model=UserProfileRead)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserProfileRead:
    profile = db.exec(
        select(UserProfile).where(UserProfile.user_id == current_user.id)
    ).one_or_none()

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found for this user.",
        )

    return profile


@router.put("", response_model=UserProfileRead)
def upsert_my_profile(
    payload: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserProfileRead:
    data = payload.dict(exclude_unset=True)

    # find existing profile
    profile = db.exec(
        select(UserProfile).where(UserProfile.user_id == current_user.id)
    ).one_or_none()

    if profile is None:
        # create new
        profile = UserProfile(
            user_id=current_user.id,
            **data,
        )
        db.add(profile)
    else:
        # update existing fields
        for field_name, value in data.items():
            setattr(profile, field_name, value)

        profile.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(profile)
    return profile
