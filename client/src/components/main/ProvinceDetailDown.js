import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import '../../styles/ProvinceDistrict.css';

function ProvinceDetailDown() {
  const { provinceId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState([]);
  const [provinceTitle, setProvinceTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`/serversendprovincedistrictdetails/${provinceId}`);
        setMessage(response.data);
        setProvinceTitle(response.data[0].provincename);

      } catch (error) {
        console.log(error);
        setMessage("error happened");
      } finally {
        setIsLoading(false);
      }
    }

    getData();
  }, [provinceId]);

  const formatNumber = (num) => {
    return num ? new Intl.NumberFormat("de-DE").format(num) : 'N/A';
  }

  const getDistrictDetails = async (districtnum) => {
    navigate(`/district/${districtnum}`);
  }

  return (
        <div>
          {isLoading ? 
              <div aria-live="polite">loading....</div>
            :
              <>
                <div className='provinceMainTable'>
                  <h2 style={{ fontFamily: "Ubuntu" }}>{provinceTitle} Nüfus Tablosu</h2>
                  {Array.isArray(message) ? (
                    <table className="provinceDistrictTable" aria-label="{provinceTitle} ili ve ilçelerinin nüfus tablosu">
                      <thead>
                        <tr>
                          <th scope="col">Sıra</th>
                          <th scope="col">İL</th>
                          <th scope="col">İLÇE</th>
                          <th scope="col">2023</th>
                          <th scope="col">2022</th>
                          <th scope="col">2021</th>
                          <th scope="col">2015</th>
                          <th scope="col">2011</th>
                          <th scope="col">2007</th>
                        </tr>
                      </thead>
                      <tbody>
                        {message.map((district, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{district.provincename}</td>
                            <td onClick={() => getDistrictDetails(district.id)} style={{cursor: "pointer"}}>
                              {district.districtname}
                            </td>
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
              </>
          }
          
        </div>

  );
}

export default ProvinceDetailDown;
