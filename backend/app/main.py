from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, database
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Smart Restaurant - Rider API")

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for dev to prevent port issues
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Routes ---

@app.get("/")
def read_root():
    return {"message": "Rider API is running 🚀"}

@app.post("/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Simple login logic for demo (Plaintext password check for simplicity as requested)
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    if not user or user.hashed_password != form_data.password:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    return {
        "access_token": "fake-jwt-token",
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id
    }

@app.get("/orders/assigned", response_model=List[schemas.Order])
def get_assigned_orders(db: Session = Depends(get_db)):
    # For demo, just return all 'assigned' orders
    return db.query(models.Order).filter(models.Order.status == "assigned").all()

@app.get("/orders/history", response_model=List[schemas.Order])
def get_order_history(db: Session = Depends(get_db)):
    return db.query(models.Order).filter(models.Order.status == "delivered").all()

@app.get("/customer/orders", response_model=List[schemas.Order])
def get_all_orders(db: Session = Depends(get_db)):
    # Return all orders for the customer demo
    return db.query(models.Order).all()

@app.get("/rider/profile/{user_id}", response_model=schemas.Rider)
def get_rider_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(models.RiderProfile).filter(models.RiderProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Rider not found")
    return profile

@app.post("/rider/location")
def update_location(location: schemas.LocationUpdate, db: Session = Depends(get_db)):
    # In a real app, we'd update the current user's profile
    # profile.current_lat = location.lat ...
    return {"status": "Location updated", "lat": location.lat, "lng": location.lng}

@app.post("/orders/{order_id}/status")
def update_order_status(order_id: int, status: str, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status
    db.commit()
    return {"success": True, "new_status": status}

# --- Seed Data Endpoint (For Demo) ---
@app.post("/seed")
def seed_data(db: Session = Depends(get_db)):
    message = []
    
    # 1. Create Admin
    if not db.query(models.User).filter(models.User.email == "admin@gmail.com").first():
        admin_user = models.User(email="admin@gmail.com", role="admin", hashed_password="admin")
        db.add(admin_user)
        message.append("Admin created")

    # 2. Create Customer
    if not db.query(models.User).filter(models.User.email == "customer@gmail.com").first():
        customer_user = models.User(email="customer@gmail.com", role="customer", hashed_password="customer")
        db.add(customer_user)
        message.append("Customer created")

    # 3. Create OR Update Rider
    rider_user = db.query(models.User).filter(models.User.email == "rider@example.com").first()
    if not rider_user:
        rider_user = models.User(email="rider@example.com", role="rider", hashed_password="rider")
        db.add(rider_user)
        db.commit() # Commit needed to get ID for profile
        
        rider_profile = models.RiderProfile(
            user_id=rider_user.id,
            full_name="Momin Jawad",
            phone_number="+92 300 1234567",
            vehicle_details="Honda CG 125 - Red",
            rating=4.9
        )
        db.add(rider_profile)
        
        # Create Dummy Orders for Rider
        order1 = models.Order(
            order_number="ORD-101",
            status="assigned",
            total_amount=25.50,
            rider_earning=3.50,
            restaurant_name="Burger King",
            restaurant_address="Downtown Ave",
            restaurant_lat=40.7128,
            restaurant_lng=-74.0060,
            customer_name="John Doe",
            customer_address="123 Pine St",
            customer_lat=40.7150,
            customer_lng=-74.0080,
            rider_id=rider_user.id
        )
        
        order2 = models.Order(
            order_number="ORD-102",
            status="delivered",
            total_amount=18.00,
            rider_earning=2.50,
            restaurant_name="Pizza Hut",
            restaurant_address="Main Blvd",
            restaurant_lat=40.7200,
            restaurant_lng=-74.0100,
            customer_name="Jane Smith",
            customer_address="456 Oak Dr",
            customer_lat=40.7220,
            customer_lng=-74.0120,
            rider_id=rider_user.id
        )
        db.add(order1)
        db.add(order2)
        message.append("Rider and Orders created")
    else:
        # Force update password if user exists
        if rider_user.hashed_password != "rider":
             rider_user.hashed_password = "rider"
             db.commit()
             message.append("Rider password updated")
    
    db.commit()
    
    if not message:
        return {"message": "Data already seeded"}
    return {"message": ", ".join(message)}

@app.get("/menu", response_model=List[schemas.MenuItem])
def get_menu(db: Session = Depends(get_db)):
    return db.query(models.MenuItem).filter(models.MenuItem.is_available == True).all()

@app.post("/seed_menu")
def seed_menu(db: Session = Depends(get_db)):
    if db.query(models.MenuItem).first():
        return {"message": "Menu already seeded"}
    
    items = [
        models.MenuItem(name="Zinger Burger", description="Crispy chicken fillet with secret sauce", price=450.0, category="Burgers", image_url="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"),
        models.MenuItem(name="Chicken Tikka Pizza", description="Spicy tikka chunks with mozzarella", price=1200.0, category="Pizza", image_url="https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500"),
        models.MenuItem(name="Fries", description="Golden crispy fries", price=200.0, category="Sides", image_url="https://images.unsplash.com/photo-1573080496987-8198cb04cd81?w=500"),
        models.MenuItem(name="Coke", description="Chilled 500ml", price=100.0, category="Drinks", image_url="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500"),
    ]
    
    db.add_all(items)
    db.commit()
    return {"message": "Menu seeded 🍔"}
