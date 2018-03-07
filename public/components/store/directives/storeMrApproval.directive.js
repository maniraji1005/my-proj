(function () {
    'use strict';

    angular
        .module('todo.store.directives')
        .directive('materialRequestApproval', materialRequestApproval);

    materialRequestApproval.$inject = ['api', '$stateParams'];
    function materialRequestApproval(api, $stateParams) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: mrApprovalController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/store/views/materialRequestApproval.store.html',
            scope: {
                item: '=item',
                index: '@'
            }
        };
        return directive;
        
        function link(scope, element, attrs, vm) {

            vm.openTrackSheet = function(data){
                scope.$emit('mrapprovaldata', {'mrid': data});
            }
        }

   
    }
    
    function mrApprovalController(){
        var vm = this;
        vm.item.sno = parseInt(vm.index);
    }
    
})();
