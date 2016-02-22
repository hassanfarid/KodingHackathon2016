(function () {
    angular.module('Application').service('toastService', ['$mdToast', 'appService', function ($mdToast, appService) {
        /* Toast */
        var last = {
            bottom: true,
            top: false,
            left: false,
            right: true
        };
        var toastPosition = angular.extend({}, last);
        this.getToastPosition = function () {
            last = sanitizePosition(toastPosition);
            return Object.keys(toastPosition)
                .filter(function (pos) {
                    return toastPosition[pos];
                })
                .join(' ');
        };
        function sanitizePosition(current) {

            if (current.bottom && last.top) current.top = false;
            if (current.top && last.bottom) current.bottom = false;
            if (current.right && last.left) current.left = false;
            if (current.left && last.right) current.right = false;
            return angular.extend({}, current);
        }
        // Toast Message
        this.toastMessage = function (message) {

            appService.toastDetails = {
                type: "message",
                message: message
            };

            $mdToast.show({
                controller: 'ToastController',
                templateUrl: 'app/common/toast/toast-template.html',
                //parent: $document[0].querySelector('#toastBounds'),
                hideDelay: 6000,
                position: this.getToastPosition()
            });
        };
        // Toast Error
        this.toastError = function (message) {

            appService.toastDetails = {
                type: "error",
                message: "Error: " + message
            };

            $mdToast.show({
                controller: 'ToastController',
                templateUrl: 'app/common/toast/toast-template.html',
                //parent: $document[0].querySelector('#toastBounds'),
                hideDelay: 6000,
                position: this.getToastPosition()
            });
        };
        // Toast Success
        this.toastSuccess = function (message) {

            appService.toastDetails = {
                type: "success",
                message: message
            };

            $mdToast.show({
                controller: 'ToastController',
                templateUrl: 'app/common/toast/toast-template.html',
                //parent: $document[0].querySelector('#toastBounds'),
                hideDelay: 6000,
                position: this.getToastPosition()
            });
        };
        
        // Toast with Controller
        this.toastWithController = function (controller, data) {
            $mdToast.show({
                controller: controller,
                locals: {
                    NotificationData: data
                },
                templateUrl: 'app/common/notification/toast-template.html',
                hideDelay: 6000,
                position: this.getToastPosition()
            });
        };
    }]);
})();
