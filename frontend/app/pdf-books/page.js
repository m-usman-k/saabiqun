import Link from 'next/link';
import { Download } from 'lucide-react';

async function getPDFs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/content/pdf-books`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function PDFPage() {
  const pdfs = await getPDFs();

  return (
    <div className="container page-fade-in">
      <h1 className="section-title">The Vault – PDF Archive</h1>
      <p style={{marginBottom: '2.5rem', textAlign: 'center'}}>A collection of downloadable Islamic literature in PDF format.</p>
      
      <div className="grid">
        {pdfs.map((pdf) => (
          <div key={pdf.id} className="card">
            <Download color="var(--primary-color)" size={24} style={{marginBottom: '0.5rem'}} />
            <h3 style={{margin: 0}}>{pdf.title}</h3>
            <p style={{margin: '1rem 0', fontSize: '0.9rem', color: '#666'}}>{pdf.description || "Historical records and books of knowledge."}</p>
            <a 
              href={pdf.file_url} 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-primary" 
              style={{display: 'inline-block', textDecoration: 'none', textAlign: 'center', width: '100%'}}
            >
              Download PDF
            </a>
          </div>
        ))}
        {pdfs.length === 0 && <p style={{textAlign: 'center', opacity: 0.5}}>The archive is currently empty.</p>}
      </div>
    </div>
  );
}
