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
        
        // get all users
        _users.getAllUsers().then(function (data) {
            $scope.users = data;
        });
        
        // get all widgets
        _widgets.getAllWidgets().then(function (data) {
            $scope.widgets = data;
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
app.controller('UserDetailsCtrl', ['$scope', '_users', '$routeParams',
    function ($scope, _users, $routeParams) {
        
        // set the page title
        $scope.$parent.pageTitle = 'Users';
        
        // get the requested user
        _users.getUser($routeParams.id).then(function (data) {    
            
            $scope.user = data;
            
            // set page breadcrumbs
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
app.controller('WidgetDetailsCtrl', ['$scope', '_widgets', '$routeParams', '$timeout',
    function ($scope, _widgets, $routeParams, $timeout) {
        
        // set page breadcrumbs
        $scope.$parent.pageTitle = 'Widgets';
        
        // get the requested widget
        _widgets.getWidget($routeParams.id).then(function (data) {
            
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
                    href: '/#/widgets'
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