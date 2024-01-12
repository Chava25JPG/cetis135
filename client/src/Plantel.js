import React, { useState, useEffect } from 'react';
import NavigationBar from './NavigationBar';


function Plantel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/plantel")
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => setData(data.message))
        .catch(error => console.error('There was a problem with the fetch operation:', error.message));
}, []);

  return (
    <div>
        <NavigationBar/>
        <div>
        {data ? <h1>{data}</h1> : "Cargando..."}
        </div>
    </div>
  );
}

export default Plantel;