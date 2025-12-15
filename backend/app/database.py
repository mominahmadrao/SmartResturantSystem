from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Default to SQLite for easy setup, but ready for Postgres
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/dbname"
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

# If user wants Postgres, they can uncomment:
# SQLALCHEMY_DATABASE_URL = "postgresql://postgres:password@localhost/smart_restaurant"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
