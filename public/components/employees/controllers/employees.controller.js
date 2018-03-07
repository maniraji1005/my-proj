(function() {
'use strict';

    angular
        .module('todo.employees.controllers')
        .controller('EmployeesController', EmployeesController);

    EmployeesController.$inject = ['db'];
    function EmployeesController(db) {
        var vm = this;
        
        vm.getEmployeeList = db.getEmployees();
        ////////////////

        // function getEmployeeList() {
        //     console.log("emp list", db.getEmployees());
        // }
    }
})();