from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
if TYPE_CHECKING:
    from app.models.orders import Order
from datetime import datetime, timezone

class OrderItem(SQLModel, table=True):
    __tablename__ = "order_items"
    id: int = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="orders.order_id")
    item_id: int = Field(foreign_key="menu_items.item_id")
    quantity: int
    price_each: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    order: Optional["Order"] = Relationship(back_populates="items")
