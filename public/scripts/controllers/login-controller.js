angular.module('SayIt').controller('LoginController', ["$scope", "config",
    function($scope, config) {
        var ref = new Firebase(config.FIREBASE_URL);
        $scope.loggedIn = false;

        $scope.login = function login(provider) {
            ref.authWithOAuthPopup(provider, function(error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                }
            });
        };

        $scope.logout = function logout() {
            ref.unauth();
        };

        function getName(authData) {
            switch(authData.provider) {
                case 'password':
                    return authData.password.email.replace(/@.*/, '');
                case 'twitter':
                    return authData.twitter.displayName;
                case 'facebook':
                    return authData.facebook.displayName;
                case 'google':
                    return authData.google.displayName;
            }
        }

        function getImage(authData) {
            switch(authData.provider) {
                case 'password':
                    return authData.password.email.replace(/@.*/, '');
                case 'twitter':
                    return authData.twitter.cachedUserProfile.profile_image_url_https;
                case 'facebook':
                    return authData.facebook.cachedUserProfile.picture.data.url;
                case 'google':
                    return authData.google.cachedUserProfile.picture;
            }
        }

        function authDataCallback(authData) {
            if (authData) {
                var name = getName(authData);
                ref.child("users").child(authData.uid).set({
                    provider: authData.provider,
                    name: name
                });
                $scope.loggedIn = true;
                $scope.name = name;
                $scope.imageUrl = getImage(authData);
            } else {
                $scope.loggedIn = false;
            }
        }

        ref.onAuth(authDataCallback);
    }
]);