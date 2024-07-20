import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/TableStyles.css';

function Homepage() {
  const navigate = useNavigate();

  const [message, setMessage] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/servergetprovinces');
        setMessage(response.data);
      } catch (error) {
        console.log(error.message);
        setMessage('error happened');
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
      <h1>NÜFUS TABLOSU</h1>
      {Array.isArray(message) ? (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Sıra</th>
              <th>Vilayet</th>
              <th>2023</th>
              <th>2022</th>
              <th>2021</th>
              <th>2015</th>
              <th>2011</th>
              <th>2007</th>
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
        <p>Error, please write to website administrator: drysoftware1@gmail.com</p>
      )}
    </div>
  );
}

export default Homepage;
