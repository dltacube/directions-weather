currentRoute = {
    result: '',
    weatherCoords: ''
};

var app = function () {
    var self = this;

    // self.dsWeather = ko.observableArray([{
    //     lat: map.center.lat(),
    //     lng: map.center.lng()
    // }]);
    self.markers = [];
    self.route = ko.observable();
    self.waypoints = ko.observableArray();

    self.updateWaypoints = ko.computed(function () {
        console.log('updateWaypoints() called');
        if (self.route()) {
            console.log('we have a route to update');
            self.waypoints.removeAll();
            if (self.route) {
                pickfivepoints(self.route, self.waypoints);
                ShowWeatherMarkers(self.waypoints, self.markers);
                getWeatherDarkSky(self);
            }
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
}

pickfivepoints = function (route, wpts) {
    if (!route()) {
        console.log('route not found.');
        return
    }
    var weatherCoords = [];
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
    };
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