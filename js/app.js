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
