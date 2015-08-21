/*
 * Controllers
 * Place all application controllers here
 */

// Global controller
app.controller('MainCtrl', ['$scope', '$cookieStore',
    function ($scope, $cookieStore) {

        // set current year for display
        var d = new Date();
        $scope.year = d.getFullYear();

        /**
         * Sidebar Toggle & Cookie Control
         */
        var mobileView = 992;

        $scope.getWidth = function () {
            return window.innerWidth;
        };

        $scope.$watch($scope.getWidth, function (newValue, oldValue) {

            if (newValue >= mobileView) {
                if (angular.isDefined($cookieStore.get('toggle'))) {
                    $scope.toggle = !$cookieStore.get('toggle') ? false : true;
                } else {
                    $scope.toggle = true;
                }
            } else {
                $scope.toggle = false;
            }

        });

        $scope.toggleSidebar = function () {
            $scope.toggle = !$scope.toggle;
            $cookieStore.put('toggle', $scope.toggle);
        };

        window.onresize = function () {
            $scope.$apply();
        };

    }
]);

// Home page controller
app.controller('DashboardCtrl', ['$scope', '_users', '_widgets', '$filter',
    function ($scope, _users, _widgets, $filter) {

        // set the page title
        $scope.$parent.pageTitle = 'Dashboard';

        // set page breadcrumbs
        $scope.$parent.breadcrumb = [
            {
                text: 'Home',
                href: null
            }
        ];

        $scope.usersTotal = 0;
        $scope.widgetsTotal = 0;
        $scope.tblData = {};

        // users grid-view configuration
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
            data: null,
            sortType: 'name',
            sortReverse: false,
            scrollable: true
        };

        // get all users
        _users.getAllUsers().then(function (data) {

            $scope.usersTotal = data.length;

            data = data.map(function (item) {
                
                item.gravatar = '<img src="' + item.gravatar + '" alt="' + item.name + '">';
                item.sref = {
                    name: 'userDetails',
                    params: { 
                        id: item.id
                    }
                }
                
                return item;
                
            });

            $scope.tblData.users.data = data;

        });

        // widgets grid-view configuration
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
            data: null,
            sortType: 'name',
            sortReverse: false,
            scrollable: true
        };

        // get all widgets
        _widgets.getAllWidgets().then(function (data) {

            $scope.widgetsTotal = data.length;

            data = data.map(function (item) {

                item.price = $filter('currency')(item.price);
                item.melts = (item.melts ? 'Yes' : 'No');
                item.sref = {
                    name: 'widgetDetails',
                    params: { 
                        id: item.id 
                    }
                }

                return item;

            });

            $scope.tblData.widgets.data = data;

        });

    }
]);

// Users list view controller
app.controller('UsersCtrl', ['$scope', '_users',
    function ($scope, _users) {

        // set the page title
        $scope.$parent.pageTitle = 'Users';

        // set page breadcrumbs
        $scope.$parent.breadcrumb = [
            {
                text: 'Home',
                href: 'dashboard'
            },
            {
                text: 'Users',
                href: null
            }
        ];

        // grid-view configuration
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
            data: null,
            sortType: 'name',
            sortReverse: false
        };

        // get all users
        _users.getAllUsers().then(function (data) {

            data = data.map(function (item) {
                
                item.gravatar = '<img src="' + item.gravatar + '" alt="' + item.name + '">';
                item.sref = {
                    name: 'userDetails',
                    params: { 
                        id: item.id
                    }
                };
                
                return item;
                
            });

            $scope.tblData.data = data;

        });

    }
]);

// User details view controller
app.controller('UserDetailsCtrl', ['$scope', '_users', '$stateParams',
    function ($scope, _users, $stateParams) {

        // set the page title
        $scope.$parent.pageTitle = 'Users';

        // set page breadcrumbs
        $scope.$parent.breadcrumb = [
            {
                text: 'Home',
                href: 'dashboard'
            },
            {
                text: 'Users',
                href: 'users'
            }
        ];

        // get the requested user
        _users.getUser($stateParams.id).then(function (data) {

            $scope.user = data;

            $scope.$parent.breadcrumb.push({
                text: data.name,
                href: null
            });

        });

    }
]);

// Widgets list view controller
app.controller('WidgetsCtrl', ['$scope', '_widgets', '$timeout', '$filter',
    function ($scope, _widgets, $timeout, $filter) {

        // set the page title
        $scope.$parent.pageTitle = 'Widgets';

        // set page breadcrumbs
        $scope.$parent.breadcrumb = [
            {
                text: 'Home',
                href: 'dashboard'
            },
            {
                text: 'Widgets',
                href: null
            }
        ];

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
            data: null,
            sortType: 'name',
            sortReverse: false
        };

        _widgets.getAllWidgets().then(function (data) {

            data = data.map(function (item) {

                item.price = $filter('currency')(item.price);
                item.melts = (item.melts ? 'Yes' : 'No');
                item.sref = {
                    name: 'widgetDetails',
                    params: { 
                        id: item.id 
                    }
                };

                return item;

            });

            $scope.tblData.data = data;

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

        // set page breadcrumbs
        $scope.$parent.breadcrumb = [
            {
                text: 'Home',
                href: 'dashboard'
            },
            {
                text: 'Widgets',
                href: 'widgets'
            }
        ];

        // get the requested widget
        _widgets.getWidget($stateParams.id).then(function (data) {

            $scope.widget = data;
            $scope.widget.price = parseFloat($scope.widget.price);

            $scope.$parent.breadcrumb.push({
                text: data.name,
                href: null
            });

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