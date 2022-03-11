/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import "../css/style.css";
import "regenerator-runtime/runtime";
import "core-js/stable";
import { addDays, format, fromUnixTime } from "date-fns";

const currentDay = new Date();

const weekDays = {
  0: "today",
  1: format(addDays(currentDay, 1), "EEEE"),
  2: format(addDays(currentDay, 2), "EEEE"),
  3: format(addDays(currentDay, 3), "EEEE"),
  4: format(addDays(currentDay, 4), "EEEE"),
  5: format(addDays(currentDay, 5), "EEEE"),
  6: format(addDays(currentDay, 6), "EEEE"),
  7: format(addDays(currentDay, 7), "EEEE"),
  8: format(addDays(currentDay, 8), "EEEE"),
};

const units = [
  ["metric", "°C", "km", "m/s"],
  ["imperial", "°F", "miles", "mph"],
];
let lastCity = "london";
// stands for Units Boolean
let ub = 0;

const searchInput = document.querySelector("#search-city");
const searchSubmit = document.querySelector(".header_city-search-submit");

async function getWeather(city) {
  const APIKEY = "4f1a5f803edc74651cef27d64b2b6c51";

  try {
    const coordUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${APIKEY}&units=${units[ub][0]}`;
    const [todayRes] = await Promise.all([fetch(coordUrl)]);
    const coordData = await todayRes.json();
    const {
      name,
      coord: { lon, lat },
    } = coordData;

    const excluded = "none";
    const sevenDaysWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${excluded}&appid=${APIKEY}&units=${units[ub][0]}`;
    const [sevenDaysRes] = await Promise.all([fetch(sevenDaysWeatherUrl)]);
    const sevenDaysWeatherData = await sevenDaysRes.json();

    return sevenDaysWeatherData;
  } catch (e) {
    if (e instanceof TypeError) {
      searchInput.placeholder = "Not a valid input";
    }
    return null;
  }
}

async function renderWeather() {
  async function formatData() {
    function destructToday({
      timezone,
      timezone_offset: timezoneOffset,
      current: {
        feels_like: feelsLike,
        dew_point: dewPoint,
        wind_speed: windSpeed,
        wind_deg: windDegree,
        dt,
        sunrise,
        sunset,
        temp,
        pressure,
        uvi,
        clouds,
        visibility,
        weather: {
          0: { main, description },
        },
      },
    }) {
      return {
        timezone,
        timezoneOffset,
        dt,
        sunrise,
        sunset,
        temp,
        feelsLike,
        pressure,
        dewPoint,
        uvi,
        clouds,
        visibility,
        windSpeed,
        windDegree,
        main,
        description,
      };
    }
    function formatToday(obj) {
      return {
        timezone: obj.timezone.split("/")[1],
        timezoneOffset: obj.timezoneOffset,
        dt: obj.dt,
        main: obj.main,
        description: obj.description,
        clouds: obj.clouds,
        windDegree: obj.windDegree,

        temp: obj.temp.toFixed(0) + units[ub][1],
        feelsLike: obj.feelsLike.toFixed(0) + units[ub][1],

        sunrise: format(fromUnixTime(obj.sunrise), "HH:MM"),
        sunset: format(fromUnixTime(obj.sunset), "HH:MM"),
        dewPoint: `${obj.dewPoint.toFixed(0)}${units[ub][1]}`,
        pressure: `${obj.pressure}mPh`,
        uvi: obj.uvi.toFixed(0),
        visibility: `${(obj.visibility / 1000).toFixed(1)}${units[ub][2]}`,
        windSpeed: `${obj.windSpeed.toFixed(1)}${units[ub][3]}`,
      };
    }

    const sevenDaysData = await getWeather(lastCity);
    const todaysData = destructToday(sevenDaysData);
    const todayDataFormatted = formatToday(todaysData);
    return todayDataFormatted;
  }
  const todaysData = await formatData();

  function renderMain() {
    const mainTempDisplay = document.querySelector(".general-weather-temp");
    const mainTempText = document.createElement("p");
    const mainFeelText = document.createElement("h1");

    mainFeelText.textContent = `feels like: ${todaysData.feelsLike}, ${todaysData.description}`;
    mainTempDisplay.textContent = "";
    mainTempDisplay.append(mainTempText, mainFeelText);
    mainTempText.textContent = `${todaysData.temp}`;

    const getFontSize = (textLength) => {
      const baseSize = 24;
      if (textLength >= baseSize) {
        // eslint-disable-next-line no-const-assign
        baseSize = textLength;
      }
      const fontSize = baseSize - textLength / 2 + -2;
      return `${fontSize}vw`;
    };

    const mainCityDisplay = document.querySelector(".general-weather-city");
    const mainCityText = document.createElement("h1");
    mainCityDisplay.textContent = "";
    mainCityText.textContent = todaysData.timezone;
    mainCityText.style.fontSize = getFontSize(mainCityText.textContent.length);

    if (mainCityText.textContent.length > 8) {
      mainCityText.style.wordBreak = "break-all";
      mainCityText.style.lineHeight = "1ch";
    }
    mainCityDisplay.append(mainCityText);

    const miniInfoDiv = document.querySelector(".current-day_more-info");
    const miniInfo = [
      todaysData.sunrise,
      todaysData.sunset,
      todaysData.pressure,
      todaysData.dewPoint,
      todaysData.uvi,
      todaysData.clouds,
      todaysData.visibility,
      todaysData.windSpeed,
      todaysData.windDegree,
    ];
    miniInfo.forEach((element) => {
      const miniInfoWrapper = document.createElement("div");
      miniInfoWrapper.classList.add("more-info_item");
      const icon = document.createElement("div");
      const p = document.createElement("p");
      p.textContent = element;
      miniInfoWrapper.append(p, icon);
      miniInfoDiv.append(miniInfoWrapper);
    });
    const compass = document.querySelector(
      "div.more-info_item:nth-child(9) > div:nth-child(2)"
    );
    compass.style.transform = `rotate(${-45 + todaysData.windDegree}deg)`;
  }

  function renderSnippet() {
    const futureSnippetCont = document.querySelector(
      ".general-weather_future-weather-snippet"
    );
  }

  renderMain();
}

renderWeather();

searchSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  const city = searchInput.value;
  lastCity = city;
  getWeather(city);
  searchInput.value = "";
});
const unitsBtn = document.querySelector(".icon-list_button");
// eslint-disable-next-line prefer-destructuring
unitsBtn.textContent = units[ub][1];
unitsBtn.addEventListener("click", (e) => {
  ub = 1 - ub;

  // eslint-disable-next-line prefer-destructuring
  unitsBtn.textContent = units[ub][1];
  getWeather(lastCity);
});

getWeather("london");

(function scrollHeader() {
  const y = window.scrollY;
  const topHeader = document.querySelector(".top-header");
  const screen = document.querySelector(".screen");
  const topHeaderHeight = topHeader.offsetHeight;

  const addClassOnScroll = () => topHeader.classList.add("fade-out");
  const removeClassOnScroll = () => topHeader.classList.remove("fade-out");

  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY;

    if (scrollPos >= topHeaderHeight + 630) {
      addClassOnScroll();
    } else {
      removeClassOnScroll();
    }
  });
})();
