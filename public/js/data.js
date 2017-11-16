/*global firebase*/
/*global vm*/
/*global dbTrails*/

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

    // Enable offline data
    firebase.firestore().enablePersistence().then(function () {

        dbTrails = firebase.firestore().collection("trails");

        // realtime db updates
        dbTrails.onSnapshot(function (querySnapshot) {
            vm.trails = querySnapshot.docs;
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