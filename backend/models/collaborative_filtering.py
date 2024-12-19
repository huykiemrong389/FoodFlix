import pandas as pd

def collaborative_filtering(user_id, ratings):
    # Tính điểm trung bình của người dùng
    user_ratings = ratings[ratings['userID'] == user_id]
    avg_rating = user_ratings['rating'].mean()

    # Tìm các nhà hàng mà người dùng chưa đánh giá
    all_rated = ratings['placeID'].unique()
    user_rated = user_ratings['placeID'].unique()
    not_rated = list(set(all_rated) - set(user_rated))

    # Giả lập tính toán (thay bằng thuật toán thực tế)
    recommendations = [{'placeID': place, 'score': avg_rating} for place in not_rated[:5]]

    return recommendations
