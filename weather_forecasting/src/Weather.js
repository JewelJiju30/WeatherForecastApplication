import React, { useState } from "react";
import { TextField } from '@mui/material';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import mapboxgl from 'mapbox-gl';
import { useEffect } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import './weather.css'

import { useActionData } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";

const Weather = () => {
  const [cityName, setCityName] = useState('');
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [long, setLong] = useState(0);
  const [lat, setLat] = useState(0);
  const [dailyData, setDailyData] = useState([]);
  const [triggerAPI, setTriggerAPI] = useState(false)

  const apiUrl2 = 'http://localhost:5000/weather/getExisting/day'
  const [loading, setLoading] = useState(false);
  const [temp, setTemp] = useState(null);
  const [max_temp, setMaxTemp] = useState(null);
  const [min_temp, setMinTemp] = useState(null);
  const [zoom, setZoom] = useState(2);

  mapboxgl.accessToken = `pk.eyJ1IjoibmFuZHVpYnMiLCJhIjoiY2xvcmptN3JwMHFvZzJqbnUybWcxZXFieCJ9._pV-gsRwFo2kI_o5JW5pZA`;

  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    initializeMap();
  }, [latitude, longitude, temp, dailyData]);
  useEffect(() => {
    fetch(apiUrl2, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())

      .then((data) => {

        setDailyData(data)

      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [triggerAPI])
  const initializeMap = () => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: zoom,
    });
    let pointerData = []
    if (longitude && latitude) {
      pointerData = [
        { lng: longitude, lat: latitude, color: 'red', temperature: temp }
      ]
    }
    const pointerData2 = (dailyData?.map((item) => {
      debugger
      return {
        city: item.city.location_name,
        lng: item.city.coord.lon,
        lat: item.city.coord.lat,
        color: 'blue',
        temperature: item.city.temperature.temp
      }

    }));

    pointerData2.forEach(data => {
      const createPopupContent = (temperature) => {

        return `
               <div class="CityName">Location : ${data.city}</div>
               <div class="temperature">Current Weather : ${temperature.toFixed(2)}°C</div>
                `;
      };

      const centerMarker = new mapboxgl.Marker({ color: data.color })
        .setLngLat([data.lng, data.lat])
        .addTo(map);

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false,
        maxWidth: '300px',
        anchor: 'bottom-left'
      });

      centerMarker.setPopup(popup);

      centerMarker.getElement().addEventListener('mouseenter', () => {
        const content = createPopupContent(data.temperature);
        popup.setHTML(content).addTo(map);
      });

      centerMarker.getElement().addEventListener('mouseleave', () => {
        popup.remove();
      });

    });

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
        popup.remove();
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






  const handleSubmit = (e) => {
    e.preventDefault();
    setTriggerAPI(!triggerAPI)
    setLoading(true)
    const apiUrl = 'http://localhost:5000/weather/getTempDay';
    const requestData = {
      "location": {
        city_name: cityName,
        latitude: lat,
        longitude: long
      }
    };


    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => response.json())
      .then(data => {

        setTemp(data?.temperature)
        setLatitude(data?.coord.latitude)
        setLongitude(data?.coord.longitude)
        setZoom(9)
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false);
      });

  };

  return (
    <div style={{ padding: '0px 30px' }}>
      <h1>Enter City Information</h1>
      <TabView activeIndex={activeIndex} onTabChange={(e) => {
        setActiveIndex(e.index)
        setLong('')
        setLat('')
        setLongitude('')
        setLatitude('')
        setZoom('2')
        setCityName('')
        setMaxTemp('')
        setMinTemp('')
      }}>
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
              disabled={cityName ? false : true}
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
              disabled={long && lat ? false : true}
            >
              Submit
            </Button>
          </form>
        </TabPanel>

      </TabView>
      <div id="map" style={{ width: '100%', height: '500px', marginTop: '2rem' }}></div>
      {loading && (
        <div className="LoaderOverlay Unclickable">
          <div className="LoaderStyle">
            <ProgressSpinner color="#00BFFF" />
          </div>
        </div>
      )}

    </div>

  );

}
export default Weather






