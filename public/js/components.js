/*global Vue*/
/*global google*/

(function () {
    
    "use strict";
    
    Vue.component("google-map", {
        props: ["latitude", "longitude", "zoom", "zone"],
        template: '<div class="map"></div>',
        data: function () {
            return {
                map: null,
                marker: null
            };
        },
        watch: {
            latitude: function (val) {
                this.marker.setPosition({lat: parseFloat(this.latitude) || 0, lng: parseFloat(this.longitude) || 0});
            },
            longitude: function (val) {
                this.marker.setPosition({lat: parseFloat(this.latitude) || 0, lng: parseFloat(this.longitude) || 0});
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

            google.maps.event.addListener(this.map, "click", function (event) {
                if (window.confirm("Set new position?")) {
                    self.$emit("position", event.latLng.lat(), event.latLng.lng(), self.zone);
                }
            });
        }
    });
    
}());