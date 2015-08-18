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
        };
        
    }
]);