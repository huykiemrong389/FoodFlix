import pandas as pd
from surprise import SVD, Dataset, Reader
from surprise.model_selection import train_test_split
import logging

logger = logging.getLogger(__name__)

class CollaborativeRecommender:
    def __init__(self):
        self.model = SVD(n_factors=100, n_epochs=20, lr_all=0.005, reg_all=0.02)
        self.ratings_df = None
        
    def load_data(self, ratings_path='data/rating_final.csv'):
        """Load ratings data"""
        try:
            self.ratings_df = pd.read_csv(ratings_path)
            logger.info("Ratings data loaded successfully")
            return True
        except Exception as e:
            logger.error(f"Error loading ratings data: {str(e)}")
            return False
            
    def train_model(self):
        """Train the SVD model"""
        try:
            reader = Reader(rating_scale=(0, 2))
            data = Dataset.load_from_df(
                self.ratings_df[['userID', 'placeID', 'rating']], 
                reader
            )
            trainset = data.build_full_trainset()
            self.model.fit(trainset)
            logger.info("Model trained successfully")
            return True
        except Exception as e:
            logger.error(f"Error training model: {str(e)}")
            return False
    
    def get_recommendations(self, user_id, n_recommendations=10):
        """Get recommendations for a user"""
        try:
            # Get all places
            all_places = self.ratings_df['placeID'].unique()
            
            # Get places the user hasn't rated
            user_rated = set(self.ratings_df[
                self.ratings_df['userID'] == user_id
            ]['placeID'])
            places_to_predict = list(set(all_places) - user_rated)
            
            # Make predictions
            predictions = []
            for place_id in places_to_predict:
                pred = self.model.predict(user_id, place_id)
                predictions.append({
                    'place_id': place_id,
                    'predicted_rating': pred.est
                })
            
            # Sort and return top N recommendations
            predictions.sort(key=lambda x: x['predicted_rating'], reverse=True)
            return predictions[:n_recommendations]
            
        except Exception as e:
            logger.error(f"Error getting recommendations: {str(e)}")
            return []
    
    def evaluate(self, test_size=0.25):
        """Evaluate the model"""
        try:
            reader = Reader(rating_scale=(0, 2))
            data = Dataset.load_from_df(
                self.ratings_df[['userID', 'placeID', 'rating']], 
                reader
            )
            
            trainset, testset = train_test_split(data, test_size=test_size)
            self.model.fit(trainset)
            predictions = self.model.test(testset)
            
            # Calculate RMSE
            from surprise import accuracy
            rmse = accuracy.rmse(predictions)
            mae = accuracy.mae(predictions)
            
            return {
                'rmse': rmse,
                'mae': mae
            }
        except Exception as e:
            logger.error(f"Error evaluating model: {str(e)}")
            return None