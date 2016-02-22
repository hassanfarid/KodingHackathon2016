(function () {
    angular.module('Application').controller('ApplicationController',
        ['$scope', '$mdToast', '$timeout', '$mdSidenav', '$location', '$mdMedia', '$templateCache', 'appService',
            function ($scope, $mdToast, $timeout, $mdSidenav, $location, $mdMedia, $templateCache, appService) {

                // remove all template cache
                $templateCache.removeAll();
                
                $scope.message = "Message from Controller";

                $scope.mdMedia = $mdMedia;

                $scope.appService = function () {
                    return appService;
                };
                
                // For ng-click Rediredcts
                $scope.redirect = function (path) {
                    $location.path(path);
                };
                
                $scope.lockOpenSideNav = function () {
                    return ($location.path().indexOf('/signout') != 0) && $mdMedia('gt-sm');
                };
                
                $scope.toggleSidenav = function (menuId) {
                    $mdSidenav(menuId).toggle();
                };


            }]);
})();
