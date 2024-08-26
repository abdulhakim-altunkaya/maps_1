import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/TableStyles.css';
import HomepageInt from './HomepageInt';
import Footer from './Footer';

function Homepage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('/servergetprovinces');
        setMessage(response.data);
        
        // Send the request to log the visitor data without awaiting its completion
        axios.post("/serversavevisitor", {}).catch((error) => {
          //console.error('Error logging visit:', error.message);
        });

      } catch (error) {
        console.log(error.message);
        setMessage('error happened');
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('de-DE').format(num); // German locale to use dot as thousands separator
  };

  const goProvince = async (provinceIdNum) => {
    navigate(`/province/${provinceIdNum}`);
  }

  return (
    <div>
      {isLoading ? 
        (<div aria-live="polite">Lütfen Bekleyiniz..Please wait...</div>) 
        : 
        (
          <>
            <h1 style={{ fontFamily: "Kanit"}}>NÜFUS TABLOSU</h1>
            {Array.isArray(message) ? (
              <table className="styled-table" aria-label="Türkiye vilayetleri nüfus tablosu">
                <thead>
                  <tr>
                    <th scope="col">Sıra</th>
                    <th scope="col">Vilayet</th>
                    <th scope="col">2023</th>
                    <th scope="col">2022</th>
                    <th scope="col">2021</th>
                    <th scope="col">2015</th>
                    <th scope="col">2011</th>
                    <th scope="col">2007</th>
                  </tr>
                </thead>
                <tbody>
                  {message.map((province, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td onClick={() => goProvince(province.provinceid)} style={{cursor: "pointer"}}>
                        {province.provincename}
                      </td>
                      <td>{formatNumber(province['2023'])}</td>
                      <td>{formatNumber(province['2022'])}</td>
                      <td>{formatNumber(province['2021'])}</td>
                      <td>{formatNumber(province['2015'])}</td>
                      <td>{formatNumber(province['2011'])}</td>
                      <td>{formatNumber(province['2007'])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Probably you do not have internet now. Website Administrator: drysoftware1@gmail.com</p>
            )}
            <HomepageInt />
            <Footer />
          </>
        )}
      
    </div>
  );
}

export default Homepage;
