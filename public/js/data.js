/*global firebase*/
/*global vm*/
/*global dbTrails*/
/*global dbUsers*/
/*global changePage*/

var initData = function () {
    
    "use strict";
    
    // Initialize Firebase
    firebase.initializeApp({
        apiKey: "AIzaSyB2vL8IVwsO-IYxbhFZgZzG_Z9gFDNPPUM",
        authDomain: "geo-adventures.firebaseapp.com",
        databaseURL: "https://geo-adventures.firebaseio.com",
        projectId: "geo-adventures",
        storageBucket: "geo-adventures.appspot.com",
        messagingSenderId: "308561790550"
    });
    
    // Authentication
    firebase.auth().onAuthStateChanged(function (user) {

        vm.user = user;
        
        // if signing-up, add user doc
        if (user && vm.page.level1 === "signup" && vm.signup.username !== "") {
            console.log("check 1");
            dbUsers.doc(user.uid).set({
                username: vm.signup.username
            });
        }

        // move on from sign in/up page if successfully logged in
        if (user && (vm.page.level1 === "siginin" || vm.page.level1 === "signup")) {
            changePage("welcome", "", true);
        }

    });


    // Enable offline data
    firebase.firestore().enablePersistence().then(function () {

        dbTrails = firebase.firestore().collection("trails");
        dbUsers = firebase.firestore().collection("users");

        // realtime db updates
        dbTrails.onSnapshot(function (querySnapshot) {
            vm.trails = querySnapshot.docs;
        });
        
        dbUsers.onSnapshot(function (querySnapshot) {
            vm.users = querySnapshot.docs;
        });

    }).catch(function (err) {
        if (err.code === "failed-precondition") {
            window.console.log("Multiple tabs open - offline data failed");
        } else if (err.code === "unimplemented") {
            window.console.log("Browser not supported - offline data failed");
        }
    });
    
};

initData();