from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone

class OrderBase(SQLModel):
    customer_id: int = Field(foreign_key="users.user_id")
    order_number: str = Field(index=True, default="ORD-000")
    total_amount: float
    status: str
    assigned_rider_id: int | None = Field(default=None, foreign_key="users.user_id")
    
    # Locations
    restaurant_name: str | None = None
    restaurant_address: str | None = None
    restaurant_lat: float | None = None
    restaurant_lng: float | None = None
    
    customer_name: str | None = None
    customer_address: str | None = None
    customer_lat: float | None = None
    customer_lng: float | None = None
    
    rider_earning: float = 0.0

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Order(OrderBase, table=True):
    __tablename__ = "orders"
    order_id: int = Field(default=None, primary_key=True)
    
    items: List["OrderItem"] = Relationship(back_populates="order")
