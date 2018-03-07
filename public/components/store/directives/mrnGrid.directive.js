(function () {
    'use strict';

    angular
        .module('todo.store.directives')
        .directive('materialReceiptNote', materialReceiptNote);

    // materialRequestGrid.$inject = ['api'];
    function materialReceiptNote() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: mrnGridController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/store/views/mrnGrid.store.html',
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
                scope.$emit('mrntracksheet',data);
            }
        }



    }

    function mrnGridController() {
        var vm = this;
        vm.item.sno = parseInt(vm.index);
       
        // editapp 

    }

})();
