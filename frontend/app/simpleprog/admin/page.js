'use client';
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// --- Custom Theme-Matching Searchable Select ---
function SearchableSelect({ items, value, onChange, placeholder, labelField = "label", valueField = "value" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  const filtered = items.filter(item => 
    String(item[labelField]).toLowerCase().includes(search.toLowerCase())
  );

  const selectedItem = items.find(i => String(i[valueField]) === String(value));

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div 
        className="form-input" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          cursor: 'pointer', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'var(--bg-color)',
          padding: '0.8rem', // Identical to .form-input in layout
          height: '45px',    // Matched for precision
          boxSizing: 'border-box',
          borderRadius: '6px'
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem', color: 'var(--text-color)' }}>
            {selectedItem ? selectedItem[labelField] : <span style={{opacity: 0.5}}>{placeholder}</span>}
        </span>
        <span style={{ fontSize: '0.7rem', opacity: 0.5, marginLeft: '10px', color: 'var(--text-color)' }}>▼</span>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          marginTop: '2px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          borderRadius: '4px'
        }}>
          <input 
            className="form-input"
            autoFocus
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', borderBottom: '1px solid var(--border-color)', padding: '1rem', width: '100%', height: '45px', background: 'transparent' }}
            onClick={(e) => e.stopPropagation()}
          />
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {filtered.map(item => (
              <div 
                key={item[valueField]}
                onClick={() => { onChange(item[valueField]); setIsOpen(false); setSearch(""); }}
                style={{ 
                  padding: '0.75rem 1rem', 
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  background: String(value) === String(item[valueField]) ? 'var(--heading-color, var(--primary-color))' : 'transparent',
                  color: String(value) === String(item[valueField]) ? 'var(--bg-color)' : 'var(--text-color)'
                }}
              >
                {item[labelField]}
              </div>
            ))}
            {filtered.length === 0 && <div style={{ padding: '1rem', opacity: 0.5, textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-color)' }}>No results.</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("articles");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const clearMessages = () => { setSuccess(""); setError(""); };
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  // --- Article State ---
  const [articleData, setArticleData] = useState({ id: null, title: "", category: "history", content: "" });
  const [articles, setArticles] = useState([]);

  const fetchArticles = async (cat) => {
    if (!cat) return;
    try {
      const res = await axios.get(`${API_URL}/api/content/articles/${cat}`);
      setArticles(res.data || []);
    } catch {}
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (articleData.id) {
        await axios.put(`${API_URL}/api/content/articles/${articleData.id}`, articleData, getAuthHeaders());
        setSuccess("Article updated successfully!");
      } else {
        await axios.post(`${API_URL}/api/content/articles`, articleData, getAuthHeaders());
        setSuccess("New article published!");
      }
      setArticleData({ id: null, title: "", category: articleData.category, content: "" });
      fetchArticles(articleData.category);
    } catch { setError("Publishing protocol failed."); }
  };

  // --- Quran State ---
  const [surahData, setSurahData] = useState({ id: null, number: "", name_arabic: "", name_english: "" });
  const [ayahData, setAyahData] = useState({ id: null, surah_number: "", ayah_number: "", text_arabic: "", text_english: "", text_urdu: "" });
  const [surahs, setSurahs] = useState([]);
  const [currentAyahs, setCurrentAyahs] = useState([]);

  useEffect(() => {
    if (activeTab === "quran") fetchSurahs();
    if (activeTab === "hadith") fetchHadithBooks();
    if (activeTab === "articles") fetchArticles(articleData.category);
  }, [activeTab]);

  const fetchSurahs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/content/quran/surahs`);
      setSurahs(res.data);
    } catch {}
  };

  const fetchAyahs = async (surahNum) => {
    if (!surahNum) { setCurrentAyahs([]); return; }
    try {
      const res = await axios.get(`${API_URL}/api/content/quran/surah/${surahNum}/ayahs`);
      setCurrentAyahs(res.data);
    } catch {}
  };

  const deleteAyah = async (id) => {
    if (!confirm('Permanent delete Ayah?')) return;
    try {
      await axios.delete(`${API_URL}/api/content/quran/ayahs/${id}`, getAuthHeaders());
      setSuccess("Ayah removed."); fetchAyahs(ayahData.surah_number);
    } catch { setError("Deletion failure."); }
  };

  const handleSurahSubmit = async (e) => {
    e.preventDefault();
    try {
      if (surahData.id) {
        await axios.put(`${API_URL}/api/content/quran/surahs/${surahData.id}`, { ...surahData, number: parseInt(surahData.number) }, getAuthHeaders());
        setSuccess("Surah record updated.");
      } else {
        await axios.post(`${API_URL}/api/content/quran/surahs`, { ...surahData, number: parseInt(surahData.number) }, getAuthHeaders());
        setSuccess("New Surah registered.");
      }
      setSurahData({ id: null, number: "", name_arabic: "", name_english: "" }); fetchSurahs();
    } catch { setError("Surah registry error."); }
  };

  const handleAyahSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...ayahData, surah_number: parseInt(ayahData.surah_number), ayah_number: parseInt(ayahData.ayah_number) };
      if (ayahData.id) {
        await axios.put(`${API_URL}/api/content/quran/ayahs/${ayahData.id}`, payload, getAuthHeaders());
        setSuccess("Ayah updated.");
      } else {
        await axios.post(`${API_URL}/api/content/quran/ayahs`, payload, getAuthHeaders());
        setSuccess("Ayah recorded successfully.");
      }
      setAyahData({ id: null, surah_number: ayahData.surah_number, ayah_number: (parseInt(ayahData.ayah_number) + 1).toString(), text_arabic: "", text_english: "", text_urdu: "" });
      fetchAyahs(ayahData.surah_number);
    } catch { setError("Ayah recording failed."); }
  };

  // --- Hadith State ---
  const [hadithBookData, setHadithBookData] = useState({ id: null, title: "" });
  const [hadithEntryData, setHadithEntryData] = useState({ id: null, book_id: "", chapter_title: "", text_arabic: "", text_english: "", text_urdu: "" });
  const [hadithBooks, setHadithBooks] = useState([]);
  const [currentHadiths, setCurrentHadiths] = useState([]);

  const fetchHadithBooks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/content/hadith/books`);
      setHadithBooks(res.data);
    } catch {}
  };

  const fetchHadithEntries = async (bookId) => {
    if (!bookId) { setCurrentHadiths([]); return; }
    try {
      const res = await axios.get(`${API_URL}/api/content/hadith/book/${bookId}/entries`);
      setCurrentHadiths(res.data);
    } catch {}
  };

  const deleteHadithEntry = async (id) => {
    if (!confirm('Permanent delete Entry?')) return;
    try {
      await axios.delete(`${API_URL}/api/content/hadith/entries/${id}`, getAuthHeaders());
      setSuccess("Entry removed."); fetchHadithEntries(hadithEntryData.book_id);
    } catch { setError("Deletion failure."); }
  };

  const handleHadithBookSubmit = async (e) => {
    e.preventDefault();
    try {
      if (hadithBookData.id) {
        await axios.put(`${API_URL}/api/content/hadith/books/${hadithBookData.id}`, hadithBookData, getAuthHeaders());
        setSuccess("Collection title updated.");
      } else {
        await axios.post(`${API_URL}/api/content/hadith/books`, hadithBookData, getAuthHeaders());
        setSuccess("Collection added to library.");
      }
      setHadithBookData({ id: null, title: "" }); fetchHadithBooks();
    } catch { setError("Collection registry failed."); }
  };

  const handleHadithEntrySubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...hadithEntryData, book_id: parseInt(hadithEntryData.book_id) };
      if (hadithEntryData.id) {
        await axios.put(`${API_URL}/api/content/hadith/entries/${hadithEntryData.id}`, payload, getAuthHeaders());
        setSuccess("Hadith narration updated.");
      } else {
        await axios.post(`${API_URL}/api/content/hadith/entries`, payload, getAuthHeaders());
        setSuccess("Hadith narration recorded.");
      }
      setHadithEntryData({ id: null, ...hadithEntryData, text_arabic: "", text_english: "", text_urdu: "" });
      fetchHadithEntries(hadithEntryData.book_id);
    } catch { setError("Narration save failed."); }
  };

  if (!user?.is_admin) return <div className="container" style={{padding: '5rem', textAlign: 'center'}}><h2>Access Denied.</h2></div>;

  return (
    <div className="container page-fade-in">
      <h1 className="section-title">Knowledge Management Dashboard</h1>
      
      {/* Dynamic Tab Selector */}
      <div style={{ display: "flex", width: "100%", marginBottom: "3rem", border: "1px solid var(--border-color)", background: "#f5f5f5" }}>
        {["articles", "quran", "hadith"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); clearMessages(); }}
            style={{
              flex: 1, padding: "1.25rem", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "1rem", 
              textTransform: "capitalize", background: activeTab === tab ? "var(--primary-color)" : "transparent",
              color: activeTab === tab ? "white" : "#555", transition: "all 0.2s ease"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {(success || error) && (
        <div style={{ 
          padding: '1.5rem', marginBottom: '2rem', borderRadius: 0,
          background: success ? '#e0ffe0' : '#ffe0e0', color: success ? '#1b5e20' : '#c62828',
          border: `1px solid ${success ? '#c3e6cb' : '#f5c6cb'}`, fontWeight: 600
        }}>{success || error}</div>
      )}

      <div className="wiki-article" style={{ minHeight: 'auto', padding: '3rem' }}>
        {activeTab === "articles" && (
          <div>
            <form onSubmit={handleArticleSubmit} style={{ width: '100%', marginBottom: '4rem' }}>
               <div className="admin-card-header" style={{ marginBottom: '2rem' }}><h4>Article Editor {articleData.id && '(Edit Mode active)'}</h4></div>
               <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                 <div className="form-group"><label>Title</label><input className="form-input" value={articleData.title} onChange={e => setArticleData({ ...articleData, title: e.target.value })} required /></div>
                 <div className="form-group">
                    <label>Branch</label>
                    <select className="form-input" value={articleData.category} onChange={e => {setArticleData({ ...articleData, category: e.target.value }); fetchArticles(e.target.value);}}>
                      <option value="history">History</option><option value="qna">Q&A</option><option value="stories">Stories</option>
                    </select>
                 </div>
               </div>
               <div className="form-group"><label>Content (Rich Text)</label><ReactQuill theme="snow" value={articleData.content} onChange={val => setArticleData({ ...articleData, content: val })} /></div>
               <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '3rem', flex: 1, padding: '1.5rem', fontSize: '1.1rem' }}>{articleData.id ? 'Push Update' : 'Publish Article'}</button>
                {articleData.id && <button onClick={() => setArticleData({id: null, title:"", category: articleData.category, content:""})} className="btn" style={{ marginTop: '3rem', padding: '1.5rem' }}>Cancel</button>}
               </div>
            </form>
            <div className="card">
               <div className="admin-card-header"><h4>Published Articles Index ({articleData.category})</h4></div>
               <div style={{ padding: '1rem' }}>
                  {articles.map(a => (
                    <div key={a.id} className="flex-between" style={{ padding: '1rem 0', borderBottom: '1px solid #eee' }}>
                      <span>{a.title}</span>
                      <div style={{ display: 'flex', gap: '1.5rem' }}>
                         <button onClick={() => setArticleData(a)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontWeight: 'bold', cursor: 'pointer' }}>Edit</button>
                         <button onClick={() => { if(confirm('Exterminate?')) axios.delete(`${API_URL}/api/content/articles/${a.id}`, getAuthHeaders()).then(()=>fetchArticles(a.category)); }} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
        
        {activeTab === "quran" && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <form className="card" onSubmit={handleSurahSubmit}>
                  <div className="admin-card-header"><h4>Surah Management {surahData.id && '(Edit)'}</h4></div>
                  <div style={{ padding: '1.5rem' }}>
                    <div className="form-group"><label>Number</label><input className="form-input" type="number" value={surahData.number} onChange={e => setSurahData({...surahData, number: e.target.value})} required /></div>
                    <div className="form-group"><label>Arabic</label><input className="form-input rtl" value={surahData.name_arabic} onChange={e => setSurahData({...surahData, name_arabic: e.target.value})} required style={{fontFamily: 'var(--font-amiri)'}} /></div>
                    <div className="form-group"><label>English</label><input className="form-input" value={surahData.name_english} onChange={e => setSurahData({...surahData, name_english: e.target.value})} required /></div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>{surahData.id ? 'Update Record' : 'Register Surah'}</button>
                  </div>
               </form>
               <div className="card">
                 <div className="admin-card-header"><h4>Surah Master List</h4></div>
                 <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '1rem' }}>
                    {surahs.map(s => (
                      <div key={s.id} className="flex-between" style={{ padding: '0.75rem 0', borderBottom: '1px solid #eee' }}>
                        <span>{s.number}. {s.name_english}</span>
                        <button onClick={() => setSurahData(s)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontWeight: 'bold', cursor: 'pointer' }}>Edit</button>
                      </div>
                    ))}
                 </div>
               </div>
             </div>

             <div>
               <form className="card" onSubmit={handleAyahSubmit} style={{ marginBottom: '2rem' }}>
                  <div className="admin-card-header"><h4>Ayah Content {ayahData.id && '(Edit active)'}</h4></div>
                  <div style={{ padding: '1.5rem' }}>
                    <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'end' }}>
                      <div className="form-group" style={{marginBottom: 0}}>
                        <label>Target Surah</label>
                        <SearchableSelect 
                            items={surahs.map(s => ({ value: s.number, label: `${s.number}. ${s.name_english}` }))}
                            value={ayahData.surah_number}
                            onChange={(val) => { setAyahData({...ayahData, surah_number: val }); fetchAyahs(val); }}
                            placeholder="Select Surah..."
                        />
                      </div>
                      <div className="form-group" style={{marginBottom: 0}}><label>Ayah #</label><input className="form-input" type="number" value={ayahData.ayah_number} onChange={e => setAyahData({...ayahData, ayah_number: e.target.value})} required style={{height: '45px'}} /></div>
                    </div>
                    <div className="form-group" style={{marginTop: '1.5rem'}}><label>Script (Arabic)</label><textarea className="form-input rtl" value={ayahData.text_arabic} onChange={e => setAyahData({...ayahData, text_arabic: e.target.value})} style={{ fontFamily: 'var(--font-amiri)', height: '150px', fontSize: '1.8rem', resize: 'none' }} /></div>
                    <div className="form-group"><label>Translation (English)</label><textarea className="form-input" value={ayahData.text_english} onChange={e => setAyahData({...ayahData, text_english: e.target.value})} style={{ height: '100px', resize: 'none' }} /></div>
                    <div className="form-group"><label>Translation (Urdu)</label><textarea className="form-input rtl" value={ayahData.text_urdu} onChange={e => setAyahData({...ayahData, text_urdu: e.target.value})} style={{ height: '120px', fontFamily: 'var(--font-noto-urdu)', fontSize: '1.4rem', resize: 'none' }} /></div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1.2rem' }}>{ayahData.id ? 'Apply Update' : 'Save Entry'}</button>
                    {ayahData.id && <button onClick={()=>setAyahData({id:null, surah_number: ayahData.surah_number, ayah_number: (parseInt(ayahData.ayah_number)+1).toString(), text_arabic:"", text_english:"", text_urdu:""})} className="btn" style={{width:'100%', marginTop:'1rem'}}>New Ayah</button>}
                  </div>
               </form>
               <div className="card">
                   <div className="admin-card-header"><h4>Surah Management List</h4></div>
                   {!ayahData.surah_number ? (
                     <div style={{padding:'2rem', textAlign:'center', opacity:0.5}}>Please select a Surah above to view and manage existing ayahs.</div>
                   ) : (
                    <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '1rem' }}>
                        {currentAyahs.length === 0 && <div style={{padding:'1rem', textAlign:'center', opacity:0.5}}>No ayahs recorded for this Surah yet.</div>}
                        {currentAyahs.map(a => (
                            <div key={a.id} className="flex-between" style={{ padding: '1rem 0', borderBottom: '1px solid #eee' }}>
                            <div style={{ maxWidth: '75%' }}><span style={{ fontWeight: 'bold' }}>#{a.ayah_number}</span>: {a.text_english.substring(0, 70)}...</div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => setAyahData(a)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontWeight: 'bold', cursor: 'pointer' }}>Edit</button>
                                <button onClick={() => deleteAyah(a.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                            </div>
                            </div>
                        ))}
                    </div>
                   )}
               </div>
             </div>
          </div>
        )}

        {activeTab === "hadith" && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <form className="card" onSubmit={handleHadithBookSubmit}>
                  <div className="admin-card-header"><h4>Collection Management {hadithBookData.id && '(Edit mode)'}</h4></div>
                  <div style={{ padding: '1.5rem' }}>
                    <div className="form-group"><label>Title</label><input className="form-input" value={hadithBookData.title} onChange={e => setHadithBookData({...hadithBookData, title: e.target.value})} required /></div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>{hadithBookData.id ? 'Save Changes' : 'Create Book'}</button>
                  </div>
               </form>
               <div className="card">
                 <div className="admin-card-header"><h4>Library Index</h4></div>
                 <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '1rem' }}>
                    {hadithBooks.map(b => (
                      <div key={b.id} className="flex-between" style={{ padding: '0.75rem 0', borderBottom: '1px solid #eee' }}>
                        <span>{b.title}</span>
                        <button onClick={() => setHadithBookData(b)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontWeight: 'bold', cursor: 'pointer' }}>Edit</button>
                      </div>
                    ))}
                 </div>
               </div>
             </div>

             <div>
               <form className="card" onSubmit={handleHadithEntrySubmit} style={{ marginBottom: '2rem' }}>
                  <div className="admin-card-header"><h4>Narration Entry {hadithEntryData.id && '(Edit Active)'}</h4></div>
                  <div style={{ padding: '1.5rem' }}>
                    <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'end' }}>
                      <div className="form-group" style={{marginBottom: 0}}>
                        <label>Target Collection</label>
                        <SearchableSelect 
                            items={hadithBooks.map(b => ({ value: b.id, label: b.title }))}
                            value={hadithEntryData.book_id}
                            onChange={(val) => { setHadithEntryData({...hadithEntryData, book_id: val }); fetchHadithEntries(val); }}
                            placeholder="Select Collection..."
                        />
                      </div>
                      <div className="form-group" style={{marginBottom: 0}}><label>Chapter</label><input className="form-input" value={hadithEntryData.chapter_title} onChange={e => setHadithEntryData({...hadithEntryData, chapter_title: e.target.value})} style={{height: '45px'}} /></div>
                    </div>
                    <div className="form-group" style={{marginTop:'1.5rem'}}><label>Original Script</label><textarea className="form-input rtl" value={hadithEntryData.text_arabic} onChange={e => setHadithEntryData({...hadithEntryData, text_arabic: e.target.value})} style={{ fontFamily: 'var(--font-amiri)', height: '150px', fontSize: '1.8rem', resize: 'none' }} /></div>
                    <div className="form-group"><label>English Narration</label><textarea className="form-input" value={hadithEntryData.text_english} onChange={e => setHadithEntryData({...hadithEntryData, text_english: e.target.value})} style={{ height: '100px', resize: 'none' }} /></div>
                    <div className="form-group"><label>Urdu Narration</label><textarea className="form-input rtl" value={hadithEntryData.text_urdu} onChange={e => setHadithEntryData({...hadithEntryData, text_urdu: e.target.value})} style={{ height: '120px', fontFamily: 'var(--font-noto-urdu)', fontSize: '1.4rem', resize: 'none' }} /></div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1.2rem' }}>{hadithEntryData.id ? 'Commit Update' : 'Record Hadith'}</button>
                  </div>
               </form>
               <div className="card">
                   <div className="admin-card-header"><h4>Collection Narrations</h4></div>
                   {!hadithEntryData.book_id ? (
                      <div style={{padding:'2rem', textAlign:'center', opacity:0.5}}>Please select a Collection above to manage narrations.</div>
                   ) : (
                    <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '1rem' }}>
                        {currentHadiths.length === 0 && <div style={{padding:'1rem', textAlign:'center', opacity:0.5}}>No entries in this collection yet.</div>}
                        {currentHadiths.map(h => (
                            <div key={h.id} className="flex-between" style={{ padding: '1rem 0', borderBottom: '1px solid #eee' }}>
                            <div style={{ maxWidth: '75%' }}><span style={{ fontWeight: 'bold' }}>Ref #{h.id}</span>: {h.text_english.substring(0, 70)}...</div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => setHadithEntryData(h)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontWeight: 'bold', cursor: 'pointer' }}>Edit</button>
                                <button onClick={() => deleteHadithEntry(h.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                            </div>
                            </div>
                        ))}
                    </div>
                   )}
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
