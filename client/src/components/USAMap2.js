import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const USAMap2 = () => {
  return (
    <MapContainer
      center={[37.0902, -95.7129]}
      zoom={4}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> contributors'
      />
    </MapContainer>
  );
};

export default USAMap2;
