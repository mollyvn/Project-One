function initialize() {
    initMap();
    initAutocomplete();
}
var map, marker;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 35.9096484, lng: -78.8948735 },
        zoom: 8
    });
}
var placeSearch, autocomplete;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};
function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('autocomplete')), {
        types: ['geocode']
    });
    autocomplete.addListener('place_changed', fillInAddress);
}
// Need to link place changed to polling place with on click event of search button!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function fillInAddress() {
    var place = autocomplete.getPlace();
    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
    }
    else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
    }
    if (!marker) {
        marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });
    }
    else
        marker.setMap(null);
    marker.setOptions({
        position: place.geometry.location,
        map: map
    });
    for (var component in componentForm) {
        document.getElementById(component).value = '';
        document.getElementById(component).disabled = false;
    }
    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    // for (var i = 0; i < place.address_components.length; i++) {
    //   var addressType = place.address_components[i].types[0];
    //   if (componentForm[addressType]) {
    //     var val = place.address_components[i][componentForm[addressType]];
    //     document.getElementById(addressType).value = val;
    //   }
    // }
}
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}
