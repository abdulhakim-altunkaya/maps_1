import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../../styles/ProvinceTable.css';

function HomepageInt() {
    
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const getData = async () => {
        try {
            const response = await axios.get(`/servergetinternational`);
            setMessage(response.data);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
      }
      getData();
    }, [])

    const formatNumber = (num) => {
        if (num ==  0) {
            return "-";
        }
        return new Intl.NumberFormat('de-DE').format(num); // German locale to use dot as thousands separator
    };
    
    return (
        <div>
            {loading ? (
                <div aria-live="polite">Loading...</div> 
                ) : (
                    <>
                    <h2 style={{ fontFamily: 'Ubuntu' }}>TÜRKİYE'YE GELENLER VE GİDENLER</h2>
                    <table className="provincetable" aria-label="Türkiye'ye gelen ve giden toplam, Türk ve yabancı uyruklu kişi sayıları">
                        <thead>
                        <tr>
                            <th scope="col">Yıl</th>
                            <th scope="col">Gelen Toplam</th>
                            <th scope="col">Giden Toplam</th>
                            <th scope="col">Gelen Türk</th>
                            <th scope="col">Giden Türk</th>
                            <th scope="col">Gelen Yabancı</th>
                            <th scope="col">Giden Yabancı</th>
                        </tr>
                        </thead>
                        <tbody>
                            {message.map((record, index) => (
                                <tr key={index}>
                                    <td>{record.year}</td>
                                    <td>{formatNumber(record.intotal)}</td>
                                    <td>{formatNumber(record.outtotal)}</td>
                                    <td>{formatNumber(record.inturkish)}</td>
                                    <td>{formatNumber(record.outturkish)}</td>
                                    <td>{formatNumber(record.inforeign)}</td>
                                    <td>{formatNumber(record.outforeign)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </>
            )}
        </div>
    )
}

export default HomepageInt;
