from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.post_list),
    path('posts/<int:pk>/', views.post_detail),
    path('posts/<int:pk>/comments/', views.post_comments),
    path('posts/<int:pk>/like/', views.post_like),
    path('comments/<int:pk>/', views.comment_detail),
    path('friends/', views.friendship_list),
    path('friends/<int:pk>/', views.friendship_detail),
]
