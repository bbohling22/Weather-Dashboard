// api key = d91479271e774026a6484634c337f322

const form = document.querySelector("#search-form");
const weatherDataDiv = document.querySelector("#weather-data");
const searchHistory = document.querySelector("#search-history")
const forecastDataDiv = document.querySelector("#forecast-data");

let history = JSON.parse(localStorage.getItem("searchHistory")) || [];


function renderSearchHistory() {
  console.log("renderSearchHistory called");
  searchHistory.innerHTML = "";
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    li.addEventListener("click", function() {
      getWeatherData(item);
    });

    searchHistory.appendChild(li);
  });
}
function getWeatherData(city) {
  console.log("getWeatherData called with city:", city);
  history.push(city);
  saveSearchHistory();
  renderSearchHistory();
}

function saveSearchHistory() {
  localStorage.setItem("searchHistory", JSON.stringify(history));
  renderSearchHistory();
  console.log(history);
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const city = document.querySelector("#city").value;
  const API_KEY = "d91479271e774026a6484634c337f322"; // Weather app api key

  // Fetch current weather data
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
  .then(response => response.json())
  .then(data => {
    
    const city = data.name;
    const temp = Math.round((data.main.temp - 273.15) * 9/5 + 32); // Converting temperature to Fahrenheit
    const icon = data.weather[0].icon;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    const currentWeatherHTML = `
      <h2>Current weather conditions for ${city}:</h2>
      <img src="https://openweathermap.org/img/w/${icon}.png" alt="Weather icon">
      <p>Temperature: ${temp}&deg;F</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind speed: ${windSpeed} m/s</p>
    `;
    weatherDataDiv.innerHTML = currentWeatherHTML;

    
    return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`);
  })
  .then(response => response.json())
  .then(data => {
    
    const forecastList = data.list;

    
    const fiveDayForecastList = forecastList.filter(forecast => forecast.dt_txt.includes("12:00:00")).slice(0, 5);

    
    let forecastHTML = '<h2>5-day forecast:</h2><div class="forecast-cards">';
    fiveDayForecastList.forEach(forecast => {
      const forecastDate = new Date(forecast.dt_txt).toLocaleDateString();
      const forecastTemp = Math.round((forecast.main.temp - 273.15) * 9/5 + 32); // Convert temperature to Fahrenheit
      const forecastIcon = forecast.weather[0].icon;
      const forecastWindSpeed = forecast.wind.speed;
      const forecastHumidity = forecast.main.humidity;

      forecastHTML += `
        <div class="forecast-card">
          <p class="forecast-date">${forecastDate}</p>
          <img src="https://openweathermap.org/img/w/${forecastIcon}.png" alt="Weather icon">
          <p class="forecast-temp">${forecastTemp}&deg;F</p>
          <p class="forecast-wind">Wind speed: ${forecastWindSpeed} m/s</p>
          <p class="forecast-humidity">Humidity: ${forecastHumidity}%</p>
        </div>
      `;
    });
    forecastHTML += '</div>';
    forecastDataDiv.innerHTML = forecastHTML;
  })
  .catch(error => {
    console.error(error);
  });
});