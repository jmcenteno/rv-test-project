var app = angular.module('WidgetSpa', [
    'ngRoute'
]);

app.constant('API_URL', 'http://spa.tglrw.com:4000');

app.run(['$rootScope',
    function($rootScope) {
        
    }
]);
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
        
        widgets.editWidget = function(id, params) {
            return $http.put(API_URL + '/widgets/' + id, params).then(function(response) {
                return response.data;
            });
        };
        
        return widgets;
        
    }
]);
app.controller('MainCtrl', ['$scope',
    function($scope) {
        
        var d = new Date();
        
        $scope.year = d.getFullYear();
        
    }
]);

app.controller('DashboardCtrl', ['$scope', '_users', '_widgets',
    function($scope, _users, _widgets) {
        
        _users.getAllUsers().then(function(data) {
            $scope.users = data;
        });
        
        _widgets.getAllWidgets().then(function(data) {
            $scope.widgets = data;
        });
        
        $scope.$parent.pageTitle = 'Dashboard';
        $scope.$parent.breadcrumb = [
            {
                text: 'Home',
                href: null
            }
        ];
        
    }
]);

app.controller('UsersCtrl', ['$scope', '_users',
    function($scope, _users) {
        
        _users.getAllUsers().then(function(data) {    
            $scope.users = data;
        });
        
        $scope.$parent.pageTitle = 'Dashboard';
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

app.controller('UserDetailsCtrl', ['$scope', '_users', '$routeParams',
    function($scope, _users, $routeParams) {
        
        $scope.$parent.pageTitle = 'Dashboard';
        
        _users.getUser($routeParams.id).then(function(data) {    
            
            $scope.user = data;
            
            $scope.$parent.breadcrumb = [
                {
                    text: 'Home',
                    href: '/#/'
                },
                {
                    text: 'Users',
                    href: '/#/users'
                },
                {
                    text: data.name,
                    href: null
                }
            ];
            
        });
        
    }
]);

app.controller('WidgetsCtrl', ['$scope', '_widgets',
    function($scope, _widgets) {
        
        $scope.$parent.pageTitle = 'Dashboard';
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
        
        _widgets.getAllWidgets().then(function(data) {
            $scope.widgets = data;
        });
        
    }
]);

app.controller('WidgetDetailsCtrl', ['$scope', '_widgets', '$routeParams',
    function($scope, _widgets, $routeParams) {
        
        $scope.$parent.pageTitle = 'Dashboard';
        
        _widgets.getWidget($routeParams.id).then(function(data) {
            
            $scope.widget = data;
            
            $scope.$parent.breadcrumb = [
                {
                    text: 'Home',
                    href: '/#/'
                },
                {
                    text: 'Widgets',
                    href: '/#/widgets'
                },
                {
                    text: data.name,
                    href: null
                }
            ];
            
        });
        
    }
]);
app.directive('breadcrumb', [
    function() {
        
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                
                scope.$watch(function() {
                    return scope.breadcrumb;
                }, function(value) {
                    
                    if (angular.isArray(value)) {
                        
                        element.html('');
                        var breadcrumb = [];
                        
                        angular.forEach(value, function(item) {
                            
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

app.directive('loading', [
    function() {
        
        return {
            restrict: 'A',
            scope: {},
            templateUrl: 'partials/loading.html'
        };
        
    }
]);

app.directive('listUsers', [
    function() {
        
        return {
            restrict: 'A',
            templateUrl: 'partials/list-users.html',
            replace: true,
            scope: {
                users: '=listUsers'
            },
            controller: function($scope, $window) {
                
                $scope.go = function(id) {
                    $window.location.href = '/#/users/' + id;
                };
                
            }
        };
        
    }
]);

app.directive('listWidgets', [
    function() {
        
        return {
            restrict: 'A',
            templateUrl: 'partials/list-widgets.html',
            replace: true,
            scope: {
                widgets: '=listWidgets',
                simpleView: '=simpleView'
            },
            controller: function($scope, $window) {
                
                $scope.go = function(id) {
                    $window.location.href = '/#/widgets/' + id;
                };
                
            }
        };
        
    }
]);