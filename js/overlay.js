markerArray = [];

function ShowWeatherMarkers() {
    // clear current markers if any
    for (marker of markerArray) {
        marker.setVisible(false);
    }
    for (pathStep in currentRoute.weatherCoords) {
        var myLatLng = currentRoute.weatherCoords[pathStep].latlng;
        var marker = new google.maps.Marker;
        marker.setPosition(myLatLng);

        var infowindow = new google.maps.InfoWindow({maps: map, content: 'THUNDAR!', position: myLatLng})
        marker.addListener('click', function () {
            console.log('marker has been clicked');
            infowindow.open(map, marker);
        });

        marker.setMap(map);
        markerArray.push(marker);
    }


}