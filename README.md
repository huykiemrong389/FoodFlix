# FoodFlix - Restaurant Recommendation System

FoodFlix is a restaurant recommendation system that allows users to explore restaurants, view detailed information, and receive recommendations based on collaborative filtering and content-based filtering.

## Features

- **Restaurant Listing**: Displays all restaurants on the homepage.
- **Detailed View**: Click on any restaurant to view its detailed information, including:
  - Place ID, Name, Address, City, State, Country, Cuisines, Hours, Parking.
- **Recommendations**:
  - Collaborative Recommendations: Suggests restaurants based on user preferences.
  - Content-Based Recommendations: Suggests similar restaurants based on the selected restaurant's features.
- **Modal Functionality**:
  - Displays detailed restaurant info in a modal with similar restaurant suggestions.
  - Modal closes when clicking outside or on the close button.

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>

2. Run Backend
Navigate to the backend folder:
```bash
cd backend
```
Install dependencies:
```bash
npm install
```
Start the backend server:
```bash
python app.py

3. Run Frontend
Navigate to the frontend folder:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Start the React development server:
```bash
npm start
```
The frontend application will run at http://localhost:3000.

API Endpoints

GET /api/foods: Fetches all restaurants.
GET /api/restaurants/:place_id/details: Fetches detailed information of a specific restaurant.
GET /api/recommendations/collaborative: Fetches collaborative filtering recommendations.
GET /api/recommendations/content-based: Fetches content-based filtering recommendations.
Technologies Used

Frontend: React.js
Backend: Node.js (Express)
Database: MongoDB (Optional for restaurant data)
Future Enhancements

Add user authentication.
Provide more filters for restaurant search.
Add map integration for location-based recommendations.
Screenshots

Homepage
Displays a list of restaurants categorized by type.

Restaurant Details Modal
When a restaurant is clicked, its detailed information and similar restaurants are shown in a modal window.

Troubleshooting

If you encounter issues:

Make sure both the backend and frontend servers are running.
Check the API endpoints in the backend are correctly configured.
Ensure the database (if used) is running and contains the required data.
