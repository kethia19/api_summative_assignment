document.getElementById('searchBtn').addEventListener('click', async () => {
  const location = document.getElementById('locationInput').value.trim();
  const weatherContainer = document.getElementById('weatherContainer');

  if (!location) {
    weatherContainer.innerHTML = '<p>Please enter a location.</p>';
    return;
  }

  weatherContainer.innerHTML = `<p class="loading">Loading</p>`;

  try {
    const res = await fetch(`/weather?location=${encodeURIComponent(location)}`);
    const data = await res.json();

    if (data.error) {
      weatherContainer.innerHTML = `<p style="color: red;">${data.error}</p>`;
      return;
    }

    weatherContainer.innerHTML = `
      <h2>${data.location}</h2>
      <img src="${data.icon}" alt="${data.condition}" />
      <p><strong>${data.condition}</strong></p>
      <p> Temp: ${data.temp} °C</p>
      <p> Humidity: ${data.humidity}%</p>
      <p> Wind Speed: ${data.wind_speed} kph</p>
      <p> UV Index: ${data.uvi}</p>
    `;
  } catch (error) {
    console.error(error);
    weatherContainer.innerHTML = '<p>Something went wrong. Please try again later.</p>';
  }
});
