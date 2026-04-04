import Link from 'next/link';

async function getHadithEntries(title) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/content/hadith/book/by-title/${title}/entries`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

async function getHadithBook(title) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/content/hadith/book/by-title/${title}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function HadithDetail({ params }) {
  const { title } = params;
  if (!title || title === 'undefined') return null;
  const entries = await getHadithEntries(title);
  const currentBook = await getHadithBook(title);

  if (!currentBook) return <div className="container"><p>Hadith collection "{title}" not found.</p></div>;

  return (
    <div className="container page-fade-in">
      <Link href="/hadith" className="btn" style={{marginBottom: '2rem', display: 'inline-block', opacity: 0.6}}>Back to Index</Link>
      
      <div className="wiki-article" style={{paddingBottom: '4rem'}}>
        <div className="wiki-header">
           <h1 style={{margin: 0}}>{currentBook.title}</h1>
           <p style={{fontSize: '0.9rem', color: '#888', marginTop: '0.5rem'}}>From Saabiqun, the digital collection of Sunnah.</p>
        </div>

        <div className="hadith-list" style={{marginTop: '3rem'}}>
          {entries.map((hadith, index) => (
            <div key={hadith.id} className="quran-ayah-card">
              <div className="ayah-number-badge">{index + 1}</div>
              {hadith.chapter_title && hadith.chapter_title.replace(/revelation/gi, '').trim() && (
                <h4 style={{marginBottom: '1.5rem', color: 'var(--heading-color, var(--primary-color))', fontSize: '1.1rem'}}>
                  {hadith.chapter_title.replace(/revelation/gi, '').trim()}
                </h4>
              )}
              <div className="ayah-arabic">{hadith.text_arabic}</div>
              <div className="ayah-translation-ur">{hadith.text_urdu}</div>
              <div className="ayah-translation-en">{hadith.text_english}</div>
            </div>
          ))}
          {entries.length === 0 && <p style={{textAlign: 'center', opacity: 0.5}}>No entries have been recorded for this collection yet.</p>}
        </div>
      </div>
    </div>
  );
}
