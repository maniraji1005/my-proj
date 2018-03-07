(function() {
'use strict';

    angular
        .module('todo.shared.factories')
        .factory('storage', storage);

    storage.$inject = ['$cookies'];
    function storage($cookies) {
        var storage = {};

        storage.get = function (key) {
            return $cookies.get(key);
        };

        storage.put = function (key, value) {
            $cookies.put(key, value);
        };

        storage.delete = function (key) {
            $cookies.remove(key);
        };

        storage.clear = function () {
            var cookies = $cookies.getAll();
            angular.forEach(cookies, function (v, k) {
                $cookies.remove(k);
            });
        };
        return storage;
    }
})();