(function(){
	angular.module('Application').controller('ToastController', ['$scope', '$mdToast', 'appService', function ($scope, $mdToast, appService) {
		$scope.closeToast = function () {
			$mdToast.hide();
		};

		$scope.appService = function () {
			return appService;
		};

	}]);

})();
