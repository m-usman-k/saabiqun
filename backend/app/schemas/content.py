from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from ..models.content import ArticleCategory

class ArticleBase(BaseModel):
    category: ArticleCategory
    title: str
    content: str

class ArticleCreate(ArticleBase):
    pass

class Article(ArticleBase):
    id: int
    author_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class QuranSurahBase(BaseModel):
    number: int
    name_arabic: str
    name_english: str

class QuranSurah(QuranSurahBase):
    id: int
    class Config:
        from_attributes = True

class QuranAyahBase(BaseModel):
    ayah_number: int
    text_arabic: str
    text_english: str
    text_urdu: str

class QuranAyah(QuranAyahBase):
    id: int
    surah_number: int
    class Config:
        from_attributes = True

class HadithBookBase(BaseModel):
    title: str

class HadithBook(HadithBookBase):
    id: int
    class Config:
        from_attributes = True

class HadithEntryBase(BaseModel):
    chapter_title: str
    text_arabic: str
    text_english: str
    text_urdu: str

class HadithEntry(HadithEntryBase):
    id: int
    book_id: int
    class Config:
        from_attributes = True

class PDFBookBase(BaseModel):
    title: str
    description: Optional[str] = None
    file_url: str

class PDFBook(PDFBookBase):
    id: int
    class Config:
        from_attributes = True
