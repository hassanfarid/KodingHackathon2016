var log = function (message) {
    if (g_loggingEnabled)
        console.log(message);
};
var g_loggingEnabled = true; // to control JS console logs across application [false, true]

(function () {

    angular.module('Application', ['ngRoute', 'ngMaterial', 'ngMessages', 'ui.router', 'angular-jqcloud'])
        .config(['$routeProvider', '$httpProvider', '$mdThemingProvider', '$mdIconProvider', '$stateProvider', '$urlRouterProvider',
            function ($routeProvider, $httpProvider, $mdThemingProvider, $mdIconProvider, $stateProvider, $urlRouterProvider) {
                $mdIconProvider.fontSet('fa', 'fontawesome');
                $mdIconProvider
                    .iconSet('social', 'assets/images/social-icons.svg', 24)
                    .iconSet('device', 'assets/images/device-icons.svg', 24)
                    .iconSet('call', 'assets/images/communication-icons.svg', 24)
                    .defaultIconSet('assets/images/core-icons.svg', 24);

                $mdThemingProvider.definePalette('applicationPalette', {
                    '50': 'FFEDE7',
                    '100': 'FFD4C5',
                    '200': 'FFBBA3',
                    '300': 'FF9E7D',
                    '400': 'FF8A61',
                    '500': '7E57C2',
                    '600': 'E86B3F',
                    '700': 'CF5F38',
                    '800': 'B55331',
                    '900': '853D24',
                    'A100': 'f2e4df',
                    'A200': '303F9F',
                    'A400': '303F9F',
                    'A700': '303F9F',
                    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                    // on this palette should be dark or light
                    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                        '200', '300', '400', 'A100'],
                    'contrastLightColors': undefined    // could also specify this if default was 'dark'
                });

                $mdThemingProvider.theme('default')
                    .primaryPalette('applicationPalette', {
                        'default': '500', // by default use shade 400 from the pink palette for primary intentions
                        'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                        'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                        'hue-3': 'A700' // use shade A100 for the <code>md-hue-3</code> class
                    })
                    .accentPalette('deep-purple')
                    .backgroundPalette('grey');

                // Add Auth HTTP Interceptor for X-Auth-Token and X-Auth-UserId
                //$httpProvider.interceptors.push('authInterceptor');

                $httpProvider.defaults.useXDomain = true;

                var requireAuthentication = function (paramCount) {
                    return {
                        load: function ($q, $location, appService) {
                           
                        }
                    };
                };


                /*
                 * Routes
                 */
                $stateProvider
                    .state('guest', {
                        abstract: true,
                        templateUrl: 'guest-master-page.html',
                    })
                    .state('login', {
                        url: '/login',
                        parent: 'guest',
                        templateUrl: 'app/login-signup/login-signup-template.html',
                        controller: 'LoginSignupController'
                    })
                    .state('guestResponsive', {
                        abstract: true,
                        templateUrl: 'responsive-master-page.html',
                    })
                    .state('verifyEmail', {
                        url: '/user-services/verify/:token',
                        parent: 'guestResponsive',
                        templateUrl: 'app/email-verification/email-verification-template.html',
                        controller: 'EmailVerificationController'
                    })
                    .state('resetPassword', {
                        url: '/user-services/password/change/:token',
                        parent: 'guestResponsive',
                        templateUrl: 'app/reset-password/reset-password-template.html',
                        controller: 'ResetPasswordController'
                    })
                
                //Authenticated User States
                    .state('loggedIn', {
                        templateUrl: 'master-page.html',
                        abstract: true,
                    })
                    .state('dashboard', {
                        parent: 'loggedIn',
                        url: '/dashboard',
                        templateUrl: 'app/dashboard/dashboard-template.html',
                        controller: 'DashboardController',
                        //resolve: requireAuthentication()
                    })
                    .state('event', {
                        parent: 'loggedIn',
                        url: '/event',
                        templateUrl: 'app/event/event-template.html',
                        controller: 'EventController',
                        //resolve: requireAuthentication()
                    })
                    .state('event_view', {
                        parent: 'loggedIn',
                        url: '/event/:id',
                        templateUrl: 'app/event/event-template.html',
                        controller: 'EventController',
                        //resolve: requireAuthentication()
                    })
                    .state('changePassword', {
                        parent: 'loggedIn',
                        url: '/user-services/password/change',
                        templateUrl: 'app/user-services/change-password-template.html',
                        controller: 'ChangePasswordController',
                        resolve: requireAuthentication()
                    })
                    .state('feedback', {
                        parent: 'loggedIn',
                        url: '/feedback',
                        templateUrl: 'app/feedback/feedbackPage.html',
                        controller: 'RatingController',
                        resolve: requireAuthentication()
                    });

                $urlRouterProvider.otherwise('/login');

            }]);
})();