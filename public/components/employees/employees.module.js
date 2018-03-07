(function() {
    'use strict';
    
    angular.module('todo.employees.controllers', []);
    angular.module('todo.employees.factories', []);
    angular.module('todo.employees.directives', []);
    
    angular.module('todo.employees', [
        'todo.employees.controllers',
        'todo.employees.factories',
        'todo.employees.directives'
    ]);
    
})();