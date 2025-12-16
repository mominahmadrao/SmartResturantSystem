from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

class User(SQLModel, table=True):
    __tablename__ = "users"
    user_id: int = Field(default=None, primary_key=True)
    name: str
    email: str
    password_hash: str
    role: str
    phone: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
