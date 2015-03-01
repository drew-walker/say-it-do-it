angular.module('SayIt').controller('DoModalController', function($scope, $modalInstance, $modal, command) {
    $scope.command = command;

    $scope.availableActions = [
        {
            name: 'Turn on the lights',
            call: "/api/v1/hue/lights/3/on",
            callback: function(response) {
                console.log(response);
            }
        },
        {
            name: 'Turn off the lights',
            call: "/api/v1/hue/lights/3/on",
            callback: function(response) {
                console.log(response);
            }
        }
    ];
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