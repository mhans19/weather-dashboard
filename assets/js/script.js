// Global Variables
var APIKey = "da1207ce6ca80c363fd1e4bb5cdbcbc9";
var cityInputEl = document.querySelector(".form-control");
var weatherIconEl = document.querySelector("#weatherIcon");
const cityHistory = JSON.parse(localStorage.getItem("storedCities")) || [];
// Fetch Current Weather API
var fetchAPI = function(city) {
    // format the URL
    var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + 
                            APIKey + "&units=imperial";
    // make a request to the url for current weather
    fetch(currentWeatherUrl)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                response.json().then(function(response) {
                        $('#weathCard').removeClass('.hide').addClass('card');
                        // Header (City name, current date, and icon)
                            //Name
                            $("#city-search-term").text("");
                            $("#city-search-term").text(response.name);
                            //Date
                            $("#date").text("(" + moment().format("L") + ")");
                            //Icon
                            weatherIconEl.setAttribute('src', "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
                        fetchUV(response);
            });
        } else {
            $("#city-search-term").text("Error: " + response.statusText);
            setTimeout(
                function() {
                    location.reload(true);
                }, 2000);
        }
    })
    .catch(function(error) {
        alert("Unable to connect");
    });
};
// Fetch UV API
var fetchUV = function(response) {
    // format the UV api
    var uvURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + 
                 response.coord.lat + "&lon=" + response.coord.lon + "&appid=" + APIKey;
    // make a request to the url for uv index
    fetch(uvURL)
        .then(function(uvData) {
            // request was successful
            if (uvData.ok) {
                uvData.json().then(function(uvData) {
                    // Current Weather
                    $("#curWeath").empty();
                    $("#curWeath").append(
                        $('<h4/>', {text: "Temperature: " + Math.round(response.main.temp) + " \u00B0F"}),
                        $('<h4/>', {text: "Humidity: " + response.main.humidity + "%"}),
                        $('<h4/>', {text: "Wind Speed: " + response.wind.speed + " MPH"}),
                        $('<h4/>', {text: "UV Index: "}).append(
                            $('<span/>', {'id': 'uvColor', text: uvData[0].value})));
                            // Dynamic Selection of UV Index Color for L/M/H
                            if(uvData[0].value < 5) {
                                $("#uvColor").addClass("bg-success rounded px-2");
                            } else if (uvData[0].value > 6) {
                                $("#uvColor").addClass("bg-danger rounded px-2");
                            } else {
                                $("#uvColor").addClass("bg-warning rounded px-2");
                            };
                    fetchForecast(response, uvData);
            });
        } else {
            alert("Eror: " + uvData.statusText);
            setTimeout(
                function() {
                    location.reload(true);
                }, 2000);
        }
    })
    .catch(function(error) {
        alert("Unable to connect");
    });
};
// Fetch 5-Day Forecast API
var fetchForecast = function(response, uvData) {
    //define increment
    var increment = 0;
    //only want 5 days
    var forecastIndex = [0,1,2,3,4];
    // format the URL
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + response.name + "&temp_max&units=imperial&appid=" + APIKey;
    // make a request to the url for five day forecast
    fetch(forecastURL)
        .then(function(foreData) {
            // request was successful
            if (foreData.ok) {
                foreData.json().then(function(foreData) {
                    $("#forecastLabel").text("5-Day Weather Forecast");
                    $("#forecast").empty();
                    jQuery.each(forecastIndex, function appendElements(){
                        //create div element down the road
                        $("#forecast").append(
                            $('<div/>', {'class': 'col', 'id': 'card-holder'}).append(
                                $('<div/>', {'class': 'card bg-primary'}).append(
                                    $('<div/>', {'class': 'card-body text-center'}).append(
                                        $('<h4/>', {'class': 'card-title', text: moment(foreData.list[increment].dt_txt).format("L")}),
                                        $('<img>', {'class': 'card-subtitle', 'alt': 'Weather Icon', 'src': "http://openweathermap.org/img/wn/" + foreData.list[increment].weather[0].icon + "@2x.png"}),
                                        $('<div/>', {'class': 'card-text'}).append(
                                            $('<h5/>', {text: 'Temp: ' + Math.round(foreData.list[increment].main.temp) + " \u00B0F"}),
                                            $('<h5/>', {text: 'Humidity: ' + foreData.list[increment].main.humidity + "%"})                  
                        )))));
                        increment = increment + 8; // increase by 8 so we get 24 hours blocks rather than 3
                    });
            });
        } else {
            alert("Eror: " + foreData.statusText);
            setTimeout(
                function() {
                    location.reload(true);
                }, 2000);
        }
    })
    .catch(function(error) {
        alert("Unable to connect");
    });
};
// Set Search History on load
$(document).ready(function(){
    // display previous stored cities, if set
    var prevCity = cityHistory;
    // identify 10 most recent searches
    if (cityHistory.length > 10){
    var recentIndex = cityHistory.length - 10;
    } else {
        var recentIndex = 0;
    }
    for (var i = recentIndex; i < cityHistory.length; i++){
        if(prevCity !== null & cityHistory[i].cityname !== "") {
            $("#cityHistory").append(
                $('<button/>', {'class': 'text-left btn btn-light btn-outline-secondary btn-block mt-2', 'id': 'historyBtn', 'value': cityHistory[i].cityname, text: cityHistory[i].cityname}));
        }
    }
});
// Set Search Button and Local Storage
$('#searchButton').on('click', function(event){  
    event.preventDefault();
    cityInput = document.querySelector(".form-control").value.trim();
    const cityArray = {
       cityname: cityInput
     };
    cityHistory.push(cityArray);
    localStorage.setItem("storedCities", JSON.stringify(cityHistory));
        // get value from input element
        var city = cityInputEl.value.trim();
        if (city) {
            fetchAPI(city);
            cityInputEl.value = "";
        } else {
        alert("Please enter a valid city.");
        }
});
// Set Button for Search History Cities
$('#cityHistory').on('click', '.btn-outline-secondary', function(){  
    var city = $(this).text();
    fetchAPI(city);
});
// Set Refresh Button for Search History
$('#refreshBtn').on('click', function(){  
    location.reload();
});