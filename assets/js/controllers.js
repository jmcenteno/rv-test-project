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
        
        $scope.$parent.pageTitle = 'Users';
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
        
        $scope.$parent.pageTitle = 'Users';
        
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

app.controller('WidgetsCtrl', ['$scope', '_widgets', '$timeout',
    function($scope, _widgets, $timeout) {
        
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
        
        _widgets.getColorOptions().then(function(data) {
            $scope.colors = data;
        });
        
        $scope.processing = false;
        
        $scope.resetForm = function() {
            $scope.widget = {
                melts: false
            };
        };
        
        $scope.create = function() {
            
            $scope.processing = true;
            
            _widgets.createWidget($scope.widget).then(function(data) {
                
                $scope.processing = false;
                $scope.recordModified = true;
                $scope.resetForm();
                
                _widgets.getAllWidgets().then(function(data) {
                    $scope.widgets = data;
                });
                
                $timeout(function() {
                    $scope.recordModified = false;
                }, 10*1000);
                
            }, function() {
                
                $scope.processing = false;
                $scope.error = true;
                
                $timeout(function() {
                    $scope.error = false;
                }, 10*1000);
                
            });
            
            return false;
            
        };
        
    }
]);

app.controller('WidgetDetailsCtrl', ['$scope', '_widgets', '$routeParams', '$timeout',
    function($scope, _widgets, $routeParams, $timeout) {
        
        $scope.$parent.pageTitle = 'Widgets';
        
        _widgets.getWidget($routeParams.id).then(function(data) {
            
            $scope.widget = data;
            $scope.widget.price = parseFloat($scope.widget.price);
            
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
        
        _widgets.getColorOptions().then(function(data) {
            $scope.colors = data;
        });
        
        $scope.processing = false;
        
        $scope.save = function() {
                
            var params = angular.copy($scope.widget);
            delete params.id;
            
            $scope.processing = true;
            
            _widgets.editWidget($scope.widget.id, params).then(function(data) {
                
                $scope.processing = false;
                $scope.recordModified = true;
                
                $timeout(function() {
                    $scope.recordModified = false;
                }, 10*1000);
            
            }, function() {
                
                $scope.processing = false;
                $scope.error = true;
                
                $timeout(function() {
                    $scope.error = false;
                }, 10*1000);
                
            });
            
            return false;
            
        };
        
    }
]);