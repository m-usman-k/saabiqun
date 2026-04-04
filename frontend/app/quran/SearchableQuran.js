'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function SearchableQuran({ initialSurahs }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSurahs = initialSurahs.filter(surah => 
    surah.name_english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.name_arabic.includes(searchTerm) ||
    surah.number.toString().includes(searchTerm)
  );

  return (
    <div className="container page-fade-in">
      <h1 className="section-title">The Noble Quran</h1>
      <p style={{marginBottom: '2rem', textAlign: 'center', color: 'var(--text-color)'}}>Explore the words of Allah (SWT) with translations in Urdu and English.</p>
      
      <div className="search-bar-container" style={{marginBottom: '3rem'}}>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Search by Surah name or number..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{maxWidth: '600px', margin: '0 auto', display: 'block', borderRadius: 0, border: '2px solid var(--heading-color, var(--primary-color))'}}
        />
      </div>

      <div className="grid">
        {filteredSurahs.map((surah) => (
          <Link key={surah.id} href={`/quran/${surah.name_english}`} className="card">
            <span style={{fontSize: '0.75rem', color: 'var(--text-color)', opacity: 0.7}}>Surah {surah.number}</span>
            <div className="flex-between" style={{marginTop: '0.25rem'}}>
              <h3 style={{margin: 0}}>{surah.name_english}</h3>
              <span style={{fontFamily: 'var(--font-amiri)', fontSize: '1.5rem', color: 'var(--heading-color, var(--primary-color))'}}>{surah.name_arabic}</span>
            </div>
          </Link>
        ))}
      </div>
      {filteredSurahs.length === 0 && <p style={{textAlign: 'center', opacity: 0.5, marginTop: '2rem'}}>No surahs matching your search.</p>}
    </div>
  );
}
