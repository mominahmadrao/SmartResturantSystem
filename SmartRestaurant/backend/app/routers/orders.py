from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select, SQLModel
from app.auth import get_current_user, get_session
from app.models.orders import Order, OrderBase
from app.models.order_items import OrderItem
from app.models.menu_items import MenuItem
from app.models.user import User

router = APIRouter(prefix="/orders", tags=["Orders"])

class OrderItemRequest(BaseModel):
    item_id: int
    quantity: int

class CreateOrderRequest(BaseModel):
    items: List[OrderItemRequest]

class OrderItemRead(SQLModel):
    item_id: int
    quantity: int
    price_each: float
    name: str | None = None

# We need to set table=False explicitly if we inherit from a table model
# to use it as a response model without creating a new table or confusing SQLModel
class OrderWithItems(OrderBase):
    order_id: int
    items: List[OrderItemRead] = []


@router.post("/", response_model=Order, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_req: CreateOrderRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Calculate total and verify items
    total_amount = 0.0
    db_items = []
    
    for item_req in order_req.items:
        menu_item = session.get(MenuItem, item_req.item_id)
        if not menu_item:
            raise HTTPException(status_code=404, detail=f"Item {item_req.item_id} not found")
        
        total_amount += menu_item.price * item_req.quantity
        db_items.append((menu_item, item_req.quantity))

    # Create Order
    new_order = Order(
        customer_id=current_user.user_id,
        total_amount=total_amount,
        status="pending",
        created_at=datetime.now(timezone.utc),
        # Default Restaurant Info (For Single Restaurant App)
        restaurant_name="Smart Restaurant HQ",
        restaurant_address="123 Food Street, Downtown",
        restaurant_lat=31.5204,
        restaurant_lng=74.3587,
        # Default Customer Info (Should ideally come from checkout workflow)
        customer_name=current_user.name,
        customer_address="Customer Location 123", # Placeholder
        customer_lat=31.53,
        customer_lng=74.36
    )
    session.add(new_order)
    session.commit()
    session.refresh(new_order)

    # Create Order Items
    for menu_item, qty in db_items:
        order_item = OrderItem(
            order_id=new_order.order_id,
            item_id=menu_item.item_id,
            quantity=qty,
            price_each=menu_item.price
        )
        session.add(order_item)
    
    session.commit()
    return new_order

@router.get("/", response_model=List[Order])
async def read_orders(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == "admin":
        return session.exec(select(Order)).all()
    elif current_user.role == "rider":
        # Returns orders available for pickup (ready/pending) or assigned to this rider
        statement = select(Order).where(
            (Order.status == "ready") | 
            (Order.status == "pending") |
            (Order.assigned_rider_id == current_user.user_id)
        )
        return session.exec(statement).all()
    else:
        # Customer: return own orders
        return session.exec(select(Order).where(Order.customer_id == current_user.user_id)).all()

@router.get("/{order_id}", response_model=OrderWithItems)
async def read_order(
    order_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Access control
    if current_user.role == "admin":
        pass # Admin can see all
    elif current_user.role == "rider":
        # Rider can see if assigned OR if it's available for pickup (ready/pending)
        if not (order.assigned_rider_id == current_user.user_id or order.status in ["ready", "pending"]):
             raise HTTPException(status_code=403, detail="Not authorized")
    elif current_user.role == "customer":
        if order.customer_id != current_user.user_id:
            raise HTTPException(status_code=403, detail="Not authorized")
    
    # Convert to response model explicitly to avoid modifying DB object
    order_items_response = []
    for item in order.items:
        menu_item = session.get(MenuItem, item.item_id)
        order_items_response.append(
            OrderItemRead(
                item_id=item.item_id,
                quantity=item.quantity,
                price_each=item.price_each,
                name=menu_item.name if menu_item else "Unknown Item"
            )
        )

    return OrderWithItems(
        **order.model_dump(),
        items=order_items_response
    )

@router.put("/{order_id}/status")
async def update_order_status(
    order_id: int,
    status: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Allow admin and rider (and maybe restaurant spec)
    if current_user.role not in ["admin", "rider"]:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    order.status = status
    if status == "assigned" and current_user.role == "rider":
        order.assigned_rider_id = current_user.user_id
        
    session.add(order)
    session.commit()
    session.refresh(order)
    return order
