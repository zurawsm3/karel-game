from .views import game_map, home

from django.urls import path

urlpatterns = [
    path('<str:room_name>/', game_map),
    path('', home),
]