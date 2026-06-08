const { Document, Packer, Paragraph, TextRun, AlignmentType, Header, Footer,
        PageNumber, SectionType } = require('docx');
const fs = require('fs');

const margins = { left: 1418, right: 567, top: 1134, bottom: 1134 };
const pageSize = { width: 11906, height: 16838 };

function tnr(text, bold, size, italics, color) {
  return new TextRun({ text, font: 'Times New Roman', size: size || 28, bold: !!bold, italics: !!italics, color });
}

function body(text, opts) {
  opts = opts || {};
  return new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER : opts.right ? AlignmentType.RIGHT : AlignmentType.JUSTIFIED,
    indent: (opts.noIndent || opts.center || opts.right) ? undefined : { firstLine: 709 },
    spacing: { line: 360, lineRule: 'auto' },
    children: Array.isArray(text) ? text : [tnr(text, opts.bold)]
  });
}

function empty() { return new Paragraph({ spacing: { line: 360 }, children: [] }); }

function heading(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 360, lineRule: 'auto', before: 200, after: 120 },
    children: [tnr(text.toUpperCase(), true)]
  });
}

function sub(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 709 },
    spacing: { line: 360, lineRule: 'auto', before: 120, after: 60 },
    children: [tnr(text, true)]
  });
}

function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 360, lineRule: 'auto' },
    children: [tnr(text)]
  });
}

function ph(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 360, lineRule: 'auto', before: 80, after: 80 },
    children: [tnr('[' + text + ']', false, 28, true, 'AAAAAA')]
  });
}

function code(lines) {
  return lines.map(line => new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { line: 240, lineRule: 'auto' },
    children: [new TextRun({ text: line, font: 'Courier New', size: 20 })]
  }));
}

function ref(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 360, lineRule: 'auto' },
    indent: { hanging: 709, left: 709 },
    children: [tnr(text)]
  });
}

const title = [
  empty(), empty(),
  body('Міністерство освіти і науки України', { center: true, bold: true }),
  body('Харківський національний університет радіоелектроніки', { center: true, bold: true }),
  empty(), empty(), empty(), empty(),
  body('ЛАБОРАТОРНА РОБОТА №3', { center: true, bold: true }),
  empty(),
  body('з дисципліни:', { center: true }),
  body('«Високорівневі мови програмування та фреймворки»', { center: true, bold: true }),
  empty(),
  body('Тема: Android Kotlin - базова соціальна мережа', { center: true }),
  empty(), empty(), empty(), empty(), empty(),
  body('Виконав:', { right: true }),
  body('студент гр. ПЗПІ-24-6', { right: true }),
  body('Ніколаєнко Д.О.', { right: true }),
  empty(),
  body('Перевірив:', { right: true }),
  body('Олійник О.О.', { right: true }),
  body('____________________', { right: true }),
  empty(), empty(), empty(), empty(), empty(),
  body('Харків 2026', { center: true, bold: true }),
];

