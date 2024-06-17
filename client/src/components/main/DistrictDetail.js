import React from 'react';
import { useParams } from "react-router-dom";

function DistrictDetail() {
  const {districtId} = useParams();

  return (
    <div>{districtId}</div>
  )
}

export default DistrictDetail