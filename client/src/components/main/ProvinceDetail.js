import React, {useState, useEffect} from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import '../../styles/ProvinceTable.css';

function ProvinceDetail() {
  const [message, setMessage] = useState([]);

  const {provinceId} = useParams();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/serversendprovincedetails/${provinceId}`);
        setMessage(response.data);
        console.log(response.data[2023])
      } catch (error) {
        console.log(error.message);
        setMessage("error happened");
      }      
    }
    getData();
  }, [provinceId])

  const formatNumber = (num) => {
    return new Intl.NumberFormat('de-DE').format(num); // German locale to use dot as thousands separator
  };

  return (
    <div>
      <h2>{message.provincename}</h2>
      <table className="provincetable">
        <thead>
          <tr>
            <th>YIL</th>
            <th>NÜFUS</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>2023</td><td>{formatNumber(message[2023])}</td></tr>
          <tr><td>2022</td><td>{formatNumber(message[2022])}</td></tr>
          <tr><td>2021</td><td>{formatNumber(message[2021])}</td></tr>
          <tr><td>2020</td><td>{formatNumber(message[2020])}</td></tr>
          <tr><td>2019</td><td>{formatNumber(message[2019])}</td></tr>
          <tr><td>2018</td><td>{formatNumber(message[2018])}</td></tr>
          <tr><td>2017</td><td>{formatNumber(message[2017])}</td></tr>
          <tr><td>2016</td><td>{formatNumber(message[2016])}</td></tr>
          <tr><td>2015</td><td>{formatNumber(message[2015])}</td></tr>
          <tr><td>2014</td><td>{formatNumber(message[2014])}</td></tr>
          <tr><td>2013</td><td>{formatNumber(message[2013])}</td></tr>
          <tr><td>2012</td><td>{formatNumber(message[2012])}</td></tr>
          <tr><td>2011</td><td>{formatNumber(message[2011])}</td></tr>
          <tr><td>2010</td><td>{formatNumber(message[2010])}</td></tr>
          <tr><td>2009</td><td>{formatNumber(message[2009])}</td></tr>
          <tr><td>2008</td><td>{formatNumber(message[2008])}</td></tr>
          <tr><td>2007</td><td>{formatNumber(message[2007])}</td></tr>
        </tbody>
      </table>

    </div>
  )
}

export default ProvinceDetail;
