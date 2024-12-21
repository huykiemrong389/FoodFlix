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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hàm random ảnh từ danh sách ảnh mẫu
  const getRandomImage = () => {
    const imagePool = [
      food1, food2, food3, food4, food5, food6, food7, food8,
      food9, food10, food11, food12, food13, food14, food15,
      food16, food17, food18, food19, food20, food21, food22, food23
    ];
    return imagePool[Math.floor(Math.random() * imagePool.length)];
  };

  // Fetch food data from backend
  useEffect(() => {
    const fetchFoods = async () => {
      const response = await fetch("http://127.0.0.1:3001/api/foods");
      const data = await response.json();
      setFoods(data || {});
    };

    fetchFoods();
  }, []);

  // Fetch restaurant details
  const fetchRestaurantDetails = async (place_id) => {
    const response = await fetch(`http://127.0.0.1:3001/api/restaurants/${place_id}/details`);
    const data = await response.json();
    setRestaurantDetails(data || {});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRestaurantDetails({});
  };

  // Xử lý tìm kiếm
  const handleSearch = () => {
    const filtered = {};
    Object.keys(foods).forEach(category => {
      const filteredItems = foods[category].filter(item => 
        (item.Rcuisine && item.Rcuisine.toLowerCase().includes(query.toLowerCase())) || 
        (item.name && item.name.toLowerCase().includes(query.toLowerCase()))
      );
      if (filteredItems.length > 0) {
        filtered[category] = filteredItems;
      }
    });
    setFoods(filtered);
    setSuggestions([]);  // Clear suggestions after search
  };

  // Xử lý gợi ý tìm kiếm
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) {
      const newSuggestions = [];
      Object.keys(foods).forEach(category => {
        foods[category].forEach(item => {
          if ((item.Rcuisine && item.Rcuisine.toLowerCase().includes(value.toLowerCase())) || 
              (item.name && item.name.toLowerCase().includes(value.toLowerCase()))) {
            newSuggestions.push(item.name);
          }
        });
      });
      setSuggestions(newSuggestions.slice(0, 5));  // Giới hạn số gợi ý
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="navbar">
        <div className="navbar-left">
          <div className="logo" onClick={() => window.location.reload()}>FoodFlix</div>
          <ul className="navbar-links">
            <li>Trang chủ</li>
            <li>Âm thực</li>
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
            <button className="search-button" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </header>

      {/* Nội dung */}
      <div className="content">
        {/* Danh sách món ăn */}
        {Object.keys(foods).map((category, index) => (
          <div key={index} className="category">
            <h2>{category}</h2>
            <div className="row">
              {Array.isArray(foods[category]) && foods[category].map((item, idx) => (
                <div key={idx} className="food-card" onClick={() => fetchRestaurantDetails(item.placeID)}>
                  <img src={getRandomImage()} alt={item.Rcuisine} />
                  <div className="food-info">
                    <p>{item.placeID}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal chi tiết nhà hàng */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Restaurant Details</h2>
            <p><strong>Place ID:</strong> {restaurantDetails.place_id}</p>
            <p><strong>Name:</strong> {restaurantDetails.name || 'N/A'}</p>
            <p><strong>Address:</strong> {restaurantDetails.address1 || 'N/A'}</p>
            <p><strong>City:</strong> {restaurantDetails.city || 'N/A'}</p>
            <p><strong>State:</strong> {restaurantDetails.state || 'N/A'}</p>
            <p><strong>Country:</strong> {restaurantDetails.country || 'N/A'}</p>
            <p><strong>Cuisines:</strong> {Array.isArray(restaurantDetails.cuisines) ? restaurantDetails.cuisines.join(', ') : 'N/A'}</p>
            <p><strong>Hours:</strong> {Array.isArray(restaurantDetails.hours) ? restaurantDetails.hours.map(hour => `${hour.days}: ${hour.hours}`).join(', ') : 'N/A'}</p>
            <p><strong>Parking:</strong> {restaurantDetails.parking || 'N/A'}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>Information about FoodFlix.</p>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: tranhoangiahuyk15@siu.edu.vn</p>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <p>Social media links</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
