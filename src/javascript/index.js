import "regenerator-runtime/runtime";

async function getWeather() {
  const url =
    "http://api.openweathermap.org/data/2.5/weather?q=London&APPID=4f1a5f803edc74651cef27d64b2b6c51";
  const response = await fetch(url);
  const weatherData = await response.json();
  console.log(weatherData);
  console.log(weatherData.name);
  console.log(weatherData.main.temp);
}

getWeather();
