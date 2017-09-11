var dsWeather;

var getWeatherDarkSyk = function () {
    console.log("fetching weather from dark sky");
    var key = 'a214b166daec400f159accdddb580373';
    var baseUrl = 'https://api.darksky.net/forecast/';

    var firstPoint = weatherCoords[0];
    console.log(baseUrl + key + '/' + firstPoint.lat + ',' + firstPoint.lng);
};

var getWeatherOpenWeatherMap = function () {
    console.log("fetching weather from open weather map");
    var key = '9648c16ab42255fec8a51db86277e4d7';
    var baseUrl = 'api.openweathermap.org/data/2.5/weather/';

    var firstPoint = weatherCoords[0];
    console.log(baseUrl + 'lat=' + firstPoint.lat + '&lon=' + firstPoint.lng + '&APPID=' + key);
}