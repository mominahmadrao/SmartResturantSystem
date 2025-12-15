from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # 'rider', 'customer'
    
    # Relationships
    rider_profile = relationship("RiderProfile", back_populates="user", uselist=False)
    orders = relationship("Order", back_populates="rider")

class RiderProfile(Base):
    __tablename__ = "rider_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    full_name = Column(String)
    phone_number = Column(String)
    vehicle_details = Column(String) # e.g., "Honda CD 70 - Red"
    current_lat = Column(Float, default=0.0)
    current_lng = Column(Float, default=0.0)
    is_online = Column(Boolean, default=False)
    rating = Column(Float, default=5.0)
    
    user = relationship("User", back_populates="rider_profile")
    earnings = relationship("Earning", back_populates="rider")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, index=True) # e.g., "ORD-123"
    
    # Status: 'assigned', 'picked_up', 'delivered', 'cancelled'
    status = Column(String, default="assigned")
    
    # Money
    total_amount = Column(Float)
    rider_earning = Column(Float)
    
    # Locations (Simplified for demo, usually points to Address table)
    restaurant_name = Column(String)
    restaurant_address = Column(String)
    restaurant_lat = Column(Float)
    restaurant_lng = Column(Float)
    
    customer_name = Column(String)
    customer_address = Column(String)
    customer_lat = Column(Float)
    customer_lng = Column(Float)
    
    # Dates
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relations
    rider_id = Column(Integer, ForeignKey("users.id"))
    rider = relationship("User", back_populates="orders")

class Earning(Base):
    __tablename__ = "earnings"

    id = Column(Integer, primary_key=True, index=True)
    rider_id = Column(Integer, ForeignKey("rider_profiles.id"))
    amount = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)
    
    rider = relationship("RiderProfile", back_populates="earnings")

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    image_url = Column(String, nullable=True)
    category = Column(String, default="Main")
    is_available = Column(Boolean, default=True)
