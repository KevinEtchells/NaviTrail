/*global vm*/
/*global dbUsers*/

var setPosition; // global, to enable testing

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
    
    
    setPosition = function (coords) {

        vm.currentPosition.latitude = coords.latitude;
        vm.currentPosition.longitude = coords.longitude;

        // check if in next zone
        if (vm.selectedTrail) {
            vm.currentPosition.distance = distanceBetweenPoints(coords, vm.selectedTrail.zones[vm.currentPosition.nextZone]);
            if (vm.currentPosition.distance < TOLERANCE) {
                vm.currentPosition.inZone = true;
                
                // if this is the last zone - add trail to users completed-trails, providing the user is signed-in
                if (vm.currentPosition.nextZone + 1 === vm.selectedTrail.zones.length && vm.user) {
                    vm.users.forEach(function (user) {
                        // TO DO: have a separate currentUser object, rather than having to iterate through all users. We may limit vm.users to just the top scorers and friends in future.
                        var completedTrails;
                        if (user.id === vm.user.uid) {
                            completedTrails = user.data().completedTrails || [];
                            if (completedTrails.indexOf(vm.page.level2) === -1) {
                                completedTrails.push(vm.page.level2);
                            }
                            dbUsers.doc(vm.user.uid).update({
                                completedTrails: completedTrails
                            });
                        }
                    });
                }
                
            }
        }
        
    };
    

    // continually update location
    navigator.geolocation.watchPosition(function (position) {
        setPosition(position.coords);
    }, function () {
        window.alert("GPS error - please ensure your GPS is switched on");
    }, {enableHighAccuracy: true});
    
}());
