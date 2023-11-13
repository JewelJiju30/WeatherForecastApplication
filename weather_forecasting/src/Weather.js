import React, { useState } from "react";
import { TextField } from '@mui/material';
import { Button } from 'primereact/button'; 
import { TabView, TabPanel } from 'primereact/tabview';
import mapboxgl from 'mapbox-gl';
import { useEffect } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import './weather.css'

const Weather =()=>{
    const [cityName, setCityName] = useState('');
    const [longitude, setLongitude] = useState('76.9167');
    const [latitude, setLatitude] = useState('8.4833');
    const [long, setLong] = useState('');
    const [lat, setLat] = useState('');

    // const[activeIndex,setActiveIndex]=useState(0);
    

    const [temp, setTemp]=useState(null);
    const [max_temp,setMaxTemp]=useState(null);
    const [min_temp,setMinTemp]=useState(null);
    const [zoom, setZoom]=useState(2);

    mapboxgl.accessToken = `pk.eyJ1IjoibmFuZHVpYnMiLCJhIjoiY2xvcmptN3JwMHFvZzJqbnUybWcxZXFieCJ9._pV-gsRwFo2kI_o5JW5pZA`;

    const [activeIndex, setActiveIndex] = useState(0); // Track the active tab index
    useEffect(() => {
      initializeMap();
    }, [latitude, longitude, temp]); // Include latitude, longitude, and temp as dependencies
    
    const initializeMap = () => {
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude],
        zoom: zoom,
      });
    
      const pointerData = [
        { lng: longitude, lat: latitude, color: 'red', temperature: temp},
        { lng: '78.008072', lat: '27.176670', color: 'blue', temperature: 245 }
      ];
    
      pointerData.forEach(data => {
        const centerMarker = new mapboxgl.Marker({ color: data.color })
          .setLngLat([data.lng, data.lat])
          .addTo(map);
    
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false,
          maxWidth: '300px', // Set the maximum width of the popup
        });
    
        centerMarker.setPopup(popup);
    
        centerMarker.getElement().addEventListener('mouseenter', () => {
          const deviation = calculateDeviation(data.temperature, min_temp, max_temp);
          const content = `
            <div class="popup-contents">
              <div class="temperature">Temperature: ${data.temperature}°C</div>
              <div class="deviationContainer">
              <div class="deviation">Deviation: ${Math.abs(deviation).toFixed(2)}°C</div>
              <div class="marginAdder triangle ${deviation > 0 ? 'up' : 'down'}"></div>
            </div>`;

          popup.setHTML(content);
          centerMarker.togglePopup();
        });
    
        centerMarker.getElement().addEventListener('mouseleave', () => {
          // centerMarker.togglePopup();
        });
      });
    
      return () => {
        map.remove();
      };
    };
    
    const calculateDeviation = (temperature, minTemperature, maxTemperature) => {
      if (temperature < minTemperature) {
       
        return temperature - minTemperature;
      } else if (temperature > maxTemperature) {
        
        return temperature - maxTemperature;
      } else {
        return 0;
      }
    };

    
    const deviation = calculateDeviation(temp, min_temp, max_temp);
    console.log(`Deviation: ${deviation}`);
    
    
    
    

    const handleSubmit = (e) => {
      e.preventDefault();
    //   const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?&q=${cityName}&cnt=4&appid=6e7c89d540009fa84fa86c67729900ae`;
    const apiUrl = 'http://localhost:8080/weather/getTempDay';
    const requestData = {
     "location": {city_name: cityName,
      latitude: lat,
      longitude: long}
    };
 
    // Sending a POST request to the backend service
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        setTemp(data?.temperature)
        setLatitude(data?.coord.latitude)
        setLongitude(data?.coord.longitude)
        setZoom(9)
      })
      .catch(error => {
        console.error('Error:', error);
      });
 
    //  window.location.href="http://localhost:3000/weather-result"
  };
   
  return (
    <div style={{ padding: '0px 30px' }}>
      <h1>Enter City Information</h1>
      <TabView  activeIndex={activeIndex} onTabChange={(e) => {setActiveIndex(e.index)
        setLong('')
        setLat('')
        setLongitude('76.9167')
        setLatitude('8.4833')
        setZoom('2')
        setCityName('')
        setMaxTemp('')
        setMinTemp('')}}>
        <TabPanel header="CITY">
        <form onSubmit={handleSubmit}>
        <div style={{ padding: '2px' }}>
          <label htmlFor="cityName">City Name:</label>
          </div>
          <TextField
            type="text"
            id="cityName"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            required
      />
      <br />
      <br />
      </form>
      <form onSubmit={handleSubmit}>
      <div style={{ padding: '2px' }}>
      <label htmlFor="mintemp">Minimun Temperature:</label>
     </div>
          <TextField
            type="text"
            id="mintemp"
            value={min_temp}
            onChange={(e) => setMinTemp(e.target.value)}
            required
      />
      <br />
      <br />
      <div style={{ padding: '2px' }}>
      <label htmlFor="maxtemp">Maximum Temperature:</label>
     </div>
          <TextField
            type="text"
            id="maxtemp"
            value={max_temp}
            onChange={(e) => setMaxTemp(e.target.value)}
            required
      />
      <br />
      <br />
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={cityName ? false :true}
      >
        Submit
      </Button>
    </form>
  </TabPanel>

  <TabPanel header="CO-ORDINATES" >
    <form onSubmit={handleSubmit}>
    <div style={{ padding: '2px' }}>
      <label htmlFor="longitude">Longitude:</label>
    </div>
      <TextField
        type="text"
        id="longitude"
        value={long}
        onChange={(e) => setLong(e.target.value)}
        required
      />
      <br />
      <br />
      
    </form>
    <form onSubmit={handleSubmit}>
    <div style={{ padding: '2px' }}>
      <label htmlFor="latitude">Latitude:</label>
    </div>
      <TextField
        type="text"
        id="latitude"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
        required
      />
      <br />
      <br />
      </form>
      <form onSubmit={handleSubmit}>
      <div style={{ padding: '2px' }}>
      <label htmlFor="Mintemp">Minimun Temperature:</label>
     </div>
          <TextField
            type="text"
            id="mintemp"
            value={min_temp}
            onChange={(e) => setMinTemp(e.target.value)}
            required
      />
      <br />
      <br />
      <form onSubmit={handleSubmit}>
      <div style={{ padding: '2px' }}>
      <label htmlFor="Maxtemp">Maximum temperature:</label>
     </div>
          <TextField
            type="text"
            id="maxtemp"
            value={max_temp}
            onChange={(e) => setMaxTemp(e.target.value)}
            required
      />
      <br />
      <br />
      </form>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={longitude && latitude ? false :true}
      >
        Submit
      </Button>
    </form>
  </TabPanel>

      </TabView>
      <div id="map" style={{width:'100%',height:'500px', marginTop:'2rem'} }></div>
     
    </div>
    
  );
  
}
export default Weather


            


     
  