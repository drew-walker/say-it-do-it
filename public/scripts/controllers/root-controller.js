var recognition = new webkitSpeechRecognition();
recognition.lang = "en-AU";

var commandRecognition = new webkitSpeechRecognition();
commandRecognition.lang = "en-AU";

angular.module('SayIt').controller('RootController', function($scope, $http, $modal, $log) {

    $scope.recognizing = false;
    $scope.final_transcript = '';
    $scope.commands = [];

    $scope.do = function(trigger) {
        var command = $scope.commands.filter(function(command) {
            return command.trigger == trigger;
        })[0];
        if (command && command.do) {
            $http.get(command.do.call).success(function(tweet) {
                command.do.data = tweet;
            });
        }
    };

    $scope.add = function(command) {
        console.log(command);
        $scope.commands.push({
            trigger:command
        });
    };

    $scope.delete = function(command) {

    };

    $scope.listen = function() {
        if ($scope.recognizing) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    $scope.recordCommand = function() {
        commandRecognition.start();
    };

    commandRecognition.addEventListener('result', function(event) {
        $scope.$apply(function() {
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    console.log(event.results[i][0].transcript);
                    //$scope.commands.push({
                    //    trigger:event.results[i][0].transcript
                    //});

                    var modalInstance = $modal.open({
                        templateUrl: 'views/do.html',
                        backdrop: 'static',
                        size: 'sm',
                        controller: 'DoModalController',
                        resolve: {
                            command: function () {
                                return event.results[i][0].transcript;
                            }
                        }
                    });

                    modalInstance.result.then(function (commandAndAction) {
                        $scope.commands.push(commandAndAction);
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                }
            }
        });
    });

    recognition.addEventListener('start', function() {
        $scope.$apply(function() {
            $scope.recognizing = true;
        });
    });

    recognition.addEventListener('error', function(event) {
        console.log("ERROR: ", event);
    });

    recognition.addEventListener('end', function() {
        $scope.$apply(function() {
            $scope.recognizing = false;
        });
    });

    recognition.addEventListener('result', function(event) {
        $scope.interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                $scope.final_transcript = event.results[i][0].transcript;

                console.log($scope.final_transcript);

                $scope.$apply(function() {
                    $scope.commands = $scope.commands.map(function(command) {
                        if ($scope.final_transcript === command.trigger) {
                            $scope.do(command.trigger);
                            command.matched = true;
                        } else {
                            command.matched = false;
                        }
                        return command;
                    });
                });
            } else {
                $scope.interim_transcript += event.results[i][0].transcript;
            }
        }
    });
});