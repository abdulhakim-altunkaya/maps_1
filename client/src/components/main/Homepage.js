import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/TableStyles.css';

function Homepage() {
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

  return (
    <div>
      <h1>City Populations for 2023 and 2022</h1>
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
                <td>{province.provincename}</td>
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
        <p>{message}</p>
      )}
    </div>
  );
}

export default Homepage;
