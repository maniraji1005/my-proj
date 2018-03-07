(function () {
    'use strict';
    angular.module("todo", [
        'ui.router',
        'todo.user',
        'todo.shared',
        'todo.store',
        'todo.login.controllers',
        'todo.storeMrController',
        'todo.storeMiController',
        'todo.storeMrnController',
        'todo.purchaseIndentController',
        'todo.purchaseOrderController',
        'todo.trackSheetController',
        'todo.purchaseTrackSheetController',
        'todo.purchase',
        'todo.dashboard',
        'todo.dashboard.controllers',
        'todo.settings',
        'ngCookies',
        'ngAnimate',
        'ui.bootstrap',
        'ui.footable'
    ]);
})();