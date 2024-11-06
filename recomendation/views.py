from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Movie, Rating
from .serializers import MovieSerializer, RatingSerializer
from django.http import HttpResponse


class MoviePagination(PageNumberPagination):
    page_size = 21  # Số lượng phim mỗi trang
    page_size_query_param = 'page_size'
    max_page_size = 100

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    pagination_class = MoviePagination

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer

def home(request):
    return HttpResponse("<h1>Welcome to Movie Recommendation System</h1>")


@api_view(['GET'])
def movie_detail(request, movie_id):
    try:
        movie = Movie.objects.get(id=movie_id)
        serializer = MovieSerializer(movie)
        return Response(serializer.data)
    except Movie.DoesNotExist:
        return Response({"error": "Movie not found"}, status=404)