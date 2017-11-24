/*global Vue*/
/*global firebase*/

var vm,
    changePage,
    dbTrails,
    dbUsers;

(function () {
    
    "use strict";

    vm = new Vue({
        el: "#app",
        data: {
            page: {
                level1: "welcome",
                level2: ""
            },
            signin: {
                email: "",
                password: "",
                error: false
            },
            signup: {
                email: "",
                username: "",
                password1: "",
                password2: "",
                error: false
            },
            user: {},
            users: [],
            trails: [],
            currentPosition: {
                latitude: 0,
                longitude: 0,
                nextZone: 0,
                distance: 0,
                inZone: false
            }
        },
        computed: {
            selectedTrail: function () {
                var selectedTrail,
                    selectedId = this.page.level2;
                if (selectedId !== '') {
                    this.trails.forEach(function (trail) {
                        if (trail.id === selectedId) {
                            selectedTrail = trail;
                        }
                    });
                }
                if (selectedTrail) {
                    return selectedTrail.data();
                }
            },
            usernameTaken: function () {
                var newUsername = this.signup.username,
                    taken = false;
                this.users.forEach(function (user) {
                    if (user.data().username === newUsername) {
                        taken = true;
                    }
                });
                return taken;
            }
        },
        methods: {
            changePage: function (event, level1, level2) {
                event.preventDefault();
                event.stopPropagation();
                changePage(level1, level2, true);
            },
            signIn: function () {
                var self = this;
                self.signin.error = false;
                firebase.auth().signInWithEmailAndPassword(self.signin.email, self.signin.password).catch(function (error) {
                    window.console.log(error);
                    self.signin.error = true;
                });
            },
            signUp: function () {
                if (this.signup.username !== "" && this.signup.email.indexOf("@") !== -1 && this.signup.email.indexOf(".") !== -1 && this.signup.password1.length >= 6 && this.signup.password1 === this.signup.password2) {
                    this.signup.error = false;
                    firebase.auth().createUserWithEmailAndPassword(this.signup.email, this.signup.password1).catch(function (error) {
                        window.console.log(error);
                    });
                } else {
                    this.signup.error = true;
                }
            },
            updateTrail: function (trail) {
                dbTrails.doc(this.page.level2).update(trail);
            },
            removeZone: function (zoneIndex) {
                var zones = this.selectedTrail.zones;
                if (window.confirm("Are you sure you wish to remove this zone?")) {
                    zones.splice(zoneIndex, 1);
                    dbTrails.doc(this.page.level2).update({
                        zones: zones
                    });
                }
            },
            addZone: function (trail) {
                
                // use previous zone location as a starting point
                var previousZone = {};
                if (trail.zones.length) {
                    previousZone = trail.zones[trail.zones.length - 1];
                }
                
                trail.zones.push({
                    latitude: previousZone.latitude || 0,
                    longitude: previousZone.longitude || 0
                });

                dbTrails.doc(this.page.level2).update({
                    zones: trail.zones
                });
            },
            positionUpdate: function (lat, lng, zoneIndex) {
                var zones = this.selectedTrail.zones;
                zones[zoneIndex].latitude = lat;
                zones[zoneIndex].longitude = lng;
                dbTrails.doc(this.page.level2).update({
                    zones: zones
                });
            },
            nextZone: function () {
                vm.currentPosition.nextZone = vm.currentPosition.nextZone + 1;
                vm.currentPosition.inZone = false;
            }
        }
    });

}());
