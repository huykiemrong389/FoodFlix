import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header__content">
        {/* Logo */}
        <img src="/Users/huybbi/Documents/Restaurant_RecommendSystem/frontend/src/assets/foodd.jpeg" alt="FoodFlix Logo" className="header__logo" />

        {/* Menu */}
        <nav className="header__nav">
          <a href="#home" className="header__link">Trang chủ</a>
          <a href="#tvshows" className="header__link">Món ăn phổ biến</a>
          <a href="#movies" className="header__link">Nhà hàng nổi bật</a>
          <a href="#latest" className="header__link">Mới nhất</a>
          <a href="#mylist" className="header__link">Danh sách của tôi</a>
        </nav>

        {/* Right Icons */}
        <div className="header__icons">
          <i className="fas fa-search"></i> {/* Icon tìm kiếm */}
          <i className="fas fa-bell"></i>   {/* Icon thông báo */}
          <div className="header__profile">
            <img
              src="/Users/huybbi/Documents/Restaurant_RecommendSystem/frontend/src/assets/user.png"
              alt="Profile"
              className="header__profileImage"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
