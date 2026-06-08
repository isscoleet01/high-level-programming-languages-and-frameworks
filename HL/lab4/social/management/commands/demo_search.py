from django.core.management.base import BaseCommand
from django.db.models import Q, Count
from social.models import Post


class Command(BaseCommand):
    help = 'Demonstrate post search and filtering (Level 3)'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING(
            '\n=== Рівень 3: Пошук та фільтрація постів ===\n'
        ))

        total = Post.objects.count()
        self.stdout.write(f'Усього постів у базі: {total}\n')

        self.stdout.write(self.style.HTTP_INFO('--- 1. Пошук за ключовим словом "Django" ---'))
        qs = Post.objects.select_related('author').filter(content__icontains='Django')
        for p in qs:
            self.stdout.write(f'  [id={p.id}] {p.author.username}: {p.content[:65]}')
        self.stdout.write(f'  Результат: {qs.count()} постів\n')

        self.stdout.write(self.style.HTTP_INFO('--- 2. Пошук за ключовим словом "Python" ---'))
        qs = Post.objects.select_related('author').filter(content__icontains='Python')
        for p in qs:
            self.stdout.write(f'  [id={p.id}] {p.author.username}: {p.content[:65]}')
        self.stdout.write(f'  Результат: {qs.count()} постів\n')

        self.stdout.write(self.style.HTTP_INFO('--- 3. Q-запит: "Python" АБО автор "anna" ---'))
        qs = Post.objects.select_related('author').filter(
            Q(content__icontains='Python') | Q(author__username='anna')
        ).distinct()
        for p in qs:
            self.stdout.write(f'  [id={p.id}] {p.author.username}: {p.content[:65]}')
        self.stdout.write(f'  Результат: {qs.count()} постів\n')

        self.stdout.write(self.style.HTTP_INFO('--- 4. Фільтрація за автором "bohdan" ---'))
        qs = Post.objects.select_related('author').filter(author__username='bohdan')
        for p in qs:
            self.stdout.write(f'  [id={p.id}] {p.content[:70]}')
        self.stdout.write(f'  Результат: {qs.count()} постів\n')

        self.stdout.write(self.style.HTTP_INFO('--- 5. Сортування за кількістю лайків (спадання) ---'))
        qs = Post.objects.select_related('author').annotate(
            likes_count=Count('likes')
        ).order_by('-likes_count')[:5]
        for p in qs:
            self.stdout.write(f'  {p.likes_count} лайк(ів) | {p.author.username}: {p.content[:55]}')
        self.stdout.write('')

        self.stdout.write(self.style.HTTP_INFO('--- 6. Комбінований пошук: "Django" + сортування за датою ---'))
        qs = Post.objects.select_related('author').filter(
            content__icontains='Django'
        ).order_by('-created_at')
        for p in qs:
            self.stdout.write(
                f'  {p.created_at.strftime("%Y-%m-%d %H:%M")} | {p.author.username}: {p.content[:55]}'
            )
        self.stdout.write(f'  Результат: {qs.count()} постів\n')

        self.stdout.write(self.style.SUCCESS('=== Демонстрацію завершено ==='))
