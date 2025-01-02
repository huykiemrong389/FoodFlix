import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging

logger = logging.getLogger(__name__)

class ContentBasedRecommender:
    def __init__(self):
        self.places_df = None
        self.tfidf_matrix = None
        self.cosine_sim = None

    def load_data(self, places_path='data/geoplaces2.csv'):
        """Load places data"""
        try:
            self.places_df = pd.read_csv(places_path)
            # Sử dụng các cột khác thay cho `cuisine`
            self.places_df['combined'] = self.places_df.apply(lambda x: f"{x['price']} {x['address']} {x['city']} {x['state']}", axis=1)
            
            tfidf = TfidfVectorizer(stop_words='english')
            self.tfidf_matrix = tfidf.fit_transform(self.places_df['combined'])
            self.cosine_sim = cosine_similarity(self.tfidf_matrix, self.tfidf_matrix)
            
            logger.info("Places data loaded and TF-IDF matrix created successfully")
            return True
        except Exception as e:
            logger.error(f"Error loading places data: {str(e)}")
            return False

    def get_recommendations(self, place_id, n_recommendations=10):
        """Get content-based recommendations for a place"""
        try:
            if self.places_df is None:
                raise ValueError("Places data not loaded.")
                
            idx = self.places_df.index[self.places_df['placeID'] == place_id].tolist()[0]
            sim_scores = list(enumerate(self.cosine_sim[idx]))
            sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
            sim_scores = sim_scores[1:n_recommendations+1]
            
            place_indices = [i[0] for i in sim_scores]
            recommendations = self.places_df.iloc[place_indices][['placeID', 'name']].to_dict('records')
            
            return recommendations
        except Exception as e:
            logger.error(f"Error getting recommendations: {str(e)}")
            return []
