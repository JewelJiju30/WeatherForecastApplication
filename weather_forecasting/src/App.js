import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import WeatherApp from './WeatherApp';
import ForecastLogin from './ForecastLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeatherApp />} />
        <Route path="/forecast_weather" element={<ForecastLogin/>}/>
      </Routes>
    </Router>
  );
}
export default App;