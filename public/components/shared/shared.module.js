(function() {
    'use strict';

    angular.module('todo.shared.factories', []);
    angular.module('todo.shared.directives', []);
    angular.module('todo.shared.constants', []);
    angular.module('todo.shared.providers', []);
    angular.module('todo.shared.filters', []);
    angular.module('todo.shared.controllers', []);
    
    angular.module('todo.shared', [
        'todo.shared.factories',
        'todo.shared.directives',
        'todo.shared.constants',
        'todo.shared.providers',
        'todo.shared.filters',
        'todo.shared.controllers'
    ]);
    
})();