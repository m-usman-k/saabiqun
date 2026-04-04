import Link from 'next/link';

export default function Home() {
  return (
    <div className="page-fade-in">
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--font-amiri)', fontSize: '3rem', color: 'var(--text-color)', marginBottom: '0.5rem', fontWeight: '400' }}>
            اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-color)', opacity: '0.7', fontStyle: 'italic', marginBottom: '0.5rem' }}>
            "Read! In the name of your Lord who created..."
          </p>
          <div style={{fontFamily: 'var(--font-amiri)', color: 'var(--text-color)', opacity: '0.8', letterSpacing: '1.5px', fontSize: '1.2rem', borderTop: '1px solid var(--border-color)', display: 'inline-block', paddingTop: '0.4rem', marginTop: '0.4rem'}}>
            [ سورة العلق : ١ ]
          </div>
        </div>

        <h1 style={{ fontSize: '3rem', color: 'var(--text-color)', marginBottom: '1.5rem', fontWeight: '700' }}>
          Digital Repository of Authentic Knowledge
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: 'var(--text-color)', opacity: '0.8', maxWidth: '800px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
          Saabiqun is dedicated to the preservation and accessible study of primary Islamic texts, history, and literature for the modern student of knowledge.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '5rem' }}>
          <Link href="/quran" className="btn btn-home">
            Explore Quran
          </Link>
          <Link href="/hadith" className="btn btn-home">
            Study Hadith
          </Link>
        </div>

        <div className="grid">
          <Link href="/history" className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-noto-urdu)', fontSize: '2.5rem', color: 'var(--text-color)', marginBottom: '1rem', fontWeight: '400' }}>تاريخ</h2>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-color)', marginBottom: '1rem' }}>Islamic History</h3>
            <p style={{ color: 'var(--text-color)', opacity: '0.8', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Chronicles of the righteous predecessors, the rise of civilizations, and the legacy of scholars.
            </p>
          </Link>
          <Link href="/qna" className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-noto-urdu)', fontSize: '2.5rem', color: 'var(--text-color)', marginBottom: '1rem', fontWeight: '400' }}>سوال وجواب</h2>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-color)', marginBottom: '1rem' }}>Logic & Q&A</h3>
            <p style={{ color: 'var(--text-color)', opacity: '0.8', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Critical inquiry and structured discourse on contemporary and classical Islamic jurisprudence.
            </p>
          </Link>
          <Link href="/stories" className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-noto-urdu)', fontSize: '2.5rem', color: 'var(--text-color)', marginBottom: '1rem', fontWeight: '400' }}>قصص</h2>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-color)', marginBottom: '1rem' }}>Literature & Stories</h3>
            <p style={{ color: 'var(--text-color)', opacity: '0.8', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Narratives from the Prophets (AS) and the Sahaba (RA) documented for moral and spiritual growth.
            </p>
          </Link>
        </div>
      </div>

      <div style={{ padding: '5rem 1.5rem', textAlign: 'center', marginTop: '4rem', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-amiri)', fontSize: '2.5rem', color: 'var(--text-color)', marginBottom: '1.5rem', fontWeight: '400', lineHeight: '1.8' }}>
            يَرْفَعِ اللّٰهُ الَّذِيْنَ اٰمَنُوْا مِنْكُمْ ۙ وَالَّذِيْنَ اُوْتُوا الْعِلْمَ دَرَجٰتٍ
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-color)', fontStyle: 'italic', maxWidth: '800px', margin: '0 auto 1.5rem' }}>
            "Allah will raise those who have believed among you and those who were given knowledge, by degrees."
          </p>
          <div style={{fontFamily: 'var(--font-amiri)', color: 'var(--text-color)', opacity: '0.8', letterSpacing: '1.5px', fontSize: '1.2rem', borderTop: '1px solid var(--border-color)', display: 'inline-block', paddingTop: '0.4rem', marginTop: '0.4rem'}}>
            [ سورة المجادلة : ١١ ]
          </div>
        </div>
      </div>
    </div>
  );
}
