angular.module('SayIt').controller('SettingsController', function($scope, settings) {
    $scope.settings = settings;

    $scope.save = function() {
        console.log($scope.settings);
    }
});