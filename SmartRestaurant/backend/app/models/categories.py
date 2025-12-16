from sqlmodel import SQLModel, Field

class Category(SQLModel, table=True):
    __tablename__ = "categories"
    category_id: int = Field(default=None, primary_key=True)
    name: str
