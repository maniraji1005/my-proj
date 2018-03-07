(function () {
    'use strict';

    angular
        .module('todo.settings.directives')
        .directive('uomMasterGrid', uomMasterGrid);

    uomMasterGrid.$inject = ['api'];
    function uomMasterGrid(api) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: uomgridController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/settings/views/uom.grid.html',
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
    function uomgridController(api, $scope) {
        var vm = this;
        vm.api = api;
        vm.deleteItem = deleteItem;
      //  vm.getCategory = getCategory;

            function deleteItem(data){
                alertify.confirm("Are you sure to delete this uom ?", function(e){
                    if (e) {
                      $scope.$emit('deleteUom',data);
                    } else {
                    }
                });
            }



      }
})();
