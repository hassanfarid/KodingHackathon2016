(function () {
    angular.module('Application').factory('appService', ["$window", function ($window) {

        /* Global Variables */
        var appServiceVariables = {
            elasticURL: "https://43e5a5e45fbb9d7eb1124f5970a5eb5c.us-west-1.aws.found.io:9243",
            event: {},
            userRole: "guest", // to track user role [guest, patient, physician, nurse, radiologist, admin]
            loginMode: "internal", // to track mode of login [internal, google-plus, facebook]
            userProfile: {},
            userData: {},
            toastDetails: {},
            firstLoad: true
        };
        /* End of Global Variables */

        // Incase of first load or browser refresh
        if (appServiceVariables.firstLoad) {

            //var isLoggedIn = getCookie("isLoggedIn");

            // If variable in Local Storage exists, load from it
            if (localStorage.appServiceVariables != null) {
                // always use URL from file
                var elasticURL = appServiceVariables.elasticURL;

                appServiceVariables = JSON.parse(localStorage.appServiceVariables);

                appServiceVariables.elasticURL = elasticURL;
            }

            // Add mutation watcher on appServiceVariables, incase of change update in localStorage
            watch(appServiceVariables, function (prop, action, newvalue, oldvalue) {
                //log("appServiceVariables changed");
                //log(prop);
                localStorage.appServiceVariables = JSON.stringify(appServiceVariables);
                document.cookie="isLoggedIn=" + appServiceVariables.isLoggedIn;
            });

            appServiceVariables.firstLoad = false;
        }
        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
            }
            return "";
        }

        return appServiceVariables;
    }]);
})();
