var APIKey = "da1207ce6ca80c363fd1e4bb5cdbcbc9";
var cityInputEl = document.querySelector(".form-control");
var cityFormEl = document.querySelector("#city-form");

var fetchAPI = function(city) {
    // format the api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
  
    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    //displayCities(data);
                    console.log(data);
            });
        } else {
            alert("Eror: " + response.statusText);
        }
    })
    .catch(function(error) {
        alert("Unable to connect");
    });
};

var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var cityInput = cityInputEl.value.trim();

    if (cityInput) {
        fetchAPI(cityInput);
        cityInputEl.value = "";
    } else {
    alert("Please enter a valid city.");
    }
    console.log(event);
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
cityFormEl.addEventListener("submit", formSubmitHandler);