appViewModel = function () {
    addWeatherRows();

}

pickfivepoints = function () {
    // console.log("picking 5 equidistant points on route");
    var polyDots = results.routes[0].overview_path.length;
    var waypoints = polyDots / 5;
    for (var i = 0; i < polyDots; i += waypoints) {
        myLatLng = new google.maps.LatLng({
            'lat': results.routes[0].overview_path[i].lat(),
            'lng': results.routes[0].overview_path[i].lng()
        });
        step = findStepForWeatherCoord(myLatLng);
        // console.log(step);
        weatherCoords[i] = {
            step: step,
            'lat': results.routes[0].overview_path[i].lat(),
            'lng': results.routes[0].overview_path[i].lng()
        };
    }
};
findStepForWeatherCoord = function (weatherCoord) {
    // console.log("finding which steps correspond to latlngs");
    tripSteps = results.routes[0].legs[0].steps;

    for (step in tripSteps) {
        stepPoly = new google.maps.Polyline({
            path: tripSteps[step].lat_lngs
        });
        if (google.maps.geometry.poly.containsLocation(weatherCoord, stepPoly) == true) {
            return (step);
        }
    }
};


addWeatherRows = function () {
    for (coord in weatherCoords) {
        var step = Number(weatherCoords[coord].step);

        // adding this way adds literal text instead of DOM objects
        // $('table.adp-directions>tbody>tr')[step].outerHTML = '<tr><td>THUNDAR!</td></tr>';
        $("tr[data-step-index='" + step + "']").after('<tr><td>THUNDAR!</td></tr>');
        console.log(step);
        // console.log($("tr[data-step-index='" + step + "']"));
        // this way the rows are properly added
        $('table.adp-directions>tbody>tr').after(function (index, html) {
            if (index == step) {
                return ('<tr><td>THUNDAR!</td></tr>')
            }
        });
    }
};

$(document).ready(function () {
    console.log("document is ready.")
    // console.log(document.getElementById('right-panel'));
    var addRowsMut = new MutationObserver(function (mutation) {
        console.log("mutation observer callback function()");
        pickfivepoints();
        // console.log("Adding rows w/ weather");
        addWeatherRows();
    });
    addRowsMut.observe(document.getElementById('right-panel'), {
        attributes: true,
        childList: true,
        characterData: true
    });
});
