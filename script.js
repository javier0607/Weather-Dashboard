//DOM elements
let srchBtnEl = document.querySelector('.searchButton');
let srchBarEl = document.querySelector('#searchBar');
let weatherContainerEl = document.querySelector('.currentWeatherContainer');
let cardContainerEl = document.querySelector('.cardContainer');
let formEl = document.querySelector('#form');
let searchHistoryContainerEl = document.querySelector('#searchHistoryContainer');

//global variables
let searchHistory = [];
let apiKey = 'e681224f251edf9fe2b18dfc26040eac';

//grabs latitdude and longitude from city inputted by user
const getCityCords = function (city) {
    console.log(`Getting coordinates for: ${city}`)
    let geoApi = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=3&appid=${apiKey}`;

    fetch(geoApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            let latitude = data[0].lat;
            let longitude = data[0].lon;

            console.log(`The latitude for ${city} is ${latitude}`);
            console.log(`The longitude for ${city} is ${longitude}`);

            getWeather(latitude, longitude);
        })

}


//grabs the weather and specific attributes of the weather from the city inputted by user
const getWeather = function (latitude, longitude) {


    console.log(`Lat and lon for city: ${latitude} & ${longitude}`);
    let weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    fetch(weatherApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            let date = moment().format('MMMM Do YYYY');

            let temperature = data.current.temp;
            temperature = Math.floor((temperature - 273.15) * 9 / 5 + 32);
            console.log(`The temperature is: ${temperature}`);

            let wind = data.current.wind_speed;
            console.log(`The wind speed is: ${wind} `);

            let humidity = data.current.humidity;
            console.log(`The humidity is: ${humidity}`);


            let uvIndex = data.current.uvi;
            console.log(`The UV Index is : ${uvIndex}`);

            let currentCity = document.createElement('h3');
            let currentCityTemp = document.createElement('p');
            let currentCityWind = document.createElement('p');
            let currentCityHumidity = document.createElement('p');
            let currentCityUvindex = document.createElement('p');

            currentCity.textContent = `${srchBarEl.value} | ${date}`;
            currentCityTemp.textContent = `Temp: ${temperature}℉`;
            currentCityWind.textContent = `Wind: ${wind} MPH`;
            currentCityHumidity.textContent = `Humidity: ${humidity}%`;
            currentCityUvindex.textContent = `UV Index: ${uvIndex}`;

            weatherContainerEl.append(currentCity);
            weatherContainerEl.append(currentCityTemp);
            weatherContainerEl.append(currentCityWind);
            weatherContainerEl.append(currentCityHumidity);
            weatherContainerEl.append(currentCityUvindex);


            srchBarEl.value = '';

            //creates a card for the next 5 days and inputs certain weather elements on it
            for (i = 1; i < 6; i++) {

                let nextDayTemp = data.daily[i].temp.max;
                nextDayTemp = Math.floor((nextDayTemp - 273.15) * 9 / 5 + 32);
                console.log(`Temp: ${nextDayTemp}`);

                let nextDayWind = data.daily[i].wind_speed;
                console.log(`Wind: ${nextDayWind}`);

                let nextDayHumidity = data.daily[i].humidity;
                console.log(`Humidity: ${nextDayHumidity}`);

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

                cardContainerEl.append(card);

            }
        })
}

//puts the cities searched by the user into the history section and saves them to local storage
function saveTheCities(city) {
    
    console.log(city);

    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'cities');
    let savedCity = srchBarEl.value.trim();
    button.textContent = savedCity;
    searchHistoryContainerEl.append(button);

    searchHistory.push(city);
    localStorage.setItem('cities', JSON.stringify(searchHistory));
    
    
}

//empties previous information and starts the search for city inputted
let formSubmitHandler = function (event) {
    weatherContainerEl.innerHTML = '';
    cardContainerEl.innerHTML = '';
    event.preventDefault();
    console.log('Submitting form')


    let city = srchBarEl.value.trim();
    console.log(city);
    if (city) {


        getCityCords(city);
        saveTheCities(city);

    } else {
        alert('Please enter a city');
    }
};

//waits for the submit button to be clicked so it can start acquiring weather information
formEl.addEventListener('submit', formSubmitHandler);