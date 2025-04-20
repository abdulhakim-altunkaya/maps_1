import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProvinceDetailDown from './ProvinceDetailDown';
import ProvinceOrigins from './ProvinceOrigins';
import '../../styles/ProvinceTable.css';
import '../../styles/ProvinceDetails.css';

import CommentDisplay from './CommentDisplay';
import Footer from './Footer';
//We will zustand to store province population and use in ProvinceOrigins component
import useStore from '../../store/useStore';

function ProvinceDetail() {

  const [message, setMessage] = useState([]);
  const [foreigners, setForeigners] = useState([]);
  const [loading, setLoading] = useState(true); 

  const setProvincePopulation = useStore((state) => state.setProvincePopulation);

  const { provinceId } = useParams();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/serversendprovincedetails/${provinceId}`);
        const foreignersData = await axios.get(`/servergetforeigners/${provinceId}`);
        setMessage(response.data);
        setForeigners(foreignersData.data);
        setProvincePopulation(Number(response.data[2023]));
      } catch (error) {
        console.log(error.message);
        setMessage("error happened");
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [provinceId]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('de-DE').format(num);
  };

  return (
    <div>
      {loading ? (
        <div aria-live="polite">Loading...</div> 
      ) : (
        <>
          <ProvinceDetailDown />
          <p></p>
          <div className='provinceDetailDiv'>
            <h2 style={{ fontFamily: 'Ubuntu' }}>Yıllara Göre {message.provincename} Nüfusu</h2>
            <table className="provincetable" aria-label="{message.provincename} nüfusu ve yabancı nüfus detayları">
              <thead>
                <tr>
                  <th scope="col">YIL</th>
                  <th scope="col">NÜFUS</th>
                  <th scope="col">Yabancı N.</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>2024</td><td>{formatNumber(message[2024])}</td><td>{formatNumber(foreigners[2024])}</td></tr>
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
          </div>
        </>
      )}
      <ProvinceOrigins />
      <CommentDisplay />
      <Footer />
    </div>
  );
}

export default ProvinceDetail;
