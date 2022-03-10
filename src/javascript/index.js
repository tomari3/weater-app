/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import "../css/style.css";
import "regenerator-runtime/runtime";

const units = [
  ["metric", "°C", "km", "m/s"],
  ["imperial", "°F", "miles", "mph"],
];
let lastCity = "london";
// stands for Units Boolean
let ub = 0;

const APIKEY = "4f1a5f803edc74651cef27d64b2b6c51";

async function getWeather(city) {
  const coordUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${APIKEY}&units=${units[ub][0]}`;
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

  (function currentDayWeather() {
    const {
      timezone,
      timezone_offset,
      current: {
        dt,
        sunrise,
        sunset,
        temp,
        feels_like,
        pressure,
        dew_point,
        uvi,
        clouds,
        visibility,
        wind_speed,
        wind_deg,
        weather: {
          0: { main, description },
        },
      },
    } = sevenDaysWeatherData;

    function returnTime(data) {
      const date = new Date(data * 1000);
      const currentHour = date.getHours();
      const currentMinute = date.getMinutes();
      return `${currentHour}:${currentMinute}`;
    }

    const sunsetTime = returnTime(sunset);
    const sunriseTime = returnTime(sunrise);

    const pressureFormatted = `${pressure}mPh`;
    const dewPointFormatted = `${dew_point.toFixed(0)}${units[ub][1]}`;
    const uviFormatted = uvi.toFixed(0);
    const visibilityFormatted = `${(visibility / 1000).toFixed(1)}${
      units[ub][2]
    }`;
    const windSpeedFormatted = `${wind_speed.toFixed(1)}${units[ub][3]}`;

    const currentDayList = [
      sunriseTime,
      sunsetTime,
      pressureFormatted,
      dewPointFormatted,
      uviFormatted,
      clouds,
      visibilityFormatted,
      windSpeedFormatted,
      wind_deg,
    ];

    (function render() {
      const mainTempDisplay = document.querySelector(".general-weather-temp");
      const mainTempText = document.createElement("p");
      const mainFeelText = document.createElement("h1");
      mainFeelText.textContent = `feels like: ${feels_like.toFixed(0)}${
        units[ub][1]
      }, ${description}`;
      mainTempDisplay.textContent = "";
      mainTempDisplay.append(mainTempText, mainFeelText);
      mainTempText.textContent = `${temp.toFixed(0)}${units[ub][1]}`;

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
      mainCityText.textContent = name;
      mainCityText.style.fontSize = getFontSize(
        mainCityText.textContent.length
      );

      if (mainCityText.textContent.length > 8) {
        mainCityText.style.wordBreak = "break-all";
        mainCityText.style.lineHeight = "1ch";
      }

      mainCityDisplay.append(mainCityText);

      const miniInfoDiv = document.querySelector(".current-day_more-info");
      (function showMiniInfo() {
        miniInfoDiv.textContent = "";
        for (let i = 0; i < currentDayList.length; i += 1) {
          const miniInfoWrapper = document.createElement("div");
          miniInfoWrapper.classList.add("more-info_item");
          const icon = document.createElement("div");
          const p = document.createElement("p");
          p.textContent = currentDayList[i];
          miniInfoWrapper.append(p, icon);
          miniInfoDiv.append(miniInfoWrapper);
        }
        (function spinWindDirection() {
          const compass = document.querySelector(
            "div.more-info_item:nth-child(9) > div:nth-child(2)"
          );
          compass.style.transform = `rotate(${-45 + wind_deg}deg)`;
        })();
      })();
    })();
  })();

  (function futureWeatherSnippet() {
    const futureSnippetCont = document.querySelector(
      ".general-weather_future-weather-snippet"
    );
    futureSnippetCont.textContent = "";
    for (let i = 0; i < 8; i += 1) {
      const {
        clouds,
        dew_point,
        dt,
        humidity,
        moon_phase,
        moonrise,
        moonset,
        sunrise,
        sunset,
        uvi,
        win_deg,
        wind_gust,
        wind_speed,
        feels_like: { day, eve, morn, night },
        weather: {
          0: { main, description },
        },
      } = sevenDaysWeatherData.daily[i];

      const dailyTemp = sevenDaysWeatherData.daily[i].temp;

      // eslint-disable-next-line no-inner-declarations
      function returnTime(data) {
        const date = new Date(data * 1000);
        const currentHour = date.getHours();
        const currentMinute = date.getMinutes();
        return `${currentHour}:${currentMinute}`;
      }

      const sunsetTime = returnTime(sunset);
      const sunriseTime = returnTime(sunrise);
      const dewPointFormatted = `${dew_point.toFixed(0)}${units[ub][1]}`;
      const uviFormatted = uvi.toFixed(0);
      const windSpeedFormatted = `${wind_speed.toFixed(1)}${units[ub][3]}`;
      // console.log(sevenDaysWeatherData.daily[i]);
      // console.log(uvi);
      // eslint-disable-next-line no-loop-func
      (function render() {
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("snippet-header");
        const dayHeader = document.createElement("h1");
        dayHeader.textContent = "friday";
        headerDiv.append(dayHeader);

        const dayDiv = document.createElement("div");
        dayDiv.classList.add("snippet_container");

        const icon = document.createElement("div");
        icon.classList.add("snippet_icon");

        const maxTemp = document.createElement("span");
        maxTemp.classList.add("snippet_max-temp");
        maxTemp.textContent = `max: ${dailyTemp.max.toFixed(0)}${units[ub][1]}`;

        const minTemp = document.createElement("span");
        minTemp.classList.add("snippet_min-temp");
        minTemp.textContent = `min: ${dailyTemp.min.toFixed(0)}${units[ub][1]}`;

        const windGust = document.createElement("span");
        windGust.classList.add("snippet_wind-gust");
        windGust.textContent = `wind: ${wind_gust.toFixed(0)}${units[ub][3]}`;

        const uviP = document.createElement("span");
        uviP.classList.add("snippet_uvi");
        uviP.textContent = `uvi: ${uvi.toFixed(0)}`;

        const descriptionP = document.createElement("h2");
        descriptionP.classList.add("snippet_description");
        descriptionP.textContent = description;

        const feelsLike = document.createElement("span");
        feelsLike.classList.add("snippet_feels-like");
        feelsLike.textContent = `feels like: ${day.toFixed(0)}${units[ub][1]}`;

        const text = document.createElement("div");
        text.classList.add("snippet_text");
        text.append(descriptionP, maxTemp, minTemp, feelsLike, windGust, uviP);
        dayDiv.append(headerDiv, icon, text);
        futureSnippetCont.append(dayDiv);
      })();
    }
  })();

  (function futureWeather() {
    const snippetCont = document.querySelectorAll(".snippet_container");

    snippetCont.forEach((element) => {
      element.addEventListener("click", (e) => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  })();
}

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

const searchInput = document.querySelector("#search-city");
const searchSubmit = document.querySelector(".header_city-search-submit");

searchSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  const city = searchInput.value;
  lastCity = city;
  getWeather(city);
  searchInput.value = "";
});

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
