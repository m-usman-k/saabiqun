from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.content import Article, QuranSurah, QuranAyah, HadithBook, HadithEntry, PDFBook, ArticleCategory
from ..schemas.content import Article as ArticleSchema, ArticleCreate, QuranSurah as QuranSurahSchema, QuranAyah as QuranAyahSchema, HadithBook as HadithBookSchema, HadithEntry as HadithEntrySchema, PDFBook as PDFBookSchema
from .auth import get_admin_user
from ..models.user import User

router = APIRouter()

# Articles (History, Q&A, Stories)
@router.post("/articles", response_model=ArticleSchema)
def create_article(article_in: ArticleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    db_article = Article(
        category=article_in.category,
        title=article_in.title,
        content=article_in.content,
        author_id=current_user.id
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

@router.get("/articles/{category}", response_model=List[ArticleSchema])
def list_articles(category: ArticleCategory, db: Session = Depends(get_db)):
    return db.query(Article).filter(Article.category == category).all()

@router.get("/article/{article_id}", response_model=ArticleSchema)
def get_article(article_id: int, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

# Quran
@router.get("/quran/surahs", response_model=List[QuranSurahSchema])
def list_surahs(db: Session = Depends(get_db)):
    return db.query(QuranSurah).order_by(QuranSurah.number).all()

@router.post("/quran/surahs", response_model=QuranSurahSchema)
def create_surah(surah_in: QuranSurahSchema, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    db_surah = QuranSurah(number=surah_in.number, name_arabic=surah_in.name_arabic, name_english=surah_in.name_english)
    db.add(db_surah)
    db.commit()
    db.refresh(db_surah)
    return db_surah

@router.get("/quran/surah/by-name/{surah_name}/ayahs", response_model=List[QuranAyahSchema])
def get_ayahs_by_name(surah_name: str, db: Session = Depends(get_db)):
    # Find surah by name (case insensitive)
    surah = db.query(QuranSurah).filter(QuranSurah.name_english.ilike(surah_name)).first()
    if not surah:
        raise HTTPException(status_code=404, detail="Surah not found")
    return db.query(QuranAyah).filter(QuranAyah.surah_number == surah.number).order_by(QuranAyah.ayah_number).all()

@router.get("/quran/surah/by-name/{surah_name}", response_model=QuranSurahSchema)
def get_surah_by_name(surah_name: str, db: Session = Depends(get_db)):
    surah = db.query(QuranSurah).filter(QuranSurah.name_english.ilike(surah_name)).first()
    if not surah:
        raise HTTPException(status_code=404, detail="Surah not found")
    return surah

@router.get("/quran/surah/{surah_number}/ayahs", response_model=List[QuranAyahSchema])
def get_ayahs(surah_number: int, db: Session = Depends(get_db)):
    return db.query(QuranAyah).filter(QuranAyah.surah_number == surah_number).order_by(QuranAyah.ayah_number).all()

@router.post("/quran/ayahs", response_model=QuranAyahSchema)
def create_ayah(ayah_in: QuranAyahSchema, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    db_ayah = QuranAyah(
        surah_number=ayah_in.surah_number,
        ayah_number=ayah_in.ayah_number,
        text_arabic=ayah_in.text_arabic,
        text_english=ayah_in.text_english,
        text_urdu=ayah_in.text_urdu
    )
    db.add(db_ayah)
    db.commit()
    db.refresh(db_ayah)
    return db_ayah

# Hadith
@router.get("/hadith/books", response_model=List[HadithBookSchema])
def list_hadith_books(db: Session = Depends(get_db)):
    return db.query(HadithBook).all()

@router.post("/hadith/books", response_model=HadithBookSchema)
def create_hadith_book(book_in: HadithBookSchema, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    db_book = HadithBook(title=book_in.title)
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

@router.get("/hadith/book/by-title/{title}/entries", response_model=List[HadithEntrySchema])
def get_hadith_entries_by_title(title: str, db: Session = Depends(get_db)):
    book = db.query(HadithBook).filter(HadithBook.title.ilike(title)).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return db.query(HadithEntry).filter(HadithEntry.book_id == book.id).all()

@router.get("/hadith/book/by-title/{title}", response_model=HadithBookSchema)
def get_hadith_book_by_title(title: str, db: Session = Depends(get_db)):
    book = db.query(HadithBook).filter(HadithBook.title.ilike(title)).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.get("/hadith/book/{book_id}/entries", response_model=List[HadithEntrySchema])
def get_hadith_entries(book_id: int, db: Session = Depends(get_db)):
    return db.query(HadithEntry).filter(HadithEntry.book_id == book_id).all()

@router.post("/hadith/entries", response_model=HadithEntrySchema)
def create_hadith_entry(entry_in: HadithEntrySchema, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    db_entry = HadithEntry(
        book_id=entry_in.book_id,
        chapter_title=entry_in.chapter_title,
        text_arabic=entry_in.text_arabic,
        text_english=entry_in.text_english,
        text_urdu=entry_in.text_urdu
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

# Articles
@router.put("/articles/{article_id}", response_model=ArticleSchema)
def update_article(article_id: int, article_in: ArticleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article: raise HTTPException(status_code=404, detail="Article not found")
    db_article.title = article_in.title
    db_article.content = article_in.content
    db_article.category = article_in.category
    db.commit()
    db.refresh(db_article)
    return db_article

@router.delete("/articles/{article_id}")
def delete_article(article_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article: raise HTTPException(status_code=404, detail="Article not found")
    db.delete(db_article)
    db.commit()
    return {"message": "Deleted successfully"}

# Quran
@router.put("/quran/surahs/{surah_id}", response_model=QuranSurahSchema)
def update_surah(surah_id: int, surah_in: QuranSurahSchema, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    db_surah = db.query(QuranSurah).filter(QuranSurah.id == surah_id).first()
    if not db_surah: raise HTTPException(status_code=404, detail="Surah not found")
    db_surah.number = surah_in.number
    db_surah.name_arabic = surah_in.name_arabic
    db_surah.name_english = surah_in.name_english
    db.commit()
    return db_surah

@router.delete("/quran/surahs/{surah_id}")
def delete_surah(surah_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    db_surah = db.query(QuranSurah).filter(QuranSurah.id == surah_id).first()
    if not db_surah: raise HTTPException(status_code=404, detail="Surah not found")
    db.delete(db_surah)
    db.commit()
    return {"message": "Deleted"}

@router.put("/quran/ayahs/{ayah_id}", response_model=QuranAyahSchema)
def update_ayah(ayah_id: int, ayah_in: QuranAyahSchema, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    db_ayah = db.query(QuranAyah).filter(QuranAyah.id == ayah_id).first()
    if not db_ayah: raise HTTPException(status_code=404, detail="Ayah not found")
    db_ayah.text_arabic = ayah_in.text_arabic
    db_ayah.text_english = ayah_in.text_english
    db_ayah.text_urdu = ayah_in.text_urdu
    db_ayah.ayah_number = ayah_in.ayah_number
    db.commit()
    return db_ayah

@router.delete("/quran/ayahs/{ayah_id}")
def delete_ayah(ayah_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    db_ayah = db.query(QuranAyah).filter(QuranAyah.id == ayah_id).first()
    if not db_ayah: raise HTTPException(status_code=404, detail="Ayah not found")
    db.delete(db_ayah)
    db.commit()
    return {"message": "Deleted"}

# Hadith
@router.put("/hadith/books/{book_id}", response_model=HadithBookSchema)
def update_hadith_book(book_id: int, book_in: HadithBookSchema, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    db_book = db.query(HadithBook).filter(HadithBook.id == book_id).first()
    if not db_book: raise HTTPException(status_code=404, detail="Book not found")
    db_book.title = book_in.title
    db.commit()
    return db_book

@router.delete("/hadith/books/{book_id}")
def delete_hadith_book(book_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    db_book = db.query(HadithBook).filter(HadithBook.id == book_id).first()
    if not db_book: raise HTTPException(status_code=404, detail="Book not found")
    db.delete(db_book)
    db.commit()
    return {"message": "Deleted"}

@router.put("/hadith/entries/{entry_id}", response_model=HadithEntrySchema)
def update_hadith_entry(entry_id: int, entry_in: HadithEntrySchema, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    db_entry = db.query(HadithEntry).filter(HadithEntry.id == entry_id).first()
    if not db_entry: raise HTTPException(status_code=404, detail="Entry not found")
    db_entry.chapter_title = entry_in.chapter_title
    db_entry.text_arabic = entry_in.text_arabic
    db_entry.text_english = entry_in.text_english
    db_entry.text_urdu = entry_in.text_urdu
    db.commit()
    return db_entry

@router.delete("/hadith/entries/{entry_id}")
def delete_hadith_entry(entry_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    db_entry = db.query(HadithEntry).filter(HadithEntry.id == entry_id).first()
    if not db_entry: raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(db_entry)
    db.commit()
    return {"message": "Deleted"}

# PDF Books
@router.get("/pdf-books", response_model=List[PDFBookSchema])
def list_pdf_books(db: Session = Depends(get_db)):
    return db.query(PDFBook).all()

@router.post("/pdf-books", response_model=PDFBookSchema)
def create_pdf_book(book_in: PDFBookSchema, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    db_book = PDFBook(**book_in.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

@router.delete("/pdf-books/{book_id}")
def delete_pdf_book(book_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    db_book = db.query(PDFBook).filter(PDFBook.id == book_id).first()
    if not db_book: raise HTTPException(status_code=404, detail="Book not found")
    db.delete(db_book)
    db.commit()
    return {"message": "Deleted"}
