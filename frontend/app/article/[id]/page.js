import Link from 'next/link';

async function getArticle(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/content/article/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function ArticleDetail({ params }) {
  const { id } = params;
  const article = await getArticle(id);

  if (!article) return <div className="container"><p>Article {id} not found.</p></div>;

  return (
    <div className="container page-fade-in">
      <Link href={`/${article.category}`} className="btn" style={{marginBottom: '2rem', display: 'inline-block', opacity: 0.6}}>Back to {article.category}</Link>
      
      <div className="wiki-article">
         <div className="wiki-header">
           <h1 style={{margin: 0, textTransform: 'capitalize'}}>{article.title}</h1>
           <p style={{fontSize: '0.9rem', color: '#888', marginTop: '0.5rem'}}>From Saabiqun, the digital free encyclopedia of Islamic knowledge.</p>
         </div>
         <div 
            className="article-content" 
            style={{marginTop: '2rem'}}
            dangerouslySetInnerHTML={{ __html: article.content }} 
         />
      </div>
    </div>
  );
}
