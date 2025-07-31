// server.js
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
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
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ error: 'Location is required.' });
  }

  try {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || response.status !== 200 || data.error) {
        console.error("Weather API response error:", data);
        const errorMessage = data.error?.message || 'Failed to fetch weather data.';
        return res.status(400).json({ error: errorMessage });
    }

    const weather = {
      location: `${data.location.name}, ${data.location.region}, ${data.location.country}`,
      temp: data.current.temp_c,
      humidity: data.current.humidity,
      wind_speed: data.current.wind_kph,
      uvi: data.current.uv,
      condition: data.current.condition.text,
      icon: data.current.condition.icon
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
