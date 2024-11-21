"""
URL configuration for movierec project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.urls import path
from recomendation.views import home, movie_detail, register_user,  CustomAuthToken, recommend_movies, user_profile, watched_movies, rate_movie, comment_movie, logout_user,  search_movies
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('recomendation.urls')),  # Thêm đường dẫn API
    # path('api/movies/<int:movie_id>/', movie_detail, name='movie_detail'),
    path('api/movies/<int:movie_id>/detail', movie_detail, name='movie_detail'),
    path('api/register/', register_user, name='register_user'),
    path('api/login/', CustomAuthToken.as_view(), name='login'),
    path('api/logout/', logout_user, name='logout'),
    path('api/recommendations/', recommend_movies, name='recommend_movies'),
    path('api/user/profile/', user_profile, name='user-profile'),
    path('api/user/movies/watched/', watched_movies, name='watched-movies'),  
    path('api/movies/<int:movie_id>/comments/', comment_movie, name='comment_movie'),
    path('api/movies/<int:movie_id>/rate/', rate_movie, name='rate_movie'),
    path('api/search/', search_movies, name='search_movies'),
    path('', home),  # Đường dẫn cho trang chủ
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


