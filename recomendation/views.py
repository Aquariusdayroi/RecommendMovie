
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Movie, Rating, Comment
from . import models
from django.db.models import Avg
from django.db.models import Avg  
from .recomender.recommendation import recommend_movies_for_user
from .serializers import MovieSerializer, RatingSerializer, CommentSerializer
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.parsers import JSONParser

# Thiết lập phân trang
class MoviePagination(PageNumberPagination):
    page_size = 21
    page_size_query_param = 'page_size'
    max_page_size = 100

# Cập nhật MovieViewSet để yêu cầu xác thực token
class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    pagination_class = MoviePagination
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

# Cập nhật RatingViewSet để yêu cầu xác thực token
class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

# Trang chính
def home(request):
    return HttpResponse("<h1>Welcome to Movie Recommendation System</h1>")

# Chi tiết phim với xác thực token
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def movie_detail(request, movie_id):
    try:
        movie = Movie.objects.get(id=movie_id)
        serializer = MovieSerializer(movie)

        # Lấy rating của user hiện tại
        try:
            user_rating = Rating.objects.get(user=request.user, movie=movie).rating
        except Rating.DoesNotExist:
            user_rating = None

        # Tính trung bình rating
        average_rating = Rating.objects.filter(movie=movie).aggregate(average=Avg('rating'))['average']
        if average_rating is None:
            average_rating = 0.0

        data = serializer.data
        data.update({
            "user_rating": user_rating,
            "average_rating": round(average_rating, 2)
        })

        return Response(data)
    except Movie.DoesNotExist:
        return Response({"error": "Movie not found"}, status=404)


# Đăng ký người dùng
@api_view(['POST'])
@authentication_classes([])  # Không yêu cầu xác thực
@permission_classes([])       # Không yêu cầu phân quyền
def register_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    email = request.data.get("email")

    if not username or not password or not email:
        return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)
    
    if len(password) < 8:
        return Response({"error": "Password must be at least 8 characters long."}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already in use."}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.create_user(username=username, password=password, email=email)
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Endpoint tùy chỉnh để lấy token xác thực người dùng
class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        user = token.user
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username
        })

# API khuyến nghị phim với xác thực token
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def recommend_movies(request):
    user = request.user
    try:
        recommended_movies = recommend_movies_for_user(user.id)
        serializer = MovieSerializer(recommended_movies, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Lấy thông tin và cập nhật thông tin người dùng
@api_view(['GET', 'PUT'])
def user_profile(request):
    user = request.user
    if request.method == 'GET':
        profile = user.userprofile
        data = {
            "username": user.username,
            "email": user.email,
            "occupation": profile.occupation,
            "gender": profile.gender,
            "age": profile.age,
            "zip_code": profile.zip_code,
        }
        return Response(data)

    if request.method == 'PUT':
        data = JSONParser().parse(request)
        user.username = data.get("username", user.username)
        user.email = data.get("email", user.email)
        profile = user.userprofile
        profile.occupation = data.get("occupation", profile.occupation)
        profile.gender = data.get("gender", profile.gender)
        profile.age = data.get("age", profile.age)
        profile.zip_code = data.get("zip_code", profile.zip_code)

        user.save()
        profile.save()
        return Response({"message": "Profile updated successfully!"})


#API lấy danh sách phim đã xem
@api_view(['GET'])
def watched_movies(request):
    user = request.user
    watched_movies = Rating.objects.filter(user=user).select_related('movie')
    data = [
        {
            "id": rating.movie.id,
            "title": rating.movie.title,
            "poster_url": rating.movie.poster_url,
            "rating": rating.rating,
        }
        for rating in watched_movies
    ]
    return Response(data)

# API cho rating và comment
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_movie(request, movie_id):
    data = request.data
    user = request.user
    try:
        movie = Movie.objects.get(id=movie_id)
        # Cập nhật hoặc tạo rating
        rating, created = Rating.objects.update_or_create(
            user=user, 
            movie=movie,
            defaults={'rating': data.get('rating')}
        )
        # Tính lại rating trung bình
        average_rating = Rating.objects.filter(movie=movie).aggregate(average=Avg('rating'))['average']
        return Response({
            "message": "Rating submitted successfully!",
            "average_rating": round(average_rating, 2)
        })
    except Movie.DoesNotExist:
        return Response({"error": "Movie not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)



@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def comment_movie(request, movie_id):
    try:
        movie = Movie.objects.get(id=movie_id)
    except Movie.DoesNotExist:
        return Response({"error": "Movie not found"}, status=404)

    if request.method == 'POST':
        data = request.data
        content = data.get('content', '').strip()
        if not content:
            return Response({"error": "Comment content cannot be empty."}, status=400)

        comment = Comment.objects.create(
            user=request.user,
            movie=movie,
            content=content
        )
        return Response({"message": "Comment submitted successfully!"}, status=201)

    elif request.method == 'GET':
        comments = Comment.objects.filter(movie=movie)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=200)
