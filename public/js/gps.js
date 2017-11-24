/*global vm*/

(function () {
    
    "use strict";
    
    var TOLERANCE = 20,
        distanceBetweenPoints;
    
    // Distance between points
    (function () {

        var toRad = function (value) {
            return value * Math.PI / 180;
        };

        // Calculates straight-line distance in metres
        distanceBetweenPoints = function (coords1, coords2) {
            var R = 6371000,
                dLat = toRad(coords2.latitude - coords1.latitude),
                dLon = toRad(coords2.longitude - coords1.longitude),
                lat1 = toRad(coords1.latitude),
                lat2 = toRad(coords2.latitude),
                a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2),
                c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
                d = R * c;
            return d;
        };

    }());
    

    // continually update location
    navigator.geolocation.watchPosition(function (position) {
        window.console.log(position.coords);
        vm.currentPosition.latitude = position.coords.latitude;
        vm.currentPosition.longitude = position.coords.longitude;
        if (vm.selectedTrail) {
            vm.currentPosition.distance = distanceBetweenPoints(position.coords, vm.selectedTrail.zones[vm.currentPosition.nextZone]);
            if (vm.currentPosition.distance < TOLERANCE) {
                vm.currentPosition.inZone = true;
            }
        }
    }, function () {
        window.alert("GPS error - please ensure your GPS is switched on");
    }, {enableHighAccuracy: true});
    
}());
