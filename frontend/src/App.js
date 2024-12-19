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



function App() {
  const [categories, setCategories] = useState({});
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Hàm random ảnh từ danh sách ảnh mẫu
  const getRandomImage = () => {
    const imagePool = [food1, food2, food3, food4, food5, food6,food7,food8,food9];
    return imagePool[Math.floor(Math.random() * imagePool.length)];
  };
  
  // Fetch dữ liệu từ backend khi load trang
  useEffect(() => {
    fetch("http://127.0.0.1:5000/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = async () => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const response = await fetch(
      `http://127.0.0.1:5000/recommend?q=${query}`
    );
    const data = await response.json();
    setSearchResults(data.recommendations || []);
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="navbar">
        <h1>FoodFlix</h1>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search for food or restaurants..."
            className="search-bar"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </header>

      {/* Nội dung */}
      <div className="content">
        {/* Kết quả tìm kiếm */}
        {searchResults.length > 0 && (
          <div className="category">
            <h2>Search Results</h2>
            <div className="row">
              {searchResults.map((item, index) => (
                <div key={index} className="food-card">
                  <img src={getRandomImage()} alt={item.name} />
                  <div className="food-info">
                    <h3>{item.name}</h3>
                    <p>{item.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Danh mục món ăn */}
        {Object.keys(categories).map((category, index) => (
          <div key={index} className="category">
            <h2>{category}</h2>
            <div className="row">
              {categories[category].map((item, idx) => (
                <div key={idx} className="food-card">
                  <img src={getRandomImage()} alt={item.name} />
                  <div className="food-info">
                    <h3>{item.name}</h3>
                    <p>{item.address}</p>
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
