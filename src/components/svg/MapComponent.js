import React from 'react';
import { ReactComponent as MapSvg } from './map.svg'; // Assuming your SVG file is named map.svg and is in the same folder

function MapComponent() {
  const handleRegionClick = (event) => {
    // Handle click event on regions of the map
    console.log('Clicked on region:', event.target.id);
  };

  return (
    <div>
      <h1>Interactive SVG Map</h1>
      <div>
        <MapSvg onClick={handleRegionClick} />
      </div>
    </div>
  );
}

export default MapComponent;