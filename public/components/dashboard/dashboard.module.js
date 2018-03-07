(function() {
    'use strict';
    
    angular.module('todo.dashboard.controllers', []);
    angular.module('todo.dashboard.factories', []);
    angular.module('todo.dashboard.directives', []);
    
    angular.module('todo.dashboard', [
        'todo.dashboard.controllers',
        'todo.dashboard.factories',
        'todo.dashboard.directives'
    ]);
    
})();