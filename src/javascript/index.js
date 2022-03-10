import "../css/style.css";
import "regenerator-runtime/runtime";

const units = ["metric", "°C", "km", "m/s"];
const APIKEY = "4f1a5f803edc74651cef27d64b2b6c51";

async function getWeather(city) {
  const coordUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${APIKEY}&units=${units[0]}`;
  const [todayRes] = await Promise.all([fetch(coordUrl)]);
  const coordData = await todayRes.json();
  const {
    name,
    coord: { lon, lat },
  } = coordData;

  const excluded = "none";
  const sevenDaysWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${excluded}&appid=${APIKEY}&units=${units[0]}`;
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
    const dewPointFormatted = `${dew_point.toFixed(0)}${units[1]}`;
    const uviFormatted = uvi.toFixed(0);
    const visibilityFormatted = `${visibility.toFixed(1) / 1000}${units[2]}`;
    const windSpeedFormatted = `${wind_speed.toFixed(1)}${units[3]}`;

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
        units[1]
      }, ${description}`;
      mainTempDisplay.textContent = "";
      mainTempDisplay.append(mainTempText, mainFeelText);
      mainTempText.textContent = `${temp.toFixed(0)}${units[1]}`;

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

      function returnTime(data) {
        const date = new Date(data * 1000);
        const currentHour = date.getHours();
        const currentMinute = date.getMinutes();
        return `${currentHour}:${currentMinute}`;
      }

      const sunsetTime = returnTime(sunset);
      const sunriseTime = returnTime(sunrise);
      const dewPointFormatted = `${dew_point.toFixed(0)}${units[1]}`;
      const uviFormatted = uvi.toFixed(0);
      const windSpeedFormatted = `${wind_speed.toFixed(1)}${units[3]}`;
      // console.log(sevenDaysWeatherData.daily[i]);
      // console.log(uvi);
      (function render() {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("snippet_container");

        const icon = document.createElement("div");
        icon.classList.add("snippet_icon");

        const maxTemp = document.createElement("span");
        maxTemp.classList.add("snippet_max-temp");
        maxTemp.textContent = `max: ${dailyTemp.max.toFixed(0)}${units[1]}`;

        const minTemp = document.createElement("span");
        minTemp.classList.add("snippet_min-temp");
        minTemp.textContent = `min: ${dailyTemp.min.toFixed(0)}${units[1]}`;

        const windGust = document.createElement("span");
        windGust.classList.add("snippet_wind-gust");
        windGust.textContent = `min: ${wind_gust.toFixed(0)}${units[3]}`;

        const uviP = document.createElement("span");
        uviP.classList.add("snippet_uvi");
        uviP.textContent = `uvi: ${uvi.toFixed(0)}`;

        const descriptionP = document.createElement("h1");
        descriptionP.classList.add("snippet_description");
        descriptionP.textContent = description;

        const feelsLike = document.createElement("span");
        feelsLike.classList.add("snippet_feels-like");
        feelsLike.textContent = `feels like: ${day.toFixed(0)}${units[1]}`;

        const text = document.createElement("div");
        text.classList.add("snippet_text");
        text.append(descriptionP, maxTemp, minTemp, feelsLike, windGust, uviP);
        dayDiv.append(icon, text);
        futureSnippetCont.append(dayDiv);
      })();
    }
  })();
}

getWeather("london");

const searchInput = document.querySelector("#search-city");
const searchSubmit = document.querySelector(".header_city-search-submit");

searchSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  const city = searchInput.value;
  getWeather(city);
});
