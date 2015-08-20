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
app.controller('DashboardCtrl', ['$scope', '_users', '_widgets', '$filter',
    function ($scope, _users, _widgets, $filter) {
        
        $scope.usersTotal = 0;
        $scope.widgetsTotal = 0;
        $scope.tblData = {};
        
        // get all users
        _users.getAllUsers().then(function (data) {
            
            $scope.usersTotal = data.length;
            
            data = data.map(function (item) {
                item.gravatar = '<img src="' + item.gravatar + '" alt="' + item.name + '">';
                item.sref = 'userDetails({ id: ' + item.id + '})';
                return item;
            });
            
            $scope.tblData.users = {
                title: 'Users',
                headers: [
                    {
                        label: 'ID',
                        field: 'id',
                        sortable: true
                    },
                    {
                        label: 'Name',
                        field: 'name',
                        sortable: true
                    },
                    {
                        label: 'Avatar',
                        field: 'gravatar',
                        sortable: false
                    }
                ],
                data: data,
                sortType: 'name',
                sortReverse: false,
                scrollable: true
            };
            
        });
        
        // get all widgets
        _widgets.getAllWidgets().then(function (data) {
            
            $scope.widgetsTotal = data.length;
            
            data = data.map(function (item) {
                
                item.price = $filter('currency')(item.price);
                item.melts = (item.melts ? 'Yes' : 'No');
                item.sref = 'widgetDetails({ id: ' + item.id + '})';
                
                return item;
                
            });
            
            $scope.tblData.widgets = {
                title: 'Widgets',
                headers: [
                    {
                        label: 'ID',
                        field: 'id',
                        sortable: true
                    },
                    {
                        label: 'Name',
                        field: 'name',
                        sortable: true
                    },
                    {
                        label: 'Color',
                        field: 'color',
                        sortable: true
                    }
                ],
                data: data,
                sortType: 'name',
                sortReverse: false,
                scrollable: true
            };
            
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
            
            data = data.map(function (item) {
                item.gravatar = '<img src="' + item.gravatar + '" alt="' + item.name + '">';
                item.sref = 'userDetails({ id: ' + item.id + '})';
                return item;
            });
            
            $scope.tblData = {
                title: 'Users',
                headers: [
                    {
                        label: 'ID',
                        field: 'id',
                        sortable: true
                    },
                    {
                        label: 'Name',
                        field: 'name',
                        sortable: true
                    },
                    {
                        label: 'Avatar',
                        field: 'gravatar',
                        sortable: false
                    }
                ],
                data: data,
                sortType: 'name',
                sortReverse: false
            };
            
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
app.controller('WidgetsCtrl', ['$scope', '_widgets', '$timeout', '$filter',
    function ($scope, _widgets, $timeout, $filter) {
        
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
            
            data = data.map(function (item) {
                item.price = $filter('currency')(item.price);
                item.melts = (item.melts ? 'Yes' : 'No');
                item.sref = 'widgetDetails({ id: ' + item.id + '})';
                return item;
            });
            
            $scope.tblData = {
                title: 'Widgets',
                headers: [
                    {
                        label: 'ID',
                        field: 'id',
                        sortable: true
                    },
                    {
                        label: 'Name',
                        field: 'name',
                        sortable: true
                    },
                    {
                        label: 'Color',
                        field: 'color',
                        sortable: true
                    },
                    {
                        label: 'Price',
                        field: 'price',
                        sortable: true
                    },
                    {
                        label: 'Melts?',
                        field: 'melts',
                        sortable: true
                    },
                    {
                        label: 'Inventory',
                        field: 'inventory',
                        sortable: true
                    }
                ],
                data: data,
                sortType: 'name',
                sortReverse: false
            };
            
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