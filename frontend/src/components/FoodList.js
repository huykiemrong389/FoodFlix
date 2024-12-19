import React from 'react';
import foodData from '../data/foodData';

function FoodList() {
  const categories = [...new Set(foodData.map((food) => food.category))];

  return (
    <div className="food-list">
      {categories.map((category, index) => (
        <div key={index} className="category-section">
          <h2>{category}</h2>
          <div className="food-items-scroll">
            {foodData
              .filter((food) => food.category === category)
              .map((food) => (
                <div key={food.id} className="food-item">
                  <img src={food.image} alt={food.name} />
                  <p className="food-name">{food.name}</p>
                  <p className="food-description">{food.description}</p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FoodList;
