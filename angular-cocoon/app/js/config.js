app.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/Home');
        $stateProvider
            .state('base', {
                abstract: true,
                url: '',
                controller: 'MainCtrl',
                templateUrl: '/views/common/content.html'
            })
            .state('base.home', {
                url: '/Home',
                controller: 'HomeCtrl',
                templateUrl: '/views/pages/home.html'
            });
    }]);