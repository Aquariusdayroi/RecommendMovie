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
    user = serializers.StringRelatedField()  # Tên người dùng
    avatar = serializers.SerializerMethodField()  # Lấy avatar của user

    class Meta:
        model = Comment
        fields = ['id', 'user', 'avatar', 'content', 'timestamp']

    def get_avatar(self, obj):
        # Giả sử UserProfile chứa avatar
        if hasattr(obj.user, 'userprofile') and obj.user.userprofile.avatar:
            return obj.user.userprofile.avatar.url
        return "https://example.com/default-avatar.png"  # Avatar mặc định