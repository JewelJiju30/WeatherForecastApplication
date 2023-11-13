
import React, { useState } from "react";
import { TextField } from '@mui/material';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import mapboxgl from 'mapbox-gl';
import { useEffect } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import './weather.css'
import Header from "./Header";
import { ProgressSpinner } from 'primereact/progressspinner';


const ForecastLogin = (props) => {

    const currentDate = new Date();
    const options = { day: 'numeric', month: 'short' };
    const [cityName, setCityName] = useState('');
    const [longitude, setLongitude] = useState('');
    const [latitude, setLatitude] = useState('');
    const [long, setLong] = useState('');
    const [lat, setLat] = useState('');
    const [numOfPointers, setNumOfPointers] = useState([]);
    const [forecastDetails, setForecastDetails] = useState([]);
    const [city, setCity] = useState([]);
    const apiUrl2 = 'http://localhost:5000/weather/getExisting/forecast';


    const [temp, setTemp] = useState([]);
    const [max_temp, setMaxTemp] = useState(null);
    const [min_temp, setMinTemp] = useState(null);
    const [zoom, setZoom] = useState(2);
    const [loading, setLoading] = useState(false);

    mapboxgl.accessToken = `pk.eyJ1IjoibmFuZHVpYnMiLCJhIjoiY2xvcmptN3JwMHFvZzJqbnUybWcxZXFieCJ9._pV-gsRwFo2kI_o5JW5pZA`;

    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() => {
        initializeMap();
    }, [latitude, longitude, temp, numOfPointers]);
    useEffect(() => {
        fetch(apiUrl2, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())

            .then((data) => {

                setNumOfPointers(data)

                const newArray2 = [];
                data.forEach((item) => {
                    const newArray = [];
                    const count = item.city.count;

                    for (let i = 0; i < count; i++) {
                        const t = `tempDetails${i + 1}`;
                        newArray.push(item.city[t]?.temp,);
                    }
                    newArray2.push({
                        city: item.city.location_name,
                        coord: item.city.coord,
                        temperatureArray: newArray,
                    });
                });


                setForecastDetails(newArray2)

            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [])
    const initializeMap = () => {
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitude, latitude],
            zoom: zoom,
        });

        const pointerData = (forecastDetails?.map((item) => {

            return {
                lng: item.coord.lon,
                lat: item.coord.lat,
                city: item.city,
                color: 'blue',
                temperature: item.temperatureArray
            }

        }));

        const pointerData2 = temp.map((temperatureItem, index) => ({
            city: city,
            lng: longitude,
            lat: latitude,
            color: 'red',
            temperature: temp,

        }));

        pointerData.forEach(data => {
            const createPopupContent = (temperature) => {

                return temperature.map((item, index) => {
                    const deviation = calculateDeviation(item, min_temp, max_temp);
                    return `
                    ${index === 0 ? `<div class="CityName">Location : ${data.city}</div>` : ''}
                     <div class="temperature">${index === 0 ? "Current Weather  " : new Intl.DateTimeFormat('en-US', options).format(
                        new Date(currentDate).setDate(currentDate.getDate() + index))} : ${item.toFixed(2)}°C</div>
                      `;
                }).join('');

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

            map.on('click', () => {
                if (popup.isOpen()) {
                    popup.remove();
                }
            });

            centerMarker.getElement().addEventListener('mouseenter', () => {
                const content = createPopupContent(data.temperature);
                popup.setHTML(content).addTo(map);
            });
        });

        pointerData2.forEach(data => {
            const createPopupContent = (temperature) => {

                return temperature.map((item, index) => {
                    const deviation = calculateDeviation(item, min_temp, max_temp);
                    return `
                  <div class="CityName">Location : ${data.city}</div>
                  <div class="temperature">${index === 0 ? "Current Weather  " : new Intl.DateTimeFormat('en-US', options).format(
                        new Date(currentDate).setDate(currentDate.getDate() + index))} : ${item.toFixed(2)}°C</div>
                  <div class="deviationContainer">
                    <div class="deviation">Deviation: ${Math.abs(deviation).toFixed(2)}°C</div>
                    <div class="marginAdder triangle ${deviation > 0 ? 'up' : 'down'}"></div>
                  </div>`;
                }).join('');

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

            map.on('click', () => {
                if (popup.isOpen()) {
                    popup.remove();
                }
            });

            centerMarker.getElement().addEventListener('mouseenter', () => {
                const content = createPopupContent(data.temperature);
                popup.setHTML(content).addTo(map);
            });
        });

        map.on('click', function (e) {
            setLat(e.lngLat.lat);
            setLong(e.lngLat.lng);



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
        setLoading(true)
        const apiUrl = 'http://localhost:5000/weather/getNew/forecast';
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

            .then((data) => {

                const extractedTemps = data?.temperature.map(
                    (item) => item.temperature_List.temp
                );
                setTemp(extractedTemps);
                setLatitude(data?.coord.latitude)
                setLongitude(data?.coord.longitude)
                setCity(data?.location_name)
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
        <>
            <Header />
            <div style={{ padding: '100px 30px' }}>
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
                                disabled={longitude && latitude ? false : true}
                            >
                                Submit
                            </Button>
                        </form>
                    </TabPanel>

                </TabView>
                <div id="map" className="ForecastMap" style={{ width: '80%', height: '500px' }}></div>
                {loading && (
                    <div className="LoaderOverlay Unclickable">
                        <div className="LoaderStyle">
                            <ProgressSpinner color="#00BFFF" />
                        </div>
                    </div>
                )}

            </div>

        </>
    );


}

export default ForecastLogin