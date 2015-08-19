/**
 * AngularJS module
 */

// define the module
var app = angular.module('WidgetSpa', [
    //'ngRoute'
    'ui.router'
]);

// Application constants
app.constant('API_URL', 'http://spa.tglrw.com:4000');

// Boostrap the application
app.run(['$rootScope',
    function ($rootScope) {
        
    }
]);
/**
 * App configuration
 * Set routes and interceptors heres
 */

app.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        
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
        
    }
]);
/**
 * Services
 * Place all application services and factories here
 */


/**
 * _users Factory
 *
 * AngularJS service to request user data from remote API
 * @returns     (object) An object with methods to obtain collections or single records
 */
app.factory('_users', ['$http', 'API_URL',
    function ($http, API_URL) {
        
        var users = {};
        
        /**
         * Get all users
         * @returns {array} Collection of user objects
         */
        users.getAllUsers = function () {
            return $http.get(API_URL + '/users').then(function (response) {
                return response.data;
            });
        };
        
        /**
         * Get one user
         * @param   {int} id User ID
         * @returns {object} User object
         */
        users.getUser = function (id) {
            return $http.get(API_URL + '/users/' + id).then(function (response) {
                return response.data;
            });
        };
        
        return users;
        
    }
]);

/* *
 * _widgets Factory
 *
 * AngularJS service to request widget data from remote API
 * @returns     (object) An object with methods to obtain collections, single records, and to modify records
 */
app.factory('_widgets', ['$http', 'API_URL',
    function ($http, API_URL) {
        
        var widgets = {};
        
        /**
         * Get all widgets
         * @returns {array} Collection of widget objects
         */
        widgets.getAllWidgets = function () {
            return $http.get(API_URL + '/widgets').then(function (response) {
                return response.data;
            });
        };
        
        /**
         * Get on widget
         * @param   {int} id Widget ID
         * @returns {object} Widget object
         */
        widgets.getWidget = function (id) {
            return $http.get(API_URL + '/widgets/' + id).then(function (response) {
                return response.data;
            });
        };
        
        /**
         * Create a new widget
         * @param   {object} params Object with all properties that make a single widget
         * @returns {string} Response from the API
         */
        widgets.createWidget = function (params) {
            return $http.post(API_URL + '/widgets', params).then(function (response) {
                return response.data;
            });
        };
        
        /**
         * Edit an existing widget
         * @param   {int} id     Widget ID
         * @param   {object} params Object with all properties that a make a single widget
         * @returns {string} Response from API
         */
        widgets.editWidget = function (id, params) {
            return $http.put(API_URL + '/widgets/' + id, params).then(function (response) {
                return response.data;
            });
        };
        
        /**
         * Generate a list of colors from existing widgets
         * @returns {array} Collection with unique color values
         */
        widgets.getColorOptions = function () {
            return $http.get(API_URL + '/widgets').then(function (response) {
                
                var colors = [];
                
                if (response.data) {
                    
                    angular.forEach(response.data, function (item) {
                        if (colors.indexOf(item.color) == -1) {
                            colors.push(item.color)
                        }
                    });
                    
                    colors = colors.sort();
                    
                } 
                
                return colors;

            });
        };
        
        return widgets;
        
    }
]);
/*
 * Controllers
 * Place all application controllers here
 */

// Global controller
app.controller('MainCtrl', ['$scope',
    function ($scope) {
        
        // set current year for display
        var d = new Date();
        $scope.year = d.getFullYear();
        
    }
]);

// Home page controller
app.controller('DashboardCtrl', ['$scope', '_users', '_widgets',
    function ($scope, _users, _widgets) {
        
        $scope.usersTotal = 0;
        $scope.widgetsTotal = 0;
        
        // get all users
        _users.getAllUsers().then(function (data) {
            $scope.users = data;
            $scope.usersTotal = data.length;
        });
        
        // get all widgets
        _widgets.getAllWidgets().then(function (data) {
            $scope.widgets = data;
            $scope.widgetsTotal = data.length;
        });
        
        // set the page title
        $scope.$parent.pageTitle = 'Dashboard';
        
        // set page breadcrumbs
        $scope.$parent.breadcrumb = [
            {
                text: 'Home',
                href: null
            }
        ];
        
    }
]);

