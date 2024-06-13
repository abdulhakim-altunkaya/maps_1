import React from 'react';
import { useParams } from "react-router-dom";

function DistrictDetail() {
  const {districtName} = useParams();

  return (
    <div>{districtName}</div>
  )
}

export default DistrictDetail