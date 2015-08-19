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
                            
                            if (item.state != null) {
                                
                                breadcrumb.push('<a ui-sref="' + item.state + '">' + item.text + '</a>');
                                
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
                
                $scope.go = function (id) {
                    $window.location.href = '/#/users/' + id;
                };
                
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
                
                $scope.go = function (id) {
                    $window.location.href = '/#/widgets/' + id;
                };
                
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