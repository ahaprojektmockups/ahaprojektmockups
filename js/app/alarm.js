var map;
var directionsService;
var directionsDisplay;

function initMap() {
    var origin = {lat: 51.431911, lng: 6.789353};
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;

    map = new google.maps.Map(document.getElementById('alarm-map'), {
        center: origin,
        zoom: 14
    });

    directionsDisplay.setMap(map);

    showRoute();
}

function showRoute(){
    directionsService.route({
        origin: 'Forsthausweg 2, Duisburg, DE',
        destination: 'Sternbuschweg 103a, Duisburg, DE',
        travelMode: google.maps.TravelMode[$('#transportation-modes .active a').attr("data-transport")]
    }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

$(document).ready(function(){
    $('.card-button').click(function(){
        $('#card-call-button').removeClass('hidden')
    });

    $("#transportation-modes a").click(function(e){
        e.preventDefault();

        var mode = $(this).attr('data-transport');
        console.log("mode: " + mode);
        $('.active', $(this).parent().parent()).removeClass('active');
        $(this).parent().addClass('active');

        showRoute();

        return false;
    });
});