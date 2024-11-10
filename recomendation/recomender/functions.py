from random import sample
from math import sqrt
from collections import defaultdict
from recomendation.models import Movie, Rating, User 

# Hàm tính độ tương đồng khoảng cách Euclidean giữa hai người dùng
def sim_distance(prefs, person1, person2):
    # Tìm các bộ phim mà cả hai người dùng đều đã đánh giá
    si = {item for item in prefs[person1] if item in prefs[person2]}
    if len(si) == 0: 
        return 0  # Nếu không có phim chung, độ tương đồng bằng 0
    
    # Tính tổng bình phương của sự khác biệt về đánh giá giữa hai người dùng
    sum_of_squares = sum([pow(prefs[person1][item] - prefs[person2][item], 2) for item in si])
    return 1 / (1 + sum_of_squares)  # Trả về độ tương đồng theo khoảng cách Euclidean

# Hàm tính độ tương đồng Pearson giữa hai người dùng
def sim_pearson(prefs, p1, p2):
    # Tìm các bộ phim mà cả hai người dùng đều đã đánh giá
    si = {item for item in prefs[p1] if item in prefs[p2]}
    if len(si) == 0: 
        return 0  # Nếu không có phim chung, độ tương đồng bằng 0
    
    # Tính toán các thông số cần thiết cho công thức Pearson
    n = len(si)
    sum1 = sum([prefs[p1][it] for it in si])
    sum2 = sum([prefs[p2][it] for it in si])
    sum1Sq = sum([pow(prefs[p1][it], 2) for it in si])
    sum2Sq = sum([pow(prefs[p2][it], 2) for it in si])
    pSum = sum([prefs[p1][it] * prefs[p2][it] for it in si])

    # Tính tử số và mẫu số của công thức Pearson
    num = pSum - (sum1 * sum2 / n)
    den = sqrt((sum1Sq - pow(sum1, 2) / n) * (sum2Sq - pow(sum2, 2) / n))
    if den == 0: 
        return 0  # Tránh chia cho 0

    return num / den  # Trả về hệ số tương đồng Pearson

# Lấy đánh giá của tất cả người dùng từ database và lưu vào từ điển prefs
def get_user_ratings():
    prefs = {}
    # Lặp qua tất cả các đánh giá trong database
    for rating in Rating.objects.all():
        user_id = rating.user.id
        movie_id = rating.movie.id
        prefs.setdefault(user_id, {})
        prefs[user_id][movie_id] = rating.rating  # Thêm đánh giá vào từ điển
    return prefs  # Trả về từ điển đánh giá của người dùng


# Hàm chia dữ liệu thành D1 và D4 cho cross-domain recommendation
def split_data_for_cross_domain(target_user_id, target_ratio=0.5):
    # Lấy toàn bộ đánh giá và tạo tập người dùng duy nhất
    all_ratings = Rating.objects.all().select_related('user', 'movie')
    all_users = set(rating.user_id for rating in all_ratings)
    
    # Đảm bảo `target_user_id` nằm trong D1 và tách người dùng theo `target_ratio`
    target_users = {target_user_id}
    remaining_users = list(all_users - {target_user_id})
    target_size = int(len(all_users) * target_ratio)
    
    # Chọn thêm người dùng ngẫu nhiên để thêm vào D1
    target_users.update(sample(remaining_users, target_size - 1))
    source_users = all_users - target_users
    
    # Khởi tạo D1 và D4 dưới dạng từ điển
    D1, D4 = defaultdict(dict), defaultdict(dict)

    # Phân loại đánh giá vào D1 hoặc D4 dựa trên người dùng
    for rating in all_ratings:
        user_id, movie_id, score = rating.user_id, rating.movie_id, rating.rating
        if user_id in target_users:
            D1[user_id][movie_id] = score
        elif user_id in source_users:
            D4[user_id][movie_id] = score

    return D1, D4


# Hàm chính để tạo ra khuyến nghị cho người dùng
def getRecommendations(domain1, domain2, person, similarity=sim_pearson):
    totals = {}
    simSums = {}

    # Duyệt qua tất cả người dùng khác trong domain2
    for other in domain2:
        if other == person: 
            continue  # Không so sánh với chính người dùng đó
        
        sim = similarity(domain2, person, other)  # Tính độ tương đồng với người dùng khác
        if sim <= 0: 
            continue  # Bỏ qua nếu độ tương đồng nhỏ hơn hoặc bằng 0

        # Duyệt qua các bộ phim mà người dùng khác đã đánh giá
        for item in domain1[other]:
            # Chỉ xét các phim mà người dùng chưa đánh giá
            if item not in domain1[person] or domain1[person][item] == 0:
                totals.setdefault(item, 0)
                totals[item] += domain1[other][item] * sim  # Cộng điểm tương đồng x đánh giá
                simSums.setdefault(item, 0)
                simSums[item] += sim  # Tổng hợp điểm tương đồng

    # Tạo danh sách phim và điểm đánh giá dự đoán
    rankings = [(total / simSums[item], item) for item, total in totals.items()]
    rankings.sort(reverse=True)  # Sắp xếp theo điểm từ cao đến thấp
    return rankings  # Trả về danh sách khuyến nghị
