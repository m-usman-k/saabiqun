'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function SearchableHadith({ initialBooks }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = initialBooks.filter(book => 
    book.title && book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container page-fade-in">
      <h1 className="section-title">The Sunnah – Hadith Repository</h1>
      <p style={{marginBottom: '2rem', textAlign: 'center'}}>Authentic Prophetic traditions with translations into Urdu and English.</p>
      
      <div className="search-bar-container" style={{marginBottom: '3rem'}}>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Search collections (e.g. Bukhari, Muslim)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{maxWidth: '600px', margin: '0 auto', display: 'block', borderRadius: 0, border: '2px solid var(--heading-color, var(--primary-color))'}}
        />
      </div>

      <div className="grid">
        {filteredBooks.map((book) => (
          <Link key={book.id} href={`/hadith/${book.title}`} className="card">
            <h3 style={{margin: 0}}>{book.title}</h3>
            <p style={{marginTop: '0.5rem', opacity: 0.8}}>Sunnah and Hadith Library of {book.title}.</p>
          </Link>
        ))}
      </div>
      {filteredBooks.length === 0 && <p style={{textAlign: 'center', opacity: 0.5, marginTop: '2rem'}}>No collections matching your search.</p>}
    </div>
  );
}
