from sqlmodel import Session, select
from database import engine
from app.models.user import User
from app.models.categories import Category
from app.models.menu_items import MenuItem
from datetime import datetime, timezone
import bcrypt


def hash_password(password: str) -> str:
    """Hashes password using bcrypt."""
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")


# -----------------------------
# Seed Data Function
# -----------------------------
def seed_data():
    print("-> Starting database seeding...")

    with Session(engine) as session:

        # -----------------------------
        # 1. Seed Users (Admin / Rider / Customer)
        # -----------------------------
        if not session.exec(select(User).where(User.email == "admin@example.com")).first():
             admin = User(
                 name="Admin User",
                 email="admin@example.com",
                 password_hash=hash_password("admin123"),
                 role="admin",
                 phone="0000000000",
                 created_at=datetime.now(tz=timezone.utc),
             )
             session.add(admin)
             print("-> Admin added")

        if not session.exec(select(User).where(User.email == "rider@example.com")).first():
             rider = User(
                 name="Rider User",
                 email="rider@example.com",
                 password_hash=hash_password("rider123"),
                 role="rider",
                 phone="1111111111",
                 created_at=datetime.now(tz=timezone.utc),
             )
             session.add(rider)
             print("-> Rider added")

        if not session.exec(select(User).where(User.email == "customer@example.com")).first():
             customer = User(
                 name="Customer User",
                 email="customer@example.com",
                 password_hash=hash_password("customer123"),
                 role="customer",
                 phone="2222222222",
                 created_at=datetime.now(tz=timezone.utc),
             )
             session.add(customer)
             print("-> Customer added")
        
        session.commit()
        print("-> Users added.")

        # -----------------------------
        # 2. Seed Categories (Skip if exist)
        # -----------------------------
        if not session.exec(select(Category)).first():
            category_burgers = Category(name="Burgers")
            category_pizza = Category(name="Pizza")
            category_drinks = Category(name="Drinks")

            session.add(category_burgers)
            session.add(category_pizza)
            session.add(category_drinks)
            session.commit()
            print("-> Categories added.")


        # -----------------------------
        # 3. Seed Menu Items (Skip if exist)
        # -----------------------------
        if not session.exec(select(MenuItem)).first():
             # Re-fetch categories
             category_burgers = session.exec(select(Category).where(Category.name == "Burgers")).first()
             category_pizza = session.exec(select(Category).where(Category.name == "Pizza")).first()
             category_drinks = session.exec(select(Category).where(Category.name == "Drinks")).first()
             
             menu_items = [
                MenuItem(
                    name="Cheese Burger",
                    description="Classic juicy cheese burger",
                    price=500,
                    image_url="",
                    category_id=category_burgers.category_id,
                    created_at=datetime.now(tz=timezone.utc),
                ),
                MenuItem(
                    name="Zinger Burger",
                    description="Crispy chicken zinger with spice",
                    price=650,
                    image_url="",
                    category_id=category_burgers.category_id,
                    created_at=datetime.now(tz=timezone.utc),
                ),
                MenuItem(
                    name="Chicken Pizza",
                    description="12-inch chicken pizza with cheese",
                    price=1200,
                    image_url="",
                    category_id=category_pizza.category_id,
                    created_at=datetime.now(tz=timezone.utc),
                ),
                MenuItem(
                    name="Cola Drink",
                    description="Chilled cola drink",
                    price=80,
                    image_url="",
                    category_id=category_drinks.category_id,
                    created_at=datetime.now(tz=timezone.utc),
                ),
            ]
             session.add_all(menu_items)
             session.commit()
             print("-> Menu items added.")
        print("-> Menu items added.")

        # -----------------------------
        # 4. Seed Orders (Dummy Data)
        # -----------------------------
        
        # Reload objects to get IDs
        rider = session.exec(select(User).where(User.role == "rider")).first()
        customer = session.exec(select(User).where(User.role == "customer")).first()
        # Fetch all menu items
        all_items = session.exec(select(MenuItem)).all()
        burger = next((i for i in all_items if "Burger" in i.name), all_items[0])
        pizza = next((i for i in all_items if "Pizza" in i.name), all_items[0])
        cola = next((i for i in all_items if "Cola" in i.name), all_items[0])

        if not rider or not customer:
            print("! Skipping orders: Rider or Customer not found.")
        else:
            from app.models.orders import Order
            from app.models.order_items import OrderItem
            from app.models.payments import Payment
            from app.models.order_status_history import OrderStatusHistory
            from datetime import timedelta

            orders_list = []
            
            # Order 1: Delivered (Yesterday)
            order1 = Order(
                customer_id=customer.user_id,
                total_amount=burger.price + cola.price,
                status="delivered",
                assigned_rider_id=rider.user_id,
                created_at=datetime.now(tz=timezone.utc) - timedelta(days=1)
            )
            orders_list.append(order1)
            session.add(order1)
            session.commit() # Commit to get order_id

            # Items for Order 1
            session.add(OrderItem(order_id=order1.order_id, item_id=burger.item_id, quantity=1, price_each=burger.price))
            session.add(OrderItem(order_id=order1.order_id, item_id=cola.item_id, quantity=1, price_each=cola.price))
            
            # Payment for Order 1
            session.add(Payment(order_id=order1.order_id, method="card", amount=order1.total_amount, status="success", created_at=order1.created_at))
            
            # History for Order 1
            session.add(OrderStatusHistory(order_id=order1.order_id, old_status="pending", new_status="ready", changed_at=order1.created_at + timedelta(minutes=10)))
            session.add(OrderStatusHistory(order_id=order1.order_id, old_status="ready", new_status="delivered", changed_at=order1.created_at + timedelta(minutes=30)))

            # Order 2: Delivered (Today) - Pizza Party
            order2 = Order(
                customer_id=customer.user_id,
                total_amount=(pizza.price * 2) + (cola.price * 2),
                status="delivered",
                assigned_rider_id=rider.user_id,
                created_at=datetime.now(tz=timezone.utc) - timedelta(hours=2)
            )
            orders_list.append(order2)
            session.add(order2)
            session.commit()

            session.add(OrderItem(order_id=order2.order_id, item_id=pizza.item_id, quantity=2, price_each=pizza.price))
            session.add(OrderItem(order_id=order2.order_id, item_id=cola.item_id, quantity=2, price_each=cola.price))
            session.add(Payment(order_id=order2.order_id, method="cash", amount=order2.total_amount, status="success", created_at=order2.created_at))
            
            session.add(OrderStatusHistory(order_id=order2.order_id, old_status="pending", new_status="ready", changed_at=order2.created_at + timedelta(minutes=15)))
            session.add(OrderStatusHistory(order_id=order2.order_id, old_status="ready", new_status="delivered", changed_at=order2.created_at + timedelta(minutes=45)))

            # Order 3: Pending (Just now)
            order3 = Order(
                customer_id=customer.user_id,
                total_amount=burger.price,
                status="pending",
                created_at=datetime.now(tz=timezone.utc)
            )
            orders_list.append(order3)
            session.add(order3)
            session.commit()

            session.add(OrderItem(order_id=order3.order_id, item_id=burger.item_id, quantity=1, price_each=burger.price))
            # No payment yet or 'pending' payment
            session.add(Payment(order_id=order3.order_id, method="card", amount=order3.total_amount, status="pending", created_at=order3.created_at))

            session.commit()
            print(f"-> Added {len(orders_list)} dummy orders with items and payments.")

    print("-> Database seeding completed successfully!")


# -----------------------------
# Run seeding when executed directly
# -----------------------------
if __name__ == "__main__":
    seed_data()
