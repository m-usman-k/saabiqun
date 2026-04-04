from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from ..database import Base

class ArticleCategory(enum.Enum):
    HISTORY = "history"
    QNA = "qna"
    STORIES = "stories"

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(SQLEnum(ArticleCategory))
    title = Column(String, index=True)
    content = Column(Text)
    author_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    author = relationship("User")

class QuranSurah(Base):
    __tablename__ = "quran_surahs"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(Integer, unique=True, index=True)
    name_arabic = Column(String)
    name_english = Column(String)

class QuranAyah(Base):
    __tablename__ = "quran_ayahs"

    id = Column(Integer, primary_key=True, index=True)
    surah_number = Column(Integer, ForeignKey("quran_surahs.number"))
    ayah_number = Column(Integer)
    text_arabic = Column(Text)
    text_english = Column(Text)
    text_urdu = Column(Text)

class HadithBook(Base):
    __tablename__ = "hadith_books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)

class HadithEntry(Base):
    __tablename__ = "hadith_entries"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("hadith_books.id"))
    chapter_title = Column(String)
    text_arabic = Column(Text)
    text_english = Column(Text)
    text_urdu = Column(Text)

class PDFBook(Base):
    __tablename__ = "pdf_books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    file_url = Column(String)
