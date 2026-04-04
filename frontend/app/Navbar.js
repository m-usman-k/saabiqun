'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for user in localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link href="/" className="nav-logo">
          <span style={{fontFamily: 'var(--font-amiri)', color: 'white', marginRight: '10px'}}>السابقون</span>
          <span>Saabiqun</span>
        </Link>
        
        <div className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} color="white" /> : <Menu size={28} color="white" />}
        </div>

        <div className={`nav-links ${isMenuOpen ? 'mobile-active' : ''}`}>
          <Link href="/quran" className="nav-link" onClick={() => setIsMenuOpen(false)}>Quran</Link>
          <Link href="/hadith" className="nav-link" onClick={() => setIsMenuOpen(false)}>Hadith</Link>
          <Link href="/history" className="nav-link" onClick={() => setIsMenuOpen(false)}>History</Link>
          <Link href="/qna" className="nav-link" onClick={() => setIsMenuOpen(false)}>Q&A</Link>
          <Link href="/stories" className="nav-link" onClick={() => setIsMenuOpen(false)}>Stories</Link>
          <Link href="/pdf-books" className="nav-link" onClick={() => setIsMenuOpen(false)}>PDFs</Link>
          
          {user?.is_admin && (
            <>
              <Link href="/simpleprog/admin" className="nav-link" style={{color: 'var(--accent-color)'}} onClick={() => setIsMenuOpen(false)}>Admin Center</Link>
              <button onClick={handleLogout} className="btn-logout" style={{marginLeft: '10px'}}>Sign Out</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
