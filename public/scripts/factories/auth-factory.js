angular.module('SayIt').factory('auth', ['$firebaseAuth', 'config', function($firebaseAuth, config) {
    var ref = new Firebase(config.FIREBASE_URL);
    return $firebaseAuth(ref);
}]);