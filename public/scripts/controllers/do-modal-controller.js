angular.module('SayIt').controller('DoModalController', function($scope, $modalInstance, $modal, command, SIDI) {
    $scope.command = command;
    $scope.services = SIDI.services;
    $scope.selectedAction = {};

    $scope.ok = function () {
        $modalInstance.close({ trigger: command, do: $scope.selectedAction });
    };

    $scope.selectAction = function(action) {
        $scope.selectedAction = action;
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});