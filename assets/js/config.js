/**
 * App configuration
 * Set routes and interceptors heres
 */

app.config(function ($stateProvider, $urlRouterProvider) {

    // declare application states (routes)
    $stateProvider

    .state('dashboard', {
        url: '/',
        templateUrl: 'partials/pages/dashboard.html',
        controller: 'DashboardCtrl'
    })

    .state('users', {
        url: '/users',
        templateUrl: 'partials/pages/users.html',
        controller: 'UsersCtrl'
    })

    .state('userDetails', {
        url: '/users/:id',
        templateUrl: 'partials/pages/user-details.html',
        controller: 'UserDetailsCtrl'
    })

    .state('widgets', {
        url: '/widgets',
        templateUrl: 'partials/pages/widgets.html',
        controller: 'WidgetsCtrl'
    })

    .state('widgetDetails', {
        url: '/widgets/:id',
        templateUrl: 'partials/pages/widget-details.html',
        controller: 'WidgetDetailsCtrl'
    });

    // redirect to dashboard if requested state is not defined
    $urlRouterProvider.otherwise('/');

});