import React from 'react';


function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">Foodflix</h1>
      <input
        type="text"
        placeholder="Search for food or restaurants..."
        className="search-bar"
      />
    </nav>
  );
}

export default Navbar;
