import Link from 'next/link';

async function getAyahs(surahName) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/content/quran/surah/by-name/${surahName}/ayahs`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

async function getSurah(surahName) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/content/quran/surah/by-name/${surahName}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function SurahDetail({ params }) {
  const { surah: surahName } = params;
  const ayahs = await getAyahs(surahName);
  const currentSurah = await getSurah(surahName);

  if (!currentSurah) return <div className="container"><p>Surah "{surahName}" not found.</p></div>;

  return (
    <div className="container page-fade-in">
      <Link href="/quran" className="btn" style={{marginBottom: '2rem', display: 'inline-block', opacity: 0.6}}>Back to Index</Link>
      
      <div className="wiki-article" style={{paddingBottom: '4rem'}}>
        <div className="wiki-header">
           <div className="flex-between" style={{alignItems: 'baseline'}}>
             <h1 style={{margin: 0}}>Surah {currentSurah.name_english}</h1>
             <span style={{fontFamily: 'serif', fontSize: '2.5rem', color: 'var(--heading-color, var(--primary-color))'}}>{currentSurah.name_arabic}</span>
           </div>
           <p style={{fontSize: '0.9rem', color: 'var(--text-color)', opacity: 0.7, marginTop: '0.5rem'}}>From Saabiqun, the digital Noble Quran explorer.</p>
        </div>

        <div className="ayahs-list" style={{marginTop: '3rem'}}>
          {ayahs.map((ayah) => (
            <div key={ayah.id} className="quran-ayah-card">
              <div className="ayah-number-badge">{ayah.ayah_number}</div>
              <div className="ayah-arabic">{ayah.text_arabic}</div>
              <div className="ayah-translation-ur">{ayah.text_urdu}</div>
              <div className="ayah-translation-en">{ayah.text_english}</div>
            </div>
          ))}
          {ayahs.length === 0 && <p style={{textAlign: 'center', opacity: 0.5}}>No ayahs have been recorded for this surah yet.</p>}
        </div>
      </div>
    </div>
  );
}
