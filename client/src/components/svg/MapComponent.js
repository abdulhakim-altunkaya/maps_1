import React, {useState} from 'react';
import { ReactComponent as MapSvg } from './map.svg'; // Assuming your SVG file is named map.svg and is in the same folder
import { useNavigate } from "react-router-dom";
import '../../styles/MapComponent.css'; // Import CSS file for styling
import provinceMap from './provinceMap';

function MapComponent() {
  const navigate = useNavigate();

  let [stateName, setStateName] = useState("");
  let [stateId, setStateId] = useState("");
  

  const handleRegionClick = (event) => {
    const provinceIdNum = event.target.id;
    const provinceName = provinceMap[provinceIdNum];
    navigate(`/province/${provinceIdNum}`);
  };
  const handleRegionHover = (event) => {
    const provinceIdNum = event.target.id;
    const provinceName = provinceMap[provinceIdNum];
    setStateName(provinceName);
    setStateId(provinceIdNum);
  }


  return (
    <div>
      <h1>Interactive SVG Map</h1>
      <div className="map-container">
        <MapSvg onMouseOver={handleRegionHover} onClick={handleRegionClick} />
      </div>
      <p>{stateId}&nbsp;&nbsp;&nbsp;{stateName}</p>
    </div>
  );
}

export default MapComponent;