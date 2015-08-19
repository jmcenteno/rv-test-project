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