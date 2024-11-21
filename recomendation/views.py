
from django.contrib.auth.models import User

from django.contrib.auth.decorators import login_required
from django.core.cache import cache
from django.contrib.auth import logout

from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Movie, Rating, Comment, UserProfile
from . import models
from django.db.models import Avg, Q
from .recomender.recommendation import recommend_movies_for_user
from .serializers import MovieSerializer, RatingSerializer, CommentSerializer
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser


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
        user_rating = None
        if Rating.objects.filter(user=request.user, movie=movie).exists():
            user_rating = Rating.objects.get(user=request.user, movie=movie).rating

        # Tính trung bình rating
        average_rating = Rating.objects.filter(movie=movie).aggregate(average=Avg('rating'))['average']
        average_rating = round(average_rating, 2) if average_rating else 1.2
        
        data = serializer.data
        data.update({
            "user_rating": user_rating,
            "average_rating": average_rating
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
        # page = request.GET.get('page', 1)
        # paginator = Paginator(recommended_movies, 20)
        # paged_movies = paginator.get_page(page)
        serializer = MovieSerializer(recommended_movies, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Lấy thông tin và cập nhật thông tin người dùng
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def user_profile(request):
    user = request.user
    profile, created = UserProfile.objects.get_or_create(user=user)

    if request.method == 'GET':
        data = {
            "username": user.username,
            "email": user.email,
            "age": profile.age,
            "gender": profile.gender,
            "occupation": profile.occupation,
            "zip_code": profile.zip_code,
            "avatar": profile.avatar.url if profile.avatar else None,
        }
        return Response(data)

    elif request.method == 'PUT':
        user.username = request.data.get("username", user.username)
        user.email = request.data.get("email", user.email)
        profile.age = request.data.get("age", profile.age)
        profile.gender = request.data.get("gender", profile.gender)
        profile.occupation = request.data.get("occupation", profile.occupation)
        profile.zip_code = request.data.get("zip_code", profile.zip_code)
        if request.FILES.get("avatar"):
            profile.avatar = request.FILES["avatar"]

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

# API cho rating
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_movie(request, movie_id):
    try:
        movie = Movie.objects.get(id=movie_id)
        rating_value = request.data.get('rating')
        if not rating_value:
            return Response({"error": "Rating value is required."}, status=400)

        # Tạo hoặc cập nhật rating
        Rating.objects.update_or_create(
            user=request.user, 
            movie=movie,
            defaults={'rating': rating_value}
        )

        # Tính lại rating trung bình
        average_rating = Rating.objects.filter(movie=movie).aggregate(average=Avg('rating'))['average']

        return Response({
            "message": "Rating submitted successfully!",
            "average_rating": round(average_rating, 2)
        }, status=200)
    except Movie.DoesNotExist:
        return Response({"error": "Movie not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


# API cho comment
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

        # Lưu comment
        comment = Comment.objects.create(
            user=request.user,
            movie=movie,
            content=content
        )
        # Trả về comment đã lưu
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=201)

    elif request.method == 'GET':
        comments = Comment.objects.filter(movie=movie)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=200)

#Api đăng xuất
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout_user(request):
    try:
        # Lấy thông tin user hiện tại
        user_id = request.user.id
        
        # Xóa cache liên quan đến user
        cache_key = f"user_data_{user_id}"
        cache.delete(cache_key)
        
        # Đăng xuất người dùng
        logout(request)
        
        return Response({"message": "Logged out successfully"}, status=200)
    except Exception as e:
        return Response({"error": f"Logout failed: {str(e)}"}, status=500)



#Api search

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def search_movies(request):
    query = request.GET.get('query', '').strip()  # Lấy từ khóa tìm kiếm
    if not query:
        return Response({"error": "Query parameter is required."}, status=400)

    # Tìm kiếm với nhiều điều kiện
    movies = Movie.objects.filter(
        Q(title__icontains=query) | Q(overview__icontains=query)
    )

    serializer = MovieSerializer(movies, many=True)
    return Response({"results": serializer.data})



# @api_view(['GET'])

# def search_and_recommend(request):
#     query = request.GET.get('q', '')
#     user_id = request.user.id if request.user.is_authenticated else None

#     if not query:
#         return Response({"error": "Search query is required."}, status=400)

#     # Tìm kiếm phim
#     search_results = Movie.objects.filter(
#         Q(title__icontains=query) |
#         Q(genre__icontains=query) |
#         Q(director__icontains=query) |
#         Q(cast__icontains=query)
#     )

#     # Khuyến nghị thêm dựa trên lịch sử người dùng
#     if user_id:
#         user_rated_movies = Rating.objects.filter(user_id=user_id).values_list('movie_id', flat=True)
#         recommendations = Movie.objects.filter(
#             Q(genre__in=[movie.genre for movie in search_results]) |
#             Q(cast__icontains=query)
#         ).exclude(id__in=user_rated_movies)
#     else:
#         recommendations = []

#     # Serialize dữ liệu
#     search_serializer = MovieSerializer(search_results, many=True)
#     recommend_serializer = MovieSerializer(recommendations, many=True)

#     return Response({
#         "search_results": search_serializer.data,
#         "recommendations": recommend_serializer.data
#     }, status=200)