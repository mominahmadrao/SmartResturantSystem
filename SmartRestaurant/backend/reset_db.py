from sqlmodel import SQLModel
from database import engine
from app.models.user import User
from app.models.orders import Order
from app.models.menu_items import MenuItem
from app.models.categories import Category
from app.models.order_items import OrderItem
from app.models.payments import Payment
from app.models.order_status_history import OrderStatusHistory
from app.models.rider import RiderProfile

def reset_db():
    print("-> Dropping all tables...")
    SQLModel.metadata.drop_all(engine)
    print("-> Creating all tables...")
    SQLModel.metadata.create_all(engine)
    print("-> Database reset complete.")

if __name__ == "__main__":
    reset_db()
