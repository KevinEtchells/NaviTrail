/*global Vue*/
/*global mapStartLocation*/

var vm,
    changePage,
    dbTrails;

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
                username: "",
                password: ""
            },
            trails: []
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
                return selectedTrail;
            }
        },
        methods: {
            changePage: function (event, level1, level2) {
                event.preventDefault();
                event.stopPropagation();
                changePage(level1, level2, true);
            },
            signUp: function () {
                window.console.log("sign-up");
            }
        }
    });

}());
