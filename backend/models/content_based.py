def content_based_filtering(user_id, restaurants, user_cuisines):
    # Tìm loại món ăn yêu thích của người dùng
    user_preferences = user_cuisines[user_cuisines['userID'] == user_id]['Rcuisine'].tolist()

    # Lọc nhà hàng phù hợp với sở thích món ăn
    recommendations = restaurants[restaurants['Rcuisine'].isin(user_preferences)]

    # Trả về danh sách top 5 nhà hàng
    result = recommendations[['placeID', 'name', 'address']].head(5).to_dict(orient='records')
    return result
