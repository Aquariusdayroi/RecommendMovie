from rest_framework import serializers
from .models import Movie, Rating, Comment

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = [
            'id',
            'title',
            'release_date',
            'genre',
            'poster_url',
            'overview',
            'director',
            'cast',
            'runtime'
        ] 

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'movie', 'user_id', 'rating', 'timestamp']

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Hiển thị username thay vì id
    class Meta:
        model = Comment
        fields = ['id', 'movie', 'user', 'content', 'timestamp']