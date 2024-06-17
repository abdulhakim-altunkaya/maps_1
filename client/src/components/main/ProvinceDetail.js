import React from 'react';
import { useParams } from "react-router-dom";

function ProvinceDetail() {
  const {provinceId} = useParams();

  return (
    <div>{provinceId}</div>
  )
}

export default ProvinceDetail