const main = [
  heading('1 МЕТА РОБОТИ'),
  body('Метою лабораторної роботи є набуття практичних навичок розробки Android-додатків з використанням мови програмування Kotlin. Зокрема, вивчення роботи з множинними Activity та Intents, RecyclerView з кастомними адаптерами, ViewBinding, а також реалізація повноцінної багатоекранної клієнтської програми типу «соціальна мережа» без зовнішнього API.'),

  heading('2 ЗАВДАННЯ'),
  body('Варіант 12, завдання 4 на кожному з трьох рівнів. Реалізувати Android-додаток «Базова соціальна мережа»:'),
  body('- Рівень 1: профіль користувача (перегляд та редагування), перегляд профілів інших користувачів, система додавання/видалення друзів;'),
  body('- Рівень 2: стрічка постів зі створенням нових публікацій, перегляд деталей поста та додавання коментарів, відображення кількості друзів у профілі;'),
  body('- Рівень 3: особисті повідомлення між користувачами (чат), список розмов, повнотекстовий пошук користувачів і постів.'),

  heading('3 ХІД ВИКОНАННЯ РОБОТИ'),

  sub('3.1 Архітектура додатка'),
  body('Додаток побудований на основі 10 Activity та єдиного глобального сховища даних DataStore (Kotlin object - singleton). Усі дані зберігаються в оперативній пам\'яті у вигляді MutableList. Між Activity дані передаються через Intent.putExtra().'),
  empty(),
  body('Структура модулів:'),
  body('- models/: User, Post, Comment, Message - data class-и;', { noIndent: true }),
  body('- adapters/: UserAdapter, PostAdapter, CommentAdapter, ConversationAdapter, ChatAdapter;', { noIndent: true }),
  body('- DataStore.kt: singleton-об\'єкт з початковими даними та допоміжними методами;', { noIndent: true }),
  body('- 10 Activity-класів: MainActivity, ProfileActivity, UsersActivity, UserDetailActivity, FeedActivity, PostDetailActivity, CreatePostActivity, MessagesActivity, ChatActivity, SearchActivity.', { noIndent: true }),
  empty(),
  ...code([
    'data class User(val id: Int, val name: String,',
    '                var bio: String,',
    '                val friends: MutableList<Int> = mutableListOf())',
    '',
    'data class Post(val id: Int, val authorId: Int, val text: String,',
    '                val comments: MutableList<Comment> = mutableListOf())',
    '',
    'data class Comment(val authorId: Int, val text: String)',
    '',
    'data class Message(val fromId: Int, val toId: Int, val text: String)',
  ]),

  sub('3.2 DataStore - централізоване сховище'),
  body('DataStore.kt реалізований як Kotlin object (singleton), що забезпечує єдиний стан даних для всіх Activity. Він містить три початкових користувачі, три пости, порожній список повідомлень та допоміжні методи для роботи з даними.'),
  empty(),
  ...code([
    'object DataStore {',
    '    var currentUserId = 1',
    '    val users = mutableListOf(',
    '        User(1, "Олексій Іваненко", "Люблю програмування та Android",',
    '             mutableListOf(2)),',
    '        User(2, "Марія Петренко", "Дизайнер UI/UX", mutableListOf(1)),',
    '        User(3, "Іван Коваль", "Студент ХНУРЕ, ПЗПІ-24", mutableListOf())',
    '    )',
    '    val posts = mutableListOf(',
    '        Post(1, 1, "Всім привіт! Це мій перший пост!",',
    '             mutableListOf(Comment(2, "Вітаємо!"))),',
    '        Post(2, 2, "Сьогодні чудова погода для роботи", mutableListOf()),',
    '        Post(3, 3, "Вивчаю Kotlin - дуже цікаво!",',
    '             mutableListOf(Comment(1, "Kotlin найкращий!")))',
    '    )',
    '    val messages = mutableListOf<Message>()',
    '',
    '    fun getCurrentUser() = users.first { it.id == currentUserId }',
    '    fun getUserById(id: Int) = users.firstOrNull { it.id == id }',
    '    fun areFriends(a: Int, b: Int) =',
    '        users.firstOrNull { it.id == a }?.friends?.contains(b) == true',
    '    fun nextPostId() = (posts.maxOfOrNull { it.id } ?: 0) + 1',
    '    fun getConversationPartners(): List<Int> {',
    '        val partners = mutableSetOf<Int>()',
    '        messages.forEach { msg ->',
    '            if (msg.fromId == currentUserId) partners.add(msg.toId)',
    '            if (msg.toId == currentUserId) partners.add(msg.fromId)',
    '        }',
    '        return partners.toList()',
    '    }',
    '    fun getMessagesWith(userId: Int) = messages.filter {',
    '        (it.fromId == currentUserId && it.toId == userId) ||',
    '        (it.fromId == userId && it.toId == currentUserId)',
    '    }',
    '}',
  ]),

  sub('3.3 Рівень 1 - Профіль та система друзів'),
  body('Реалізовано головну Activity з вибором поточного користувача через AlertDialog та навігацією до всіх розділів. ProfileActivity відображає ім\'я, біо та список друзів поточного користувача, дозволяє редагувати біо. UsersActivity та UserDetailActivity забезпечують перегляд інших користувачів та управління дружніми зв\'язками.'),
  empty(),
  ...code([
    'class MainActivity : AppCompatActivity() {',
    '    private lateinit var binding: ActivityMainBinding',
    '    override fun onCreate(savedInstanceState: Bundle?) {',
    '        super.onCreate(savedInstanceState)',
    '        binding = ActivityMainBinding.inflate(layoutInflater)',
    '        setContentView(binding.root)',
    '        binding.btnSwitchUser.setOnClickListener { showUserPicker() }',
    '        binding.btnProfile.setOnClickListener {',
    '            startActivity(Intent(this, ProfileActivity::class.java))',
    '        }',
    '    }',
    '    override fun onResume() {',
    '        super.onResume()',
    '        binding.tvCurrentUser.text =',
    '            "Поточний користувач: ${DataStore.getCurrentUser().name}"',
    '    }',
    '    private fun showUserPicker() {',
    '        val names = DataStore.users.map { it.name }.toTypedArray()',
    '        AlertDialog.Builder(this)',
    '            .setTitle("Оберіть користувача")',
    '            .setItems(names) { _, index ->',
    '                DataStore.currentUserId = DataStore.users[index].id',
    '            }.show()',
    '    }',
    '}',
  ]),
  empty(),
  body('Логіка додавання/видалення друга є двостороннього: при додаванні/видаленні одного друга ідентифікатори синхронно оновлюються в обох User-об\'єктах.'),
  empty(),
  ...code([
    'binding.btnFriend.setOnClickListener {',
    '    val me = DataStore.getCurrentUser()',
    '    val user = DataStore.getUserById(userId) ?: return@setOnClickListener',
    '    if (me.friends.contains(userId)) {',
    '        me.friends.remove(userId)',
    '        user.friends.remove(me.id)',
    '    } else {',
    '        me.friends.add(userId)',
    '        user.friends.add(me.id)',
    '    }',
    '    refresh()',
    '}',
  ]),
  empty(),
  ph('Скриншот 1 - Головний екран (MainActivity): вибір користувача + навігаційні кнопки'),
  caption('Рисунок 3.1 - Головний екран додатка'),
  empty(),
  ph('Скриншот 2 - ProfileActivity: ім\'я, біо, список друзів'),
  caption('Рисунок 3.2 - Екран профілю поточного користувача'),
  empty(),
  ph('Скриншот 3 - UsersActivity: список інших користувачів з кнопкою "Додати в друзі"'),
  caption('Рисунок 3.3 - Список всіх користувачів'),

  sub('3.4 Рівень 2 - Пости та коментарі'),
  body('FeedActivity відображає стрічку постів у зворотному порядку (останні зверху) за допомогою PostAdapter. CreatePostActivity дозволяє публікувати нові пости. PostDetailActivity відображає деталі поста разом з коментарями та формою для додавання нового коментаря.'),
  empty(),
  ...code([
    'class PostAdapter(',
    '    private val posts: List<Post>,',
    '    private val onClick: (Post) -> Unit',
    ') : RecyclerView.Adapter<PostAdapter.ViewHolder>() {',
    '    inner class ViewHolder(val binding: ItemPostBinding)',
    '        : RecyclerView.ViewHolder(binding.root)',
    '    override fun onBindViewHolder(holder: ViewHolder, position: Int) {',
    '        val post = posts[position]',
    '        val author = DataStore.getUserById(post.authorId)',
    '        holder.binding.tvAuthor.text = author?.name ?: "Невідомий"',
    '        holder.binding.tvText.text = post.text',
    '        holder.binding.tvComments.text = "Коментарів: ${post.comments.size}"',
    '        holder.binding.root.setOnClickListener { onClick(post) }',
    '    }',
    '    override fun getItemCount() = posts.size',
    '}',
  ]),
  empty(),
  body('Додавання коментаря реалізовано безпосередньо в PostDetailActivity: після натискання кнопки текст з EditText додається до списку коментарів поста в DataStore.'),
  empty(),
  ...code([
    'binding.btnAddComment.setOnClickListener {',
    '    val text = binding.etComment.text.toString().trim()',
    '    if (text.isNotEmpty()) {',
    '        val post = DataStore.posts.find { it.id == postId }',
    '            ?: return@setOnClickListener',
    '        post.comments.add(Comment(DataStore.currentUserId, text))',
    '        binding.etComment.text?.clear()',
    '        refresh()',
    '    }',
    '}',
  ]),
  empty(),
  ph('Скриншот 4 - FeedActivity: стрічка постів (останні зверху)'),
  caption('Рисунок 3.4 - Стрічка новин'),
  empty(),
  ph('Скриншот 5 - PostDetailActivity: пост + коментарі + форма додавання коментаря'),
  caption('Рисунок 3.5 - Деталі поста з коментарями'),
  empty(),
  ph('Скриншот 6 - CreatePostActivity: форма публікації нового поста'),
  caption('Рисунок 3.6 - Створення нового поста'),

  sub('3.5 Рівень 3 - Повідомлення та пошук'),
  body('MessagesActivity відображає список активних розмов - для кожного співрозмовника показується ім\'я та останнє повідомлення через ConversationAdapter. ChatActivity реалізує чат з конкретним користувачем: повідомлення відображаються через ChatAdapter, де власні повідомлення позначаються "Ви". SearchActivity реалізує повнотекстовий пошук в реальному часі через TextWatcher.'),
  empty(),
  ...code([
    'class ChatActivity : AppCompatActivity() {',
    '    private lateinit var binding: ActivityChatBinding',
    '    private var partnerId = -1',
    '    override fun onCreate(savedInstanceState: Bundle?) {',
    '        super.onCreate(savedInstanceState)',
    '        binding = ActivityChatBinding.inflate(layoutInflater)',
    '        setContentView(binding.root)',
    '        partnerId = intent.getIntExtra("userId", -1)',
    '        supportActionBar?.title = DataStore.getUserById(partnerId)?.name ?: "Чат"',
    '        binding.btnSend.setOnClickListener {',
    '            val text = binding.etMessage.text.toString().trim()',
    '            if (text.isNotEmpty()) {',
    '                DataStore.messages.add(',
    '                    Message(DataStore.currentUserId, partnerId, text)',
    '                )',
    '                binding.etMessage.text?.clear()',
    '                refresh()',
    '            }',
    '        }',
    '    }',
    '    private fun refresh() {',
    '        val msgs = DataStore.getMessagesWith(partnerId)',
    '        binding.rvMessages.adapter = ChatAdapter(msgs)',
    '        if (msgs.isNotEmpty())',
    '            binding.rvMessages.scrollToPosition(msgs.size - 1)',
    '    }',
    '}',
  ]),
  empty(),
  body('Пошук реалізований без затримок (debounce) - TextWatcher викликає метод search() після кожного символу, що відповідно до завдання забезпечує миттєві результати:'),
  empty(),
  ...code([
    'binding.etSearch.addTextChangedListener(object : TextWatcher {',
    '    override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {',
    '        search(s.toString())',
    '    }',
    '    override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}',
    '    override fun afterTextChanged(s: Editable?) {}',
    '})',
    '',
    'private fun search(query: String) {',
    '    if (query.isBlank()) { setResultsVisible(false); return }',
    '    setResultsVisible(true)',
    '    val q = query.lowercase()',
    '    val foundUsers = DataStore.users.filter {',
    '        it.name.lowercase().contains(q) || it.bio.lowercase().contains(q)',
    '    }',
    '    val foundPosts = DataStore.posts.filter {',
    '        it.text.lowercase().contains(q)',
    '    }',
    '    binding.rvUsers.adapter = UserAdapter(foundUsers, ...)',
    '    binding.rvPosts.adapter = PostAdapter(foundPosts) { ... }',
    '}',
  ]),
  empty(),
  ph('Скриншот 7 - MessagesActivity: список розмов'),
  caption('Рисунок 3.7 - Список активних розмов'),
  empty(),
  ph('Скриншот 8 - ChatActivity: чат між двома користувачами'),
  caption('Рисунок 3.8 - Чат (особисті повідомлення)'),
  empty(),
  ph('Скриншот 9 - SearchActivity: пошук користувачів та постів'),
  caption('Рисунок 3.9 - Пошук по додатку'),

  heading('4 ВИСНОВКИ'),
  body('У ході виконання лабораторної роботи розроблено повнофункціональний Android-додаток «Базова соціальна мережа» мовою Kotlin. Реалізовано такі функції:'),
  body('- управління профілями: перегляд та редагування власного профілю, перегляд профілів інших користувачів;'),
  body('- система дружніх зв\'язків: двостороннє додавання та видалення друзів;'),
  body('- публікації: створення постів, стрічка новин у зворотному хронологічному порядку, коментарі;'),
  body('- особисті повідомлення: чат між двома користувачами, список активних розмов;'),
  body('- пошук: повнотекстовий пошук по іменах/біо користувачів та тексту постів у режимі реального часу.'),
  empty(),
  body('Застосовано такі технології: ViewBinding для типобезпечного доступу до View-елементів, RecyclerView з кастомними Adapter/ViewHolder для відображення списків, Kotlin object для реалізації глобального сховища даних, Intent/putExtra для передачі даних між Activity. Практична робота сформувала розуміння багатоекранної навігації Android та шаблону проєктування з централізованим станом додатка.'),

  heading('СПИСОК ВИКОРИСТАНИХ ДЖЕРЕЛ'),
  ref('1.\tAndroid Developers. Activities. URL: https://developer.android.com/guide/components/activities/intro-activities (дата звернення: 08.06.2026).'),
  ref('2.\tAndroid Developers. RecyclerView. URL: https://developer.android.com/develop/ui/views/layout/recyclerview (дата звернення: 08.06.2026).'),
  ref('3.\tAndroid Developers. View Binding. URL: https://developer.android.com/topic/libraries/view-binding (дата звернення: 08.06.2026).'),
  ref('4.\tKotlin Documentation. Objects. URL: https://kotlinlang.org/docs/object-declarations.html (дата звернення: 08.06.2026).'),
];

const doc = new Document({
  sections: [
    {
      properties: {
        page: { size: pageSize, margin: margins },
        titlePage: true,
      },
      headers: { default: new Header({ children: [] }), first: new Header({ children: [] }) },
      footers: { default: new Footer({ children: [] }), first: new Footer({ children: [] }) },
      children: title,
    },
    {
      properties: {
        page: { size: pageSize, margin: { ...margins, header: 567 } },
        pageNumberStart: 2,
        type: SectionType.NEXT_PAGE,
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ children: [PageNumber.CURRENT], font: 'Times New Roman', size: 28 })]
          })]
        })
      },
      footers: { default: new Footer({ children: [] }) },
      children: main,
    }
  ]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('C:/lb3/ВМПТФ_ЛБ3_Ніколаєнко_ПЗПІ-24-6.docx', buf);
  console.log('Done: C:/lb3/ВМПТФ_ЛБ3_Ніколаєнко_ПЗПІ-24-6.docx');
}).catch(e => { console.error(e); process.exit(1); });
