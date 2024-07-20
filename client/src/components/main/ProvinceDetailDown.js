import React, {useState, useEffect} from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import '../../styles/ProvinceDistrict.css';


function ProvinceDetailDown() {

  const {provinceId} = useParams();

  const [message, setMessage] = useState([]);

  useEffect(() => {
    console.log("response.data");
    const getData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/serversendprovincedistrictdetails/${provinceId}`);
        setMessage(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.log(error);
        setMessage("error happened");
      }
    }

    getData();
    
  }, [provinceId])

  const formatNumber = (num) => {
    return new Intl.NumberFormat("de-DE").format(num);
  }  


  return (
    <div>
      <h2>VİLAYET/KAZA (İL/İLÇE) NÜFUS TABLOSU</h2>
      {Array.isArray(message) ? (
        <table className="provinceDistrictTable">
          <thead>
            <tr>
              <th>İL</th>
              <th>İLÇE</th>
              <th>2023</th>
              <th>2022</th>
              <th>2021</th>
              <th>2015</th>
              <th>2011</th>
              <th>2007</th>
            </tr>
          </thead>
          <tbody>
            {message.map((district, index) => (
              <tr key={index}>
                <td>{district.provincename}</td>
                <td>{district.districtname}</td>
                <td>{formatNumber(district['2023'])}</td>
                <td>{formatNumber(district['2022'])}</td>
                <td>{formatNumber(district['2021'])}</td>
                <td>{formatNumber(district['2015'])}</td>
                <td>{formatNumber(district['2011'])}</td>
                <td>{formatNumber(district['2007'])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Error, please write to website administrator: drysoftware1@gmail.com</p>
      )}

    </div>
  )
}

export default ProvinceDetailDown;