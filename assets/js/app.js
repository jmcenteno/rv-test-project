/**
 * AngularJS module
 */

// define the module
var app = angular.module('WidgetSpa', [
    'ui.router',
    'ngAnimate',
    'ngSanitize',
    'ngCookies'
]);

// Application constants
app.constant('API_URL', 'http://spa.tglrw.com:4000');

// Boostrap the application
app.run(['$rootScope',
    function ($rootScope) {

    }
]);