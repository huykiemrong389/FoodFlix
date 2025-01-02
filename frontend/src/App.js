import React, { useState, useEffect } from "react";
import "./App.css";
import food1 from "./assets/burger.jpg";
import food2 from "./assets/pizza.jpg";
import food3 from "./assets/sushi.jpg";
import food4 from "./assets/kfc.jpg";
import food5 from "./assets/cafe.JPG";
import food6 from "./assets/pho.jpg";
import food7 from "./assets/mexican.jpg";
import food8 from "./assets/seafood.jpg";
import food9 from "./assets/chinese.jpg";
import food10 from "./assets/armenian.jpg";
import food11 from "./assets/armenian1.jpeg";
import food12 from "./assets/bakery.jpg";
import food13 from "./assets/bakery1.jpg";
import food14 from "./assets/bar.jpg";
import food15 from "./assets/bar1.jpg";
import food16 from "./assets/breakfast.jpg";
import food17 from "./assets/breakfast1.jpg";
import food18 from "./assets/cua.jpg";
import food19 from "./assets/fired.jpg";
import food20 from "./assets/foodd.jpeg";
import food21 from "./assets/chinese1.jpg";
import food22 from "./assets/pizza1.jpg";
import food23 from "./assets/mexican1.jpg";

function App() {
  const [foods, setFoods] = useState({});
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [restaurantDetails, setRestaurantDetails] = useState({});
  const [contentRecommendations, setContentRecommendations] = useState([]);
  const [collaborativeRecommendations, setCollaborativeRecommendations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getRandomImage = () => {
    const imagePool = [
      food1, food2, food3, food4, food5, food6, food7, food8,
      food9, food10, food11, food12, food13, food14, food15,
      food16, food17, food18, food19, food20, food21, food22, food23
    ];
    return imagePool[Math.floor(Math.random() * imagePool.length)];
  };

  useEffect(() => {
    const fetchFoods = async () => {
      const response = await fetch("http://127.0.0.1:3001/api/foods");
      const data = await response.json();
      setFoods(data || {});
    };

    fetchFoods();
  }, []);

  const fetchRestaurantDetails = async (place_id) => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/restaurants/${place_id}/details`);
      const details = await response.json();
      setRestaurantDetails(details || {});

      const recommendationsResponse = await fetch(
        `http://127.0.0.1:3001/api/recommendations/content-based?place_id=${place_id}&n_recommendations=5`
      );
      const recommendationsData = await recommendationsResponse.json();
      setContentRecommendations(recommendationsData.recommendations || []);

      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching restaurant details or recommendations:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRestaurantDetails({});
  };

  const fetchCollaborativeRecommendations = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:3001/api/recommendations/collaborative?user_id=current_user_id&n_recommendations=5"
      );
      const data = await response.json();
      setCollaborativeRecommendations(data.recommendations || []);
    } catch (error) {
      console.error("Error fetching collaborative recommendations:", error);
    }
  };

  const fetchContentRecommendations = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:3001/api/recommendations/content-based?place_id=135085&n_recommendations=5"
      );
      const data = await response.json();
      setContentRecommendations(data.recommendations || []);
    } catch (error) {
      console.error("Error fetching content-based recommendations:", error);
    }
  };

  const handleSearch = () => {
    const filtered = {};
    Object.keys(foods).forEach((category) => {
      const filteredItems = foods[category].filter(
        (item) =>
          (item.Rcuisine && item.Rcuisine.toLowerCase().includes(query.toLowerCase())) ||
          (item.name && item.name.toLowerCase().includes(query.toLowerCase()))
      );
      if (filteredItems.length > 0) {
        filtered[category] = filteredItems;
      }
    });
    setFoods(filtered);
    setSuggestions([]);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) {
      const newSuggestions = [];
      Object.keys(foods).forEach((category) => {
        foods[category].forEach((item) => {
          if (
            (item.Rcuisine && item.Rcuisine.toLowerCase().includes(value.toLowerCase())) ||
            (item.name && item.name.toLowerCase().includes(value.toLowerCase()))
          ) {
            newSuggestions.push(item.name);
          }
        });
      });
      setSuggestions(newSuggestions.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="App">
      <header className="navbar">
        <div className="navbar-left">
          <div className="logo" onClick={() => window.location.reload()}>
            FoodFlix
          </div>
          <ul className="navbar-links">
            <li>Trang chủ</li>
            <li>Ẩm thực</li>
            <li>Nhà hàng</li>
            <li>Yêu thích</li>
          </ul>
        </div>
        <div className="navbar-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for food or restaurants..."
              className="search-bar"
              value={query}
              onChange={handleInputChange}
            />
            {suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="search-suggestion"
                    onClick={() => {
                      setQuery(suggestion);
                      setSuggestions([]);
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
            <button className="search-button" onClick={handleSearch}>
              Search
            </button>
            <button className="collaborative-recommendations-button" onClick={fetchCollaborativeRecommendations}>
              Show Collaborative Recommendations
            </button>
            <button className="content-recommendations-button" onClick={fetchContentRecommendations}>
              Show Content-Based Recommendations
           
            </button>
          </div>
        </div>
      </header>

      {/* Danh sách Collaborative Recommendations */}
      {collaborativeRecommendations.length > 0 && (
        <div className="recommendations">
          <h2>Collaborative Recommendations (Lọc Cộng Tác)</h2>
          <p>Những đề xuất này dựa trên những gì người dùng khác có cùng sở thích giống bạn.</p>
          <div className="row">
            {collaborativeRecommendations.map((item, idx) => (
              <div
                key={idx}
                className="food-card"
                onClick={() => fetchRestaurantDetails(item.placeID)}
              >
                <img src={getRandomImage()} alt={item.name} />
                <div className="food-info">
                  <p>{item.name || `Place ID: ${item.placeID}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Danh sách Content-Based Recommendations */}
      {contentRecommendations.length > 0 && (
        <div className="recommendations">
          <h2>Content-Based Recommendations (Lọc Dựa Trên Nội Dung)</h2>
          <p>Những đề xuất này dựa trên đặc điểm của nhà hàng bạn muốn.</p>
          <div className="row">
            {contentRecommendations.map((item, idx) => (
              <div
                key={idx}
                className="food-card"
                onClick={() => fetchRestaurantDetails(item.placeID)}
              >
                <img src={getRandomImage()} alt={item.name} />
                <div className="food-info">
                  <p>{item.name || `Place ID: ${item.placeID}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal hiển thị thông tin chi tiết */}
      {isModalOpen && (
  <div className="modal" onClick={closeModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      {/* Nút thoát modal */}
      <button className="close-modal" onClick={closeModal}>
        &times;
      </button>
      <h2>Chi tiết nhà hàng</h2>
      <p><strong>Place ID:</strong> {restaurantDetails.place_id}</p>
      <p><strong>Name:</strong> {restaurantDetails.name || "N/A"}</p>
      <p><strong>Address:</strong> {restaurantDetails.address1 || "N/A"}</p>
      <p><strong>City:</strong> {restaurantDetails.city || "N/A"}</p>
      <p><strong>State:</strong> {restaurantDetails.state || "N/A"}</p>
      <p><strong>Country:</strong> {restaurantDetails.country || "N/A"}</p>
      <p><strong>Cuisines:</strong> {Array.isArray(restaurantDetails.cuisines) ? restaurantDetails.cuisines.join(", ") : "N/A"}</p>
      <p><strong>Hours:</strong> {Array.isArray(restaurantDetails.hours) ? restaurantDetails.hours.map(hour => `${hour.days}: ${hour.hours}`).join(", ") : "N/A"}</p>
      <p><strong>Parking:</strong> {restaurantDetails.parking || "N/A"}</p>

      <h3>Danh sách các nhà hàng tương tự</h3>
      <div className="row">
        {contentRecommendations.map((item, idx) => (
          <div key={idx} className="food-card">
            <img src={getRandomImage()} alt={item.name || `Place ID: ${item.placeID}`} />
            <div className="food-info">
              <p>{item.name || `Place ID: ${item.placeID}`}</p>
              <p>{item.state || "State: N/A"}</p>
              <p>{item.country || "Country: N/A"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}


      {/* Danh sách tất cả các nhà hàng */}
      <div className="content">
        {Object.keys(foods).map((category, index) => (
          <div key={index} className="category">
            <h2>{category}</h2>
            <div className="row">
              {Array.isArray(foods[category]) &&
                foods[category].map((item, idx) => (
                  <div
                    key={idx}
                    className="food-card"
                    onClick={() => fetchRestaurantDetails(item.placeID)}
                  >
                    <img src={getRandomImage()} alt={item.Rcuisine} />
                    <div className="food-info">
                      <p>{item.name || `Place ID: ${item.placeID}`}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
