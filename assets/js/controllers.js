app.controller('MainCtrl', ['$scope',
    function($scope) {
        
        var d = new Date();
        
        $scope.year = d.getFullYear();
        
    }
]);

app.controller('DashboardCtrl', ['$scope', '_users', '_widgets',
    function($scope, _users, _widgets) {
        
        _users.getAllUsers().then(function(data) {
            $scope.users = data;
        });
        
        _widgets.getAllWidgets().then(function(data) {
            $scope.widgets = data;
        });
        
        $scope.$parent.pageTitle = 'Dashboard';
        $scope.$parent.breadcrumb = [
            {
                text: 'Home',
                href: null
            }
        ];
        
    }
]);

app.controller('UsersCtrl', ['$scope', '_users',
    function($scope, _users) {
        
        _users.getAllUsers().then(function(data) {    
            $scope.users = data;
        });
        
        $scope.$parent.pageTitle = 'Dashboard';
        $scope.$parent.breadcrumb = [
            {
                text: 'Home',
                href: '/#/'
            },
            {
                text: 'Users',
                href: null
            }
        ];
        
    }
]);

app.controller('UserDetailsCtrl', ['$scope', '_users', '$routeParams',
    function($scope, _users, $routeParams) {
        
        $scope.$parent.pageTitle = 'Dashboard';
        
        _users.getUser($routeParams.id).then(function(data) {    
            
            $scope.user = data;
            
            $scope.$parent.breadcrumb = [
                {
                    text: 'Home',
                    href: '/#/'
                },
                {
                    text: 'Users',
                    href: '/#/users'
                },
                {
                    text: data.name,
                    href: null
                }
            ];
            
        });
        
    }
]);

app.controller('WidgetsCtrl', ['$scope', '_widgets',
    function($scope, _widgets) {
        
        $scope.$parent.pageTitle = 'Dashboard';
        $scope.$parent.breadcrumb = [
            {
                text: 'Home',
                href: '/#/'
            },
            {
                text: 'Widgets',
                href: null
            }
        ];
        
        _widgets.getAllWidgets().then(function(data) {
            $scope.widgets = data;
        });
        
    }
]);

app.controller('WidgetDetailsCtrl', ['$scope', '_widgets', '$routeParams',
    function($scope, _widgets, $routeParams) {
        
        $scope.$parent.pageTitle = 'Dashboard';
        
        _widgets.getWidget($routeParams.id).then(function(data) {
            
            $scope.widget = data;
            
            $scope.$parent.breadcrumb = [
                {
                    text: 'Home',
                    href: '/#/'
                },
                {
                    text: 'Widgets',
                    href: '/#/widgets'
                },
                {
                    text: data.name,
                    href: null
                }
            ];
            
        });
        
    }
]);