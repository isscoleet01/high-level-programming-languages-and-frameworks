import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import UserPage from './components/UserPage';
import Search from './components/Search';
import Inbox from './components/Inbox';
import Chat from './components/Chat';

export const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => {
        setUsers(data);
        setCurrentUser(data[0]);
      });
  }, []);

  if (!currentUser) return <div style={{ padding: 40, textAlign: 'center' }}>Завантаження...</div>;

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser, users }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/users/:id" element={<UserPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/messages" element={<Inbox />} />
          <Route path="/messages/:partnerId" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
