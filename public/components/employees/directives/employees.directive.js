(function() {
    'use strict';

    angular
        .module('todo.employees.directives')
        .directive('employeeDet', employeeDet);

    employeeDet.$inject = ['$state'];
    function employeeDet($state) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: EmployeeController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: 'components/employees/views/employeeDet.views.html',
            scope: {
                employee : "=employee"
            }
        };
        return directive;
        
        function link(scope, element, attrs) {
        }
    }
    /* @ngInject */
    function EmployeeController ($state) {
        var vm = this;
        vm.detailView = detailView;
        
        function detailView(){
            console.log("emp id", vm.employee._id);
            $state.go('employees.details', {eId: vm.employee._id});
        }
        // console.log("employee", vm.employee);
    }
})();