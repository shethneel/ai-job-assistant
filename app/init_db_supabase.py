# app/init_db_supabase.py
"""
Small helper script to create all tables in the target database.

On Railway, with DATABASE_URL pointing to Supabase, you can run:
  python -m app.init_db_supabase
"""
from app.database import init_db


def main() -> None:
    init_db()


if __name__ == "__main__":
    main()
