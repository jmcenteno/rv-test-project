var app = angular.module('WidgetSpa', [
    'ui.router'
]);

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        
        // declare application states (routes)
        $stateProvider
        
        .state('dashboard', {
            url: '/',
            templateUrl: 'partials/dashboard.html',
            controller: 'DashboardCtrl'
        })
        
        .state('users', {
            url: '/users',
            templateUrl: 'partials/users.html',
            controller: 'UsersCtrl'
        })
        
        .state('users.single', {
            url: '/users/:id',
            templateUrl: 'partials/users-single.html',
            controller: 'UsersCtrl'
        })
        
        .state('widgets', {
            url: '/widgets',
            templateUrl: 'partials/widgets.html',
            controller: 'WidgetsCtrl'
        })
        
        .state('widgets.single', {
            url: '/widgets/:id',
            templateUrl: 'partials/widgets-single.html',
            controller: 'WidgetsCtrl'
        });
        
        // redirect to dashboard if requested state is not defined
        $urlRouterProvider.otherwise('/');
        
    }
]);

app.constant('API_URL', 'http://spa.tglrw.com:4000');

app.run(['$rootScope',
    function($rootScope) {
        
    }
]);

/*
 * _users Factory
 *
 * AngularJS service to request user data from remote API
 * @returns     (object) An object with methods to obtain collections or single records
 */
app.factory('_users', ['$http', 'API_URL',
    function($http, API_URL) {
        
        var users = {};
        
        users.getAllUsers = function() {
            return $http.get(API_URL + '/users').then(function(response) {
                return response.data;
            });
        };
        
        users.getUser = function(id) {
            return $http.get(API_URL + '/users/' + id).then(function(response) {
                return response.data;
            });
        };
        
        return users;
        
    }
]);

/*
 * _widgets Factory
 *
 * AngularJS service to request widget data from remote API
 * @returns     (object) An object with methods to obtain collections, single records, and to modify records
 */
app.factory('_widgets', ['$http', 'API_URL',
    function($http, API_URL) {
        
        var widgets = {};
        
        widgets.getAllWidgets = function() {
            return $http.get(API_URL + '/widgets').then(function(response) {
                return response.data;
            });
        };
        
        widgets.getWidget = function(id) {
            return $http.get(API_URL + '/widgets/' + id).then(function(response) {
                return response.data;
            });
        };
        
        widgets.createWidget = function(params) {
            return $http.post(API_URL + '/widgets', params).then(function(response) {
                return response.data;
            });
        };
        
        widgets.getWidget = function(id, params) {
            return $http.put(API_URL + '/widgets/' + id, params).then(function(response) {
                return response.data;
            });
        };
        
        return widgets;
        
    }
]);

