import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../styles/ProvinceDistrict.css';
//We will get Province Populatino from Zustand and Zustand will grab it from ProvinceDetail component
import useStore from '../../store/useStore';

function ProvinceOrigins() {
  const { provinceId } = useParams();
  const [message, setMessage] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [provinceTitle, setProvinceTitle] = useState("");
  const [provinceTitle2, setProvinceTitle2] = useState("");
  const [provinceTitle3, setProvinceTitle3] = useState("");
  const [provinceTitle4, setProvinceTitle4] = useState("");
  const [provinceTitle5, setProvinceTitle5] = useState("");
  const [originPopulation2, setOriginPopulation2] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  //First we get province population from zustand. We could do it outside useEffect but better to do it here. 
  const provincePopulation = useStore((state) => state.provincePopulation);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/servergetprovinceorigins/${provinceId}`);
        const responseData = response.data;
        
        if (responseData && responseData.length > 0) {

          const provinceData = responseData[0];
          setMessage(responseData);

          const headersData = Object.keys(provinceData).filter(key => key !== 'provinceid' && key !== 'provincename' && key !== 'originPopulation');
          setHeaders(headersData);

          setOriginPopulation2(provinceData.originPopulation);
          const provinceName1 = provinceData.provincename;
          setProvinceTitle4(provinceName1);
          if (provinceName1) {
            const provinceName2 = provinceName1.slice(-3); // Get the last two characters of the city
            if (provinceName2.includes("i") || provinceName2.includes("e")) {
              setProvinceTitle(`${provinceName1}lilerin`);
              setProvinceTitle2(`${provinceName1}liler`);
              setProvinceTitle3(`${provinceName1}li`);
              setProvinceTitle5(`${provinceName1}'de`)
            } else {
              setProvinceTitle(`${provinceName1}lıların`);
              setProvinceTitle2(`${provinceName1}lılar`);
              setProvinceTitle3(`${provinceName1}lı`);
              setProvinceTitle5(`${provinceName1}'da`)
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
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [provinceId]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('de-DE').format(num); // German locale to use dot as thousands separator
  };

  return (
    <div>
      { isLoading ? 
          <div>loading...</div>
        :
          <>
            <h2 style={{ fontFamily: "Ubuntu" }}>{provinceTitle} En Çok Yaşadığı İller</h2>
            {Array.isArray(message) ? (
              <div>
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
                        <td>{formatNumber(message[0][header])}</td>
                      </tr>
                    ))}
                      <tr>
                        <td></td>
                        <td><strong>Toplam {provinceTitle3}</strong></td>
                        <td>{formatNumber(originPopulation2)}</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td><strong>{provinceTitle4} İl Nüfusu</strong></td>
                        <td>{formatNumber(provincePopulation)}</td>
                      </tr>
                  </tbody>
                </table>
                <br/>
                <div className='notesArea'><strong>{provinceTitle3}:</strong> Türkiye'de yaşayan ve Kütük kaydı {provinceTitle5} olanlar.</div>
                <div className='notesArea'><strong>{provinceTitle4} İl Nüfus:</strong> Adres kaydı {provinceTitle5} olanlar.</div>
                <br/>
              </div>
            ) : (
              <p>Error, please write to website administrator: drysoftware1@gmail.com</p>
            )}
          </>
      }
      
    </div>
  );
}

export default ProvinceOrigins;
