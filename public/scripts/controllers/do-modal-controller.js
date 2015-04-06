angular.module('SayIt').controller('DoModalController', function($scope, $modalInstance, $modal, command, SIDI) {
    $scope.command = command;
    $scope.services = SIDI.services;
    $scope.selectedAction = {};
    $scope.editingCommand = false;

    $scope.ok = function () {
        $modalInstance.close({ trigger: $scope.command, do: $scope.selectedAction });
    };

    $scope.selectAction = function(action) {
        $scope.selectedAction = action;
    };

    $scope.changeCommand = function() {
        $scope.editingCommand = true;
    };

    $scope.saveCommand = function() {
        $scope.editingCommand = false;
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});