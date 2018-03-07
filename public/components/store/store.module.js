(function() {
    'use strict';

    angular.module('todo.store.controllers', ['daterangepicker']);
    angular.module('todo.store.directives', []);
    
    angular.module('todo.store', [
        'todo.store.controllers',
        'todo.store.directives'
    ]);
    
})();