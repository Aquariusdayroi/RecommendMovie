import os
from django.utils import timezone
from datetime import datetime
from recomendation.models import Movie, Rating
from tqdm import tqdm
import requests 
import re

def load_movies():
    with open('./crossDomainRecommenderSystem-master/movielens/u.item', 'r', encoding='ISO-8859-1') as f:
        lines = f.readlines()
        for line in tqdm(lines, desc="Loading movies"):
            parts = line.strip().split('|')
            movie_id = int(parts[0])
            title = parts[1]
            release_date = parts[2]
            genres = parts[5:]

            # Xử lý ngày phát hành
            try:
                release_date = datetime.strptime(release_date, '%d-%b-%Y').date()
            except ValueError:
                release_date = None

            # Tạo danh sách thể loại (dựa vào các cột 0/1 của file u.item)
            genre_labels = ["unknown", "Action", "Adventure", "Animation", "Children's", "Comedy", "Crime", "Documentary", "Drama", "Fantasy", "Film-Noir", "Horror", "Musical", "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western"]
            genre_list = [genre_labels[i] for i, g in enumerate(genres) if g == "1"]
            genre = ", ".join(genre_list)
            id=movie_id
            defaults={
                "title": title,
                "release_date": release_date,
                "genre": genre
            }
            # Thêm phim vào database
            Movie.objects.update_or_create(
                id=movie_id,
                defaults={
                    "title": title,
                    "release_date": release_date,
                    "genre": genre
                }
            )




def load_ratings():
    with open('./crossDomainRecommenderSystem-master/movielens/u.data', 'r') as f:
        lines = f.readlines()
        for line in tqdm(lines, desc="Loading ratings"):
            parts = line.strip().split('\t')
            user_id = int(parts[0])
            movie_id = int(parts[1])
            rating_value = int(parts[2])
            # Chuyển timestamp sang múi giờ hiện tại
            timestamp = timezone.make_aware(datetime.fromtimestamp(int(parts[3])))

            # Kiểm tra xem ẽphim có tồn tại trong cơ sở dữ liệu không
            try:
                movie = Movie.objects.get(id=movie_id)
                # Tạo hoặc cập nhật đánh giá
                Rating.objects.update_or_create(
                    movie=movie,
                    user_id=user_id,
                    defaults={"rating": rating_value, "timestamp": timestamp}
                )
        
            except Movie.DoesNotExist:
                print(f"Movie with ID {movie_id} not found.")



def get_poster_urls():
    api_key = "9de9e07ab5ab14a81cd1467c9bc145f9"
    base_image_url = "https://image.tmdb.org/t/p/w500"  # URL cơ bản cho ảnh poster

    for movie in tqdm(Movie.objects.all(), desc="Loading Image"):
        title = movie.title
        title = re.sub(r"\s\(\d{4}\)$", "", movie.title)  # Loại bỏ năm phát hành trong ngoặc đơn
        year = movie.release_date.year if movie.release_date else None

        # Endpoint TMDb API để tìm kiếm phim
        url = f"https://api.themoviedb.org/3/search/movie?api_key={api_key}&query={title}"
        if year:
            url += f"&year={year}"

        response = requests.get(url)
        data = response.json()
        
        # Kiểm tra kết quả tìm kiếm và lấy poster_path
        if data['results']:
            poster_path = data['results'][0].get('poster_path')  # Lấy poster_path của kết quả đầu tiên
            if poster_path:
                movie.poster_url = f"{base_image_url}{poster_path}"
                movie.save()
            else:
                print(f"No poster found for '{title}'")
        else:
            print(f"No results found for '{title}'")

