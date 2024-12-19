import React from 'react';


function Row({ title, foods }) {
  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row-scroll">
        {foods.map((food) => (
          <div key={food.id} className="row-item">
            <img src={food.image} alt={food.name} />
            <p className="food-name">{food.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Row;
