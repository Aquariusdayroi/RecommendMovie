from django.shortcuts import render
from rest_framework import viewsets
from .models import Movie, Rating
from .serializers import MovieSerializer, RatingSerializer
from django.http import HttpResponse


class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer

def home(request):
    return HttpResponse("<h1>Welcome to Movie Recommendation System</h1>")