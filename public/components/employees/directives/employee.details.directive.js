(function() {
    'use strict';

    angular
        .module('todo.employees.directives')
        .directive('employeeDetails', employeeDetails);

    employeeDetails.$inject = ['$stateParams', 'db'];
    function employeeDetails($stateParams, db) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: EmpDetController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: 'components/employees/views/employee.details.view.html',
            scope: {
                
            }
        };
        return directive;
        
        function link(scope, element, attrs) {
        }
    }
    /* @ngInject */
    function EmpDetController ($stateParams, db) {
        var vm = this;
        vm.getHandlingProj = getHandlingProj();
        //Get emp handling projects
        
        ///////////
        function getHandlingProj(){
            return db.getEmpHandlingProj($stateParams.eId);
        }
    }
})();