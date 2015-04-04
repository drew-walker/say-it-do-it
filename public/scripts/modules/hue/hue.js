angular.module('hue', ['SIDI']).run(['SIDI', '$http', function(SIDI, $http) {
    SIDI.register(
        'hue', {
            'turnOffLight' : {
                name: 'Turn off the lights',
                call: function(command, args, callback) {
                    var lightIdentifier = args[0].replace(/ /g, '-') ;
                    $http.get("/api/v1/hue/lights/" + lightIdentifier + "/off").success(function() {
                        callback();
                        command.callback.apply(this, arguments);
                    });
                },
                callback: function(response) {
                }
            },
            'turnOnLight' : {
                name: 'Turn on the lights',
                call: function(command, args, callback) {
                    var lightIdentifier = args[0].replace(/ /g, '-') ;
                    $http.get("/api/v1/hue/lights/" + lightIdentifier + "/on").success(function() {
                        callback();
                        command.callback.apply(this, arguments);
                    });
                },
                callback: function(response) {
                }
            },
            'turnUpLight' : {
                name: 'Brighten the lights',
                call: function(command, args, callback) {
                    var lightIdentifier = args[0].replace(/ /g, '-') ;
                    $http.get("/api/v1/hue/lights/" + lightIdentifier + "/brighten").success(function() {
                        callback();
                        command.callback.apply(this, arguments);
                    });
                },
                callback: function(response) {
                }
            },
            'turnDownLight' : {
                name: 'Darken the lights',
                call: function(command, args, callback) {
                    var lightIdentifier = args[0].replace(/ /g, '-') ;
                    $http.get("/api/v1/hue/lights/" + lightIdentifier + "/darken").success(function() {
                        callback();
                        command.callback.apply(this, arguments);
                    });
                },
                callback: function(response) {
                }
            }
        }
    );
}]);