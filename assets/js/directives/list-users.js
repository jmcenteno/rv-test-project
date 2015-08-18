app.directive('listUsers', [
    function() {
        
        return {
            restrict: 'A',
            templateUrl: 'partials/list-users.html',
            replace: true,
            scope: {
                users: '=listUsers'
            },
        };
        
    }
]);