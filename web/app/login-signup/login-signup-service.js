(function(){
    angular.module('Application').service('loginSignupService', ['$http','$q','$timeout','$location', 'appService', 
    function ($http,$q,$timeout,$location, appService) {

        // [POST] Login
        this.login = function (loginDTO) {
            return $http.post(appService.serviceURL + "login", angular.toJson(loginDTO));
        };
        
        // [GET] Get Events
        this.getEvents = function () {
            return $http.get(appService.elasticURL + '/event_details/_search?q=*&sort=updatedOn');
        };

    }]);
})();
