import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../styles/ProvinceDistrict.css';

function ProvinceOrigins() {
  const { provinceId } = useParams();
  const [message, setMessage] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [provinceTitle, setProvinceTitle] = useState("");
  const [provinceTitle2, setProvinceTitle2] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/servergetprovinceorigins/${provinceId}`);
        const responseData = response.data;
        console.log("Response Data:", responseData); // Log the response data for debugging

        if (responseData && responseData.length > 0) {
          const provinceData = responseData[0];
          setMessage(responseData);

          const headersData = Object.keys(provinceData).filter(key => key !== 'provinceid' && key !== 'provincename');
          setHeaders(headersData);

          const provinceName1 = provinceData.provincename;
          if (provinceName1) {
            const provinceName2 = provinceName1.slice(-2); // Get the last two characters of the city
            if (provinceName2.includes("i") || provinceName2.includes("e")) {
              setProvinceTitle(`${provinceName1}lilerin`);
              setProvinceTitle2(`${provinceName1}liler`);
            } else {
              setProvinceTitle(`${provinceName1}lıların`);
              setProvinceTitle2(`${provinceName1}lılar`);
            }
          } else {
            console.error("provincename is undefined");
          }
        } else {
          console.error("response.data is undefined or empty");
        }
      } catch (error) {
        console.log(error);
        setMessage("error happened");
      }
    };

    getData();
  }, [provinceId]);

  return (
    <div>
      <h2 style={{ fontFamily: "Ubuntu" }}>{provinceTitle} En Çok Yaşadığı İller</h2>
      {Array.isArray(message) ? (
        <table className="provinceDistrictTable">
          <thead>
            <tr>
              <th>SIRA</th>
              <th>İLLER</th>
              <th>{provinceTitle2}</th>
            </tr>
          </thead>
          <tbody>
            {headers.map((header, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{header}</td>
                <td>{message[0][header]}</td>
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

export default ProvinceOrigins;
