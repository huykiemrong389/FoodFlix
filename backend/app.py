from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import pandas as pd
from models.collaborative_filtering import CollaborativeRecommender
from models.content_based import ContentBasedRecommender

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize recommenders
collaborative_recommender = CollaborativeRecommender()
content_recommender = ContentBasedRecommender()

# Load data and train models
@app.before_first_request
def initialize():
    # Load collaborative filtering data and train model
    if collaborative_recommender.load_data():
        collaborative_recommender.train_model()
    
    # Load content-based filtering data
    content_recommender.load_data()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Service is running"})

@app.route('/api/recommendations/collaborative', methods=['GET'])
def get_collaborative_recommendations():
    """Get collaborative filtering recommendations"""
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "user_id is required"}), 400
        
        n_recommendations = int(request.args.get('n_recommendations', 10))
        
        recommendations = collaborative_recommender.get_recommendations(
            user_id, 
            n_recommendations
        )
        
        return jsonify({
            "user_id": user_id,
            "recommendations": recommendations
        })
        
    except Exception as e:
        logger.error(f"Error in collaborative recommendations: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/recommendations/content-based', methods=['GET'])
def get_content_based_recommendations():
    """Get content-based recommendations"""
    try:
        place_id = request.args.get('place_id')
        if not place_id:
            return jsonify({"error": "place_id is required"}), 400
        
        place_id = int(place_id)
        n_recommendations = int(request.args.get('n_recommendations', 10))
        
        recommendations = content_recommender.get_recommendations(
            place_id, 
            n_recommendations
        )
        
        return jsonify({
            "place_id": place_id,
            "recommendations": recommendations
        })
        
    except Exception as e:
        logger.error(f"Error in content-based recommendations: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/recommendations/evaluate', methods=['GET'])
def evaluate_recommendations():
    """Evaluate the collaborative filtering model"""
    try:
        metrics = collaborative_recommender.evaluate()
        return jsonify({"metrics": metrics})
    except Exception as e:
        logger.error(f"Error in evaluation: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/restaurants/<place_id>/details', methods=['GET'])
def get_restaurant_details(place_id):
    """Get restaurant details"""
    try:
        place_id = int(place_id)

        # Load data from CSV files
        cuisine_path = 'data/chefmozcuisine.csv'
        places_path = 'data/geoplaces2.csv'
        hours_path = 'data/chefmozhours4.csv'
        parking_path = 'data/chefmozparking.csv'

        cuisine_df = pd.read_csv(cuisine_path)
        places_df = pd.read_csv(places_path)
        hours_df = pd.read_csv(hours_path)
        parking_df = pd.read_csv(parking_path)

        # Get restaurant details from geoplaces2.csv
        restaurant = places_df[places_df['placeID'] == place_id].to_dict('records')
        if not restaurant:
            return jsonify({"error": "Restaurant not found"}), 404
        restaurant = restaurant[0]

        # Get cuisine information
        cuisines = cuisine_df[cuisine_df['placeID'] == place_id]['Rcuisine'].tolist()

        # Get hours information
        hours = hours_df[hours_df['placeID'] == place_id][['hours', 'days']].to_dict('records')

        # Get parking information
        parking = parking_df[parking_df['placeID'] == place_id]['parking_lot'].iloc[0] if len(parking_df[parking_df['placeID'] == place_id]) > 0 else None

        return jsonify({
            "place_id": place_id,
            "name": restaurant.get('name'),
            "address1": restaurant.get('address1'),
            "city": restaurant.get('city'),
            "state": restaurant.get('state'),
            "country": restaurant.get('country'),
            "cuisines": cuisines,
            "hours": hours,
            "parking": parking
        })

    except Exception as e:
        logger.error(f"Error getting restaurant details: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500



@app.route('/api/foods', methods=['GET'])
def get_foods():
    """Get list of food items from chefmozcuisine.csv"""
    try:
        cuisine_path = 'data/chefmozcuisine.csv'
        cuisine_df = pd.read_csv(cuisine_path)

        # Group foods by Rcuisine and prepare a list of items
        food_items = cuisine_df.groupby('Rcuisine').apply(
            lambda x: x.to_dict('records')
        ).to_dict()
        
        return jsonify(food_items)
    except Exception as e:
        logger.error(f"Error getting foods: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3001)  # Change the port if needed







