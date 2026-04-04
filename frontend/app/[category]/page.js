import Link from 'next/link';

import SearchableArticles from './SearchableArticles';

async function getArticles(category) {
  if (!category || category === 'favicon.ico') return [];
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/content/articles/${category}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function CategoryPage({ params }) {
  const { category } = params;
  if (category === 'favicon.ico') return null;
  const articles = await getArticles(category);
  return <SearchableArticles initialArticles={articles} category={category} />;
}
