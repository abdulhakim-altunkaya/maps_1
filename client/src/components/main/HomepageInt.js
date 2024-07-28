import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../../styles/ProvinceTable.css';

function HomepageInt() {
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
      const getData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/servergetinternational`);
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
                <div>Loading...</div> // Display loading indicator
                ) : (
                    <>
                    <h2 style={{ fontFamily: 'Ubuntu' }}>TÜRKİYE'YE GELENLER VE GİDENLER</h2>
                    <table className="provincetable">
                        <thead>
                        <tr>
                            <th></th>
                            <th>Gelen Toplam</th>
                            <th>Giden Toplam</th>
                            <th>Gelen Türk</th>
                            <th>Giden Türk</th>
                            <th>Gelen Yabancı</th>
                            <th>Giden Yabancı</th>
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

export default HomepageInt