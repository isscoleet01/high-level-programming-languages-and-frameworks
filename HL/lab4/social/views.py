import json
from django.http import JsonResponse as _JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.db.models import Q, Count
from .models import Post, Comment, Like, Friendship


def JsonResponse(data, **kwargs):
    kwargs.setdefault('json_dumps_params', {})['ensure_ascii'] = False
    return _JsonResponse(data, **kwargs)


def _comment(c):
    return {
        'id': c.id,
        'author': c.author.username,
        'text': c.text,
        'created_at': c.created_at.isoformat(),
    }


def _friendship(f):
    return {
        'id': f.id,
        'from_user': f.from_user.username,
        'to_user': f.to_user.username,
        'status': f.status,
        'created_at': f.created_at.isoformat(),
    }


@csrf_exempt
def post_list(request):
    if request.method == 'GET':
        qs = Post.objects.select_related('author').annotate(
            likes_count=Count('likes', distinct=True),
            comments_count=Count('comments', distinct=True),
        )

        search = request.GET.get('search', '').strip()
        if search:
            qs = qs.filter(content__icontains=search)

        author = request.GET.get('author', '').strip()
        if author:
            qs = qs.filter(author__username__icontains=author)

        date_from = request.GET.get('date_from', '').strip()
        if date_from:
            qs = qs.filter(created_at__date__gte=date_from)

        date_to = request.GET.get('date_to', '').strip()
        if date_to:
            qs = qs.filter(created_at__date__lte=date_to)

        ordering = request.GET.get('ordering', '-created_at')
        if ordering in ('created_at', '-created_at', 'likes_count', '-likes_count'):
            qs = qs.order_by(ordering)

        return JsonResponse([{
            'id': p.id,
            'author': p.author.username,
            'content': p.content,
            'likes_count': p.likes_count,
            'comments_count': p.comments_count,
            'created_at': p.created_at.isoformat(),
        } for p in qs], safe=False)

    if request.method == 'POST':
        body = json.loads(request.body)
        user = User.objects.get(pk=body['user_id'])
        post = Post.objects.create(author=user, content=body['content'])
        return JsonResponse({
            'id': post.id,
            'author': post.author.username,
            'content': post.content,
            'created_at': post.created_at.isoformat(),
        }, status=201)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def post_detail(request, pk):
    try:
        post = Post.objects.select_related('author').annotate(
            likes_count=Count('likes', distinct=True),
            comments_count=Count('comments', distinct=True),
        ).get(pk=pk)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    if request.method == 'GET':
        return JsonResponse({
            'id': post.id,
            'author': post.author.username,
            'content': post.content,
            'likes_count': post.likes_count,
            'comments_count': post.comments_count,
            'created_at': post.created_at.isoformat(),
        })

    if request.method == 'DELETE':
        post.delete()
        return JsonResponse({'deleted': True})

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def post_comments(request, pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    if request.method == 'GET':
        qs = Comment.objects.select_related('author').filter(post=post)
        return JsonResponse([_comment(c) for c in qs], safe=False)

    if request.method == 'POST':
        body = json.loads(request.body)
        user = User.objects.get(pk=body['user_id'])
        comment = Comment.objects.create(post=post, author=user, text=body['text'])
        return JsonResponse(_comment(comment), status=201)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def comment_detail(request, pk):
    try:
        comment = Comment.objects.select_related('author', 'post').get(pk=pk)
    except Comment.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    if request.method == 'GET':
        return JsonResponse(_comment(comment))

    if request.method == 'DELETE':
        comment.delete()
        return JsonResponse({'deleted': True})

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def post_like(request, pk):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    body = json.loads(request.body)
    user = User.objects.get(pk=body['user_id'])
    like, created = Like.objects.get_or_create(post=post, user=user)
    if not created:
        like.delete()
    return JsonResponse({'liked': created, 'likes_count': post.likes.count()})


@csrf_exempt
def friendship_list(request):
    if request.method == 'GET':
        qs = Friendship.objects.select_related('from_user', 'to_user').all()
        return JsonResponse([_friendship(f) for f in qs], safe=False)

    if request.method == 'POST':
        body = json.loads(request.body)
        from_user = User.objects.get(pk=body['from_user_id'])
        to_user = User.objects.get(pk=body['to_user_id'])
        f, created = Friendship.objects.get_or_create(from_user=from_user, to_user=to_user)
        return JsonResponse(_friendship(f), status=201 if created else 200)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def friendship_detail(request, pk):
    try:
        f = Friendship.objects.select_related('from_user', 'to_user').get(pk=pk)
    except Friendship.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    if request.method == 'PUT':
        body = json.loads(request.body)
        if 'status' in body:
            f.status = body['status']
            f.save()
        return JsonResponse(_friendship(f))

    if request.method == 'DELETE':
        f.delete()
        return JsonResponse({'deleted': True})

    return JsonResponse({'error': 'Method not allowed'}, status=405)
