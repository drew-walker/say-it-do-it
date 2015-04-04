angular.module('SayIt').factory('commands', ['$firebaseArray', '$firebaseAuth', 'config', function($firebaseArray, $firebaseAuth, config) {
    var ref = new Firebase(config.FIREBASE_URL + "/commands/");
    var auth = ref.getAuth();
    if (auth) return $firebaseArray(new Firebase(config.FIREBASE_URL + "/commands/" + auth.uid));
    else return [];
}]);