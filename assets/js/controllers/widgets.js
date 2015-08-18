app.controller('WidgetsCtrl', ['$scope', '_widgets',
    function($scope, _widgets) {
        
        _widgets.getAllWidgets().then(function(data) {
            $scope.widgets = data;
        });
        
    }
]);