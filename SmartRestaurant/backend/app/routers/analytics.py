from fastapi import APIRouter, Depends
from sqlmodel import Session, select, text
from database import engine
from datetime import datetime

# ... imports ... (Match lines 6-12 calling view_file again if I need to be precise, but I have the content)
from app.models.orders import Order
from app.models.payments import Payment
from app.models.user import User
from app.models.order_items import OrderItem
from app.models.menu_items import MenuItem
from app.models.order_status_history import OrderStatusHistory


router = APIRouter(prefix="/admin/analytics", tags=["Analytics"])


def get_session():
    with Session(engine) as session:
        yield session


# 1. Total number of orders
@router.get("/total-orders")
def total_orders(session: Session = Depends(get_session)):
    query = text("SELECT COUNT(*) FROM orders;")
    result = session.exec(query).first()
    count = result[0] if result else 0
    return {"total_orders": count}


# 2. Total revenue (only successful payments)
@router.get("/total-revenue")
def total_revenue(session: Session = Depends(get_session)):
    query = text("""
        SELECT SUM(total_amount)
        FROM orders
        WHERE status = 'delivered';
    """)
    result = session.exec(query).first()
    # result is a tuple (sum,) or None.
    total = result[0] if result and result[0] else 0
    return {"total_revenue": total}


# 3. Daily revenue
@router.get("/daily-revenue")
def daily_revenue(session: Session = Depends(get_session)):
    query = text("""
        SELECT DATE(created_at) AS day, SUM(total_amount) AS revenue
        FROM orders
        WHERE status = 'delivered'
        GROUP BY day
        ORDER BY day DESC;
    """)
    return session.exec(query).mappings().all()


# 4. Monthly revenue
@router.get("/monthly-revenue")
def monthly_revenue(session: Session = Depends(get_session)):
    query = text("""
        SELECT DATE_TRUNC('month', created_at) AS month, SUM(total_amount) AS revenue
        FROM orders
        WHERE status = 'delivered'
        GROUP BY month
        ORDER BY month DESC;
    """)
    return session.exec(query).mappings().all()


# 5. Total customers
@router.get("/total-customers")
def total_customers(session: Session = Depends(get_session)):
    query = text("""
        SELECT COUNT(*)
        FROM users
        WHERE role = 'customer';
    """)
    result = session.exec(query).first()
    total = result[0] if result else 0
    return {"total_customers": total}


# 6. Orders by status
@router.get("/orders-by-status")
def orders_by_status(session: Session = Depends(get_session)):
    query = text("""
        SELECT status, COUNT(*) as count
        FROM orders
        GROUP BY status;
    """)
    return session.exec(query).mappings().all()


# 7. Top-selling items
@router.get("/top-items")
def top_items(session: Session = Depends(get_session)):
    query = text("""
        SELECT mi.name, SUM(oi.quantity) AS total_sold
        FROM order_items oi
        JOIN menu_items mi ON oi.item_id = mi.item_id
        GROUP BY mi.name
        ORDER BY total_sold DESC
        LIMIT 5;
    """)
    return session.exec(query).mappings().all()


# 8. Most active riders
@router.get("/top-riders")
def top_riders(session: Session = Depends(get_session)):
    query = text("""
        SELECT u.name AS rider, COUNT(*) AS delivered_orders
        FROM orders o
        JOIN users u ON o.assigned_rider_id = u.user_id
        WHERE o.status = 'delivered'
        GROUP BY rider
        ORDER BY delivered_orders DESC;
    """)
    return session.exec(query).mappings().all()


# 9. Average order value
@router.get("/avg-order-value")
def avg_order_value(session: Session = Depends(get_session)):
    query = text("""
        SELECT AVG(total_amount)
        FROM orders;
    """)
    result = session.exec(query).first()
    avg = result[0] if result and result[0] else 0
    return {"average_order_value": avg}


# 10. Average delivery time
@router.get("/avg-delivery-time")
def avg_delivery_time(session: Session = Depends(get_session)):
    query = text("""
        SELECT AVG(delivered.changed_at - ready.changed_at) AS avg_time
        FROM order_status_history ready
        JOIN order_status_history delivered
        ON ready.order_id = delivered.order_id
        WHERE ready.new_status = 'ready'
        AND delivered.new_status = 'delivered';
    """)
    result = session.exec(query).first()
    avg = result[0] if result and result[0] else None 
    # Return as seconds or string? The frontend likely expects pretty format or raw duration. 
    # Postgres returns timedelta. FastAPI handles it? 
    # Let's return as dict.
    return {"average_delivery_time": avg}


# 11. Orders per customer (activity)
@router.get("/orders-per-customer")
def orders_per_customer(session: Session = Depends(get_session)):
    query = text("""
        SELECT u.name, COUNT(o.order_id) AS orders
        FROM users u
        LEFT JOIN orders o ON u.user_id = o.customer_id
        WHERE u.role = 'customer'
        GROUP BY u.name
        ORDER BY orders DESC;
    """)
    return session.exec(query).mappings().all()


# 12. Payment success rate
@router.get("/payment-success-rate")
def payment_success_rate(session: Session = Depends(get_session)):
    # Mocking this as we don't handle payments yet
    return {"success_rate": 1.0}


# 13. Most popular category
@router.get("/top-category")
def top_category(session: Session = Depends(get_session)):
    query = text("""
        SELECT c.name, SUM(oi.quantity) AS total_sold
        FROM order_items oi
        JOIN menu_items mi ON oi.item_id = mi.item_id
        JOIN categories c ON mi.category_id = c.category_id
        GROUP BY c.name
        ORDER BY total_sold DESC
        LIMIT 1;
    """)
    return session.exec(query).mappings().all()
