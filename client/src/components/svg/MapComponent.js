import React, {useState} from 'react';
import { ReactComponent as MapSvg } from './map.svg'; // Assuming your SVG file is named map.svg and is in the same folder
import '../../styles/MapComponent.css'; // Import CSS file for styling

function MapComponent() {
  let [stateName, setStateName] = useState("");

  const handleRegionClick = (event) => {
    // Handle click event on regions of the map
    console.log('Clicked on region:', event.target.id);
  };
  const handleRegionHover = (e) => {
    setStateName(e.target.id)
  }

  return (
    <div>
      <h1>Interactive SVG Map</h1>
      <div className="map-container">
        <MapSvg onMouseOver={handleRegionHover} onClick={handleRegionClick} />
      </div>
      <p>&nbsp;{stateName}</p>
    </div>
  );
}

export default MapComponent;