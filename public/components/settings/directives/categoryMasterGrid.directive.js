(function () {
    'use strict';

    angular
        .module('todo.settings.directives')
        .directive('categoryMasterGrid', categoryMasterGrid);

    categoryMasterGrid.$inject = ['api'];
    function categoryMasterGrid(api) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: ControllerController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/settings/views/categoryMaster.grid.html',
            scope: {
                item: '=item',
                index: '@'
            }
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

    /* @ngInject */
    function ControllerController(api, $scope) {
          var vm = this;
          vm.api = api;
          vm.deleteItem = deleteItem;
           vm.edit = edit;
           vm.save = save;
          vm.editMode = false;
         
          function edit(){
            vm.editMode = true;
           // vm.uomList = vm.api.uomList;
        }

        function save(data){
            $scope.$emit('categoryEdit', data);
            vm.editMode = false;
        }
        //    alert(JSON.stringify(category.name));
         function deleteItem(data){
                alertify.confirm("Are you sure to delete this category ?", function(e){
                    if (e) {
                       $scope.$emit('deleteCategory', data);
                    } else {
                    }
                });
            }

    }
})();
