from django.contrib import admin
from .models import Post, Comment, Like, Friendship


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['id', 'author', 'short_content', 'created_at']
    list_filter = ['created_at']
    search_fields = ['content', 'author__username']

    def short_content(self, obj):
        return obj.content[:60] + '...' if len(obj.content) > 60 else obj.content
    short_content.short_description = 'Вміст'


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'author', 'post', 'created_at']
    list_filter = ['created_at']
    search_fields = ['text', 'author__username']


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'post', 'created_at']


@admin.register(Friendship)
class FriendshipAdmin(admin.ModelAdmin):
    list_display = ['from_user', 'to_user', 'status', 'created_at']
    list_filter = ['status']
