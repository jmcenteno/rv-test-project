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
app.factory('_users', ['$http', 'API_URL',
    function ($http, API_URL) {

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

    }
]);

/* *
 * _widgets Factory
 *
 * AngularJS service to request widget data from remote API
 * @returns     (object) An object with methods to obtain collections, single records, and to modify records
 */
app.factory('_widgets', ['$http', 'API_URL',
    function ($http, API_URL) {

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

    }
]);