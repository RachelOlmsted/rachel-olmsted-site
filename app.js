const weatherAction = document.getElementById('weather-action');
const weatherEmoji = document.getElementById('weather-emoji');
const weatherTemperature = document.getElementById('weather-temperature');
const weatherSummary = document.getElementById('weather-summary');
const weatherDetails = document.getElementById('weather-details');
const weatherStatus = document.getElementById('weather-status');

const weatherConditions = {
  0: ['☀️', 'Clear sky'],
  1: ['🌤️', 'Mostly clear'],
  2: ['⛅', 'Partly cloudy'],
  3: ['☁️', 'Overcast'],
  45: ['🌫️', 'Foggy'],
  48: ['🌫️', 'Icy fog'],
  51: ['🌦️', 'Light drizzle'],
  53: ['🌦️', 'Drizzle'],
  55: ['🌧️', 'Heavy drizzle'],
  61: ['🌦️', 'Light rain'],
  63: ['🌧️', 'Rain'],
  65: ['🌧️', 'Heavy rain'],
  71: ['🌨️', 'Light snow'],
  73: ['❄️', 'Snow'],
  75: ['❄️', 'Heavy snow'],
  80: ['🌦️', 'Rain showers'],
  81: ['🌧️', 'Rain showers'],
  82: ['🌧️', 'Heavy showers'],
  95: ['⛈️', 'Thunderstorms'],
  96: ['⛈️', 'Storms with hail'],
  99: ['⛈️', 'Storms with hail']
};

function setWeatherStatus(message) {
  weatherStatus.textContent = message;
}

async function loadWeather(position) {
  const { latitude, longitude } = position.coords;
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    timezone: 'auto'
  });

  setWeatherStatus('Loading current conditions...');
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!response.ok) throw new Error('Weather request failed');

  const data = await response.json();
  const current = data.current;
  const [emoji, description] = weatherConditions[current.weather_code] || ['🌡️', 'Current conditions'];
  weatherEmoji.textContent = emoji;
  weatherTemperature.textContent = `${Math.round(current.temperature_2m)}°`;
  weatherSummary.textContent = description;
  weatherDetails.textContent = `Feels like ${Math.round(current.apparent_temperature)}° · Wind ${Math.round(current.wind_speed_10m)} mph · ${data.timezone}`;
  weatherAction.textContent = 'Refresh weather';
  setWeatherStatus('');
}

function requestWeather() {
  if (!navigator.geolocation) {
    setWeatherStatus('Location is not available in this browser.');
    return;
  }

  weatherAction.disabled = true;
  weatherAction.textContent = 'Finding you...';
  setWeatherStatus('Waiting for location permission...');
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        await loadWeather(position);
      } catch (error) {
        weatherAction.textContent = 'Try again';
        setWeatherStatus('Weather is unavailable right now.');
      } finally {
        weatherAction.disabled = false;
      }
    },
    () => {
      weatherAction.disabled = false;
      weatherAction.textContent = 'Use my location';
      weatherDetails.textContent = 'Enable location to see your weather forecast.';
      setWeatherStatus('Location access is needed for local conditions.');
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
  );
}

weatherAction.addEventListener('click', requestWeather);
