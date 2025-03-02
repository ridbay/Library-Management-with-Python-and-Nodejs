from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base

# Database setup
DATABASE_URL = "sqlite:///frontend.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    firstname = Column(String)
    lastname = Column(String)

class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    author = Column(String)
    publisher = Column(String)
    category = Column(String)
    available = Column(Boolean, default=True)

# Initialize database
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI()

# Pydantic models
class UserCreate(BaseModel):
    email: str
    firstname: str
    lastname: str

class BookFilter(BaseModel):
    publisher: Optional[str] = None
    category: Optional[str] = None

# Routes
@app.post("/users", status_code=201)
def create_user(user: UserCreate):
    db = SessionLocal()
    db_user = User(email=user.email, firstname=user.firstname, lastname=user.lastname)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User enrolled successfully", "user_id": db_user.id}

@app.get("/books", response_model=List[dict])
def list_books(publisher: Optional[str] = None, category: Optional[str] = None):
    db = SessionLocal()
    query = db.query(Book).filter(Book.available == True)
    if publisher:
        query = query.filter(Book.publisher == publisher)
    if category:
        query = query.filter(Book.category == category)
    books = query.all()
    return [{"id": book.id, "title": book.title, "author": book.author} for book in books]

@app.get("/books/{book_id}", response_model=dict)
def get_book(book_id: int):
    db = SessionLocal()
    book = db.query(Book).filter(Book.id == book_id, Book.available == True).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return {"id": book.id, "title": book.title, "author": book.author}