/*
 * _widgets Factory
 *
 * AngularJS service to request widget data from remote API
 * @returns     (object) An object with methods to obtain collections, single records, and to modify records
 */
app.factory('_widgets', ['$http', 'API_URL',
    function($http, API_URL) {
        
        var widgets = {};
        
        widgets.getAllWidgets = function() {
            return $http.get(API_URL + '/widgets').then(function(response) {
                return response.data;
            });
        };
        
        widgets.getWidget = function(id) {
            return $http.get(API_URL + '/widgets/' + id).then(function(response) {
                return response.data;
            });
        };
        
        widgets.createWidget = function(params) {
            return $http.post(API_URL + '/widgets', params).then(function(response) {
                return response.data;
            });
        };
        
        widgets.editWidget = function(id, params) {
            return $http.put(API_URL + '/widgets/' + id, params).then(function(response) {
                return response.data;
            });
        };
        
        return widgets;
        
    }
]);