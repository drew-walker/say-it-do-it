var recognition = new webkitSpeechRecognition();
recognition.lang = "en-AU";

var commandRecognition = new webkitSpeechRecognition();
commandRecognition.lang = "en-AU";

angular.module('SayIt').controller('RootController', function($scope, $http, $modal, $log, commands, config, auth, SIDI, $sce) {
    $scope.auth = auth;
    $scope.recognizing = false;
    $scope.final_transcript = '';

    $scope.auth.$onAuth(function(authData) {
        $scope.authData = authData;
        $scope.commands = commands;
    });

    $scope.try = function() {
        $scope.authData = null;
        $scope.error = null;

        $scope.auth.$authAnonymously().then(function(authData) {
            $scope.authData = authData;
        }).catch(function(error) {
            $scope.error = error;
        });
    };

    $scope.do = function(trigger, args) {
        var command = $scope.commands.filter(function(command) {
            return command.trigger == trigger;
        })[0];
        if (command && command.do) {
            command.running = true;
            var commandParts = command.do.split('.');
            commandObject = SIDI.services[commandParts[0]].actions[commandParts[1]];
            commandObject.call(commandObject, args, function() {
                command.running = false;
            });
        }
    };

    $scope.add = function(command) {
        $scope.commands.$add({
            trigger:command
        });
    };

    $scope.getFriendlyCommandName = function getFriendlyCommandName(command) {
        var commandParts = command.split('.');
        var serviceKey = commandParts[0];
        var actionKey = commandParts[1];
        var serviceObject = SIDI.services[serviceKey];
        return $sce.trustAsHtml('<span class="service-icon" style="background-image:url(\'/images/logo-' + serviceKey + '.png\')">' + serviceObject.friendlyName + '</span> ' + serviceObject.actions[actionKey].name);
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

                    var modalInstance = $modal.open({
                        templateUrl: 'views/do.html',
                        backdrop: 'static',
                        controller: 'DoModalController',
                        resolve: {
                            command: function () {
                                return event.results[i][0].transcript;
                            }
                        }
                    });

                    modalInstance.result.then(function (commandAndAction) {
                        $scope.commands.$add(commandAndAction);
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

                $scope.$apply(function() {
                    $scope.commands = $scope.commands.map(function(command) {
                        var matches = new RegExp(command.trigger, "g").exec($scope.final_transcript);
                        if (matches) {
                            var args = matches.splice(1, matches.length - 1);
                            command.matched = true;
                            $scope.do(command.trigger, args);
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