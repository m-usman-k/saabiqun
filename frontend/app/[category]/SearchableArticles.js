'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function SearchableArticles({ initialArticles, category }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = initialArticles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container page-fade-in">
      <h1 className="section-title" style={{textTransform: 'capitalize'}}>{category} Archive</h1>
      <p style={{marginBottom: '2rem', textAlign: 'center'}}>Browse our collection of authentic {category} records.</p>
      
      <div className="search-bar-container" style={{marginBottom: '3rem'}}>
        <input 
          type="text" 
          className="form-input" 
          placeholder={`Search ${category} records...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{maxWidth: '600px', margin: '0 auto', display: 'block', borderRadius: 0, border: '2px solid var(--heading-color, var(--primary-color))'}}
        />
      </div>

      <div className="grid">
        {filteredArticles.map((article) => (
          <Link key={article.id} href={`/article/${article.id}`} className="card">
            <h3>{article.title}</h3>
            <p style={{fontSize: '0.8rem', color: '#888', marginTop: '0.5rem'}}>
              {new Date(article.created_at).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
      {filteredArticles.length === 0 && <p style={{textAlign: 'center', opacity: 0.5, marginTop: '2rem'}}>No records matching your search.</p>}
    </div>
  );
}
