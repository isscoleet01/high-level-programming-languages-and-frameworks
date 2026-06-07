const express = require('express');
const cors = require('cors');
const { users, posts, comments, friends, messages, nextId } = require('./data');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });
  res.json(user);
});

app.get('/api/posts', (req, res) => {
  const result = posts
    .map(p => ({
      ...p,
      author: users.find(u => u.id === p.userId),
      commentCount: comments.filter(c => c.postId === p.id).length,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(result);
});

app.get('/api/users/:id/posts', (req, res) => {
  const userId = parseInt(req.params.id);
  const result = posts
    .filter(p => p.userId === userId)
    .map(p => ({
      ...p,
      author: users.find(u => u.id === p.userId),
      commentCount: comments.filter(c => c.postId === p.id).length,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(result);
});

app.post('/api/posts', (req, res) => {
  const { userId, text } = req.body;
  if (!text || !userId) return res.status(400).json({ error: 'Потрібні userId та text' });
  const post = { id: nextId.post++, userId: parseInt(userId), text, createdAt: new Date().toISOString() };
  posts.push(post);
  res.status(201).json({ ...post, author: users.find(u => u.id === post.userId), commentCount: 0 });
});

app.delete('/api/posts/:id', (req, res) => {
  const idx = posts.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Пост не знайдено' });
  posts.splice(idx, 1);
  res.json({ ok: true });
});

app.get('/api/posts/:id/comments', (req, res) => {
  const postId = parseInt(req.params.id);
  const result = comments
    .filter(c => c.postId === postId)
    .map(c => ({ ...c, author: users.find(u => u.id === c.userId) }))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  res.json(result);
});

app.post('/api/posts/:id/comments', (req, res) => {
  const { userId, text } = req.body;
  const postId = parseInt(req.params.id);
  if (!text || !userId) return res.status(400).json({ error: 'Потрібні userId та text' });
  const comment = {
    id: nextId.comment++,
    postId,
    userId: parseInt(userId),
    text,
    createdAt: new Date().toISOString(),
  };
  comments.push(comment);
  res.status(201).json({ ...comment, author: users.find(u => u.id === comment.userId) });
});

app.get('/api/users/:id/friends', (req, res) => {
  const userId = parseInt(req.params.id);
  const friendIds = friends.filter(f => f.userId === userId).map(f => f.friendId);
  res.json(users.filter(u => friendIds.includes(u.id)));
});

app.post('/api/users/:id/friends', (req, res) => {
  const userId = parseInt(req.params.id);
  const { friendId } = req.body;
  if (!friendId) return res.status(400).json({ error: 'Потрібен friendId' });
  const fid = parseInt(friendId);
  if (fid === userId) return res.status(400).json({ error: 'Не можна додати себе' });
  if (friends.find(f => f.userId === userId && f.friendId === fid)) {
    return res.status(400).json({ error: 'Вже є у друзях' });
  }
  friends.push({ userId, friendId: fid });
  friends.push({ userId: fid, friendId: userId });
  res.status(201).json({ ok: true });
});

app.delete('/api/users/:id/friends/:friendId', (req, res) => {
  const userId = parseInt(req.params.id);
  const fid = parseInt(req.params.friendId);
  const toRemove = friends.filter(
    f => (f.userId === userId && f.friendId === fid) || (f.userId === fid && f.friendId === userId)
  );
  toRemove.forEach(f => friends.splice(friends.indexOf(f), 1));
  res.json({ ok: true });
});

app.get('/api/messages/inbox/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const partnersSet = new Set();
  messages
    .filter(m => m.fromId === userId || m.toId === userId)
    .forEach(m => {
      const partnerId = m.fromId === userId ? m.toId : m.fromId;
      partnersSet.add(partnerId);
    });
  const conversations = Array.from(partnersSet).map(partnerId => {
    const partner = users.find(u => u.id === partnerId);
    const conv = messages
      .filter(
        m => (m.fromId === userId && m.toId === partnerId) || (m.fromId === partnerId && m.toId === userId)
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { partner, lastMessage: conv[0] };
  });
  res.json(conversations);
});

app.get('/api/messages/:userId/:otherId', (req, res) => {
  const a = parseInt(req.params.userId);
  const b = parseInt(req.params.otherId);
  const conv = messages
    .filter(m => (m.fromId === a && m.toId === b) || (m.fromId === b && m.toId === a))
    .sort((x, y) => new Date(x.createdAt) - new Date(y.createdAt))
    .map(m => ({ ...m, from: users.find(u => u.id === m.fromId) }));
  res.json(conv);
});

app.post('/api/messages', (req, res) => {
  const { fromId, toId, text } = req.body;
  if (!fromId || !toId || !text) return res.status(400).json({ error: 'Потрібні fromId, toId, text' });
  const msg = {
    id: nextId.message++,
    fromId: parseInt(fromId),
    toId: parseInt(toId),
    text,
    createdAt: new Date().toISOString(),
  };
  messages.push(msg);
  res.status(201).json({ ...msg, from: users.find(u => u.id === msg.fromId) });
});

app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase().trim();
  if (!q) return res.json({ users: [], posts: [] });
  const foundUsers = users.filter(u => u.name.toLowerCase().includes(q));
  const foundPosts = posts
    .filter(p => p.text.toLowerCase().includes(q))
    .map(p => ({ ...p, author: users.find(u => u.id === p.userId) }));
  res.json({ users: foundUsers, posts: foundPosts });
});

app.listen(3002, () => console.log('Сервер запущено на http://localhost:3002'));
