pickfivepoints = function () {
    // console.log("picking 5 equidistant points on route");
    currentRoute.weatherCoords = {};
    var polyDots = currentRoute.result.routes[0].overview_path.length;
    var waypoints = Math.floor((polyDots / 5));
    for (var i = 0; i < polyDots; i += waypoints) {
        myLatLng = new google.maps.LatLng({
            'lat': currentRoute.result.routes[0].overview_path[i].lat(),
            'lng': currentRoute.result.routes[0].overview_path[i].lng()
        });
        step = findStepForWeatherCoord(myLatLng);
        // console.log(step);
        currentRoute.weatherCoords[i] = {
            step: step,
            'lat': myLatLng.lat(),
            'lng': myLatLng.lng(),
            'latlng': myLatLng
        };
    }
};
findStepForWeatherCoord = function (weatherCoord) {
    // console.log("finding which steps correspond to latlngs");
    tripSteps = currentRoute.result.routes[0].legs[0].steps;

    for (step in tripSteps) {
        stepPoly = new google.maps.Polyline({
            path: tripSteps[step].lat_lngs
        });
        if (google.maps.geometry.poly.containsLocation(weatherCoord, stepPoly) == true) {
            return (step);
        }
    }
};


addWeatherRows = function (addMutationBack) {
    $('tr#weather-row').remove();
    for (coord in currentRoute.weatherCoords) {
        var step = currentRoute.weatherCoords[coord].step;
        $("tr[data-step-index='" + step + "']").after('<tr id="weather-row"><td>THUNDAR!</td></tr>');
    }
    addMutationBack();
};

currentRoute = {
    result: '',
    weatherCoords: ''
};

function addRowsToDirections() {
    var addRowsMut = new MutationObserver(function (mutations) {
        addRowsMut.disconnect();
        pickfivepoints();
        ShowWeatherMarkers();
        addWeatherRows(function () {
            addRowsToDirections();
        });
    });
    addRowsMut.observe(document.getElementById('right-panel'), {
        attributes: true,
        childList: true,
        characterData: true
    });
}

$(document).ready(function () {
    addRowsToDirections();
})