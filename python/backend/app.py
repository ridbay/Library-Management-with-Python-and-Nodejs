from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Database setup
DATABASE_URL = "mysql+pymysql://root:password@db:3306/backend"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
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
class BookCreate(BaseModel):
    title: str
    author: str
    publisher: str
    category: str

# Routes
@app.post("/admin/books", status_code=201)
def add_book(book: BookCreate):
    db = SessionLocal()
    db_book = Book(title=book.title, author=book.author, publisher=book.publisher, category=book.category)
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return {"message": "Book added successfully", "book_id": db_book.id}

@app.delete("/admin/books/{book_id}", status_code=200)
def remove_book(book_id: int):
    db = SessionLocal()
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
    return {"message": "Book removed successfully"}