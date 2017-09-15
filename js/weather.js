function ShowWeatherMarkers(waypoints, markers) {
    console.log('inside showweathermarkers()');
    // clear current markers if any
    for (marker of markers) {
        marker.marker.setVisible(false);
    }
    for (pathStep in waypoints()) {
        var myLatLng = waypoints()[pathStep].latlng;
        var marker = new google.maps.Marker;
        marker.setPosition(myLatLng);

        var infowindow = new google.maps.InfoWindow({maps: map, content: 'THUNDAR!', position: myLatLng});
        marker.addListener('click', (function (infowindowCopy, markerCopy) {
            return function () {
                infowindowCopy.open(map, markerCopy);
            }
        })(infowindow, marker));

        marker.setMap(map);
        markers.push({
            marker: marker,
            infoWindow: infowindow
        });
    };
}

var getWeatherDarkSky = function (viewModel) {
    console.log("fetching weather from dark sky");
    var key = 'a214b166daec400f159accdddb580373';
    var baseUrl = 'https://api.darksky.net/forecast/' + key + '/';

    var firstPoint = viewModel.waypoints()[0];
    var qUrl = baseUrl + firstPoint.lat + ',' + firstPoint.lng;
    console.log(qUrl);
    var result;
    $.ajax(qUrl, {
        dataType: 'jsonp',
        success: function (data) {
            result = data;
            viewModel.markers[0].marker.setVisible(false);
            myLatLng = {
                lat: viewModel.markers[0].marker.position.lat(),
                lng: viewModel.markers[0].marker.position.lng()
            };
            var infoWindow = new google.maps.InfoWindow({
                map: map,
                content: result.currently.summary,
                position: myLatLng});
            viewModel.markers[0].infoWindow = infoWindow;
            var marker = viewModel.markers[0].marker = new google.maps.Marker;
            marker.setPosition(myLatLng);
            marker.addListener('click', function (infoWindow, marker) {
                infoWindow.open(map, marker);
            })
            // var newInfo = new google.maps.InfoWindow({content: result.currently.summary});
            // newInfo.open(map, viewModel.markers[0])
        }
    });
};


var getWeatherOpenWeatherMap = function () {
    var invocation = new XMLHttpRequest()
    var url = 'https://api.darksky.net/forecast/a214b166daec400f159accdddb580373/41.87811000000001,-87.62979000000001?cb=lol';

    function handler(data) {
        console.log(data)
    };

    function callOtherDomain() {
        if (invocation) {
            invocation.open('GET', url, true);
            invocation.onreadystatechange = handler;
            invocation.send();
        }
    };

    callOtherDomain();

}

// var getWeatherOpenWeatherMap = function () {
//     console.log("fetching weather from open weather map");
//     var key = '9648c16ab42255fec8a51db86277e4d7';
//     var baseUrl = 'api.openweathermap.org/data/2.5/weather/';
//
//     var firstPoint = weatherCoords[0];
//     console.log(baseUrl + 'lat=' + firstPoint.lat + '&lon=' + firstPoint.lng + '&APPID=' + key);
// }