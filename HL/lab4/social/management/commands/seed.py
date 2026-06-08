import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from social.models import Post, Comment, Like, Friendship


class Command(BaseCommand):
    help = 'Seed database with test data'

    def handle(self, *args, **options):
        self.stdout.write('Очищення даних...')
        Like.objects.all().delete()
        Comment.objects.all().delete()
        Post.objects.all().delete()
        Friendship.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()

        self.stdout.write('Створення користувачів...')
        usernames = ['anna', 'bohdan', 'daria', 'evhen', 'iryna']
        users = []
        for name in usernames:
            u = User.objects.create_user(
                username=name,
                email=f'{name}@example.com',
                password='pass1234',
            )
            users.append(u)

        self.stdout.write('Створення постів...')
        posts_data = [
            (users[0], 'Сьогодні чудова погода для прогулянки у парку!'),
            (users[0], 'Python - найкраща мова програмування для початківців.'),
            (users[1], 'Щойно прочитав нову книгу з алгоритмів - рекомендую!'),
            (users[1], 'Django ORM - потужний інструмент для роботи з базами даних.'),
            (users[2], 'Новини з конференції PyCon: багато цікавих доповідей про Python та Django.'),
            (users[2], 'Хто займається спортом? Поради щодо тренувань у спортзалі.'),
            (users[3], 'Django vs Flask: який фреймворк обрати для нового проекту?'),
            (users[3], 'Мій перший внесок у відкритий проект на GitHub - дуже цікавий досвід!'),
            (users[4], 'Пошук та фільтрація в Django з Q-об\'єктами - дуже зручно.'),
            (users[4], 'Оптимізація запитів у Django: select_related та prefetch_related.'),
        ]
        posts = []
        for author, content in posts_data:
            p = Post.objects.create(author=author, content=content)
            posts.append(p)

        self.stdout.write('Додавання коментарів...')
        comments_data = [
            (users[1], posts[0], 'Погоджуюсь, сьогодні справді чудова погода!'),
            (users[2], posts[0], 'Я теж гуляла сьогодні, дуже приємно.'),
            (users[0], posts[3], 'Django та Flask - відмінні фреймворки!'),
            (users[3], posts[3], 'select_related та prefetch_related - must know!'),
            (users[4], posts[6], 'Я обираю Django за потужний ORM та адмін-панель.'),
            (users[0], posts[8], 'Q-об\'єкти дуже зручні для складних запитів у Django.'),
            (users[1], posts[9], 'Дякую за статтю, дуже корисно!'),
        ]
        for author, post, text in comments_data:
            Comment.objects.create(post=post, author=author, text=text)

        self.stdout.write('Додавання лайків...')
        for post in posts:
            likers = random.sample(users, k=random.randint(1, 4))
            for user in likers:
                Like.objects.get_or_create(post=post, user=user)

        self.stdout.write('Створення зв\'язків дружби...')
        pairs = [
            (users[0], users[1], 'accepted'),
            (users[0], users[2], 'accepted'),
            (users[1], users[3], 'accepted'),
            (users[2], users[4], 'accepted'),
            (users[3], users[4], 'pending'),
        ]
        for from_user, to_user, status in pairs:
            Friendship.objects.create(from_user=from_user, to_user=to_user, status=status)

        self.stdout.write(self.style.SUCCESS(
            f'\nГотово! Створено:\n'
            f'  Користувачів: {User.objects.filter(is_superuser=False).count()}\n'
            f'  Постів:       {Post.objects.count()}\n'
            f'  Коментарів:   {Comment.objects.count()}\n'
            f'  Лайків:       {Like.objects.count()}\n'
            f'  Зв\'язків:     {Friendship.objects.count()}'
        ))
