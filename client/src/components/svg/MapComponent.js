import React, {useState} from 'react';
import { ReactComponent as MapSvg } from './map.svg'; // Assuming your SVG file is named map.svg and is in the same folder
import { useNavigate } from "react-router-dom";
import '../../styles/MapComponent.css'; // Import CSS file for styling
import provinceMap from './provinceMap';

function MapComponent() {
  const navigate = useNavigate();

  let [stateName, setStateName] = useState("");
  

  const handleRegionClick = (event) => {
    const provinceIdNum = event.target.id;
    navigate(`/province/${provinceIdNum}`);
  };
  const handleRegionHover = (event) => {
    const provinceIdNum = event.target.id;
    const provinceName = provinceMap[provinceIdNum];
    setStateName(provinceName);;
  }

  const goHomepage = () => {
    navigate("/")
  }


  return (
    <div>
      <h1 onClick={goHomepage} style={{ fontFamily: "Ubuntu", cursor: "pointer"}}>TÜRKİYE NÜFUS TABLOSU</h1>
      <p>{stateName}&nbsp;</p>
      <div className="map-container">
        <MapSvg onMouseOver={handleRegionHover} onClick={handleRegionClick} />
      </div>
      
    </div>
  );
}

export default MapComponent;