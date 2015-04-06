angular.module('SayIt').factory('settings', ['$firebaseArray', '$firebaseAuth', 'config', function($firebaseArray, $firebaseAuth, config) {
    var ref = new Firebase(config.FIREBASE_URL + "/settings/");
    var auth = ref.getAuth();
    if (auth) return $firebaseArray(new Firebase(config.FIREBASE_URL + "/settings/" + auth.uid));
    else return [];
}]);