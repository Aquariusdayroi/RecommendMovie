from .functions import split_data_for_cross_domain, getRecommendations
from recomendation.models import Movie
from django.core.cache import cache


def recommend_movies_for_user(user_id):
    try:
        # Kiểm tra cache xem đã có khuyến nghị cho user_id chưa
        cache_key = f"recommendations_{user_id}"
        cached_recommendations = cache.get(cache_key, [])

        if len(cached_recommendations) < 20:  # Nếu cache không đủ 20 phim, tạo lại khuyến nghị
            D1, D4 = split_data_for_cross_domain(target_ratio=0.3)
            if user_id not in D1:
                raise ValueError(f"User {user_id} không có trong D1. Hãy kiểm tra dữ liệu.")

            recommendations = getRecommendations(D1, D4, user_id)
            recommended_movie_ids = [item[1] for item in recommendations]
            cache.set(cache_key, recommended_movie_ids, timeout=3600)  # Lưu vào cache trong 1 giờ
            cached_recommendations = recommended_movie_ids

        # Lấy ngẫu nhiên 20 phim từ cache và xóa chúng khỏi cache
        next_movies = cached_recommendations[:20]
        cache.set(cache_key, cached_recommendations[20:], timeout=3600)  # Cập nhật cache

        # Lấy thông tin phim từ database dựa trên ID
        recommended_movies = Movie.objects.filter(id__in=next_movies)
        return recommended_movies
    except Exception as e:
        print(f"Lỗi khi tạo khuyến nghị cho user {user_id}: {str(e)}")
        return []