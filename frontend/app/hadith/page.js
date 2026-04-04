import Link from 'next/link';

import SearchableHadith from './SearchableHadith';

async function getHadithBooks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/content/hadith/books`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function HadithPage() {
  const books = await getHadithBooks();
  return <SearchableHadith initialBooks={books} />;
}
