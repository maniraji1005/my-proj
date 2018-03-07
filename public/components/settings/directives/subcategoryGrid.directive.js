(function () {
    'use strict';

    angular
        .module('todo.settings.directives')
        .directive('subCategoryGrid', subCategoryGrid);
    subCategoryGrid.$inject = ['api'];
    function subCategoryGrid(api) {
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
            templateUrl: 'components/settings/views/subCategory.grid.html',
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
    function ControllerController(api, $scope, $filter) {
        
          var vm = this;
          vm.api = api;
           vm.edit = edit;
           vm.save = save;
          vm.editMode = false;
         vm.getcategory = getcategory;
         function getcategory(data)
         {
             var category =  vm.api.category;
            category = $filter('filter')(category, {_id: data}, true)[0];
            if(category){
                return category.name;
            }
         }
          function edit(){
            vm.editMode = true;
           // vm.uomList = vm.api.uomList;
        }

        function save(data){
            $scope.$emit('editSubcategory', data);
            vm.editMode = false;
        }

        
    }
})();
