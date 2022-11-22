const APIkey = "1feeae181c216523cb0b0ff24fd0683b";
const cities = [];
const recentCityCounter = 0;

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lon = position.coords.longitude;
      const lat = position.coords.latitude;
      const URL =
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` +
        `lon=${lon}&appid=${APIkey}`;

      fetch(URL)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          console.log(new Date().getTime());
          const dat = new Date(data.dt);
          console.log(dat.toLocaleString());
          console.log(new Date().getMinutes());
          weatherReport(data);
        });
    });
  }
});

function searchByCity() {
  const place = document.getElementById("input").value;
  const urlsearch = `http://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${APIkey}`;

  fetch(urlsearch)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      weatherReport(data);
    });
  document.getElementById("input").value = "";
}

function getHistory() {
  let history = localStorage.getItem("search-history");
  history = JSON.parse(history);
  console.log(history);
  history.forEach((place) => cities.push(place));
  console.log(cities);
}
getHistory();

const createRecentCity = function () {
  const listItemEl = document.createElement("li");
  listItemEl.className = "recentSearch";

  // add city id as custom attribute
  listItemEl.setAttribute("data-city-id", recentCityCounter);

  const cityInfoEl = document.createElement("h3");
  cityInfoEl.className = "cityInfo";
  cityInfoEl.innerHTML = "<h3 class='cityName'>";
};

function weatherReport(data) {
  const urlcast =
    `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` +
    `appid=${APIkey}&units=imperial`;

  fetch(urlcast)
    .then((res) => {
      return res.json();
    })
    .then((forecast) => {
      console.log(forecast.city);
      // hourForecast(forecast);
      dayForecast(forecast);

      console.log(data);
      document.getElementById("currentCityWeather").innerText =
        data.name + ", " + data.sys.country;
      console.log(data.name + "," + data.sys.country);

      console.log(Math.floor(data.main.temp - 273));
      document.getElementById("Ctemp").innerText =
        Math.floor(data.main.temp * 1.8 - 459.67) + " °F";

      document.getElementById("Chumd").innerText =
        "Humidity: " + data.main.humidity + "%";
      console.log(data.main.humidity);

      document.getElementById("Cwind").innerText =
        "Wind Speed: " + Math.floor(data.wind.speed / 0.44704) + "mph";
      console.log(data.wind.speed);

      const icon1 = data.weather[0].icon;
      const iconURL = "http://api.openweathermap.org/img/w/" + icon1 + ".png";
      document.getElementById("img").src = iconURL;
    });
}

function dayForecast(forecast) {
  document.getElementById("futureWeather").innerHTML = "";
  for (let i = 7; i < forecast.list.length; i += 7) {
    console.log(forecast.list[i]);
    const div = document.createElement("div");
    div.setAttribute("class", "dayF");

    const day = document.createElement("p");
    day.setAttribute("class", "date");
    day.innerText = new Date(forecast.list[i].dt * 1000).toLocaleDateString();
    div.appendChild(day);

    const temp = document.createElement("p");
    temp.innerText = Math.floor(forecast.list[i].main.temp_max) + " °F";
    div.appendChild(temp);

    const wind = document.createElement("p");
    wind.innerText = Math.floor(forecast.list[i].wind.speed) + " mph";
    div.appendChild(wind);

    const hum = document.createElement("p");
    hum.innerText = Math.floor(forecast.list[i].main.humidity) + " %";
    div.appendChild(hum);

    const description = document.createElement("p");
    description.setAttribute("class", "desc");
    description.innerText = forecast.list[i].weather[0].description;
    div.appendChild(description);

    const icon = document.createElement("img");
    description.setAttribute(
      "src",
      "http://api.openweathermap.org/img/w/",
      ".png",
      "id",
      "img"
    );
    description.innerText = forecast.list[i].weather[0].icon;
    div.appendChild(icon);

    document.getElementById("futureWeather").appendChild(div);
  }
}
