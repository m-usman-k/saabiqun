import Link from 'next/link';

import SearchableQuran from './SearchableQuran';

async function getSurahs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/content/quran/surahs`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function QuranPage() {
  const surahs = await getSurahs();
  return <SearchableQuran initialSurahs={surahs} />;
}
