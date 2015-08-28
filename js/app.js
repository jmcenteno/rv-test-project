/**
 * AngularJS module
 */

// define the module
var app = angular.module('WidgetSpa', [
    'ui.router',
    'ngAnimate',
    'ngSanitize',
    'ngCookies',
    'angularUtils.directives.dirPagination'
]);

// Application constants
app.constant('API_URL', 'http://spa.tglrw.com:4000');

// Boostrap the application
app.run(["$rootScope", function ($rootScope) {

}]);
/**
 * App configuration
 * Set routes and interceptors heres
 */

app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

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

}]);
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
app.factory('_users', ["$http", "API_URL", function ($http, API_URL) {

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

}]);

/* *
 * _widgets Factory
 *
 * AngularJS service to request widget data from remote API
 * @returns     (object) An object with methods to obtain collections, single records, and to modify records
 */
app.factory('_widgets', ["$http", "API_URL", function ($http, API_URL) {

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

}]);

app.service('_pageHeader', function () {
    
    // page title
    this.title = '';
    
    this.setTitle = function (value) {
        this.title = value;
    };
    
    this.getTitle = function () {
        return this.title;
    };
    
    // breadcrumbs
    this.breadcrumb = [];
    
    this.setBreacrumb = function (arr) {
        this.breadcrumb = arr;
    };
    
    this.getBreadcrumb = function() {
        return this.breadcrumb;
    };
    
});
/*
 * Controllers
 * Place all application controllers here
 */

// Global controller
app.controller('MainCtrl', ["$scope", "$cookieStore", "$window", "_pageHeader", function ($scope, $cookieStore, $window, _pageHeader) {

    // set current year for display
    var d = new Date();
    $scope.year = d.getFullYear();

    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.getWidth = function () {
        return $window.window.innerWidth;
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

    if ($window.innerHeight < mobileView) {
        $scope.toggleSidebar();
    }

    $window.onresize = function () {
        $scope.$apply();
    };
    
    $scope.$watch(function() {
        return _pageHeader.getTitle();
    }, function(value) {
        $scope.pageTitle = value;
    });

}]);

// Home page controller
app.controller('DashboardCtrl', ["$scope", "_users", "_widgets", "$filter", "_pageHeader", function ($scope, _users, _widgets, $filter, _pageHeader) {

    // set the page title
    _pageHeader.setTitle('Dashboard');

    // set page breadcrumbs
    _pageHeader.setBreacrumb([
        {
            text: 'Home',
            href: null
        }
    ]);

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

}]);

// Users list view controller
app.controller('UsersCtrl', ["$scope", "_users", "_pageHeader", function ($scope, _users, _pageHeader) {

    // set the page title
    _pageHeader.setTitle('Users');

    // set page breadcrumbs
    _pageHeader.setBreacrumb([
        {
            text: 'Home',
            href: 'dashboard'
        },
        {
            text: 'Users',
            href: null
        }
    ]);

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

}]);

// User details view controller
app.controller('UserDetailsCtrl', ["$scope", "_users", "_pageHeader", "$stateParams", function ($scope, _users, _pageHeader, $stateParams) {

    // set the page title
    _pageHeader.setTitle('User Details');

    // set page breadcrumbs
    var breadcrumb = [
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

        breadcrumb.push({
            text: data.name,
            href: null
        });
        
        _pageHeader.setBreacrumb(breadcrumb);

    });

}]);

// Widgets list view controller
app.controller('WidgetsCtrl', ["$scope", "_widgets", "_pageHeader", "$timeout", "$filter", function ($scope, _widgets, _pageHeader, $timeout, $filter) {

    // set the page title
    _pageHeader.setTitle('Widgets');

    // set page breadcrumbs
    _pageHeader.setBreacrumb([
        {
            text: 'Home',
            href: 'dashboard'
        },
        {
            text: 'Widgets',
            href: null
        }
    ]);

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

}]);

