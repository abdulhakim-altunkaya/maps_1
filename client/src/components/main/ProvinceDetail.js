import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProvinceDetailDown from './ProvinceDetailDown';
import '../../styles/ProvinceTable.css';
import Comment from "./Comment";
import CommentDisplay from './CommentDisplay';

function ProvinceDetail() {

  const [message, setMessage] = useState([]);
  const [foreigners, setForeigners] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const { provinceId } = useParams();

  useEffect(() => {
    const getData = async () => {
      setLoading(true); // Set loading to true before starting the fetch
      try {
        const response = await axios.get(`http://localhost:5000/serversendprovincedetails/${provinceId}`);
        const foreignersData = await axios.get(`http://localhost:5000/servergetforeigners/${provinceId}`);
        setMessage(response.data);
        setForeigners(foreignersData.data);
      } catch (error) {
        console.log(error.message);
        setMessage("error happened");
      } finally {
        setLoading(false); // Set loading to false after the fetch is complete
      }
    }
    getData();
  }, [provinceId]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('de-DE').format(num); // German locale to use dot as thousands separator
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div> // Display loading indicator
      ) : (
        <>
          <ProvinceDetailDown />
          <p></p>
          <h2 style={{ fontFamily: 'Ubuntu' }}>Yıllara Göre {message.provincename} Nüfusu</h2>
          <table className="provincetable">
            <thead>
              <tr>
                <th>YIL</th>
                <th>NÜFUS</th>
                <th>Yabancı N.</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>2023</td><td>{formatNumber(message[2023])}</td><td>{formatNumber(foreigners[2023])}</td></tr>
              <tr><td>2022</td><td>{formatNumber(message[2022])}</td><td>{formatNumber(foreigners[2022])}</td></tr>
              <tr><td>2021</td><td>{formatNumber(message[2021])}</td><td>{formatNumber(foreigners[2021])}</td></tr>
              <tr><td>2020</td><td>{formatNumber(message[2020])}</td><td>{formatNumber(foreigners[2020])}</td></tr>
              <tr><td>2019</td><td>{formatNumber(message[2019])}</td><td>{formatNumber(foreigners[2019])}</td></tr>
              <tr><td>2018</td><td>{formatNumber(message[2018])}</td><td>{formatNumber(foreigners[2018])}</td></tr>
              <tr><td>2017</td><td>{formatNumber(message[2017])}</td><td>{formatNumber(foreigners[2017])}</td></tr>
              <tr><td>2016</td><td>{formatNumber(message[2016])}</td><td>{formatNumber(foreigners[2016])}</td></tr>
              <tr><td>2015</td><td>{formatNumber(message[2015])}</td><td>{formatNumber(foreigners[2015])}</td></tr>
              <tr><td>2014</td><td>{formatNumber(message[2014])}</td><td>{formatNumber(foreigners[2014])}</td></tr>
              <tr><td>2013</td><td>{formatNumber(message[2013])}</td><td>{formatNumber(foreigners[2013])}</td></tr>
              <tr><td>2012</td><td>{formatNumber(message[2012])}</td><td>{formatNumber(foreigners[2012])}</td></tr>
              <tr><td>2011</td><td>{formatNumber(message[2011])}</td><td>{formatNumber(foreigners[2011])}</td></tr>
              <tr><td>2010</td><td>{formatNumber(message[2010])}</td><td>{formatNumber(foreigners[2010])}</td></tr>
              <tr><td>2009</td><td>{formatNumber(message[2009])}</td><td>{formatNumber(foreigners[2009])}</td></tr>
              <tr><td>2008</td><td>{formatNumber(message[2008])}</td><td>{formatNumber(foreigners[2008])}</td></tr>
              <tr><td>2007</td><td>{formatNumber(message[2007])}</td><td> - </td></tr>
            </tbody>
          </table>
        </>
      )}
      <Comment />
      <CommentDisplay />
    </div>
  );
}

export default ProvinceDetail;
