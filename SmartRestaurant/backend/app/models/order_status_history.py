from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

class OrderStatusHistory(SQLModel, table=True):
    __tablename__ = "order_status_history"
    id: int = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="orders.order_id")
    old_status: str | None = None
    new_status: str
    changed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
