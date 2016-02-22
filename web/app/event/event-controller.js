(function () {
    angular.module('Application').controller('EventController',
        ['$scope', '$routeParams', '$stateParams', '$location', '$window', '$mdToast', '$mdDialog', 'appService', 'eventService', 'toastService',
            function ($scope, $routeParams, $stateParams, $location, $window, $mdToast, $mdDialog, appService, eventService, toastService) {

                $scope._id = $stateParams.id;

                $scope.event = {
                    _id: '',
                    eventName: '',
                    hashTag: [],
                    dimensions: [],
                    ignore: [],
                    updatedOn: '',
                    isNew: "1",
                    isActive: "1"
                };

                if ($scope._id != null) {
                    // Fetch Event, set in appService and View Dashboard
                    eventService.getEvent($scope._id)
                        .success(function (data) {
                            $scope.event = data.hits.hits[0]._source;
                            $scope.event._id = data.hits.hits[0]._id;
                            appService.event = angular.copy($scope.event);
                            $location.path('/dashboard');
                        })
                        .error(function (error) {
                            toastService.toastError(error);
                        })
                        .finally(function () {

                        });
                }
                else {
                    if (appService.event != null && appService.event.eventName != null) {
                        $scope.event = angular.copy(appService.event);
                    }

                    $scope.save = function () {
                    
                        // if not created create
                        if ($scope.event._id == '') {
                            eventService.createEvent($scope.event)
                                .success(function (data) {
                                    $scope.event._id = data._id;
                                    appService.event = angular.copy($scope.event);
                                    toastService.toastError("Created");
                                    $location.path('/dashboard');
                                })
                                .error(function (error) {
                                    toastService.toastError(error);
                                })
                                .finally(function () {

                                });
                        }
                        // else update
                        else {
                            $scope.event.isNew = false;
                            eventService.updateEvent($scope.event)
                                .success(function (data) {
                                    $scope.event._id = data._id; // redundant
                                    appService.event = angular.copy($scope.event);
                                    toastService.toastError("Updated");
                                    $location.path('/dashboard');
                                })
                                .error(function (error) {
                                    toastService.toastError(error);
                                })
                                .finally(function () {

                                });
                        }


                    };
                }



            }]);

})();