// Widget details view controller
app.controller('WidgetDetailsCtrl', ["$scope", "_widgets", "_pageHeader", "$stateParams", "$timeout", function ($scope, _widgets, _pageHeader, $stateParams, $timeout) {

    // set page breadcrumbs
    _pageHeader.setTitle('Widget Details');

    // set page breadcrumbs
    var breadcrumb = [
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

        breadcrumb.push({
            text: data.name,
            href: null
        });
        
        _pageHeader.setBreacrumb(breadcrumb);

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

}]);
/**
 * Directives
 * Place all custom directives here
 */

//Generate breadcrumb navigation
app.directive('breadcrumb', ["$state", "_pageHeader", function ($state, _pageHeader) {

    return {
        restrict: 'A',
        scope: {},
        link: function (scope, element, attrs) {

            scope.$watchCollection(function () {

                return _pageHeader.getBreadcrumb();

            }, function (value) {

                if (angular.isArray(value)) {

                    element.html('');
                    
                    var breadcrumb = [];

                    angular.forEach(value, function (item) {

                        if (item.href != null) {

                            breadcrumb.push('<a href="' + $state.href(item.href) + '">' + item.text + '</a>');

                        } else {

                            breadcrumb.push(item.text);

                        }

                    });

                    element.html(breadcrumb.join(' / '));

                }

            });

        }
    };

}]);

// Wrapper directive to use jQuery to animate values and display them as they change with an easing method
app.directive('animateValue', function () {

    return {
        restrict: 'A',
        scope: {
            total: '=animateValue'
        },
        link: function (scope, element, attrs) {

            scope.$watch(function () {

                return scope.total;

            }, function (newValue, oldValue) {

                angular.element({
                    value: oldValue
                }).animate({
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

});

// Show a loading animation
app.directive('loading', function () {

    return {
        restrict: 'E',
        scope: {},
        replace: true,
        template: '<div class="loading">' +
            '<div class="double-bounce1"></div>' +
            '<div class="double-bounce2"></div>' + 
            '</div>'
    };

});

// Sortable HTML table generator
app.directive('gridView', ["$state", function ($state) {

    return {
        restrict: 'A',
        templateUrl: 'partials/directives/grid-view.html',
        scope: {
            config: '=gridView'
        },
        controller: ["$scope", function ($scope) {

            $scope.itemsPerPageOptions = [10, 25, 50, 100];
            $scope.itemsPerPage = $scope.itemsPerPageOptions[0];
            $scope.currentPage = 0;

            $scope.go = function (state) {
                $state.go(state.name, state.params);
            };

        }]
    };

}]);

// Modal with a form to create new widgets
app.directive('widgetCreate', ["_widgets", function (_widgets) {

    return {
        restrict: 'A',
        templateUrl: 'partials/directives/widget-create.html',
        replace: true
    };

}]);

// Back button
app.directive('backButton', ["$state", function ($state) {

    return {
        restrict: 'A',
        templateUrl: 'partials/directives/back-button.html',
        replace: true,
        scope: {},
        link: function (scope, element, attrs) {

            scope.config = scope.$eval(attrs.backButton);
            scope.config.state = $state.href(scope.config.state);

        }
    };

}]);
/**
 * Filters
 * Place all custom filters here
 */

/**
 * Filter duplicate values from an array
 * @returns {array} Array with unique values
 */
app.filter('unique', function () {

    return function (items, filterOn) {

        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {

            var hashCheck = {},
                newItems = [];

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

});
//# sourceMappingURL=data:application/json;base64,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QUNWLGFBQWE7UUFDYixTQUFTO1FBQ1QsT0FBTztRQUNQLE1BQU0sVUFBVSxPQUFPLFNBQVMsT0FBTzs7WUFFbkMsTUFBTSxTQUFTLE1BQU0sTUFBTSxNQUFNO1lBQ2pDLE1BQU0sT0FBTyxRQUFRLE9BQU8sS0FBSyxNQUFNLE9BQU87Ozs7Ozs7Ozs7Ozs7OztBQWUxRCxJQUFJLE9BQU8sVUFBVSxZQUFZOztJQUU3QixPQUFPLFVBQVUsT0FBTyxVQUFVOztRQUU5QixJQUFJLGFBQWEsT0FBTztZQUNwQixPQUFPOzs7UUFHWCxJQUFJLENBQUMsWUFBWSxRQUFRLFlBQVksY0FBYyxRQUFRLFFBQVEsUUFBUTs7WUFFdkUsSUFBSSxZQUFZO2dCQUNaLFdBQVc7O1lBRWYsSUFBSSx3QkFBd0IsVUFBVSxNQUFNO2dCQUN4QyxJQUFJLFFBQVEsU0FBUyxTQUFTLFFBQVEsU0FBUyxXQUFXO29CQUN0RCxPQUFPLEtBQUs7dUJBQ1Q7b0JBQ0gsT0FBTzs7OztZQUlmLFFBQVEsUUFBUSxPQUFPLFVBQVUsTUFBTTs7Z0JBRW5DLElBQUksY0FBYyxjQUFjOztnQkFFaEMsS0FBSyxJQUFJLElBQUksR0FBRyxJQUFJLFNBQVMsUUFBUSxLQUFLO29CQUN0QyxJQUFJLFFBQVEsT0FBTyxzQkFBc0IsU0FBUyxLQUFLLHNCQUFzQixRQUFRO3dCQUNqRixjQUFjO3dCQUNkOzs7O2dCQUlSLElBQUksQ0FBQyxhQUFhO29CQUNkLFNBQVMsS0FBSzs7Ozs7WUFLdEIsUUFBUTs7OztRQUlaLE9BQU87Ozs7R0FJWiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQW5ndWxhckpTIG1vZHVsZVxuICovXG5cbi8vIGRlZmluZSB0aGUgbW9kdWxlXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ1dpZGdldFNwYScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnbmdBbmltYXRlJyxcbiAgICAnbmdTYW5pdGl6ZScsXG4gICAgJ25nQ29va2llcycsXG4gICAgJ2FuZ3VsYXJVdGlscy5kaXJlY3RpdmVzLmRpclBhZ2luYXRpb24nXG5dKTtcblxuLy8gQXBwbGljYXRpb24gY29uc3RhbnRzXG5hcHAuY29uc3RhbnQoJ0FQSV9VUkwnLCAnaHR0cDovL3NwYS50Z2xydy5jb206NDAwMCcpO1xuXG4vLyBCb29zdHJhcCB0aGUgYXBwbGljYXRpb25cbmFwcC5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUpIHtcblxufSk7XG4vKipcbiAqIEFwcCBjb25maWd1cmF0aW9uXG4gKiBTZXQgcm91dGVzIGFuZCBpbnRlcmNlcHRvcnMgaGVyZXNcbiAqL1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG5cbiAgICAvLyBkZWNsYXJlIGFwcGxpY2F0aW9uIHN0YXRlcyAocm91dGVzKVxuICAgICRzdGF0ZVByb3ZpZGVyXG5cbiAgICAuc3RhdGUoJ2Rhc2hib2FyZCcsIHtcbiAgICAgICAgdXJsOiAnLycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvcGFnZXMvZGFzaGJvYXJkLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnRGFzaGJvYXJkQ3RybCdcbiAgICB9KVxuXG4gICAgLnN0YXRlKCd1c2VycycsIHtcbiAgICAgICAgdXJsOiAnL3VzZXJzJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9wYWdlcy91c2Vycy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1VzZXJzQ3RybCdcbiAgICB9KVxuXG4gICAgLnN0YXRlKCd1c2VyRGV0YWlscycsIHtcbiAgICAgICAgdXJsOiAnL3VzZXJzLzppZCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvcGFnZXMvdXNlci1kZXRhaWxzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnVXNlckRldGFpbHNDdHJsJ1xuICAgIH0pXG5cbiAgICAuc3RhdGUoJ3dpZGdldHMnLCB7XG4gICAgICAgIHVybDogJy93aWRnZXRzJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9wYWdlcy93aWRnZXRzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnV2lkZ2V0c0N0cmwnXG4gICAgfSlcblxuICAgIC5zdGF0ZSgnd2lkZ2V0RGV0YWlscycsIHtcbiAgICAgICAgdXJsOiAnL3dpZGdldHMvOmlkJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9wYWdlcy93aWRnZXQtZGV0YWlscy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1dpZGdldERldGFpbHNDdHJsJ1xuICAgIH0pO1xuXG4gICAgLy8gcmVkaXJlY3QgdG8gZGFzaGJvYXJkIGlmIHJlcXVlc3RlZCBzdGF0ZSBpcyBub3QgZGVmaW5lZFxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcblxufSk7XG4vKipcbiAqIFNlcnZpY2VzXG4gKiBQbGFjZSBhbGwgYXBwbGljYXRpb24gc2VydmljZXMgYW5kIGZhY3RvcmllcyBoZXJlXG4gKi9cblxuXG4vKipcbiAqIF91c2VycyBGYWN0b3J5XG4gKlxuICogQW5ndWxhckpTIHNlcnZpY2UgdG8gcmVxdWVzdCB1c2VyIGRhdGEgZnJvbSByZW1vdGUgQVBJXG4gKiBAcmV0dXJucyAgICAgKG9iamVjdCkgQW4gb2JqZWN0IHdpdGggbWV0aG9kcyB0byBvYnRhaW4gY29sbGVjdGlvbnMgb3Igc2luZ2xlIHJlY29yZHNcbiAqL1xuYXBwLmZhY3RvcnkoJ191c2VycycsIGZ1bmN0aW9uICgkaHR0cCwgQVBJX1VSTCkge1xuXG4gICAgdmFyIHVzZXJzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYWxsIHVzZXJzXG4gICAgICogQHJldHVybnMge2FycmF5fSBDb2xsZWN0aW9uIG9mIHVzZXIgb2JqZWN0c1xuICAgICAqL1xuICAgIHVzZXJzLmdldEFsbFVzZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KEFQSV9VUkwgKyAnL3VzZXJzJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0IG9uZSB1c2VyXG4gICAgICogQHBhcmFtICAge2ludH0gaWQgVXNlciBJRFxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IFVzZXIgb2JqZWN0XG4gICAgICovXG4gICAgdXNlcnMuZ2V0VXNlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KEFQSV9VUkwgKyAnL3VzZXJzLycgKyBpZCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHVzZXJzO1xuXG59KTtcblxuLyogKlxuICogX3dpZGdldHMgRmFjdG9yeVxuICpcbiAqIEFuZ3VsYXJKUyBzZXJ2aWNlIHRvIHJlcXVlc3Qgd2lkZ2V0IGRhdGEgZnJvbSByZW1vdGUgQVBJXG4gKiBAcmV0dXJucyAgICAgKG9iamVjdCkgQW4gb2JqZWN0IHdpdGggbWV0aG9kcyB0byBvYnRhaW4gY29sbGVjdGlvbnMsIHNpbmdsZSByZWNvcmRzLCBhbmQgdG8gbW9kaWZ5IHJlY29yZHNcbiAqL1xuYXBwLmZhY3RvcnkoJ193aWRnZXRzJywgZnVuY3Rpb24gKCRodHRwLCBBUElfVVJMKSB7XG5cbiAgICB2YXIgd2lkZ2V0cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogR2V0IGFsbCB3aWRnZXRzXG4gICAgICogQHJldHVybnMge2FycmF5fSBDb2xsZWN0aW9uIG9mIHdpZGdldCBvYmplY3RzXG4gICAgICovXG4gICAgd2lkZ2V0cy5nZXRBbGxXaWRnZXRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KEFQSV9VUkwgKyAnL3dpZGdldHMnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHZXQgb24gd2lkZ2V0XG4gICAgICogQHBhcmFtICAge2ludH0gaWQgV2lkZ2V0IElEXG4gICAgICogQHJldHVybnMge29iamVjdH0gV2lkZ2V0IG9iamVjdFxuICAgICAqL1xuICAgIHdpZGdldHMuZ2V0V2lkZ2V0ID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoQVBJX1VSTCArICcvd2lkZ2V0cy8nICsgaWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyB3aWRnZXRcbiAgICAgKiBAcGFyYW0gICB7b2JqZWN0fSBwYXJhbXMgT2JqZWN0IHdpdGggYWxsIHByb3BlcnRpZXMgdGhhdCBtYWtlIGEgc2luZ2xlIHdpZGdldFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFJlc3BvbnNlIGZyb20gdGhlIEFQSVxuICAgICAqL1xuICAgIHdpZGdldHMuY3JlYXRlV2lkZ2V0ID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChBUElfVVJMICsgJy93aWRnZXRzJywgcGFyYW1zKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFZGl0IGFuIGV4aXN0aW5nIHdpZGdldFxuICAgICAqIEBwYXJhbSAgIHtpbnR9IGlkICAgICBXaWRnZXQgSURcbiAgICAgKiBAcGFyYW0gICB7b2JqZWN0fSBwYXJhbXMgT2JqZWN0IHdpdGggYWxsIHByb3BlcnRpZXMgdGhhdCBhIG1ha2UgYSBzaW5nbGUgd2lkZ2V0XG4gICAgICogQHJldHVybnMge3N0cmluZ30gUmVzcG9uc2UgZnJvbSBBUElcbiAgICAgKi9cbiAgICB3aWRnZXRzLmVkaXRXaWRnZXQgPSBmdW5jdGlvbiAoaWQsIHBhcmFtcykge1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KEFQSV9VUkwgKyAnL3dpZGdldHMvJyArIGlkLCBwYXJhbXMpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlIGEgbGlzdCBvZiBjb2xvcnMgZnJvbSBleGlzdGluZyB3aWRnZXRzXG4gICAgICogQHJldHVybnMge2FycmF5fSBDb2xsZWN0aW9uIHdpdGggdW5pcXVlIGNvbG9yIHZhbHVlc1xuICAgICAqL1xuICAgIHdpZGdldHMuZ2V0Q29sb3JPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KEFQSV9VUkwgKyAnL3dpZGdldHMnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXG4gICAgICAgICAgICB2YXIgY29sb3JzID0gW107XG5cbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhKSB7XG5cbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocmVzcG9uc2UuZGF0YSwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbG9ycy5pbmRleE9mKGl0ZW0uY29sb3IpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcnMucHVzaChpdGVtLmNvbG9yKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb2xvcnMgPSBjb2xvcnMuc29ydCgpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjb2xvcnM7XG5cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiB3aWRnZXRzO1xuXG59KTtcblxuYXBwLnNlcnZpY2UoJ19wYWdlSGVhZGVyJywgZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIC8vIHBhZ2UgdGl0bGVcbiAgICB0aGlzLnRpdGxlID0gJyc7XG4gICAgXG4gICAgdGhpcy5zZXRUaXRsZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnRpdGxlID0gdmFsdWU7XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLmdldFRpdGxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50aXRsZTtcbiAgICB9O1xuICAgIFxuICAgIC8vIGJyZWFkY3J1bWJzXG4gICAgdGhpcy5icmVhZGNydW1iID0gW107XG4gICAgXG4gICAgdGhpcy5zZXRCcmVhY3J1bWIgPSBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgIHRoaXMuYnJlYWRjcnVtYiA9IGFycjtcbiAgICB9O1xuICAgIFxuICAgIHRoaXMuZ2V0QnJlYWRjcnVtYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5icmVhZGNydW1iO1xuICAgIH07XG4gICAgXG59KTtcbi8qXG4gKiBDb250cm9sbGVyc1xuICogUGxhY2UgYWxsIGFwcGxpY2F0aW9uIGNvbnRyb2xsZXJzIGhlcmVcbiAqL1xuXG4vLyBHbG9iYWwgY29udHJvbGxlclxuYXBwLmNvbnRyb2xsZXIoJ01haW5DdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJGNvb2tpZVN0b3JlLCAkd2luZG93LCBfcGFnZUhlYWRlcikge1xuXG4gICAgLy8gc2V0IGN1cnJlbnQgeWVhciBmb3IgZGlzcGxheVxuICAgIHZhciBkID0gbmV3IERhdGUoKTtcbiAgICAkc2NvcGUueWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcblxuICAgIC8qKlxuICAgICAqIFNpZGViYXIgVG9nZ2xlICYgQ29va2llIENvbnRyb2xcbiAgICAgKi9cbiAgICB2YXIgbW9iaWxlVmlldyA9IDk5MjtcblxuICAgICRzY29wZS5nZXRXaWR0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICR3aW5kb3cud2luZG93LmlubmVyV2lkdGg7XG4gICAgfTtcblxuICAgICRzY29wZS4kd2F0Y2goJHNjb3BlLmdldFdpZHRoLCBmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG5cbiAgICAgICAgaWYgKG5ld1ZhbHVlID49IG1vYmlsZVZpZXcpIHtcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCgkY29va2llU3RvcmUuZ2V0KCd0b2dnbGUnKSkpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUudG9nZ2xlID0gISRjb29raWVTdG9yZS5nZXQoJ3RvZ2dsZScpID8gZmFsc2UgOiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUudG9nZ2xlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRzY29wZS50b2dnbGUgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICAkc2NvcGUudG9nZ2xlU2lkZWJhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLnRvZ2dsZSA9ICEkc2NvcGUudG9nZ2xlO1xuICAgICAgICAkY29va2llU3RvcmUucHV0KCd0b2dnbGUnLCAkc2NvcGUudG9nZ2xlKTtcbiAgICB9O1xuXG4gICAgaWYgKCR3aW5kb3cuaW5uZXJIZWlnaHQgPCBtb2JpbGVWaWV3KSB7XG4gICAgICAgICRzY29wZS50b2dnbGVTaWRlYmFyKCk7XG4gICAgfVxuXG4gICAgJHdpbmRvdy5vbnJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgIH07XG4gICAgXG4gICAgJHNjb3BlLiR3YXRjaChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIF9wYWdlSGVhZGVyLmdldFRpdGxlKCk7XG4gICAgfSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgJHNjb3BlLnBhZ2VUaXRsZSA9IHZhbHVlO1xuICAgIH0pO1xuXG59KTtcblxuLy8gSG9tZSBwYWdlIGNvbnRyb2xsZXJcbmFwcC5jb250cm9sbGVyKCdEYXNoYm9hcmRDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgX3VzZXJzLCBfd2lkZ2V0cywgJGZpbHRlciwgX3BhZ2VIZWFkZXIpIHtcblxuICAgIC8vIHNldCB0aGUgcGFnZSB0aXRsZVxuICAgIF9wYWdlSGVhZGVyLnNldFRpdGxlKCdEYXNoYm9hcmQnKTtcblxuICAgIC8vIHNldCBwYWdlIGJyZWFkY3J1bWJzXG4gICAgX3BhZ2VIZWFkZXIuc2V0QnJlYWNydW1iKFtcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ0hvbWUnLFxuICAgICAgICAgICAgaHJlZjogbnVsbFxuICAgICAgICB9XG4gICAgXSk7XG5cbiAgICAkc2NvcGUudXNlcnNUb3RhbCA9IDA7XG4gICAgJHNjb3BlLndpZGdldHNUb3RhbCA9IDA7XG4gICAgJHNjb3BlLnRibERhdGEgPSB7fTtcblxuICAgIC8vIHVzZXJzIGdyaWQtdmlldyBjb25maWd1cmF0aW9uXG4gICAgJHNjb3BlLnRibERhdGEudXNlcnMgPSB7XG4gICAgICAgIHRpdGxlOiAnVXNlcnMnLFxuICAgICAgICBoZWFkZXJzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICdJRCcsXG4gICAgICAgICAgICAgICAgZmllbGQ6ICdpZCcsXG4gICAgICAgICAgICAgICAgc29ydGFibGU6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICdOYW1lJyxcbiAgICAgICAgICAgICAgICBmaWVsZDogJ25hbWUnLFxuICAgICAgICAgICAgICAgIHNvcnRhYmxlOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnQXZhdGFyJyxcbiAgICAgICAgICAgICAgICBmaWVsZDogJ2dyYXZhdGFyJyxcbiAgICAgICAgICAgICAgICBzb3J0YWJsZTogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgc29ydFR5cGU6ICduYW1lJyxcbiAgICAgICAgc29ydFJldmVyc2U6IGZhbHNlLFxuICAgICAgICBzY3JvbGxhYmxlOiB0cnVlXG4gICAgfTtcblxuICAgIC8vIGdldCBhbGwgdXNlcnNcbiAgICBfdXNlcnMuZ2V0QWxsVXNlcnMoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJHNjb3BlLnVzZXJzVG90YWwgPSBkYXRhLmxlbmd0aDtcblxuICAgICAgICBkYXRhID0gZGF0YS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcblxuICAgICAgICAgICAgaXRlbS5ncmF2YXRhciA9ICc8aW1nIHNyYz1cIicgKyBpdGVtLmdyYXZhdGFyICsgJ1wiIGFsdD1cIicgKyBpdGVtLm5hbWUgKyAnXCI+JztcbiAgICAgICAgICAgIGl0ZW0uc3JlZiA9IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAndXNlckRldGFpbHMnLFxuICAgICAgICAgICAgICAgIHBhcmFtczogeyBcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGl0ZW0uaWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS50YmxEYXRhLnVzZXJzLmRhdGEgPSBkYXRhO1xuXG4gICAgfSk7XG5cbiAgICAvLyB3aWRnZXRzIGdyaWQtdmlldyBjb25maWd1cmF0aW9uXG4gICAgJHNjb3BlLnRibERhdGEud2lkZ2V0cyA9IHtcbiAgICAgICAgdGl0bGU6ICdXaWRnZXRzJyxcbiAgICAgICAgaGVhZGVyczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnSUQnLFxuICAgICAgICAgICAgICAgIGZpZWxkOiAnaWQnLFxuICAgICAgICAgICAgICAgIHNvcnRhYmxlOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnTmFtZScsXG4gICAgICAgICAgICAgICAgZmllbGQ6ICduYW1lJyxcbiAgICAgICAgICAgICAgICBzb3J0YWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0NvbG9yJyxcbiAgICAgICAgICAgICAgICBmaWVsZDogJ2NvbG9yJyxcbiAgICAgICAgICAgICAgICBzb3J0YWJsZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICBzb3J0VHlwZTogJ25hbWUnLFxuICAgICAgICBzb3J0UmV2ZXJzZTogZmFsc2UsXG4gICAgICAgIHNjcm9sbGFibGU6IHRydWVcbiAgICB9O1xuXG4gICAgLy8gZ2V0IGFsbCB3aWRnZXRzXG4gICAgX3dpZGdldHMuZ2V0QWxsV2lkZ2V0cygpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAkc2NvcGUud2lkZ2V0c1RvdGFsID0gZGF0YS5sZW5ndGg7XG5cbiAgICAgICAgZGF0YSA9IGRhdGEubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cbiAgICAgICAgICAgIGl0ZW0ucHJpY2UgPSAkZmlsdGVyKCdjdXJyZW5jeScpKGl0ZW0ucHJpY2UpO1xuICAgICAgICAgICAgaXRlbS5tZWx0cyA9IChpdGVtLm1lbHRzID8gJ1llcycgOiAnTm8nKTtcbiAgICAgICAgICAgIGl0ZW0uc3JlZiA9IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnd2lkZ2V0RGV0YWlscycsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7IFxuICAgICAgICAgICAgICAgICAgICBpZDogaXRlbS5pZCBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS50YmxEYXRhLndpZGdldHMuZGF0YSA9IGRhdGE7XG5cbiAgICB9KTtcblxufSk7XG5cbi8vIFVzZXJzIGxpc3QgdmlldyBjb250cm9sbGVyXG5hcHAuY29udHJvbGxlcignVXNlcnNDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgX3VzZXJzLCBfcGFnZUhlYWRlcikge1xuXG4gICAgLy8gc2V0IHRoZSBwYWdlIHRpdGxlXG4gICAgX3BhZ2VIZWFkZXIuc2V0VGl0bGUoJ1VzZXJzJyk7XG5cbiAgICAvLyBzZXQgcGFnZSBicmVhZGNydW1ic1xuICAgIF9wYWdlSGVhZGVyLnNldEJyZWFjcnVtYihbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdIb21lJyxcbiAgICAgICAgICAgIGhyZWY6ICdkYXNoYm9hcmQnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdVc2VycycsXG4gICAgICAgICAgICBocmVmOiBudWxsXG4gICAgICAgIH1cbiAgICBdKTtcblxuICAgIC8vIGdyaWQtdmlldyBjb25maWd1cmF0aW9uXG4gICAgJHNjb3BlLnRibERhdGEgPSB7XG4gICAgICAgIHRpdGxlOiAnVXNlcnMnLFxuICAgICAgICBoZWFkZXJzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICdJRCcsXG4gICAgICAgICAgICAgICAgZmllbGQ6ICdpZCcsXG4gICAgICAgICAgICAgICAgc29ydGFibGU6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICdOYW1lJyxcbiAgICAgICAgICAgICAgICBmaWVsZDogJ25hbWUnLFxuICAgICAgICAgICAgICAgIHNvcnRhYmxlOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnQXZhdGFyJyxcbiAgICAgICAgICAgICAgICBmaWVsZDogJ2dyYXZhdGFyJyxcbiAgICAgICAgICAgICAgICBzb3J0YWJsZTogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgc29ydFR5cGU6ICduYW1lJyxcbiAgICAgICAgc29ydFJldmVyc2U6IGZhbHNlXG4gICAgfTtcblxuICAgIC8vIGdldCBhbGwgdXNlcnNcbiAgICBfdXNlcnMuZ2V0QWxsVXNlcnMoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgZGF0YSA9IGRhdGEubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cbiAgICAgICAgICAgIGl0ZW0uZ3JhdmF0YXIgPSAnPGltZyBzcmM9XCInICsgaXRlbS5ncmF2YXRhciArICdcIiBhbHQ9XCInICsgaXRlbS5uYW1lICsgJ1wiPic7XG4gICAgICAgICAgICBpdGVtLnNyZWYgPSB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3VzZXJEZXRhaWxzJyxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHsgXG4gICAgICAgICAgICAgICAgICAgIGlkOiBpdGVtLmlkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLnRibERhdGEuZGF0YSA9IGRhdGE7XG5cbiAgICB9KTtcblxufSk7XG5cbi8vIFVzZXIgZGV0YWlscyB2aWV3IGNvbnRyb2xsZXJcbmFwcC5jb250cm9sbGVyKCdVc2VyRGV0YWlsc0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBfdXNlcnMsIF9wYWdlSGVhZGVyLCAkc3RhdGVQYXJhbXMpIHtcblxuICAgIC8vIHNldCB0aGUgcGFnZSB0aXRsZVxuICAgIF9wYWdlSGVhZGVyLnNldFRpdGxlKCdVc2VyIERldGFpbHMnKTtcblxuICAgIC8vIHNldCBwYWdlIGJyZWFkY3J1bWJzXG4gICAgdmFyIGJyZWFkY3J1bWIgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdIb21lJyxcbiAgICAgICAgICAgIGhyZWY6ICdkYXNoYm9hcmQnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdVc2VycycsXG4gICAgICAgICAgICBocmVmOiAndXNlcnMnXG4gICAgICAgIH1cbiAgICBdO1xuXG4gICAgLy8gZ2V0IHRoZSByZXF1ZXN0ZWQgdXNlclxuICAgIF91c2Vycy5nZXRVc2VyKCRzdGF0ZVBhcmFtcy5pZCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICRzY29wZS51c2VyID0gZGF0YTtcblxuICAgICAgICBicmVhZGNydW1iLnB1c2goe1xuICAgICAgICAgICAgdGV4dDogZGF0YS5uYW1lLFxuICAgICAgICAgICAgaHJlZjogbnVsbFxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIF9wYWdlSGVhZGVyLnNldEJyZWFjcnVtYihicmVhZGNydW1iKTtcblxuICAgIH0pO1xuXG59KTtcblxuLy8gV2lkZ2V0cyBsaXN0IHZpZXcgY29udHJvbGxlclxuYXBwLmNvbnRyb2xsZXIoJ1dpZGdldHNDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgX3dpZGdldHMsIF9wYWdlSGVhZGVyLCAkdGltZW91dCwgJGZpbHRlcikge1xuXG4gICAgLy8gc2V0IHRoZSBwYWdlIHRpdGxlXG4gICAgX3BhZ2VIZWFkZXIuc2V0VGl0bGUoJ1dpZGdldHMnKTtcblxuICAgIC8vIHNldCBwYWdlIGJyZWFkY3J1bWJzXG4gICAgX3BhZ2VIZWFkZXIuc2V0QnJlYWNydW1iKFtcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ0hvbWUnLFxuICAgICAgICAgICAgaHJlZjogJ2Rhc2hib2FyZCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1dpZGdldHMnLFxuICAgICAgICAgICAgaHJlZjogbnVsbFxuICAgICAgICB9XG4gICAgXSk7XG5cbiAgICAkc2NvcGUudGJsRGF0YSA9IHtcbiAgICAgICAgdGl0bGU6ICdXaWRnZXRzJyxcbiAgICAgICAgaGVhZGVyczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnSUQnLFxuICAgICAgICAgICAgICAgIGZpZWxkOiAnaWQnLFxuICAgICAgICAgICAgICAgIHNvcnRhYmxlOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnTmFtZScsXG4gICAgICAgICAgICAgICAgZmllbGQ6ICduYW1lJyxcbiAgICAgICAgICAgICAgICBzb3J0YWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0NvbG9yJyxcbiAgICAgICAgICAgICAgICBmaWVsZDogJ2NvbG9yJyxcbiAgICAgICAgICAgICAgICBzb3J0YWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ1ByaWNlJyxcbiAgICAgICAgICAgICAgICBmaWVsZDogJ3ByaWNlJyxcbiAgICAgICAgICAgICAgICBzb3J0YWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ01lbHRzPycsXG4gICAgICAgICAgICAgICAgZmllbGQ6ICdtZWx0cycsXG4gICAgICAgICAgICAgICAgc29ydGFibGU6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICdJbnZlbnRvcnknLFxuICAgICAgICAgICAgICAgIGZpZWxkOiAnaW52ZW50b3J5JyxcbiAgICAgICAgICAgICAgICBzb3J0YWJsZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICBzb3J0VHlwZTogJ25hbWUnLFxuICAgICAgICBzb3J0UmV2ZXJzZTogZmFsc2VcbiAgICB9O1xuXG4gICAgX3dpZGdldHMuZ2V0QWxsV2lkZ2V0cygpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICBkYXRhID0gZGF0YS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcblxuICAgICAgICAgICAgaXRlbS5wcmljZSA9ICRmaWx0ZXIoJ2N1cnJlbmN5JykoaXRlbS5wcmljZSk7XG4gICAgICAgICAgICBpdGVtLm1lbHRzID0gKGl0ZW0ubWVsdHMgPyAnWWVzJyA6ICdObycpO1xuICAgICAgICAgICAgaXRlbS5zcmVmID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6ICd3aWRnZXREZXRhaWxzJyxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHsgXG4gICAgICAgICAgICAgICAgICAgIGlkOiBpdGVtLmlkIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS50YmxEYXRhLmRhdGEgPSBkYXRhO1xuXG4gICAgfSk7XG5cbiAgICBfd2lkZ2V0cy5nZXRDb2xvck9wdGlvbnMoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICRzY29wZS5jb2xvcnMgPSBkYXRhO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLnByb2Nlc3NpbmcgPSBmYWxzZTtcblxuICAgIC8vIHJlc2V0cyB3aWRnZXQgb2JqZWN0IGFuZCBmb3JtIHRvIGEgZGVmYXVsdCBzdGF0ZVxuICAgICRzY29wZS5yZXNldEZvcm0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS53aWRnZXQgPSB7XG4gICAgICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgICAgICAgY29sb3I6IG51bGwsXG4gICAgICAgICAgICBwcmljZTogMC4wMSxcbiAgICAgICAgICAgIG1lbHRzOiBmYWxzZSxcbiAgICAgICAgICAgIGludmVudG9yeTogMFxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAkc2NvcGUucmVzZXRGb3JtKCk7XG5cbiAgICAvLyBjYWxsZWQgd2hlbiBmb3JtIGlzIHN1Ym1pdHRlZFxuICAgICRzY29wZS5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgJHNjb3BlLnByb2Nlc3NpbmcgPSB0cnVlO1xuXG4gICAgICAgIF93aWRnZXRzLmNyZWF0ZVdpZGdldCgkc2NvcGUud2lkZ2V0KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5wcm9jZXNzaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUucmVjb3JkTW9kaWZpZWQgPSB0cnVlO1xuICAgICAgICAgICAgJHNjb3BlLnJlc2V0Rm9ybSgpO1xuXG4gICAgICAgICAgICBfd2lkZ2V0cy5nZXRBbGxXaWRnZXRzKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICRzY29wZS53aWRnZXRzID0gZGF0YTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnJlY29yZE1vZGlmaWVkID0gZmFsc2U7XG4gICAgICAgICAgICB9LCAxMCAqIDEwMDApO1xuXG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgJHNjb3BlLnByb2Nlc3NpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHRydWU7XG5cbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICAgIH0sIDEwICogMTAwMCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgfTtcblxufSk7XG5cbi8vIFdpZGdldCBkZXRhaWxzIHZpZXcgY29udHJvbGxlclxuYXBwLmNvbnRyb2xsZXIoJ1dpZGdldERldGFpbHNDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgX3dpZGdldHMsIF9wYWdlSGVhZGVyLCAkc3RhdGVQYXJhbXMsICR0aW1lb3V0KSB7XG5cbiAgICAvLyBzZXQgcGFnZSBicmVhZGNydW1ic1xuICAgIF9wYWdlSGVhZGVyLnNldFRpdGxlKCdXaWRnZXQgRGV0YWlscycpO1xuXG4gICAgLy8gc2V0IHBhZ2UgYnJlYWRjcnVtYnNcbiAgICB2YXIgYnJlYWRjcnVtYiA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ0hvbWUnLFxuICAgICAgICAgICAgaHJlZjogJ2Rhc2hib2FyZCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1dpZGdldHMnLFxuICAgICAgICAgICAgaHJlZjogJ3dpZGdldHMnXG4gICAgICAgIH1cbiAgICBdO1xuXG4gICAgLy8gZ2V0IHRoZSByZXF1ZXN0ZWQgd2lkZ2V0XG4gICAgX3dpZGdldHMuZ2V0V2lkZ2V0KCRzdGF0ZVBhcmFtcy5pZCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICRzY29wZS53aWRnZXQgPSBkYXRhO1xuICAgICAgICAkc2NvcGUud2lkZ2V0LnByaWNlID0gcGFyc2VGbG9hdCgkc2NvcGUud2lkZ2V0LnByaWNlKTtcblxuICAgICAgICBicmVhZGNydW1iLnB1c2goe1xuICAgICAgICAgICAgdGV4dDogZGF0YS5uYW1lLFxuICAgICAgICAgICAgaHJlZjogbnVsbFxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIF9wYWdlSGVhZGVyLnNldEJyZWFjcnVtYihicmVhZGNydW1iKTtcblxuICAgIH0pO1xuXG4gICAgLy8gZ2V0IGFsbCBjb2xvciBvcHRpb25zXG4gICAgX3dpZGdldHMuZ2V0Q29sb3JPcHRpb25zKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAkc2NvcGUuY29sb3JzID0gZGF0YTtcbiAgICB9KTtcblxuICAgICRzY29wZS5wcm9jZXNzaW5nID0gZmFsc2U7XG5cbiAgICAvLyB1cGRhdGUgcmVxdWVzdGVkIHdpZGdldFxuICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBwYXJhbXMgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLndpZGdldCk7XG4gICAgICAgIGRlbGV0ZSBwYXJhbXMuaWQ7XG5cbiAgICAgICAgJHNjb3BlLnByb2Nlc3NpbmcgPSB0cnVlO1xuXG4gICAgICAgIF93aWRnZXRzLmVkaXRXaWRnZXQoJHNjb3BlLndpZGdldC5pZCwgcGFyYW1zKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5wcm9jZXNzaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUucmVjb3JkTW9kaWZpZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnJlY29yZE1vZGlmaWVkID0gZmFsc2U7XG4gICAgICAgICAgICB9LCAxMCAqIDEwMDApO1xuXG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgJHNjb3BlLnByb2Nlc3NpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHRydWU7XG5cbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICAgIH0sIDEwICogMTAwMCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgfTtcblxufSk7XG4vKipcbiAqIERpcmVjdGl2ZXNcbiAqIFBsYWNlIGFsbCBjdXN0b20gZGlyZWN0aXZlcyBoZXJlXG4gKi9cblxuLy9HZW5lcmF0ZSBicmVhZGNydW1iIG5hdmlnYXRpb25cbmFwcC5kaXJlY3RpdmUoJ2JyZWFkY3J1bWInLCBmdW5jdGlvbiAoJHN0YXRlLCBfcGFnZUhlYWRlcikge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICAgICAgIHNjb3BlLiR3YXRjaENvbGxlY3Rpb24oZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9wYWdlSGVhZGVyLmdldEJyZWFkY3J1bWIoKTtcblxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHZhbHVlKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHZhbHVlKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaHRtbCgnJyk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB2YXIgYnJlYWRjcnVtYiA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2YWx1ZSwgZnVuY3Rpb24gKGl0ZW0pIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uaHJlZiAhPSBudWxsKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhZGNydW1iLnB1c2goJzxhIGhyZWY9XCInICsgJHN0YXRlLmhyZWYoaXRlbS5ocmVmKSArICdcIj4nICsgaXRlbS50ZXh0ICsgJzwvYT4nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFkY3J1bWIucHVzaChpdGVtLnRleHQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5odG1sKGJyZWFkY3J1bWIuam9pbignIC8gJykpO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgfTtcblxufSk7XG5cbi8vIFdyYXBwZXIgZGlyZWN0aXZlIHRvIHVzZSBqUXVlcnkgdG8gYW5pbWF0ZSB2YWx1ZXMgYW5kIGRpc3BsYXkgdGhlbSBhcyB0aGV5IGNoYW5nZSB3aXRoIGFuIGVhc2luZyBtZXRob2RcbmFwcC5kaXJlY3RpdmUoJ2FuaW1hdGVWYWx1ZScsIGZ1bmN0aW9uICgpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICB0b3RhbDogJz1hbmltYXRlVmFsdWUnXG4gICAgICAgIH0sXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblxuICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBzY29wZS50b3RhbDtcblxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuXG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IG9sZFZhbHVlXG4gICAgICAgICAgICAgICAgfSkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBuZXdWYWx1ZVxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDMwMDAsXG4gICAgICAgICAgICAgICAgICAgIGVhc2luZzogJ3N3aW5nJyxcbiAgICAgICAgICAgICAgICAgICAgc3RlcDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC50ZXh0KE1hdGguY2VpbCh0aGlzLnZhbHVlKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgIH07XG5cbn0pO1xuXG4vLyBTaG93IGEgbG9hZGluZyBhbmltYXRpb25cbmFwcC5kaXJlY3RpdmUoJ2xvYWRpbmcnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZToge30sXG4gICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImxvYWRpbmdcIj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZG91YmxlLWJvdW5jZTFcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZG91YmxlLWJvdW5jZTJcIj48L2Rpdj4nICsgXG4gICAgICAgICAgICAnPC9kaXY+J1xuICAgIH07XG5cbn0pO1xuXG4vLyBTb3J0YWJsZSBIVE1MIHRhYmxlIGdlbmVyYXRvclxuYXBwLmRpcmVjdGl2ZSgnZ3JpZFZpZXcnLCBmdW5jdGlvbiAoJHN0YXRlKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2RpcmVjdGl2ZXMvZ3JpZC12aWV3Lmh0bWwnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgY29uZmlnOiAnPWdyaWRWaWV3J1xuICAgICAgICB9LFxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5pdGVtc1BlclBhZ2VPcHRpb25zID0gWzEwLCAyNSwgNTAsIDEwMF07XG4gICAgICAgICAgICAkc2NvcGUuaXRlbXNQZXJQYWdlID0gJHNjb3BlLml0ZW1zUGVyUGFnZU9wdGlvbnNbMF07XG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudFBhZ2UgPSAwO1xuXG4gICAgICAgICAgICAkc2NvcGUuZ28gPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oc3RhdGUubmFtZSwgc3RhdGUucGFyYW1zKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfVxuICAgIH07XG5cbn0pO1xuXG4vLyBNb2RhbCB3aXRoIGEgZm9ybSB0byBjcmVhdGUgbmV3IHdpZGdldHNcbmFwcC5kaXJlY3RpdmUoJ3dpZGdldENyZWF0ZScsIGZ1bmN0aW9uIChfd2lkZ2V0cykge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9kaXJlY3RpdmVzL3dpZGdldC1jcmVhdGUuaHRtbCcsXG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICB9O1xuXG59KTtcblxuLy8gQmFjayBidXR0b25cbmFwcC5kaXJlY3RpdmUoJ2JhY2tCdXR0b24nLCBmdW5jdGlvbiAoJHN0YXRlKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2RpcmVjdGl2ZXMvYmFjay1idXR0b24uaHRtbCcsXG4gICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG4gICAgICAgICAgICBzY29wZS5jb25maWcgPSBzY29wZS4kZXZhbChhdHRycy5iYWNrQnV0dG9uKTtcbiAgICAgICAgICAgIHNjb3BlLmNvbmZpZy5zdGF0ZSA9ICRzdGF0ZS5ocmVmKHNjb3BlLmNvbmZpZy5zdGF0ZSk7XG5cbiAgICAgICAgfVxuICAgIH07XG5cbn0pO1xuLyoqXG4gKiBGaWx0ZXJzXG4gKiBQbGFjZSBhbGwgY3VzdG9tIGZpbHRlcnMgaGVyZVxuICovXG5cbi8qKlxuICogRmlsdGVyIGR1cGxpY2F0ZSB2YWx1ZXMgZnJvbSBhbiBhcnJheVxuICogQHJldHVybnMge2FycmF5fSBBcnJheSB3aXRoIHVuaXF1ZSB2YWx1ZXNcbiAqL1xuYXBwLmZpbHRlcigndW5pcXVlJywgZnVuY3Rpb24gKCkge1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtcywgZmlsdGVyT24pIHtcblxuICAgICAgICBpZiAoZmlsdGVyT24gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKGZpbHRlck9uIHx8IGFuZ3VsYXIuaXNVbmRlZmluZWQoZmlsdGVyT24pKSAmJiBhbmd1bGFyLmlzQXJyYXkoaXRlbXMpKSB7XG5cbiAgICAgICAgICAgIHZhciBoYXNoQ2hlY2sgPSB7fSxcbiAgICAgICAgICAgICAgICBuZXdJdGVtcyA9IFtdO1xuXG4gICAgICAgICAgICB2YXIgZXh0cmFjdFZhbHVlVG9Db21wYXJlID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc09iamVjdChpdGVtKSAmJiBhbmd1bGFyLmlzU3RyaW5nKGZpbHRlck9uKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVtmaWx0ZXJPbl07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGl0ZW1zLCBmdW5jdGlvbiAoaXRlbSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlVG9DaGVjaywgaXNEdXBsaWNhdGUgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV3SXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuZXF1YWxzKGV4dHJhY3RWYWx1ZVRvQ29tcGFyZShuZXdJdGVtc1tpXSksIGV4dHJhY3RWYWx1ZVRvQ29tcGFyZShpdGVtKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRHVwbGljYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFpc0R1cGxpY2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdJdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0ZW1zID0gbmV3SXRlbXM7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpdGVtcztcblxuICAgIH07XG5cbn0pOyJdfQ==