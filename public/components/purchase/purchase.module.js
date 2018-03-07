(function() {
    'use strict';
    
    angular.module('todo.purchase.controllers',['daterangepicker']);
    angular.module('todo.purchase.factories', []);
    angular.module('todo.purchase.directives', []);
    
    angular.module('todo.purchase', [
        'todo.purchase.controllers',
        'todo.purchase.factories',
        'todo.purchase.directives'
    ]);
    
})();