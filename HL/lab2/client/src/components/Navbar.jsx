import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../App';

const s = {
  nav: {
    background: '#1877f2',
    color: '#fff',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    height: 56,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  },
  logo: { fontWeight: 800, fontSize: 22, letterSpacing: -1, color: '#fff' },
  links: { display: 'flex', gap: 16, flex: 1 },
  link: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 600,
    fontSize: 15,
    padding: '4px 8px',
    borderRadius: 6,
    transition: 'background 0.15s',
  },
  searchBox: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: 20,
    padding: '6px 14px',
    color: '#fff',
    width: 180,
    fontSize: 14,
  },
  userSel: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: 6,
    padding: '6px 10px',
    color: '#fff',
    fontSize: 14,
    cursor: 'pointer',
  },
  userLabel: { fontSize: 13, opacity: 0.8 },
};

export default function Navbar() {
  const { currentUser, setCurrentUser, users } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = React.useState('');

  function handleSearch(e) {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      setQ('');
    }
  }

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.logo}>СоцМережа</Link>
      <div style={s.links}>
        <Link to="/" style={s.link}>Стрічка</Link>
        <Link to="/messages" style={s.link}>Повідомлення</Link>
        <Link to={`/users/${currentUser.id}`} style={s.link}>Мій профіль</Link>
      </div>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
        <input
          style={s.searchBox}
          placeholder="Пошук..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </form>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
        <span style={s.userLabel}>Увійти як:</span>
        <select
          style={s.userSel}
          value={currentUser.id}
          onChange={e => {
            const u = users.find(u => u.id === parseInt(e.target.value));
            setCurrentUser(u);
          }}
        >
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>
    </nav>
  );
}
