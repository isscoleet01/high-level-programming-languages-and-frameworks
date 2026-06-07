import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../App';

function formatDate(iso) {
  return new Date(iso).toLocaleString('uk-UA', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export default function Inbox() {
  const { currentUser, users } = useApp();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/messages/inbox/${currentUser.id}`)
      .then(r => r.json())
      .then(data => { setConversations(data); setLoading(false); });
  }, [currentUser.id]);

  const otherUsers = users.filter(u => u.id !== currentUser.id);
  const convPartnerIds = new Set(conversations.map(c => c.partner.id));

  return (
    <div className="layout">
      <div className="main-col">
        <div className="page-title">Повідомлення</div>

        {loading && <div className="empty-state">Завантаження...</div>}

        {conversations.map(({ partner, lastMessage }) => (
          <Link key={partner.id} to={`/messages/${partner.id}`}>
            <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}>
              <div className="avatar large">{partner.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700 }}>{partner.name}</div>
                <div style={{
                  fontSize: 14, color: '#65676b',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {lastMessage.fromId === currentUser.id ? 'Ви: ' : ''}{lastMessage.text}
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#65676b', flexShrink: 0 }}>
                {formatDate(lastMessage.createdAt)}
              </div>
            </div>
          </Link>
        ))}

        {!loading && conversations.length === 0 && (
          <div className="empty-state">Немає повідомлень</div>
        )}
      </div>

      <div className="side-col">
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Написати комусь</div>
          {otherUsers.filter(u => !convPartnerIds.has(u.id)).map(u => (
            <Link key={u.id} to={`/messages/${u.id}`}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <div className="avatar" style={{ width: 32, height: 32, fontSize: 13 }}>{u.avatar}</div>
                <span style={{ fontSize: 14 }}>{u.name}</span>
              </div>
            </Link>
          ))}
          {otherUsers.filter(u => !convPartnerIds.has(u.id)).length === 0 && (
            <div style={{ color: '#65676b', fontSize: 13 }}>Всі переписки вже розпочаті</div>
          )}
        </div>
      </div>
    </div>
  );
}
