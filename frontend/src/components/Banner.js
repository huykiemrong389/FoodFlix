import React from 'react';


function Banner() {
  const bannerFood = {
    name: 'Sushi',
    image: '/assets/sushi.jpg',
    description: 'Fresh raw fish served with rice and seaweed.',
  };

  return (
    <div
      className="banner"
      style={{
        backgroundImage: `url(${bannerFood.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="banner-content">
        <h1>{bannerFood.name}</h1>
        <p>{bannerFood.description}</p>
      </div>
    </div>
  );
}

export default Banner;
