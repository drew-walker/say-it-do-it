var recognition = new webkitSpeechRecognition();
recognition.lang = "en-AU";

var commandRecognition = new webkitSpeechRecognition();
commandRecognition.lang = "en-AU";

angular.module('SayIt').controller('RootController', function($scope, $http, $modal, $log) {

    $scope.recognizing = false;
    $scope.final_transcript = '';
    $scope.commands = [{
        trigger : 'turn off (.+)',
        do : {
            name: 'Turn off the lights',
            call: function(command, args) {
                var lightIdentifier = args[0].replace(/ /g, '-') ;
                $http.get("/api/v1/hue/lights/" + lightIdentifier + "/off").success(function() {
                    command.do.callback.apply(this, arguments);
                    command.do.running = false;
                });
            },
            callback: function(response) {
                //console.log(response);
            }
        }
    }, {
        trigger : 'turn on (.+)',
        do : {
            name: 'Turn on the lights',
            call: function(command, args) {
                var lightIdentifier = args[0].replace(/ /g, '-') ;
                $http.get("/api/v1/hue/lights/" + lightIdentifier + "/on").success(function() {
                    command.do.callback.apply(this, arguments);
                    command.do.running = false;
                });
            },
            callback: function(response) {
                //console.log(response);
            }
        }
    }, {
        trigger : 'turn up (.+)',
        do : {
            name: 'Brighten the lights',
            call: function(command, args) {
                var lightIdentifier = args[0].replace(/ /g, '-') ;
                $http.get("/api/v1/hue/lights/" + lightIdentifier + "/brighten").success(function() {
                    command.do.callback.apply(this, arguments);
                    command.do.running = false;
                });
            },
            callback: function(response) {
                //console.log(response);
            }
        }
    }, {
        trigger : 'turn down (.+)',
        do : {
            name: 'Darken the lights',
            call: function(command, args) {
                var lightIdentifier = args[0].replace(/ /g, '-') ;
                $http.get("/api/v1/hue/lights/" + lightIdentifier + "/darken").success(function() {
                    command.do.callback.apply(this, arguments);
                    command.do.running = false;
                });
            },
            callback: function(response) {
                //console.log(response);
            }
        }
    }];

    $scope.do = function(trigger, args) {
        var command = $scope.commands.filter(function(command) {
            return command.trigger == trigger;
        })[0];
        if (command && command.do) {
            command.do.running = true;
            command.do.call(command, args);
        }
    };

    $scope.add = function(command) {
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