(function () {
    'use strict';

    angular
        .module('todo.purchase.directives')
        .directive('purchaseOrderGrid', purchaseOrderGrid);

    // materialRequestGrid.$inject = ['api'];
    function purchaseOrderGrid() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: poGridController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/purchase/views/poGrid.view.html',
            scope: {
                item: '=item',
                index: '@',
                // mredit: '=method',
                mrdelete: '=method'
            }
        };
        return directive;

        function link(scope, element, attrs, vm) {
            vm.openTrackSheet = function (data){
                scope.$emit('PoTrackSheet',data);
            }
        }



    }

    function poGridController(api) {
        var vm = this;
        vm.api = api;
        vm.item.sno = parseInt(vm.index);
        vm.getCompDet = '';
  // vm.filterCatName = '';
  vm.getCompDet = vm.api.profile.company;

        // editapp 

    }

})();
