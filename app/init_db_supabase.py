# app/init_db_supabase.py
"""
Optional helper to manually initialize Supabase tables.

Run locally with DATABASE_URL pointing at Supabase:

    DATABASE_URL="<supabase url>" uvicorn app.main:app --reload

You usually don't need this, because init_db() is called on startup.
"""

from app.database import init_db  # imports models via database.init_db


def main():
    init_db()


if __name__ == "__main__":
    main()
