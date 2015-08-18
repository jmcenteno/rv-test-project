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