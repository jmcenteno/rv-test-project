app.controller('UsersCtrl', ['$scope', '_users',
    function($scope, _users) {
        
        _users.getAllUsers().then(function(data) {
            $scope.users = data;
        });
        
    }
]);