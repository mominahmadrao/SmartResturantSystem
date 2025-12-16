from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Annotated
from app.routers.analytics import get_session
from app.models.orders import Order
from app.models.rider import RiderProfile
from app.models.user import User
from pydantic import BaseModel

router = APIRouter(prefix="/rider", tags=["Rider"])

# Schemas
class LocationUpdate(BaseModel):
    lat: float
    lng: float

@router.get("/profile/{user_id}")
def get_rider_profile(user_id: int, session: Session = Depends(get_session)):
    profile = session.exec(select(RiderProfile).where(RiderProfile.user_id == user_id)).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Rider profile not found")
    return profile

@router.post("/location")
def update_location(location: LocationUpdate, session: Session = Depends(get_session)):
    # In real app, identify user from token. For now just mock.
    return {"status": "Location updated", "lat": location.lat, "lng": location.lng}

@router.get("/orders/assigned")
def get_assigned_orders(session: Session = Depends(get_session)):
    # In real app, filter by current rider.
    # For demo, return all assigned orders.
    return session.exec(select(Order).where(Order.status == "assigned")).all()

@router.get("/orders/history")
def get_order_history(session: Session = Depends(get_session)):
    return session.exec(select(Order).where(Order.status == "delivered")).all()

@router.post("/orders/{order_id}/status")
def update_order_status(order_id: int, status: str, session: Session = Depends(get_session)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status
    session.add(order)
    session.commit()
    return {"success": True, "new_status": status}
