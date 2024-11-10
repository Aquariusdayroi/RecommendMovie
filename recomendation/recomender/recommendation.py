from .functions import split_data_for_cross_domain, getRecommendations
from recomendation.models import Movie  

def recommend_movies_for_user(user_id):
    # Chia dữ liệu với user_id nằm trong target domain (D1)
    D1, D4 = split_data_for_cross_domain(user_id)
    
    # Tạo khuyến nghị từ D1 và D4 cho user_id
    recommendations = getRecommendations(D1, D4, user_id)
    print("helllo")
    # Lấy danh sách ID phim từ các khuyến nghị
    recommended_movie_ids = [item_id for _, item_id in recommendations]
    recommended_movies = Movie.objects.filter(id__in=recommended_movie_ids)
    print(len(recommended_movie_ids))
    return recommended_movies
