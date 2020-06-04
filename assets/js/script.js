var APIKey = "da1207ce6ca80c363fd1e4bb5cdbcbc9";
var cityInputEl = document.querySelector(".form-control");
var cityButtonEl = document.querySelector("#searchButton");
var weatherCityEl = document.querySelector("#city-search-term");
var curTempEl = document.querySelector("#curTemp");
var curHumEl = document.querySelector("#curHum");
var curWindEl = document.querySelector("#curWind");
var curUVEl = document.querySelector("#curUV");


var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var city = cityInputEl.value.trim();

    if (city) {
        fetchAPI(city);
        cityInputEl.value = "";
    } else {
    alert("Please enter a valid city.");
    }
};

var fetchAPI = function(city) {
    // format the api urls
    var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + 
    "&units=imperial";
  
    // make a request to the url for current weather
    fetch(currentWeatherUrl)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                response.json().then(function(response) {
                        // Header (City name, current date, and icon)
                            //Name
                            weatherCityEl.textContent = "";
                            weatherCityEl.textContent = response.name;
                        //Date
                            $("#date").text("(" + moment().format("L") + ")");
                        //Icon
                            //$("#weather-icon");
                        fetchUV(response);
                    console.log(response);
            });
        } else {
            weatherCityEl.textContent = "Error: " + response.statusText;
        }
    })
    .catch(function(error) {
        alert("Unable to connect");
    });
};

var fetchUV = function(response) {
    // format the UV api
    var uvURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=" + APIKey;

    // make a request to the url for current weather
    fetch(uvURL)
        .then(function(uvData) {
            // request was successful
            if (uvData.ok) {
                uvData.json().then(function(uvData) {
                    // Current Weather
                        curTempEl.textContent = "Temperature: " + Math.round(response.main.temp) + " \u00B0F";
                        curHumEl.textContent = "Humidity: " + response.main.humidity + "%";
                        curWindEl.textContent = "Wind Speed: " + response.wind.speed + " MPH";
                        curUVEl.textContent = "UV Index: " + uvData[0].value;
                    fetchForecast(response, uvData);
                    console.log(uvData);   
            });
        } else {
            alert("Eror: " + uvData.statusText);
        }
    })
    .catch(function(error) {
        alert("Unable to connect");
    });
};

var fetchForecast = function(response, uvData) {
    // format the UV api
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + response.id + "&units=imperial&appid=" + APIKey;
    
    // make a request to the url for current weather
    fetch(forecastURL)
        .then(function(foreData) {
            // request was successful
            if (foreData.ok) {
                foreData.json().then(function(foreData) {
                    displayWeather(response, uvData, foreData);
                    console.log(foreData);   
            });
        } else {
            alert("Eror: " + foreData.statusText);
        }
    })
    .catch(function(error) {
        alert("Unable to connect");
    });
};



   

// $('#searchButton').on('click', function(event){  
//     event.preventDefault();
//     cityInput = document.querySelector(".form-control").value;

//     const cityArray = {
//        cityname: cityInput
//      };
//     const cityHistory = JSON.parse(localStorage.getItem("storedCities")) || [];
//     cityHistory.push(cityArray);
//     //cityHistory.sort((a, b)=> b.cityCount - a.cityCount);
//     //cityHistory.splice(5);
//     localStorage.setItem("storedCities", JSON.stringify(cityHistory));

//     fetchAPI();
// });


cityButtonEl.addEventListener("click", formSubmitHandler);