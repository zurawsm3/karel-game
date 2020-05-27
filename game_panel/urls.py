from .views import game_map

from django.urls import path

urlpatterns = [
    path('<str:room_name>/', game_map),
]