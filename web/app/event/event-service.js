(function () {
    angular.module('Application').service('eventService', ['$http', '$q', '$timeout', '$location', 'appService',
        function ($http, $q, $timeout, $location, appService) {

            // [POST] Create Event
            this.createEvent = function (event) {
                var payload = angular.copy(event);
                payload.updatedOn = new Date();
                delete payload._id;
                return $http.post(appService.elasticURL + '/event_details/log/', angular.toJson(payload));
            };
        
            // [POST] Update Event
            this.updateEvent = function (event) {
                var payload = angular.copy(event);
                payload.updatedOn = new Date();
                delete payload._id;
                return $http.post(appService.elasticURL + '/event_details/log/' + event._id, angular.toJson(payload));
            };
        
            // [POST] Get Event
            this.getEvent = function (event_id) {
                var query = {
                    "query": { "match": { "_id": event_id } },
                    "size": 1
                };

                return $http.post(appService.elasticURL + '/event_details/_search', angular.toJson(query));
            };


        }]);
})();
