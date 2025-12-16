from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from .user import User

class RiderProfile(SQLModel, table=True):
    __tablename__ = "rider_profiles"
    profile_id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.user_id")
    full_name: str
    phone_number: str
    vehicle_details: str
    current_lat: float = 0.0
    current_lng: float = 0.0
    is_online: bool = False
    rating: float = 5.0
