from django.http import FileResponse
from django.shortcuts import render


def home(request):
    return render(request, 'home.html')


def pdf(request):
    return FileResponse(open('static/pdf/ListOfCommands-Karel.pdf', 'rb'), content_type='application/pdf')
