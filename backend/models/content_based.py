import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging

logger = logging.getLogger(__name__)

class ContentBasedRecommender:
    def __init__(self):
        self.cuisine_df = None
        self.hours_df = None
        self.parking_df = None
        self.features_matrix = None
        self.place_indices = None
        
    def load_data(self, cuisine_path='data/chefmozcuisine.csv', 
                 hours_path='data/chefmozhours4.csv',
                 parking_path='data/chefmozparking.csv'):
        """Load all required data"""
        try:
            self.cuisine_df = pd.read_csv(cuisine_path)
            self.hours_df = pd.read_csv(hours_path)
            self.parking_df = pd.read_csv(parking_path)
            self._prepare_features()
            logger.info("Content-based data loaded successfully")
            return True
        except Exception as e:
            logger.error(f"Error loading content-based data: {str(e)}")
            return False
    
    def _prepare_features(self):
        """Prepare combined features for restaurants"""
        # Prepare cuisine features
        cuisine_features = self.cuisine_df.groupby('placeID')['Rcuisine'].apply(
            lambda x: ' '.join(x)).reset_index()
        
        # Prepare hours features
        hours_features = self._process_hours()
        
        # Prepare parking features
        parking_features = self._process_parking()
        
        # Combine all features
        combined_features = pd.merge(
            cuisine_features, 
            hours_features, 
            on='placeID', 
            how='outer'
        )
        combined_features = pd.merge(
            combined_features, 
            parking_features, 
            on='placeID', 
            how='outer'
        )
        
        # Fill NaN values
        combined_features = combined_features.fillna('')
        
        # Create final feature string
        combined_features['all_features'] = (
            combined_features['Rcuisine'] + ' ' +
            combined_features['hours_features'] + ' ' +
            combined_features['parking_features']
        )
        
        # Create TF-IDF matrix
        tfidf = TfidfVectorizer(stop_words='english')
        self.features_matrix = tfidf.fit_transform(combined_features['all_features'])
        
        # Store place indices
        self.place_indices = pd.Series(
            combined_features.index, 
            index=combined_features['placeID']
        )
    
    def _process_hours(self):
        """Process hours data into features"""
        def extract_hours_features(group):
            days = []
            hours = []
            for _, row in group.iterrows():
                days.extend(row['days'].split(';'))
                hours.append(row['hours'])
            
            features = []
            if 'Mon' in days: features.append('open_weekdays')
            if 'Sat' in days or 'Sun' in days: features.append('open_weekends')
            if '00:00-23:30' in hours: features.append('open_late')
            if any('08:00' in h for h in hours): features.append('open_early')
            
            return ' '.join(features)
        
        hours_features = self.hours_df.groupby('placeID').apply(
            extract_hours_features
        ).reset_index()
        hours_features.columns = ['placeID', 'hours_features']
        return hours_features
    
    def _process_parking(self):
        """Process parking data into features"""
        parking_features = self.parking_df.groupby('placeID')['parking_lot'].apply(
            lambda x: 'parking_' + '_'.join(x)
        ).reset_index()
        parking_features.columns = ['placeID', 'parking_features']
        return parking_features
    
    def get_recommendations(self, place_id, n_recommendations=10):
        """Get content-based recommendations"""
        try:
            if place_id not in self.place_indices.index:
                return []
            
            idx = self.place_indices[place_id]
            similarity_scores = cosine_similarity(
                self.features_matrix[idx:idx+1], 
                self.features_matrix
            ).flatten()
            
            similar_scores = list(enumerate(similarity_scores))
            similar_scores = sorted(
                similar_scores, 
                key=lambda x: x[1], 
                reverse=True
            )[1:n_recommendations+1]
            
            recommendations = []
            for idx, score in similar_scores:
                place_id = self.place_indices.index[idx]
                recommendations.append({
                    'place_id': place_id,
                    'similarity_score': float(score),
                    'cuisine': self.cuisine_df[
                        self.cuisine_df['placeID'] == place_id
                    ]['Rcuisine'].tolist(),
                    'parking': self.parking_df[
                        self.parking_df['placeID'] == place_id
                    ]['parking_lot'].iloc[0] if len(self.parking_df[
                        self.parking_df['placeID'] == place_id
                    ]) > 0 else None
                })
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error getting recommendations: {str(e)}")
            return []