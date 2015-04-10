angular.module('SIDI', ['hue', 'spotify', 'pandora']);

angular.module('SIDI').service('SIDI', [function() {
    var services = {};

    function register(serviceName, commands) {
        services[serviceName] = commands;
    }

    return {
        services: services,
        register: register
    }
}]);