//DOM elements
let serachButtonElements = document.querySelector('.searchButton');
let serachBarElements = document.querySelector('#searchBar');
let weatherContainerElements = document.querySelector('.WeatherContainer');
let cardContainerElements = document.querySelector('.cardContainer');
let formElements = document.querySelector('#form');
let searchHistortyContainerElements = document.querySelector('#searchHistoryContainer');

//global variables
let searchHistory = [];
let apiKey = 'e681224f251edf9fe2b18dfc26040eac';

//grabs latitdude and longitude from city inputted by user
const getCityCords = function (city) {
   
    let geoApi = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=3&appid=${apiKey}`;

    fetch(geoApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
           

            let latitude = data[0].lat;
            let longitude = data[0].lon;

            getWeather(latitude, longitude);
        })
}
//grabs the weather and specific attributes of the weather from the city inputted by user
const getWeather = function (latitude, longitude) {

let weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    fetch(weatherApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            let date = moment().format('MMMM Do YYYY');
            let temperature = data.current.temp;
            temperature = Math.floor((temperature - 273.15) * 9 / 5 + 32);

            let wind = data.current.wind_speed;
            let humidity = data.current.humidity;
            let uvIndex = data.current.uvi;

            let currentCity = document.createElement('h3');
            let currentCityTemp = document.createElement('p');
            let currentCityWind = document.createElement('p');
            let currentCityHumidity = document.createElement('p');
            let currentCityUvindex = document.createElement('p');

            currentCity.textContent = `${serachBarElements.value} | ${date}`;
            currentCityTemp.textContent = `Temp: ${temperature}℉`;
            currentCityWind.textContent = `Wind: ${wind} MPH`;
            currentCityHumidity.textContent = `Humidity: ${humidity}%`;
            currentCityUvindex.textContent = `UV Index: ${uvIndex}`;

            weatherContainerElements.append(currentCity);
            weatherContainerElements.append(currentCityTemp);
            weatherContainerElements.append(currentCityWind);
            weatherContainerElements.append(currentCityHumidity);
            weatherContainerElements.append(currentCityUvindex);

            serachBarElements.value = '';
            //creates a card for the next 5 days and inputs certain weather elements on it
            for (i = 1; i < 6; i++) {

                let nextDayTemp = data.daily[i].temp.max;
                nextDayTemp = Math.floor((nextDayTemp - 273.15) * 9 / 5 + 32);

                let nextDayWind = data.daily[i].wind_speed;

                let nextDayHumidity = data.daily[i].humidity;

                let card = document.createElement('div')
                card.setAttribute('class', 'card');
                let days = document.createElement('h5');
                let dayAfterTemp = document.createElement('p');
                let dayAfterWind = document.createElement('p');
                let dayAfterHumidity = document.createElement('p');

                days.textContent = `${[i]} Day(s) After`;
                dayAfterTemp.textContent = `Temp: ${nextDayTemp} ℉`;
                dayAfterWind.textContent = `Wind: ${nextDayWind} mph`;
                dayAfterHumidity.textContent = `Humidity: ${nextDayHumidity}%`;

                card.append(days);
                card.append(dayAfterTemp);
                card.append(dayAfterWind);
                card.append(dayAfterHumidity);

                cardContainerElements.append(card);

            }
    })
}
//puts the cities searched by the user into the history section and saves them to local storage
function saveTheCities(city) {

    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'cities');
    let oldCities = serachBarElements.value.trim();
    button.textContent = oldCities;
    searchHistortyContainerElements.append(button);

    searchHistory.push(city);
    localStorage.setItem('cities', JSON.stringify(searchHistory));
    
    
}
//empties previous information and starts the search for city inputted
let formSubmitHandler = function (event) {
    weatherContainerElements.innerHTML = '';
    cardContainerElements.innerHTML = '';
    event.preventDefault();

    let city = serachBarElements.value.trim();
    if (city) {
        getCityCords(city);
        saveTheCities(city);
    } else {
        alert('Please enter a city');
    }
};
//waits for the submit button to be clicked so it can start acquiring weather information
formElements.addEventListener('submit', formSubmitHandler);