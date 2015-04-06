angular.module('SayIt', ['ui.bootstrap', 'firebase', 'SIDI', 'ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/views/index.html'
            })
            .when('/settings', {
                templateUrl: '/views/settings.html',
                controller: 'SettingsController'
            })
    });