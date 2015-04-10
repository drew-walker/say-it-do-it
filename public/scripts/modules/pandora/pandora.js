angular.module('pandora', ['SIDI']).run(['SIDI', '$window', function(SIDI, $window) {
    SIDI.register(
        'pandora', {
            'friendlyName' : 'Pandora',
            'actions' : {
                'radio' : {
                    name: 'Listen to Pandora radio',
                    call: function(command, args, callback) {
                        $window.open('https://www.pandora.com');
                        callback();
                    },
                    callback: function(response) {
                    }
                }
            }
        }
    );
}]);