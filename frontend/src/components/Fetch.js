import React, { useState, useEffect } from 'react';

export const ApiExample = () => {
  // useState means restaurants is like a static var. 
  // We can update it globally across runs and its singular.
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // We hit the Express endpoint, not the model file directly
        const response = await fetch('/api/restaurants'); 
        // After we get a response we return it, o.w error.
        const result = await response.json();
        console.log("Great Success")
        setRestaurants(result); // We set restaurants with the response 
        // we get from fetch('/api/restaurants') == GET->'http:localhost5000/api/restaurants'
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchData();
  }, []);

  return (
    // Example component featuring the restaurant list we got from our GET call.
    <div>
      <h3>Restaurants List</h3>
      <ul>
        {restaurants.map((restaurant, id) => (
          // The array is mapping key (list index) to restaurant name.
          <li key={restaurant.id}>{restaurant.name}</li>
        ))}
      </ul>
    </div>
  );
};