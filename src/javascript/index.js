/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import "../css/style.css";
import "regenerator-runtime/runtime";
import "core-js/stable";
import { addDays, format, fromUnixTime } from "date-fns";
import Chart from "chart.js/auto";

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

    return [sevenDaysWeatherData, name];
  } catch (e) {
    if (e instanceof TypeError) {
      searchInput.placeholder = "Not a valid input";
    }
    return null;
  }
}

async function renderWeather() {
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

  async function formatData() {
    function formatToday({
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
        main,
        description,
        clouds,
        windDegree,

        temp: temp.toFixed(0) + units[ub][1],
        feelsLike: feelsLike.toFixed(0) + units[ub][1],

        sunrise: format(fromUnixTime(sunrise), "HH:MM"),
        sunset: format(fromUnixTime(sunset), "HH:MM"),
        dewPoint: `${dewPoint.toFixed(0)}${units[ub][1]}`,
        pressure: `${pressure}mPh`,
        uvi: uvi.toFixed(0),
        visibility: `${(visibility / 1000).toFixed(1)}${units[ub][2]}`,
        windSpeed: `${windSpeed.toFixed(1)}${units[ub][3]}`,
      };
    }

    function formatFuture(obj) {
      const futureData = [];
      for (let i = 0; i < obj.length; i += 1) {
        let weekDay = {};
        const {
          clouds,
          dt,
          humidity,
          moonrise,
          moonset,
          sunrise,
          sunset,
          uvi,
          dew_point: dewPoint,
          moon_phase: moonPhase,
          wind_deg: windDegree,
          wind_gust: windGust,
          wind_speed: windSpeed,
          feels_like: {
            day: dayFeel,
            eve: eveFeel,
            morn: mornFeel,
            night: nightFeel,
          },
          temp: { day, eve, morn, night, min, max },
          weather: {
            0: { main, description },
          },
        } = obj[i];
        weekDay = {
          clouds,
          windDegree,
          windGust,
          dewPoint: `${dewPoint.toFixed(0)}${units[ub][1]}`,
          dt: fromUnixTime(dt),
          humidity,
          moonPhase: format(fromUnixTime(moonPhase), "HH:MM"),
          moonrise: format(fromUnixTime(moonrise), "HH:MM"),
          moonset: format(fromUnixTime(moonset), "HH:MM"),
          sunrise: format(fromUnixTime(sunrise), "HH:MM"),
          sunset: format(fromUnixTime(sunset), "HH:MM"),
          windSpeed: `${windSpeed.toFixed(1)}${units[ub][3]}`,
          uvi: uvi.toFixed(0),
          day: day.toFixed(0) + units[ub][1],
          eve: eve.toFixed(0) + units[ub][1],
          morn: morn.toFixed(0) + units[ub][1],
          night: night.toFixed(0) + units[ub][1],
          min: min.toFixed(0) + units[ub][1],
          max: max.toFixed(0) + units[ub][1],
          dayFeel: dayFeel.toFixed(0) + units[ub][1],
          eveFeel: eveFeel.toFixed(0) + units[ub][1],
          mornFeel: mornFeel.toFixed(0) + units[ub][1],
          nightFeel: nightFeel.toFixed(0) + units[ub][1],
          main,
          description,
        };
        futureData.push(weekDay);
      }
      return futureData;
    }

    function formatHourly(obj) {
      const hourlyData = [];
      for (let i = 0; i < obj.length; i += 1) {
        let hourly = {};
        const {
          clouds,
          dt,
          humidity,
          uvi,
          temp,
          dew_point: dewPoint,
          wind_deg: windDegree,
          wind_gust: windGust,
          wind_speed: windSpeed,
          feels_like: feelsLike,
          weather: {
            0: { main, description },
          },
        } = obj[i];
        hourly = {
          clouds,
          windDegree,
          windGust,
          humidity,
          dewPoint: `${dewPoint.toFixed(0)}${units[ub][1]}`,
          dt: format(fromUnixTime(dt), "HH:MM"),
          windSpeed: `${windSpeed.toFixed(1)}${units[ub][3]}`,
          uvi: uvi.toFixed(0),
          temp: temp.toFixed(0) + units[ub][1],
          feelsLike: feelsLike.toFixed(0) + units[ub][1],
          main,
          description,
        };
        hourlyData.push(hourly);
      }
      return hourlyData;
    }

    const metaData = await getWeather(lastCity);
    const cityName = metaData[1];
    const sevenDaysData = metaData[0];
    const todaysData = formatToday(sevenDaysData);
    const futureData = formatFuture(sevenDaysData.daily);
    const hourlyData = formatHourly(sevenDaysData.hourly);

    console.log(hourlyData);

    return [todaysData, futureData, hourlyData, cityName];
  }
  const data = await formatData();
  const todaysData = data[0];
  const futureData = data[1];
  const hourlyData = data[2];
  const cityName = data[3];

  function renderMain() {
    const mainTempDisplay = document.querySelector(".general-weather-temp");
    const mainTempText = document.createElement("p");
    const mainFeelText = document.createElement("h1");

    mainTempDisplay.textContent = "";
    mainFeelText.textContent = `feels like: ${todaysData.feelsLike}, ${todaysData.description}`;
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
    mainCityText.textContent = cityName;
    mainCityText.style.fontSize = getFontSize(mainCityText.textContent.length);

    if (mainCityText.textContent.length > 8) {
      mainCityText.style.wordBreak = "break-all";
      mainCityText.style.lineHeight = "1ch";
    }
    mainCityDisplay.append(mainCityText);

    const miniInfoDiv = document.querySelector(".current-day_more-info");
    miniInfoDiv.textContent = "";
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
    futureSnippetCont.textContent = "";

    for (let i = 0; i < 8; i += 1) {
      const renderList = {
        description: {
          prefix: "",
          value: futureData[i].description,
          class: "description",
          appendix: "",
        },
        windSpeed: {
          prefix: "wind speed:",
          value: futureData[i].windSpeed,
          class: "text",
          appendix: "",
        },
        humidity: {
          prefix: "humidity:",
          value: futureData[i].humidity,
          class: "text",
          appendix: "%",
        },
        day: {
          prefix: "day:",
          value: futureData[i].day,
          class: "text",
          appendix: "",
        },
        min: {
          prefix: "min:",
          value: futureData[i].min,
          class: "text",
          appendix: "",
        },
        max: {
          prefix: "max:",
          value: futureData[i].max,
          class: "text",
          appendix: "",
        },
        dayFeel: {
          prefix: "feels like:",
          value: futureData[i].dayFeel,
          class: "text",
          appendix: "",
        },
      };
      const headerDiv = document.createElement("div");
      headerDiv.classList.add("snippet-header");
      const dayHeader = document.createElement("h1");
      dayHeader.textContent = weekDays[i];
      headerDiv.append(dayHeader);
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("snippet_container");
      const text = document.createElement("div");
      text.classList.add("snippet_text");
      const icon = document.createElement("div");
      icon.classList.add("snippet_icon");
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(renderList)) {
        const a = document.createElement("p");
        a.classList.add(`snippet_${value.class}`);
        a.textContent = `${value.prefix} ${value.value}${value.appendix}`;
        text.append(a);
      }
      dayDiv.append(headerDiv, icon, text);
      futureSnippetCont.append(dayDiv);
    }
  }

  // function renderFuture() {
  //   const shownDay = futureData[0];

  //   const ctx = document.getElementById("myChart").getContext("2d");
  //   const myChart = new Chart(ctx, {
  //     type: "bar",
  //     data: {
  //       labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  //       datasets: [
  //         {
  //           label: "# of Votes",
  //           data: [12, 19, 3, 5, 2, 3],
  //           backgroundColor: [
  //             "rgba(255, 99, 132, 0.2)",
  //             "rgba(54, 162, 235, 0.2)",
  //             "rgba(255, 206, 86, 0.2)",
  //             "rgba(75, 192, 192, 0.2)",
  //             "rgba(153, 102, 255, 0.2)",
  //             "rgba(255, 159, 64, 0.2)",
  //           ],
  //           borderColor: [
  //             "rgba(255, 99, 132, 1)",
  //             "rgba(54, 162, 235, 1)",
  //             "rgba(255, 206, 86, 1)",
  //             "rgba(75, 192, 192, 1)",
  //             "rgba(153, 102, 255, 1)",
  //             "rgba(255, 159, 64, 1)",
  //           ],
  //           borderWidth: 1,
  //         },
  //       ],
  //     },
  //   });
  // }

  renderMain();
  renderSnippet();
  // renderFuture();
}

renderWeather();

searchSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  const city = searchInput.value;
  lastCity = city;
  renderWeather(city);
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
