from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status
from .models import Movie, Rating
from .recomender.recommendation import recommend_movies_for_user
from .serializers import MovieSerializer, RatingSerializer
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken

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
        return Response(serializer.data)
    except Movie.DoesNotExist:
        return Response({"error": "Movie not found"}, status=404)

# Đăng ký người dùng
@api_view(['POST'])
def register_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    email = request.data.get("email")

    if username and password:
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user = User.objects.create_user(username=username, password=password, email=email)
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    else:
        return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

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
