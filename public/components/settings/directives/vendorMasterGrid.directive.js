(function () {
    'use strict';

    angular
        .module('todo.settings.directives')
        .directive('vendorMasterGrid', vendorMasterGrid);

    vendorMasterGrid.$inject = ['api'];
    function vendorMasterGrid(api) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: vendorMasterGridController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/settings/views/vendorMaster.grid.html',
            scope: {
                item: '=item',
                index: '@',
                onRemove: "&"
            }
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

    /* @ngInject */
    function vendorMasterGridController(api, $scope) {
        var vm = this;
        vm.api = api;
        // vm.validation = validation;
        // vm.check = check;
        vm.deleteItem = deleteItem;
        vm.editItem = edititem;
        vm.access = vm.api.vendorAccess;
         function deleteItem(data){
                alertify.confirm("Are you sure to delete this Vendor ?", function(e){
                    if (e) {
                      $scope.$emit('deleteVendor',data);
                    } else {
                    }
                });
            }
        function edititem(data){
            $scope.$emit('editvendor', data);
        }
    }
})();
