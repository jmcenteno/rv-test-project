app.config(['$routeProvider',
    function($routeProvider) {
        
        // declare application states (routes)
        $routeProvider
        
        .when('/', {
            templateUrl: 'partials/dashboard.html',
            controller: 'DashboardCtrl'
        })
        
        .when('/users', {
            templateUrl: 'partials/users.html',
            controller: 'UsersCtrl'
        })
        
        .when('/users/:id', {
            templateUrl: 'partials/user-details.html',
            controller: 'UserDetailsCtrl'
        })
        
        .when('/widgets', {
            templateUrl: 'partials/widgets.html',
            controller: 'WidgetsCtrl'
        })
        
        .when('/widgets/:id', {
            templateUrl: 'partials/widget-details.html',
            controller: 'WidgetDetailsCtrl'
        })
        
        // redirect to dashboard if requested state is not defined
        .otherwise({
            redirectTo: '/'
        });
        
    }
]);