/**
 * Directives
 * Place all custom directives here
 */

//Generate breadcrumb navigation
app.directive('breadcrumb', function ($state, _pageHeader) {

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

});

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
app.directive('gridView', function ($state) {

    return {
        restrict: 'A',
        templateUrl: 'partials/directives/grid-view.html',
        scope: {
            config: '=gridView'
        },
        controller: function ($scope) {

            $scope.itemsPerPageOptions = [10, 25, 50, 100];
            $scope.itemsPerPage = $scope.itemsPerPageOptions[0];
            $scope.currentPage = 0;

            $scope.go = function (state) {
                $state.go(state.name, state.params);
            };

        }
    };

});

// Modal with a form to create new widgets
app.directive('widgetCreate', function (_widgets) {

    return {
        restrict: 'A',
        templateUrl: 'partials/directives/widget-create.html',
        replace: true
    };

});

// Back button
app.directive('backButton', function ($state) {

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

});