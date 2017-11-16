/*global vm*/
/*global changePage*/

(function () {
    
    "use strict";
    
    changePage = function (level1, level2, store) {

        var h1 = document.querySelector("h1");
        
        vm.page.level1 = level1;
        vm.page.level2 = level2 || "";

        if (store) {
            history.pushState(null, null, window.location.origin + "/" + level1 + (level2 ? "-" + level2 : ""));
        }
        
        // Focus to top - visually and for screen readers
        window.scrollTo(0, 0);
        if (h1) {
            h1.focus();
        }

    };

    
    // HTML5 History - Load correct page depending on URL
    (function () {
        function setPage(store) {
            var pages = window.location.pathname.replace("/", "").replace(/%20/g, " ").split("-");
            changePage((pages.length && pages[0]) ? pages[0] : "welcome", pages.length >= 2 ? pages[1] : "", store);
        }
        setPage(true);
        window.addEventListener('popstate', function () {
            setPage();
        });
    }());
    
}());