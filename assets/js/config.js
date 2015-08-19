/**
 * App configuration
 * Set routes and interceptors heres
 */

app.config(['$routeProvider',
    function ($routeProvider) {
        
        // declare application states (routes)
        $routeProvider
        
        .when('/', {
            templateUrl: 'partials/pages/dashboard.html',
            controller: 'DashboardCtrl'
        })
        
        .when('/users', {
            templateUrl: 'partials/pages/users.html',
            controller: 'UsersCtrl'
        })
        
        .when('/users/:id', {
            templateUrl: 'partials/pages/user-details.html',
            controller: 'UserDetailsCtrl'
        })
        
        .when('/widgets', {
            templateUrl: 'partials/pages/widgets.html',
            controller: 'WidgetsCtrl'
        })
        
        .when('/widgets/:id', {
            templateUrl: 'partials/pages/widget-details.html',
            controller: 'WidgetDetailsCtrl'
        })
        
        // redirect to dashboard if requested state is not defined
        .otherwise({
            redirectTo: '/'
        });
        
    }
]);