from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- Rider Schemas ---
class RiderBase(BaseModel):
    full_name: str
    phone_number: str
    vehicle_details: str

class RiderCreate(RiderBase):
    pass

class Rider(RiderBase):
    id: int
    user_id: int
    rating: float
    is_online: bool
    
    class Config:
        from_attributes = True

# --- Order Schemas ---
class OrderBase(BaseModel):
    restaurant_name: str
    restaurant_address: str
    customer_name: str
    customer_address: str
    total_amount: float
    status: str

class Order(OrderBase):
    id: int
    order_number: str
    created_at: datetime
    
    restaurant_lat: float
    restaurant_lng: float
    customer_lat: float
    customer_lng: float
    
    class Config:
        from_attributes = True

# --- Location Update Schema ---
class LocationUpdate(BaseModel):
    lat: float
    lng: float

# --- Menu Schemas ---
class MenuItemBase(BaseModel):
    name: str
    description: str
    price: float
    image_url: Optional[str] = None
    category: str = "Main"
    is_available: bool = True

class MenuItem(MenuItemBase):
    id: int
    
    class Config:
        from_attributes = True
