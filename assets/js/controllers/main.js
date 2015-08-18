app.controller('MainCtrl', ['$scope',
    function($scope) {
        
        var d = new Date();
        
        $scope.year = d.getFullYear();
        
    }
]);