from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

class Payment(SQLModel, table=True):
    __tablename__ = "payments"
    payment_id: int = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="orders.order_id")
    method: str
    amount: float
    status: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
