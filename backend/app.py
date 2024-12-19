from flask import Flask, request, jsonify
import pandas as pd
from models.collaborative_filtering import collaborative_filtering
from models.content_based import content_based_filtering
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# Đặt thư mục gốc
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')

# Đọc dữ liệu từ các file CSV
cuisine_data = pd.read_csv(os.path.join(DATA_DIR, 'chefmozcuisine.csv'), names=['placeID', 'cuisine'])
places_data = pd.read_csv(os.path.join(DATA_DIR, 'geoplaces2.csv'), encoding='latin1')

# Đảm bảo cột placeID có cùng kiểu dữ liệu
cuisine_data['placeID'] = cuisine_data['placeID'].astype(str)
places_data['placeID'] = places_data['placeID'].astype(str)

# Gộp dữ liệu loại món ăn và vị trí
data = pd.merge(cuisine_data, places_data, on='placeID', how='inner')

@app.route('/recommend', methods=['GET'])
def recommend():
    query = request.args.get('q', '').lower()
    # Lấy danh sách các món ăn hoặc nhà hàng phù hợp
    filtered = data[data['cuisine'].str.contains(query, case=False) |
                    data['name'].str.contains(query, case=False)]
    
    # Nếu không có món ăn nào tìm thấy
    if filtered.empty:
        return jsonify({'message': 'No results found', 'recommendations': []})
    
    # Gợi ý dựa trên loại món ăn
    recommendations = filtered[['cuisine', 'name', 'address']].to_dict(orient='records')
    return jsonify({'message': 'Success', 'recommendations': recommendations})

@app.route('/categories', methods=['GET'])
def get_categories():
    categories = data.groupby('cuisine').apply(lambda x: x[['name', 'address']].to_dict(orient='records')).to_dict()
    return jsonify(categories)



# API: Trả về danh sách món ăn và nhà hàng
@app.route('/foods', methods=['GET'])
def get_foods():
    foods = data[['cuisine', 'name', 'address']].to_dict(orient='records')
    return jsonify(foods)

# API: Tìm kiếm món ăn hoặc nhà hàng
@app.route('/search', methods=['GET'])
def search_foods():
    query = request.args.get('q', '').lower()
    filtered = data[data['cuisine'].str.contains(query, case=False) | 
                    data['name'].str.contains(query, case=False)]
    results = filtered[['cuisine', 'name', 'address']].to_dict(orient='records')
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)