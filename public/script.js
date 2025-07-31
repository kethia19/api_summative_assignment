document.addEventListener('DOMContentLoaded', () => {
  const status = document.getElementById('status');
  const weatherDiv = document.getElementById('weather');
  const temp = document.getElementById('temp');
  const humidity = document.getElementById('humidity');
  const wind = document.getElementById('wind');
  const uvi = document.getElementById('uvi');
  const alerts = document.getElementById('alerts');

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(async position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const response = await fetch(`/weather?lat=${lat}&lon=${lon}`);
        const data = await response.json();

        if (data.error) {
          status.textContent = data.error;
          return;
        }

        status.textContent = "Here's your local weather:";
        weatherDiv.classList.remove('hidden');

        temp.textContent = data.temp;
        humidity.textContent = data.humidity;
        wind.textContent = data.wind_speed;
        uvi.textContent = data.uvi;

        if (data.alerts.length > 0) {
          const messages = data.alerts.map(alert => `<p><strong> ${alert.event}:</strong> ${alert.description}</p>`).join('');
          alerts.innerHTML = messages;
        } else if (data.uvi > 7) {
          alerts.innerHTML = '<p><strong>! Extreme UV Index!</strong> Take precautions when outdoors.</p>';
        } else {
          alerts.innerHTML = '<p>No extreme weather alerts.</p>';
        }

      } catch (error) {
        status.textContent = 'Error fetching weather data.';
      }

    }, () => {
      status.textContent = 'Unable to get your location.';
    });
  } else {
    status.textContent = 'Geolocation not supported by your browser.';
  }
});
