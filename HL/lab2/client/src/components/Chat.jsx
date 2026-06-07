import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../App';

function formatTime(iso) {
  return new Date(iso).toLocaleString('uk-UA', {
    hour: '2-digit', minute: '2-digit',
  });
}

export default function Chat() {
  const { partnerId } = useParams();
  const { currentUser, users } = useApp();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);
  const partner = users.find(u => u.id === parseInt(partnerId));

  function loadMessages() {
    fetch(`/api/messages/${currentUser.id}/${partnerId}`)
      .then(r => r.json())
      .then(setMessages);
  }

  useEffect(() => { loadMessages(); }, [partnerId, currentUser.id]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  function sendMessage(e) {
    e.preventDefault();
    if (!text.trim()) return;
    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromId: currentUser.id, toId: parseInt(partnerId), text: text.trim() }),
    })
      .then(r => r.json())
      .then(m => { setMessages(prev => [...prev, m]); setText(''); });
  }

  if (!partner) return <div style={{ padding: 40, textAlign: 'center' }}>Користувача не знайдено</div>;

  return (
    <div className="layout">
      <div className="main-col">
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #e4e6eb',
            display: 'flex', gap: 10, alignItems: 'center',
            background: '#f0f2f5',
          }}>
            <Link to="/messages" style={{ color: '#1877f2', fontWeight: 600, fontSize: 14 }}>
              &larr; Назад
            </Link>
            <div className="avatar">{partner.avatar}</div>
            <div>
              <Link to={`/users/${partner.id}`} style={{ fontWeight: 700 }}>{partner.name}</Link>
              <div style={{ fontSize: 12, color: '#65676b' }}>{partner.bio}</div>
            </div>
          </div>

          <div style={{ height: 420, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.length === 0 && (
              <div className="empty-state">Почніть розмову з {partner.name}</div>
            )}
            {messages.map(m => {
              const mine = m.fromId === currentUser.id;
              return (
                <div key={m.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '65%',
                    background: mine ? '#1877f2' : '#f0f2f5',
                    color: mine ? '#fff' : '#050505',
                    borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    padding: '8px 12px',
                  }}>
                    <div style={{ fontSize: 15 }}>{m.text}</div>
                    <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2, textAlign: 'right' }}>
                      {formatTime(m.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={sendMessage} style={{
            padding: '12px 16px',
            borderTop: '1px solid #e4e6eb',
            display: 'flex', gap: 8,
          }}>
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Написати повідомлення..."
              style={{ flex: 1 }}
            />
            <button className="btn-primary" type="submit">Надіслати</button>
          </form>
        </div>
      </div>

      <div className="side-col">
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Про користувача</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="avatar large">{partner.avatar}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{partner.name}</div>
              <div style={{ fontSize: 13, color: '#65676b' }}>{partner.bio}</div>
            </div>
          </div>
          <Link to={`/users/${partner.id}`} style={{ display: 'block', marginTop: 12 }}>
            <button className="btn-secondary" style={{ width: '100%' }}>Переглянути профіль</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
