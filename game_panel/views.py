from django.shortcuts import render


def game_map(request, room_name):
    return render(request, 'game_panel/game_map.html', {'room_name': room_name})
