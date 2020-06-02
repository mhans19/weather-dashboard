var APIKey = 'da1207ce6ca80c363fd1e4bb5cdbcbc9';
var cityname = "Dallas"

var fetchAPI = function() {
    // format the github api url
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&appid=" + APIKey;
  
    // make a request to the url
    fetch(apiUrl)
    console.log(apiUrl);
  };
  
  fetchAPI();