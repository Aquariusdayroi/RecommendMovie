import copy
from random import sample
from math import sqrt
from collections import defaultdict
from recomendation.models import Movie, Rating, User
from concurrent.futures import ThreadPoolExecutor

# Hàm tính độ tương đồng khoảng cách Euclidean giữa hai người dùng
def sim_distance(prefs, person1, person2):
    # Lọc ra các bộ phim mà cả hai người dùng đều đã đánh giá
    si = {item for item in prefs[person1] if item in prefs[person2]}
    if len(si) == 0:
        return 0

    # Tính tổng bình phương sự khác biệt giữa các đánh giá
    sum_of_squares = sum((prefs[person1][item] - prefs[person2][item]) ** 2 for item in si)
    return 1 / (1 + sum_of_squares)  # Đảo ngược để giá trị tương đồng càng cao càng gần

# Hàm tính độ tương đồng Pearson giữa hai người dùng
def sim_pearson(prefs, p1, p2):
    # Lấy các bộ phim mà cả hai người dùng đã đánh giá
    si = {item for item in prefs[p1] if item in prefs[p2]}
    if len(si) == 0:
        return 0

    # Tổng hợp các đánh giá của cả hai người dùng trên các phim đã xem chung
    n = len(si)
    sum1, sum2 = sum(prefs[p1][it] for it in si), sum(prefs[p2][it] for it in si)
    sum1Sq, sum2Sq = sum(prefs[p1][it] ** 2 for it in si), sum(prefs[p2][it] ** 2 for it in si)
    pSum = sum(prefs[p1][it] * prefs[p2][it] for it in si)

    # Tính toán hệ số Pearson
    num = pSum - (sum1 * sum2 / n)
    den = sqrt((sum1Sq - (sum1 ** 2) / n) * (sum2Sq - (sum2 ** 2) / n))
    return 0 if den == 0 else num / den

# Lấy đánh giá của tất cả người dùng từ database và lưu vào từ điển prefs
def get_user_ratings():
    prefs = defaultdict(dict)
    # Lặp qua tất cả các đánh giá từ database và thêm vào từ điển
    for rating in Rating.objects.all():
        prefs[rating.user.id][rating.movie.id] = rating.rating
    return prefs  # Trả về từ điển đánh giá của người dùng

# Hàm chia dữ liệu thành D1 và D4 cho cross-domain recommendation
# def split_data_for_cross_domain(target_ratio=0.1):
#     """
#     Tách dữ liệu cho cross-domain recommendation với D1 và D4.
#     D1 sẽ chứa target_ratio của toàn bộ dữ liệu, còn D4 là phần còn lại.
#     """
#     # Lấy toàn bộ đánh giá
#     all_ratings = list(Rating.objects.all())
#     target_size = int(len(all_ratings) * target_ratio)
    
#     # Lấy một phần ngẫu nhiên từ all_ratings cho D1
#     D1_ratings = set(sample(all_ratings, target_size))
#     D1, D4 = defaultdict(dict), defaultdict(dict)

#     # Phân loại các đánh giá vào D1 và D4
#     for rating in all_ratings:
#         user_id, movie_id, score = rating.user.id, rating.movie.id, rating.rating
#         target_dict = D1 if rating in D1_ratings else D4
#         target_dict[user_id][movie_id] = score  # Thêm đánh giá vào D1 hoặc D4

#     return D1, D4

def split_data_for_cross_domain(target_ratio=0.3):
    all_ratings = list(Rating.objects.values_list('user__id', 'movie__id', 'rating'))
    target_size = int(len(all_ratings) * target_ratio)

    # Chọn ngẫu nhiên các đánh giá
    D1_ratings = set(sample(all_ratings, target_size))
    D1, D4 = defaultdict(dict), defaultdict(dict)

    def process_rating(rating):
        user_id, movie_id, score = rating
        target_dict = D1 if rating in D1_ratings else D4
        target_dict[user_id][movie_id] = score

    with ThreadPoolExecutor() as executor:
        executor.map(process_rating, all_ratings)

    return D1, D4

# Hàm tạo ra khuyến nghị cho người dùng dựa trên các đánh giá trong domain1 và domain2
def getRecommendations(domain1, domain2, person, similarity=sim_pearson):
    """
    Tạo ra khuyến nghị cho người dùng `person` dựa trên dữ liệu domain2.
    """
    totals = defaultdict(float)  # Tổng số đánh giá được tính toán cho từng phim
    simSums = defaultdict(float)  # Tổng số độ tương đồng cho từng phim

    # Tính điểm khuyến nghị cho từng phim dựa trên độ tương đồng
    for other in domain2:
        if other == person:
            continue
        
        sim = similarity(domain2, person, other)
        if sim <= 0:
            continue

        # Tính điểm đánh giá dự đoán cho các phim mà người dùng chưa xem
        for item in domain1[other]:
            if item not in domain1.get(person, {}):
                totals[item] += domain1[other][item] * sim
                simSums[item] += sim

    # Tạo danh sách khuyến nghị dựa trên điểm đánh giá dự đoán
    rankings = [(totals[item] / simSums[item], item) for item in totals if simSums[item] > 0]
    rankings.sort(reverse=True)  # Sắp xếp theo điểm từ cao xuống thấp
    return rankings
