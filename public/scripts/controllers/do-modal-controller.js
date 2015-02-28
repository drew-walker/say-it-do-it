angular.module('SayIt').controller('DoModalController', function($scope, $modalInstance, command) {
    $scope.command = command;

    $scope.availableActions = [
        { name: 'See my latest Tweet' },
        { name: 'Change the world' }
    ];
    $scope.selectedAction = {};

    $scope.ok = function () {
        //$modalInstance.close($scope.selected.item);
    };

    $scope.selectAction = function(action) {
        $scope.selectedAction = action;
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});