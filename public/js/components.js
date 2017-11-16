(function () {
    
    "use strict";
    
    Vue.component("google-map", {
        props: ["latitude", "longitude", "zoom"],
        template: '<div class="map"></div>',
        mounted: function () {
            var map = new google.maps.Map(this.$el, {
                    zoom: this.zoom || 16,
                    center: {
                        lat: this.latitude,
                        lng: this.longitude
                    }
                }),
                marker = new google.maps.Marker({
                    position: {
                        lat: this.latitude,
                        lng: this.longitude
                    },
                    map: map
                });
        }
    });
    
}());