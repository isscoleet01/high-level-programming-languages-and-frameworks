import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import PostCard from './PostCard';

export default function Feed() {
  const { currentUser } = useApp();
  const [posts, setPosts] = useState([]);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(true);

  function loadPosts() {
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false); });
  }

  useEffect(() => { loadPosts(); }, []);

  function submitPost(e) {
    e.preventDefault();
    if (!newText.trim()) return;
    fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, text: newText.trim() }),
    })
      .then(r => r.json())
      .then(p => { setPosts(prev => [p, ...prev]); setNewText(''); });
  }

  function deletePost(id) {
    fetch(`/api/posts/${id}`, { method: 'DELETE' })
      .then(() => setPosts(prev => prev.filter(p => p.id !== id)));
  }

  return (
    <div className="layout">
      <div className="main-col">
        <div className="card">
          <form onSubmit={submitPost}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div className="avatar">{currentUser.avatar}</div>
              <div style={{ flex: 1 }}>
                <textarea
                  value={newText}
                  onChange={e => setNewText(e.target.value)}
                  placeholder={`Що у вас нового, ${currentUser.name.split(' ')[0]}?`}
                  style={{ marginBottom: 8 }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn-primary" type="submit">Опублікувати</button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {loading && <div className="empty-state">Завантаження...</div>}
        {!loading && posts.length === 0 && <div className="empty-state">Поки немає постів</div>}
        {posts.map(p => (
          <PostCard key={p.id} post={p} onDelete={deletePost} />
        ))}
      </div>

      <div className="side-col">
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Ви увійшли як</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="avatar large">{currentUser.avatar}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{currentUser.name}</div>
              <div style={{ fontSize: 13, color: '#65676b' }}>{currentUser.bio}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