// Users list view controller
app.controller('UsersCtrl', ['$scope', '_users',
    function ($scope, _users) {
        
        // get all users
        _users.getAllUsers().then(function (data) {    
            $scope.users = data;
        });
        
        // set the page title
        $scope.$parent.pageTitle = 'Users';
        
        // set page breadcrumbs
        $scope.$parent.breadcrumb = [
            {
                text: 'Home',
                href: '/#/'
            },
            {
                text: 'Users',
                href: null
            }
        ];
        
    }
]);

// User details view controller
app.controller('UserDetailsCtrl', ['$scope', '_users', '$stateParams',
    function ($scope, _users, $stateParams) {
        
        // set the page title
        $scope.$parent.pageTitle = 'Users';
        
        // get the requested user
        _users.getUser($stateParams.id).then(function (data) {    
            
            $scope.user = data;
            
            // set page breadcrumbs
            $scope.$parent.breadcrumb = [
                {
                    text: 'Home',
                    href: '/#/'
                },
                {
                    text: 'Users',
                    href: 'users'
                },
                {
                    text: data.name,
                    href: null
                }
            ];
            
        });
        
    }
]);

// Widgets list view controller
app.controller('WidgetsCtrl', ['$scope', '_widgets', '$timeout',
    function ($scope, _widgets, $timeout) {
        
        // set the page title
        $scope.$parent.pageTitle = 'Dashboard';
        
        // set page breadcrumbs
        $scope.$parent.breadcrumb = [
            {
                text: 'Home',
                href: '/#/'
            },
            {
                text: 'Widgets',
                href: null
            }
        ];
        
        _widgets.getAllWidgets().then(function (data) {
            $scope.widgets = data;
        });
        
        _widgets.getColorOptions().then(function (data) {
            $scope.colors = data;
        });
        
        $scope.processing = false;
        
        // resets widget object and form to a default state
        $scope.resetForm = function () {
            $scope.widget = {
                name: null,
                color: null,
                price: 0.01,
                melts: false,
                inventory: 0
            };
        };
        
        $scope.resetForm();
        
        // called when form is submitted
        $scope.create = function () {
            
            $scope.processing = true;
            
            _widgets.createWidget($scope.widget).then(function (data) {
                
                $scope.processing = false;
                $scope.recordModified = true;
                $scope.resetForm();
                
                _widgets.getAllWidgets().then(function (data) {
                    $scope.widgets = data;
                });
                
                $timeout(function () {
                    $scope.recordModified = false;
                }, 10 * 1000);
                
            }, function () {
                
                $scope.processing = false;
                $scope.error = true;
                
                $timeout(function () {
                    $scope.error = false;
                }, 10 * 1000);
                
            });
            
            return false;
            
        };
        
    }
]);

// Widget details view controller
app.controller('WidgetDetailsCtrl', ['$scope', '_widgets', '$stateParams', '$timeout',
    function ($scope, _widgets, $stateParams, $timeout) {
        
        // set page breadcrumbs
        $scope.$parent.pageTitle = 'Widgets';
        
        // get the requested widget
        _widgets.getWidget($stateParams.id).then(function (data) {
            
            $scope.widget = data;
            $scope.widget.price = parseFloat($scope.widget.price);
            
            // set page breadcrumbs
            $scope.$parent.breadcrumb = [
                {
                    text: 'Home',
                    href: '/#/'
                },
                {
                    text: 'Widgets',
                    href: 'widgets'
                },
                {
                    text: data.name,
                    href: null
                }
            ];
            
        });
        
        // get all color options
        _widgets.getColorOptions().then(function (data) {
            $scope.colors = data;
        });
        
        $scope.processing = false;
        
        // update requested widget
        $scope.save = function () {
                
            var params = angular.copy($scope.widget);
            delete params.id;
            
            $scope.processing = true;
            
            _widgets.editWidget($scope.widget.id, params).then(function (data) {
                
                $scope.processing = false;
                $scope.recordModified = true;
                
                $timeout(function () {
                    $scope.recordModified = false;
                }, 10 * 1000);
            
            }, function () {
                
                $scope.processing = false;
                $scope.error = true;
                
                $timeout(function () {
                    $scope.error = false;
                }, 10 * 1000);
                
            });
            
            return false;
            
        };
        
    }
]);
/**
 * Directives
 * Place all custom directives here
 */

