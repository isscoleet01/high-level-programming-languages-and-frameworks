from django.shortcuts import render, get_object_or_404, redirect
from django.core.paginator import Paginator
from .models import Article
from .forms import CommentForm


def article_list(request):
    articles = Article.objects.select_related('category').order_by('-published_at')
    paginator = Paginator(articles, 5)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'blog/article_list.html', {'page_obj': page_obj})


def article_detail(request, pk):
    article = get_object_or_404(Article, pk=pk)
    form = CommentForm()
    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.article = article
            comment.save()
            return redirect('article_detail', pk=pk)
    return render(request, 'blog/article_detail.html', {'article': article, 'form': form})
