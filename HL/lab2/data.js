const users = [
  { id: 1, name: 'Олена Коваль', avatar: 'О', bio: 'Люблю програмування та каву' },
  { id: 2, name: 'Максим Бондар', avatar: 'М', bio: 'Фотограф та мандрівник' },
  { id: 3, name: 'Аліна Шевченко', avatar: 'А', bio: 'Дизайнер інтерфейсів' },
  { id: 4, name: 'Іван Мельник', avatar: 'І', bio: 'Backend розробник' },
];

const posts = [
  { id: 1, userId: 1, text: 'Перший пост у нашій соціальній мережі!', createdAt: '2026-06-01T10:00:00.000Z' },
  { id: 2, userId: 2, text: 'Щойно повернувся з Карпат. Чудові краєвиди!', createdAt: '2026-06-02T12:30:00.000Z' },
  { id: 3, userId: 1, text: 'Node.js та Express — чудовий стек для бекенду.', createdAt: '2026-06-03T09:15:00.000Z' },
  { id: 4, userId: 3, text: 'Новий дизайн завершено. Як вам?', createdAt: '2026-06-04T16:00:00.000Z' },
  { id: 5, userId: 4, text: 'REST API + React = ідеальна пара.', createdAt: '2026-06-05T11:45:00.000Z' },
];

const comments = [
  { id: 1, postId: 1, userId: 2, text: 'Вітаємо! Чудовий початок.', createdAt: '2026-06-01T10:30:00.000Z' },
  { id: 2, postId: 2, userId: 1, text: 'Казково! Хочу теж поїхати.', createdAt: '2026-06-02T13:00:00.000Z' },
  { id: 3, postId: 3, userId: 4, text: 'Погоджуюсь, дуже зручний інструмент.', createdAt: '2026-06-03T10:00:00.000Z' },
];

const friends = [
  { userId: 1, friendId: 2 },
  { userId: 2, friendId: 1 },
  { userId: 1, friendId: 3 },
  { userId: 3, friendId: 1 },
];

const messages = [
  { id: 1, fromId: 1, toId: 2, text: 'Привіт, Максиме! Як справи?', createdAt: '2026-06-05T10:00:00.000Z' },
  { id: 2, fromId: 2, toId: 1, text: 'Привіт, Оленко! Все добре, дякую.', createdAt: '2026-06-05T10:05:00.000Z' },
  { id: 3, fromId: 1, toId: 2, text: 'Чудово! Побачимось завтра?', createdAt: '2026-06-05T10:10:00.000Z' },
];

const nextId = { post: 6, comment: 4, message: 4 };

module.exports = { users, posts, comments, friends, messages, nextId };
