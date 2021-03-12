var city="";

var searchCity = $("#city-search");
var searchButton = $("#search-button");
var clearButton = $("#clear-button");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidity = $("#humidity");
var currentSpeed = $("#wind-speed");
var currentUvIndex = $("#uv-index");
var sCity=[];
//does the city exist?
function find(c){
    for (var i=0; i<sCity.length; i++){
        if(c.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}
//API Key
var APIKey="00a453b8aa0b12b1e42810a6a79be211"
// Displays current and future weather from text input
function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}