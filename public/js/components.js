/*global Vue*/
/*global google*/

(function () {
    
    "use strict";
    
    Vue.component("google-map", {
        props: ["latitude", "longitude", "zoom", "zone", "currentlatitude", "currentlongitude"], // "zone" is used to pass back into event handler so correct zone is updated
        template: '<div class="map"></div>',
        data: function () {
            return {
                map: null,
                marker: null,
                currentLocationMarker: null
            };
        },
        watch: {
            latitude: function (val) {
                this.marker.setPosition({lat: parseFloat(this.latitude) || 0, lng: parseFloat(this.longitude) || 0});
            },
            longitude: function (val) {
                this.marker.setPosition({lat: parseFloat(this.latitude) || 0, lng: parseFloat(this.longitude) || 0});
            },
            currentlatitude: function (val) {
                this.currentLocationMarker.setPosition({lat: this.currentlatitude, lng: this.currentlongitude});
            },
            currentlongitude: function (val) {
                this.currentLocationMarker.setPosition({lat: this.currentlatitude, lng: this.currentlongitude});
            }
        },
        mounted: function () {
            
            var self = this;
            
            this.map = new google.maps.Map(this.$el, {
                zoom: this.zoom || 16,
                center: {
                    lat: parseFloat(this.latitude) || 0,
                    lng: parseFloat(this.longitude) || 0
                }
            });
            
            this.marker = new google.maps.Marker({
                position: {
                    lat: parseFloat(this.latitude) || 0,
                    lng: parseFloat(this.longitude) || 0
                },
                map: self.map
            });
            
            //if (this.showCurrentLocation) {
            this.currentLocationMarker = new google.maps.Marker({
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 9,
                    strokeColor: 'blue',
                    strokeWeight: 2,
                    fillColor: 'blue',
                    fillOpacity: 0.4
                },
                map: self.map
            });
            //}

            google.maps.event.addListener(this.map, "click", function (event) {
                if (self.zone >= 0 && window.confirm("Set new position?")) {
                    self.$emit("position", event.latLng.lat(), event.latLng.lng(), self.zone);
                }
            });
        }
    });
    
}());
