angular.module('spotify', ['SIDI']).run(['SIDI', '$window', function(SIDI, $window) {
    SIDI.register(
        'spotify', {
            'friendlyName' : 'Spotify',
            'actions' : {
                'radio' : {
                    name: 'Listen to Spotify radio',
                    call: function(command, args, callback) {
                        $window.open('https://play.spotify.com/radio');
                        callback();
                    },
                    callback: function(response) {
                    }
                },
                'playlists' : {
                    name: 'Listen to one of my playlists',
                    call: function(command, args, callback) {
                        $window.open('https://play.spotify.com/collection/playlists');
                        callback();
                    },
                    callback: function(response) {
                    }
                },
                'albums' : {
                    name: 'Listen to one of my albums',
                    call: function(command, args, callback) {
                        $window.open('https://play.spotify.com/collection/albums');
                        callback();
                    },
                    callback: function(response) {
                    }
                },
                'artists' : {
                    name: 'Listen to one of my artists',
                    call: function(command, args, callback) {
                        $window.open('https://play.spotify.com/collection/artists');
                        callback();
                    },
                    callback: function(response) {
                    }
                },
                'songs' : {
                    name: 'Listen to my songs',
                    call: function(command, args, callback) {
                        $window.open('https://play.spotify.com/collection/songs');
                        callback();
                    },
                    callback: function(response) {
                    }
                }
            }
        }
    );
}]);