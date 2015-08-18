app.controller('DashboardCtrl', ['$scope', '_users', '_widgets',
    function($scope, _users, _widgets) {
        
        _users.getAllUsers().then(function(data) {
            $scope.users = data;
        });
        
        _widgets.getAllWidgets().then(function(data) {
            $scope.widgets = data;
        });
        
    }
]);