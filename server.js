// server.js
const express = require('express');
const fetch = require('node-fetch');
// const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;
const API_KEY = process.env.WEATHER_API_KEY;

if (!API_KEY) {
  console.error('Error: WEATHER_API_KEY environment variable is not set.');
  process.exit(1);
}

app.use(express.static('public'));

app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and Longitude are required.' });
  }

  try {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || response.status !== 200 || data.error) {
      console.error("Weather API response error:", data);
      return res.status(500).json({ error: 'Failed to fetch weather data.' });
    }

    const weather = {
      temp: data.current.temp_c,
      humidity: data.current.humidity,
      wind_speed: data.current.wind_kph,
      uvi: data.current.uv,
      alerts: []
    };

    res.json(weather);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`FarmCast running on port ${PORT}`);
});
