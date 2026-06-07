import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../App';
import PostCard from './PostCard';

export default function UserPage() {
  const { id } = useParams();
  const { currentUser } = useApp();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const [tab, setTab] = useState('posts');

  const userId = parseInt(id);
  const isOwn = userId === currentUser.id;

  function loadAll() {
    Promise.all([
      fetch(`/api/users/${userId}`).then(r => r.json()),
      fetch(`/api/users/${userId}/posts`).then(r => r.json()),
      fetch(`/api/users/${currentUser.id}/friends`).then(r => r.json()),
    ]).then(([u, p, f]) => {
      setUser(u);
      setPosts(p);
      setFriends(f);
      setIsFriend(f.some(fr => fr.id === userId));
    });
  }

  useEffect(() => { loadAll(); }, [id, currentUser.id]);

  function addFriend() {
    fetch(`/api/users/${currentUser.id}/friends`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ friendId: userId }),
    }).then(() => loadAll());
  }

  function removeFriend() {
    fetch(`/api/users/${currentUser.id}/friends/${userId}`, { method: 'DELETE' })
      .then(() => loadAll());
  }

  function deletePost(postId) {
    fetch(`/api/posts/${postId}`, { method: 'DELETE' })
      .then(() => setPosts(prev => prev.filter(p => p.id !== postId)));
  }

  if (!user) return <div style={{ padding: 40, textAlign: 'center' }}>Завантаження...</div>;

  return (
    <div className="layout">
      <div className="main-col">
        <div className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div className="avatar large">{user.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{user.name}</div>
              <div style={{ color: '#65676b', marginTop: 4 }}>{user.bio}</div>
              <div style={{ color: '#65676b', fontSize: 13, marginTop: 4 }}>
                {friends.length} друзів - {posts.length} постів
              </div>
            </div>
            {!isOwn && (
              <div style={{ display: 'flex', gap: 8 }}>
                {isFriend ? (
                  <button className="btn-danger" onClick={removeFriend}>Видалити з друзів</button>
                ) : (
                  <button className="btn-success" onClick={addFriend}>Додати в друзі</button>
                )}
                <Link to={`/messages/${userId}`}>
                  <button className="btn-secondary">Повідомлення</button>
                </Link>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 4, marginTop: 16, borderTop: '1px solid #e4e6eb', paddingTop: 12 }}>
            {['posts', 'friends'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: tab === t ? '#e7f3ff' : 'transparent',
                  color: tab === t ? '#1877f2' : '#050505',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 16px',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                {t === 'posts' ? 'Пости' : 'Друзі'}
              </button>
            ))}
          </div>
        </div>

        {tab === 'posts' && (
          <>
            {posts.length === 0 && <div className="empty-state">Немає постів</div>}
            {posts.map(p => <PostCard key={p.id} post={p} onDelete={deletePost} />)}
          </>
        )}

        {tab === 'friends' && (
          <div className="card">
            <div className="page-title">Друзі ({friends.length})</div>
            {friends.length === 0 && <div className="empty-state">Немає друзів</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {friends.map(f => (
                <Link key={f.id} to={`/users/${f.id}`}>
                  <div style={{
                    display: 'flex', gap: 10, alignItems: 'center',
                    padding: 10, borderRadius: 8, background: '#f0f2f5',
                  }}>
                    <div className="avatar">{f.avatar}</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{f.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="side-col">
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Друзі</div>
          {friends.slice(0, 5).map(f => (
            <Link key={f.id} to={`/users/${f.id}`}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <div className="avatar" style={{ width: 32, height: 32, fontSize: 13 }}>{f.avatar}</div>
                <span style={{ fontSize: 14 }}>{f.name}</span>
              </div>
            </Link>
          ))}
          {friends.length === 0 && <div style={{ color: '#65676b', fontSize: 13 }}>Немає друзів</div>}
        </div>
      </div>
    </div>
  );
}
