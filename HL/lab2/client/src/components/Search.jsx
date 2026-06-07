import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Search() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(data => { setResults(data); setLoading(false); });
  }, [q]);

  if (!q) return (
    <div className="layout">
      <div className="main-col">
        <div className="empty-state">Введіть запит у рядку пошуку</div>
      </div>
    </div>
  );

  return (
    <div className="layout">
      <div className="main-col">
        <div className="page-title">Результати пошуку: «{q}»</div>

        {loading && <div className="empty-state">Пошук...</div>}

        {!loading && results.users.length > 0 && (
          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 10 }}>
              Користувачі ({results.users.length})
            </div>
            {results.users.map(u => (
              <Link key={u.id} to={`/users/${u.id}`}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e4e6eb' }}>
                  <div className="avatar">{u.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: 13, color: '#65676b' }}>{u.bio}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && results.posts.length > 0 && (
          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 10 }}>
              Пости ({results.posts.length})
            </div>
            {results.posts.map(p => (
              <div key={p.id} style={{ padding: '10px 0', borderBottom: '1px solid #e4e6eb' }}>
                <Link to={`/users/${p.author?.id}`} style={{ fontWeight: 600, fontSize: 14 }}>
                  {p.author?.name}
                </Link>
                <p style={{ marginTop: 4, fontSize: 14, lineHeight: 1.5 }}>{p.text}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && results.users.length === 0 && results.posts.length === 0 && (
          <div className="empty-state">Нічого не знайдено за запитом «{q}»</div>
        )}
      </div>
    </div>
  );
}
