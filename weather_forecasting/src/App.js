import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import WeatherApp from './WeatherApp';
import ForecastLogin from './ForecastLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ForecastLogin />} />
        <Route path="/current_weather" element={<WeatherApp />} />

      </Routes>
    </Router>
  );
}
export default App;