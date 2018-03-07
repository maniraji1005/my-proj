(function() {
    'use strict';
    
    angular.module('todo.settings.controllers',[]);
    angular.module('todo.settings.factories', []);
    angular.module('todo.settings.directives', []);
    
    angular.module('todo.settings', [
        'todo.settings.controllers',
        'todo.settings.factories',
        'todo.settings.directives'
    ]);
    
})();