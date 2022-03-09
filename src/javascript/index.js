import "regenerator-runtime/runtime";

async function getWeather(city) {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=4f1a5f803edc74651cef27d64b2b6c51&units=metric`;
  const response = await fetch(url);
  const currentWeatherData = await response.json();
  console.table(currentWeatherData);
  const {
    coord: { lon, lat },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed, deg },
    clouds: { all },
    sys: { country, sunrise, sunset },
    timezone,
    name,
    visibility,
  } = currentWeatherData;
  console.log(name);
}

const rootDiv = document.getElementById("root");
const form = document.createElement("form");

const input = document.createElement("input");
input.id = "city-input";

const submit = document.createElement("button");
submit.id = "city-submit";

form.append(input, submit);
rootDiv.append(form);
const cityInput = document.getElementById("city-input");
const citySubmit = document.getElementById("city-submit");
citySubmit.textContent = "Get Weather";

citySubmit.addEventListener("click", (e) => {
  e.preventDefault();
  let city = cityInput.value;
  getWeather(city);
});

getWeather("london");
