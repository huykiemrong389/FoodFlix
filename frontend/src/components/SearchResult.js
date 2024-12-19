import React from 'react';

function SearchResult({ filteredFoods }) {
  return (
    <div className="search-result">
      <h2>Search Results</h2>
      {filteredFoods.length > 0 ? (
        <div className="food-items">
          {filteredFoods.map((food) => (
            <div key={food.id} className="food-item">
              <img src={food.image} alt={food.name} />
              <p>{food.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}

export default SearchResult;
