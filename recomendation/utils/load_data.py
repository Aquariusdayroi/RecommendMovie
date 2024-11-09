from django.utils import timezone
from datetime import datetime
from recomendation.models import Movie, Rating, UserProfile
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model


import csv
import os
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


User = get_user_model()

def load_ratings():
    with open('./crossDomainRecommenderSystem-master/movielens/u.data', 'r') as f:
        lines = f.readlines()
        for line in tqdm(lines, desc="Loading ratings"):
            parts = line.strip().split('\t')
            user_id = int(parts[0])
            movie_id = int(parts[1])
            rating_value = int(parts[2])
            timestamp = timezone.make_aware(datetime.fromtimestamp(int(parts[3])))

            # Kiểm tra xem phim có tồn tại trong cơ sở dữ liệu không
            try:
                movie = Movie.objects.get(id=movie_id)

                # Kiểm tra và tạo User nếu chưa tồn tại
                user, created = User.objects.get_or_create(
                    id=user_id,
                    defaults={"username": f"user_{user_id}", "email": f"user_{user_id}@gmail.com"}
                )

                # Tạo hoặc cập nhật đánh giá
                Rating.objects.update_or_create(
                    movie=movie,
                    user=user,
                    defaults={"rating": rating_value, "timestamp": timestamp}
                )
            except Movie.DoesNotExist:
                print(f"Movie with ID {movie_id} not found.")



def migrate_users_from_file():
    with open('./crossDomainRecommenderSystem-master/movielens/u.user', 'r') as file:
        total_lines = sum(1 for line in file)

    with open('./crossDomainRecommenderSystem-master/movielens/u.user', 'r') as file:
        reader = csv.reader(file, delimiter='|')
        for row in tqdm(reader, total = total_lines,  desc = "Load User Profile"):
            user_id, age, gender, occupation, zip_code = row
            # user id | age | gender | occupation | zip code

            # Truy vấn user 
            user, created = User.objects.get_or_create(
                id = user_id, 
                defaults={
                    "username": f"user_{user_id}",
                    "email": f"user_{user_id}@gmail.com",
                }
            )
            if created: 
                user.set_password("123456789")
                user.save()            
            else:
                # Cập nhật username và mật khẩu cho user đã tồn tại
                user.username = f"user_{user_id}"
                user.set_password("123456789")  # Đặt mật khẩu mặc định mã hóa
                user.save()  # Lưu lại các thay đổi

            # Cập nhật hoặc tạo mới UserProfile
            UserProfile.objects.update_or_create(
                user=user,
                defaults={
                    "age": int(age) if age.isdigit() else None,
                    "gender": gender,
                    "occupation": occupation,
                    "zip_code": zip_code
                }
            )
            if created:
                print(f"Created user and profile for {user.username}")


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



def get_movie_details():
    api_key = "9de9e07ab5ab14a81cd1467c9bc145f9"
    base_image_url = "https://image.tmdb.org/t/p/w500"  # URL cơ bản cho ảnh poster

    for movie in tqdm(Movie.objects.all(), desc="Loading Movie Details"):
        # Loại bỏ năm phát hành trong tiêu đề (nếu có)
        title = re.sub(r"\s\(\d{4}\)$", "", movie.title)
        year = movie.release_date.year if movie.release_date else None

        # TMDb API để tìm kiếm phim
        search_url = f"https://api.themoviedb.org/3/search/movie?api_key={api_key}&query={title}"
        if year:
            search_url += f"&year={year}"

        response = requests.get(search_url)
        data = response.json()

        if data['results']:
            movie_data = data['results'][0]  # Lấy kết quả đầu tiên trong tìm kiếm
            movie.poster_url = f"{base_image_url}{movie_data.get('poster_path')}"
            movie.overview = movie_data.get('overview')

            # Gọi API chi tiết để lấy thêm thông tin
            movie_id = movie_data['id']
            details_url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}&append_to_response=credits"
            details_response = requests.get(details_url)
            details_data = details_response.json()

            # Lấy runtime
            movie.runtime = details_data.get('runtime')

            # Lấy đạo diễn từ credits
            directors = [crew['name'] for crew in details_data.get('credits', {}).get('crew', []) if crew['job'] == 'Director']
            movie.director = ', '.join(directors)

            # Lấy danh sách diễn viên
            cast = [actor['name'] for actor in details_data.get('credits', {}).get('cast', [])[:5]]
            movie.cast = ', '.join(cast)

            movie.save()
        else:
            print(f"No results found for '{title}'")