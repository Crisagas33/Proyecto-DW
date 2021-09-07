from django.http import HttpResponse, JsonResponse
from django.shortcuts import render


def myfirstview(request):
   data = {
       'name': 'Joan'
   }
   return render(request, 'index.html', data)

