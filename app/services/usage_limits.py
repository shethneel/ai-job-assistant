# app/services/usage_limits.py
from datetime import datetime
from typing import Dict, Optional

from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.models import UsageLog

# Central place for daily limits per action
DAILY_LIMITS: Dict[str, int] = {
    "resume_improve": 5,
    "cover_letter_saved": 5,
    "job_match_saved": 10,
    "tailor_saved": 5,
}


def _start_of_utc_day(now: datetime) -> datetime:
    """Return the UTC start of the current day."""
    return datetime(year=now.year, month=now.month, day=now.day)


def check_and_record_usage(
    db: Session,
    user_id: int,
    action: str,
    limit: Optional[int] = None,
) -> None:
    """
    Check if the user has exceeded today's limit for the given action.
    If not, record one usage.

    - If `limit` is provided, use that.
    - Otherwise, look up the limit from DAILY_LIMITS[action].

    Raises HTTPException(429) when over limit.
    """

    # If caller didn't pass limit explicitly, pull from DAILY_LIMITS
    if limit is None:
        if action not in DAILY_LIMITS:
            # If we ever typo an action name, better to fail loudly
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unknown usage action: {action}",
            )
        limit = DAILY_LIMITS[action]

    now = datetime.utcnow()
    start_of_day = _start_of_utc_day(now)

    stmt = (
        select(UsageLog)
        .where(UsageLog.user_id == user_id)
        .where(UsageLog.action == action)
        .where(UsageLog.timestamp >= start_of_day)
    )
    rows = db.exec(stmt).all()
    count_today = len(rows)

    if count_today >= limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Daily limit reached for this action. Please try again tomorrow.",
        )

    # Record this usage
    log = UsageLog(user_id=user_id, action=action)
    db.add(log)
    db.commit()