//Generate breadcrumb navigation
app.directive('breadcrumb', [
    function () {
        
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                
                scope.$watch(function () {
                    return scope.breadcrumb;
                }, function (value) {
                    
                    if (angular.isArray(value)) {
                        
                        element.html('');
                        var breadcrumb = [];
                        
                        angular.forEach(value, function (item) {
                            
                            if (item.href != null) {
                                
                                breadcrumb.push('<a href="' + item.href + '">' + item.text + '</a>');
                                
                            } else {
                                
                                breadcrumb.push(item.text);
                                
                            }
                            
                        });
                    
                        element.html(breadcrumb.join(' / '));
                        
                    }
                    
                });
                
            }
        };
        
    }
]);

// Wrapper directive to use jQuery to animate values and display them as they change with an easing method
app.directive('animateValue', [
    function () {
        
        return {
            restrict: 'A',
            scope: {
                total: '=animateValue'
            },
            link: function (scope, element, attrs) {
                
                scope.$watch(function () {
                    
                    return scope.total;
                    
                }, function (newValue, oldValue) {
                    
                    angular.element({ value: oldValue }).animate({
                        value: newValue
                    }, {
                        duration: 3000,
                        easing: 'swing',
						step: function () {
							element.text(Math.ceil(this.value));
						}
                    });
                    
                });
                
            }
        };
        
    }
])

// Show a loading animation
app.directive('loading', [
    function () {
        
        return {
            restrict: 'A',
            scope: {},
            templateUrl: 'partials/directives/loading.html'
        };
        
    }
]);

// List users in a HTML table
app.directive('listUsers', [
    function () {
        
        return {
            restrict: 'A',
            templateUrl: 'partials/directives/list-users.html',
            replace: true,
            scope: {
                users: '=listUsers'
            },
            controller: function ($scope, $window) {
                
                // table sorting
                $scope.sortType     = 'name';
                $scope.sortReverse  = false;
                
            }
        };
        
    }
]);

// List widgets in a HTML table
app.directive('listWidgets', [
    function () {
        
        return {
            restrict: 'A',
            templateUrl: 'partials/directives/list-widgets.html',
            replace: true,
            scope: {
                widgets: '=listWidgets',
                simpleView: '=simpleView'
            },
            controller: function ($scope, $window) {
                
                // table sorting
                $scope.sortType     = 'name';
                $scope.sortReverse  = false;
                
            }
        };
        
    }
]);

// Modal with a form to create new widgets
app.directive('widgetCreate', ['_widgets',
    function (_widgets) {
        
        return {
            restrict: 'A',
            templateUrl: 'partials/directives/widget-create.html',
            replace: true
        };
        
    }
]);

// Back button
app.directive('backButton', ['$state',
    function ($state) {
        
        return {
            restrict: 'A',
            templateUrl: 'partials/directives/back-button.html',
            replace: true,
            scope: {},
            link: function (scope, element, attrs) {
                
                scope.config = scope.$eval(attrs.backButton);
                
                scope.go = function (state, options) {
                    $state.go(state, options);
                };
                
            }
        };
        
    }
]);
/**
 * Filters
 * Place all custom filters here
 */

/**
 * Filter duplicate values from an array
 * @returns {array} Array with unique values
 */
app.filter('unique', [
    function () {

        return function (items, filterOn) {

            if (filterOn === false) {
                return items;
            }

            if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {

                var hashCheck = {}, newItems = [];

                var extractValueToCompare = function (item) {
                    if (angular.isObject(item) && angular.isString(filterOn)) {
                        return item[filterOn];
                    } else {
                        return item;
                    }
                };

                angular.forEach(items, function (item) {

                    var valueToCheck, isDuplicate = false;

                    for (var i = 0; i < newItems.length; i++) {
                        if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                            isDuplicate = true;
                            break;
                        }
                    }

                    if (!isDuplicate) {
                        newItems.push(item);
                    }

                });

                items = newItems;
            
            }
            
            return items;
            
        };

    }
]);