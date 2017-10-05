currentRoute = {
    result: '',
    weatherCoords: ''
};

var app = function () {
    var self = this;

    self.markers = [];
    self.route = ko.observable();
    self.waypoints = ko.observableArray();

    self.updateWaypoints = ko.computed(function () {
        console.log('updateWaypoints() called');
        if (self.route()) {
            // remove old infowindows, waypoints, markers.
            self.waypoints.removeAll();
            pickfivepoints(self.route, self.waypoints);
            ShowWeatherMarkers(self.waypoints, self.markers);
            getWeatherDarkSky(self);
        }
        return self.route;
    });

    // called by calculateAndDisplayRoute() on maps.js
    self.updateCoordinates = function (response) {
        self.route(response);
        pickfivepoints(self.route, self.waypoints);
        console.log(self.route());
        currentRoute.weatherCoords = self.waypoints();
        ShowWeatherMarkers();
    }
};

pickfivepoints = function (route, wpts) {
    if (!route()) {
        console.log('route not found.');
        return
    }
    var polyDots = route().routes[0].overview_path.length;
    var waypoints = Math.floor((polyDots / 5));

    for (var i = 0; i < polyDots; i += waypoints) {
        myLatLng = new google.maps.LatLng({
            'lat': route().routes[0].overview_path[i].lat(),
            'lng': route().routes[0].overview_path[i].lng()
        });

        step = findStepForWeatherCoord(route, myLatLng);
        wpts.push({
            step: step,
            'lat': myLatLng.lat(),
            'lng': myLatLng.lng(),
            'latlng': myLatLng
        });
    }
    ;
};

findStepForWeatherCoord = function (route, weatherCoord) {
    // console.log("finding which steps correspond to latlngs");
    tripSteps = route().routes[0].legs[0].steps;

    for (step in tripSteps) {
        stepPoly = new google.maps.Polyline({
            path: tripSteps[step].lat_lngs
        });
        if (google.maps.geometry.poly.containsLocation(weatherCoord, stepPoly) == true) {
            return (step);
        }
    }
};

function ShowWeatherMarkers(waypoints, markers) {
    console.log('inside showweathermarkers()');
    // clear current markers if any
    for (marker of markers) {
        marker.marker.setVisible(false);
        marker.infoWindow.close();
    };
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
    }
}

var getWeatherDarkSky = function (viewModel) {
    console.log("fetching weather from dark sky");
    var key = 'a214b166daec400f159accdddb580373';
    var baseUrl = 'https://api.darksky.net/forecast/' + key + '/';

    for (var i = 0; i < viewModel.waypoints().length; i++) {
        var waypoint = viewModel.waypoints()[i];
        (function (waypoint) {
            var qUrl = baseUrl + waypoint.lat + ',' + waypoint.lng;
            $.ajax(qUrl, {
                dataType: 'jsonp',
                success: function (data) {
                    attachWeatherSummary(data, waypoint);
                }
            });
        })(waypoint);
    }
};

var attachWeatherSummary = function (result, waypoint) {
    // result sample: https://api.darksky.net/forecast/a214b166daec400f159accdddb580373/37.8267,-122.4233
    myLatLng = {
        lat: waypoint.lat,
        lng: waypoint.lng
    };
    wpts = new google.maps.LatLng(myLatLng);
    for (marker in viewModel.markers) {
        var point = viewModel.markers[marker];
        if (point.marker.position.equals(wpts)) {
            var hourly = result.hourly.data;
            var icon = hourly[0].icon;
            var content = hourly[0].summary + '<br>' +
                hourly[0].icon + '<br>' +
                '<canvas id="waypoint' + marker + '" width="64" height="64">' + icon + '</canvas><br>' +
                'precip intensity: ' + hourly[0].precipIntensity + '<br>' +
                'precip chance: ' + hourly[0].precipProbability + '<br>' +
                'temperature: ' + hourly[0].temperature + '<br>' +
                'wind speed: ' + hourly[0].windSpeed+ '<br>' +
                'wind gust: ' + hourly[0].windGust + '<br>' +
                'visibility: ' + hourly[0].visibility+ '<br>';
         point.infoWindow.setContent(content);
         point.infoWindow.open(map, point.marker);
         generateIcon('waypoint' + marker, icon);
        }
    }
};

var skycons = new Skycons();
var generateIcon = function (tag, icon) {
    var re = new RegExp('-', 'g');
    console.log(icon);
    var icon = icon.replace(re, '_').toUpperCase();
    console.log(icon);
    skycons.add(document.getElementById(tag), Skycons[icon]);
    skycons.play();
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
// TODO: delete
addWeatherRows = function (addMutationBack) {
    $('tr#weather-row').remove();
    for (coord in currentRoute.weatherCoords) {
        var step = currentRoute.weatherCoords[coord].step;
        $("tr[data-step-index='" + step + "']").after('<tr id="weather-row"><td>THUNDAR!</td></tr>');
    }
    addMutationBack();
};

// function addRowsToDirections() {
//     var addRowsMut = new MutationObserver(function (mutations) {
//         addRowsMut.disconnect();
//         pickfivepoints();
//         ShowWeatherMarkers();
//         addWeatherRows(function () {
//             addRowsToDirections();
//         });
//     });
//     addRowsMut.observe(document.getElementById('right-panel'), {
//         attributes: true,
//         childList: true,
//         characterData: true
//     });
// }

$(document).ready(function () {
    // addRowsToDirections();
})