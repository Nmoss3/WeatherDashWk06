var city="";

var citySearch = $("#city-search");
var searchButton = $("#search-button");
var clearButton = $("#clear-button");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidity = $("#humidity");
var currentWindSpeed = $("#wind-speed");
var currentUvIndex = $("#uv-index");
var sCity=[];
// Button functionality
$("#search-button").on("click",displayWeather);
$(document).on("click",displayPastSearch);
$(window).on("load",loadHistory);
$("#clear-button").on("click",clearHistory);

// checks to see if the city exists 
function find(c){
    for (var i=0; i<sCity.length; i++){
        if(c.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}
// My API Key
var APIKey="00a453b8aa0b12b1e42810a6a79be211"
// displays current and future weather from user input
function displayWeather(event){
    event.preventDefault();
    if(citySearch.val().trim()!==""){
        city=citySearch.val().trim();
        currentWeather(city);
    }
}
// AJAX call
function currentWeather(city){
    var queryUrl= "https://api.openweathermap.org/data/2.5/weather?q="
     + city 
     + "&APPID=" 
     + APIKey;
     $.ajax({
         url:queryUrl,
         method:"GET"
     }).then(function(response){

         console.log(response);

         var weatherIcon = response.weather[0].icon;
         var iconURL="https://openweathermap.org/img/wn/"+weatherIcon +"@2x.png";

         var date=new Date(response.dt*1000).toLocaleDateString();
         $(currentCity).html(response.name +"("+date+")" + "<img src="+iconURL+"<");
         //converts current temp data to ferenheit since I did not add that to the fetch URL

         var tempFeren = (response.main.temp - 273.15) * 1.80 + 32;
         $(currentTemperature).html((tempFeren).toFixed(2)+"&#8457");
         //displays humidity
         $(currentHumidity).html(response.main.humidity+"%");
         //Display wind speed and converts it to mph because I never learned the metric system
         var windSpeed = response.wind.speed;
         var windMPH =(windSpeed*2.237).toFixed(1);
         $(currentWindSpeed).html(windMPH+"MPH");
         //Here lies the UvIndex
         UVIndex(response.coord.lon,response.coord.lat);
         forecast(response.id);
         if(response.cod==200){
             sCity=JSON.parse(localStorage.getItem("cityname"));
             console.log(sCity);
             if(sCity==null){
                 sCity=[];
                 sCity.push(city.toUpperCase()
                 );
                 localStorage.setItem("cityname",JSON.stringify(sCity));
                 addToList(city);
             }
             else {
                 if(find(city)>0){
                     sCity.push(city.toUpperCase());
                     localStorage.setItem("cityname",JSON.stringify(sCity));
                     addToList(city);
                 }
             }
         }
         

     });
}
function UVIndex(ln,lt){
    var queryUV ="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
    $.ajax({
            url:queryUV,
            method:"GET"
            }).then(function(response){
                $(currentUvIndex).html(response.value);
            });
}
// display 5 day for current city
function forecast(cityid){
    var queryForecast = "https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
    $.ajax({
        url: queryForecast,
        method: "GET"
    }).then(function(response){
        for(i=0;i<5;i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
            var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
            var tempK= response.list[((i+1)*8)-1].main.temp;
            var tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
            var humidity= response.list[((i+1)*8)-1].main.humidity;
        
            $("#futDate"+i).html(date);
            $("#futimg"+i).html("<img src="+iconurl+">");
            $("#futTemp"+i).html(tempF+"&#8457");
            $("#futHumidity"+i).html(humidity+"%");
        }
    });
}
// add searched city on the search history
function addToList(c){
    var listEl= $("<li>"+c.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",c.toUpperCase());
    $(".list-group").append(listEl);
}
//displays the past search when clicked in search history
function displayPastSearch(event){
    var listEl=event.target;
    if(event.target.matches("li")){
        city=listEl.textContent.trim();
        currentWeather(city);
    }
}
//load previous function
function loadHistory(){
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if(sCity!==null){
        sCity=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<sCity.length;i++){
            addToList(sCity[i]);
        }
        city=sCity[i-1];
        currentWeather(city);
    }
}
// clear search history
function clearHistory(event){
    event.preventDefault();
    sCity=[];
    localStorage.removeItem("cityname");
    document.location.reload();
}