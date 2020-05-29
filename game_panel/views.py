from django.shortcuts import render


def game_map(request, room_name):
    print(request.user.id)
    return render(request, 'game_panel/game_map.html', {'room_name': room_name})


def home(request):
    return render(request, 'game_panel/home.html')
