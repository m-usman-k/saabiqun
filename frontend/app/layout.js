import './globals.css';
import { Inter, Amiri, Noto_Nastaliq_Urdu } from 'next/font/google';
import Link from 'next/link';
import React from 'react';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

const amiri = Amiri({ 
  subsets: ['arabic'], 
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

const notoUrdu = Noto_Nastaliq_Urdu({ 
  subsets: ['arabic'], 
  weight: ['400', '700'],
  variable: '--font-noto-urdu',
  display: 'swap',
});

export const metadata = {
  title: 'Saabiqun – Islamic Knowledge Repository',
  description: 'The ultimate repository for Quran, Hadith, History, and more.',
  icons: {
    icon: '/favicon.ico',
  },
}

import Navbar from './Navbar';
import ThemeToggle from './ThemeToggle';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${amiri.variable} ${notoUrdu.variable}`}>
      <body>
        <Navbar />
        <main className="page-fade-in" style={{minHeight: '80vh', padding: '2rem 0'}}>
          {children}
        </main>
        <footer className="footer">
           <div className="container" style={{ position: 'relative' }}>
              <ThemeToggle />
              <div className="footer-logo" style={{fontFamily: 'var(--font-amiri)', fontSize: '2.5rem', marginBottom: '1rem'}}>وَالسَّابِقُونَ السَّابِقُونَ</div>
              <p className="footer-text" style={{fontFamily: 'var(--font-noto-urdu)', fontSize: '1.4rem', marginBottom: '0.5rem'}}>اور جو آگے والے ہیں وہ تو آگے والے ہی ہیں</p>
              <p className="footer-text" style={{fontFamily: 'var(--font-inter)', fontSize: '1.2rem', marginBottom: '1rem'}}>And the foremost are the foremost</p>
              <div className="footer-hawala" style={{fontFamily: 'var(--font-amiri)', color: 'white', letterSpacing: '1.5px', fontSize: '1.4rem', borderTop: '1px solid rgba(255,255,255,0.15)', display: 'inline-block', paddingTop: '0.4rem', marginTop: '0.4rem'}}>[ سورة الواقعة : ١٠ ]</div>
              <p style={{marginTop: '2.5rem', fontSize: '0.8rem', opacity: '0.4'}}>&copy; 2026 Saabiqun Community Project. Dedicated to preserving authentic knowledge.</p>
           </div>
        </footer>
      </body>
    </html>
  );
}
