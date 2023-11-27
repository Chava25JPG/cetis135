import React, { useState, useEffect } from 'react';

function Conocenos() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/conocenos")
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
      {data ? <h1>{data}</h1> : "Cargando..."}
    </div>
  );
}

export default Conocenos;
