// src/components/Footer.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import '../../styles/Footer.css';

const Footer = () => {
  const navigate = useNavigate();
 
  const handleHomeClick = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" role="contentinfo" aria-label="Footer">
      <div className="footer-content">
        <div className="footer-header">
          <p>Kaynak Genel:
            <a href="https://www.tuik.gov.tr/" target="_blank" rel="noopener noreferrer" aria-label="General link to TÜİK site">TÜİK</a>
          </p>
          <FaHome
            className="home-icon"
            onClick={handleHomeClick}
            aria-label="Go to homepage"
          />
        </div>
        <p>Kaynak Tablolar:
          <a href="https://biruni.tuik.gov.tr/medas/?locale=tr" target="_blank" rel="noopener noreferrer" aria-label="Data link to TÜİK site">TÜİK-Biruni</a>
        </p>
        <p>SVG Türkiye Haritası/Map: 
          <a href="https://simplemaps.com/svg/country/tr" target="_blank" rel="noopener noreferrer" 
          aria-label="Data link to SimpleMaps website">SimpleMaps</a>
        </p>
        <p>Website Manager: <a href='https://www.youtube.com/@soft.tomatoes'> Soft Tomatoes  </a> </p>
        <p>Contact: <a href="mailto:drysoftware1@gmail.com" aria-label="Email contact to DrySoftware">drysoftware1@gmail.com</a></p>
      </div>
    </footer>
  );
};

export default Footer;
