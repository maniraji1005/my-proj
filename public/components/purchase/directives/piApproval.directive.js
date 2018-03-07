(function () {
    'use strict';

    angular
        .module('todo.purchase.directives')
        .directive('purchaseIndentApproval', purchaseIndentApproval);

    // materialRequestGrid.$inject = ['api'];
    function purchaseIndentApproval() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: piApprovalController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/purchase/views/purchaseIndentApproval.purchase.html',
            scope: {
                item: '=item',
                index: '@',
                // mredit: '=method',
                mrdelete: '=method'
            }
        };
        return directive;

        function link(scope, element, attrs, vm) {
            // vm.edititem = function (data) {
            //     scope.$emit('mredit',data);
            // }
            
            // vm.deleteitem = function (data){
            //     scope.$emit('mrdelete',data);
            // }
            
            vm.openTrackSheet = function (data){
                scope.$emit('piTrackSheet',data);
            }
        }



    }

    function piApprovalController() {
        var vm = this;
        vm.item.sno = parseInt(vm.index);

        // editapp 

    }

})();
