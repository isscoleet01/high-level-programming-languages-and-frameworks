import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../App';

function formatDate(iso) {
  return new Date(iso).toLocaleString('uk-UA', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export default function PostCard({ post, onDelete }) {
  const { currentUser } = useApp();
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  function loadComments() {
    setLoadingComments(true);
    fetch(`/api/posts/${post.id}/comments`)
      .then(r => r.json())
      .then(data => { setComments(data); setLoadingComments(false); });
  }

  function toggleComments() {
    if (!showComments) loadComments();
    setShowComments(v => !v);
  }

  function submitComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    fetch(`/api/posts/${post.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, text: commentText.trim() }),
    })
      .then(r => r.json())
      .then(c => { setComments(prev => [...prev, c]); setCommentText(''); });
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <Link to={`/users/${post.author?.id}`}>
          <div className="avatar">{post.author?.avatar}</div>
        </Link>
        <div>
          <Link to={`/users/${post.author?.id}`} style={{ fontWeight: 700, fontSize: 15 }}>
            {post.author?.name}
          </Link>
          <div style={{ fontSize: 12, color: '#65676b' }}>{formatDate(post.createdAt)}</div>
        </div>
        {post.userId === currentUser.id && (
          <button
            className="btn-danger"
            style={{ marginLeft: 'auto', padding: '4px 10px', fontSize: 12 }}
            onClick={() => onDelete(post.id)}
          >
            Видалити
          </button>
        )}
      </div>

      <p style={{ lineHeight: 1.5, marginBottom: 10 }}>{post.text}</p>

      <div style={{ borderTop: '1px solid #e4e6eb', paddingTop: 8, display: 'flex', gap: 8 }}>
        <button className="btn-secondary" style={{ fontSize: 13 }} onClick={toggleComments}>
          {showComments ? 'Сховати' : `Коментарі (${post.commentCount})`}
        </button>
      </div>

      {showComments && (
        <div style={{ marginTop: 12 }}>
          {loadingComments && <div style={{ color: '#65676b', fontSize: 13 }}>Завантаження...</div>}
          {comments.map(c => (
            <div key={c.id} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
              <Link to={`/users/${c.author?.id}`}>
                <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{c.author?.avatar}</div>
              </Link>
              <div style={{ background: '#f0f2f5', borderRadius: 8, padding: '6px 10px', flex: 1 }}>
                <Link to={`/users/${c.author?.id}`} style={{ fontWeight: 600, fontSize: 13 }}>{c.author?.name}</Link>
                <div style={{ fontSize: 14 }}>{c.text}</div>
              </div>
            </div>
          ))}
          <form onSubmit={submitComment} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{currentUser.avatar}</div>
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Написати коментар..."
              style={{ flex: 1 }}
            />
            <button className="btn-primary" type="submit" style={{ padding: '6px 12px', fontSize: 13 }}>
              Надіслати
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
