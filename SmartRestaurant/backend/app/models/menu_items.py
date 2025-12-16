from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

class MenuItem(SQLModel, table=True):
    __tablename__ = "menu_items"
    item_id: int = Field(default=None, primary_key=True)
    name: str
    description: str | None = None
    price: float
    image_url: str | None = None
    category_id: int = Field(foreign_key="categories.category_id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
