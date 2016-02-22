(function () {
    angular.module('Application').controller('LoginSignupController',
        ['$scope', '$routeParams', '$location', '$window', '$mdDialog', 'appService', 'loginSignupService',
            function ($scope, $routeParams, $location, $window, $mdDialog, appService, loginSignupService) {

                $scope.login = function () {
                    $location.path('/dashboard');
                }

                $scope.events = [];
                $scope.words = [];

                loginSignupService.getEvents()
                    .success(function (data) {
                        for (var i = 0; i < data.hits.hits.length; i++) {
                            
                            $scope.events.push(data.hits.hits[i]._source);
                            $scope.words.push({
                                text: $scope.events[i].eventName,
                                weight: Math.floor((Math.random() * 10) + 1),
                                link: '#/event/' + data.hits.hits[i]._id
                            });
                        }
                    })
                    .error(function (error) {

                    })
                    .finally(function () {

                    });


                $scope.colors = ["#FF5722", "#FF8A65", "#388E3C", "#AFB42B", "#EF6C00", "#5D4037", "#66BB6A"];

            }]);

})();
