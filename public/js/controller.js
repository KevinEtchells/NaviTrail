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
            }
        }
    });

}());
