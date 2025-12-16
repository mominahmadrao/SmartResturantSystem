from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.auth import get_current_admin, get_session
from app.models.menu_items import MenuItem
from app.schemas.menu import MenuItemWithCategory
from app.models.categories import Category

router = APIRouter(prefix="/menu", tags=["Menu"])

@router.get("/", response_model=List[MenuItemWithCategory])
async def read_menu_items(session: Session = Depends(get_session)):
    results = session.exec(select(MenuItem, Category).join(Category)).all()
    # Map results to schema
    items = []
    for item, category in results:
        item_dict = item.model_dump()
        item_dict["category_name"] = category.name
        items.append(MenuItemWithCategory(**item_dict))
    return items

@router.get("/categories", response_model=List[Category])
async def read_categories(session: Session = Depends(get_session)):
    categories = session.exec(select(Category)).all()
    return categories

@router.post("/", response_model=MenuItem, status_code=status.HTTP_201_CREATED)
async def create_menu_item(
    item: MenuItem, 
    session: Session = Depends(get_session),
    current_user = Depends(get_current_admin)
):
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_menu_item(
    item_id: int,
    session: Session = Depends(get_session),
    current_user = Depends(get_current_admin)
):
    item = session.get(MenuItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    session.delete(item)
    session.commit()
    return None

@router.put("/{item_id}", response_model=MenuItem)
async def update_menu_item(
    item_id: int,
    item_update: MenuItem,
    session: Session = Depends(get_session),
    current_user = Depends(get_current_admin)
):
    db_item = session.get(MenuItem, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    item_data = item_update.model_dump(exclude_unset=True)
    for key, value in item_data.items():
        if key != "item_id": # Prevent ID update
             setattr(db_item, key, value)
             
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item
