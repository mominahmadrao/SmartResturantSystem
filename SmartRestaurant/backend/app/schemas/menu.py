from sqlmodel import SQLModel
from app.models.menu_items import MenuItem

# Create a read model that wraps the item + category name
# Inheriting with table=False explicitly to avoid SQLModel registry issues
class MenuItemWithCategory(MenuItem):
    category_name: str
