from app.database import SessionLocal, engine, Base
from app.models.content import QuranSurah, QuranAyah, HadithBook, HadithEntry, PDFBook, Article, ArticleCategory
from app.models.user import User
from app.routers.auth import get_password_hash

def seed():
    db = SessionLocal()
    Base.metadata.create_all(bind=engine)

    # 1. Create Admin User
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        admin = User(
            username="admin", 
            email="admin@saabiqun.com", 
            hashed_password=get_password_hash("admin123"),
            is_admin=True
        )
        db.add(admin)
        db.commit()
    
    # 2. Seed Surah Fatiha
    fatiha = db.query(QuranSurah).filter(QuranSurah.number == 1).first()
    if not fatiha:
        fatiha = QuranSurah(number=1, name_arabic="الفاتحة", name_english="Al-Fatihah")
        db.add(fatiha)
        db.commit()

        ayahs = [
            (1, "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "In the name of Allah, the Entirely Merciful, the Especially Merciful.", "اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے"),
            (2, "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", "[All] praise is [due] to Allah, Lord of the worlds -", "سب تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کا پالنے والا ہے"),
            (3, "الرَّحْمَٰنِ الرَّحِيمِ", "The Entirely Merciful, the Especially Merciful,", "بڑا مہربان، نہایت رحم والا"),
            (4, "مَالِكِ يَوْمِ الدِّينِ", "Sovereign of the Day of Recompense.", "روزِ جزا کا مالک"),
            (5, "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", "It is You we worship and You we ask for help.", "ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں"),
            (6, "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", "Guide us to the straight path -", "ہمیں سیدھے راستے پر چلا"),
            (7, "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", "The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray.", "ان لوگوں کے راستے پر جن پر تو نے انعام کیا، نہ ان کے راستے پر جن پر تیرا غضب ہوا اور نہ گمراہوں کے راستے پر")
        ]
        for num, ar, en, ur in ayahs:
            db.add(QuranAyah(surah_number=1, ayah_number=num, text_arabic=ar, text_english=en, text_urdu=ur))
        db.commit()

    # 3. Seed Hadith Sample
    bukhari = db.query(HadithBook).filter(HadithBook.title == "Sahih al-Bukhari").first()
    if not bukhari:
        bukhari = HadithBook(title="Sahih al-Bukhari")
        db.add(bukhari)
        db.commit()
        
        db.add(HadithEntry(
            book_id=bukhari.id,
            chapter_title="Revelation",
            text_arabic="إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
            text_english="Actions are but by intentions.",
            text_urdu="اعمال کا دارومدار نیتوں پر ہے۔"
        ))
        db.commit()

    # 4. Seed PDF Sample
    pdf = db.query(PDFBook).filter(PDFBook.title == "Tafsir al-Jalalayn").first()
    if not pdf:
        db.add(PDFBook(
            title="Tafsir al-Jalalayn",
            description="A classic Sunni tafsir of the Quran, composed first by Jalal ad-Din al-Mahalli and then completed by his student Jalal ad-Din as-Suyuti.",
            file_url="https://quran.com/pdf/tafsir-al-jalalayn.pdf"
        ))
        db.commit()

    # 4. Seed a Sample History Article
    history = db.query(Article).filter(Article.title == "The Golden Age of Islam").first()
    if not history:
        db.add(Article(
            category=ArticleCategory.HISTORY,
            title="The Golden Age of Islam",
            content="""
                <h2>Overview</h2>
                <p>The Islamic Golden Age was a period of cultural, economic, and scientific flourishing in the history of Islam, traditionally dated from the 8th century to the 14th century.</p>
                <h3>Key Advancements</h3>
                <ul>
                    <li>Mathematics (Al-Khwarizmi)</li>
                    <li>Medicine (Ibn Sina)</li>
                    <li>Optics (Ibn al-Haytham)</li>
                </ul>
            """,
            author_id=admin.id
        ))
        db.commit()

    db.close()
    print("Seed data applied successfully!")

if __name__ == "__main__":
    seed()
