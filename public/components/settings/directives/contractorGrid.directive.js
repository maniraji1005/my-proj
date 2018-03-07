(function () {
    'use strict';

    angular
        .module('todo.settings.directives')
        .directive('contractorGrid', contractorGrid);
    contractorGrid.$inject = ['api'];
    function contractorGrid(api) {
        var directive = {
            bindToController: true,
            controller: ControllerController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/settings/views/contractor.grid.html',
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
          vm.save = save;
          vm.editMode = false;
          vm.edit = edit;
          function edit(){
            vm.editMode = true;
        }

        function save(data){
            if(data.name)
            {
            $scope.$emit('updateContractor', data);
            vm.editMode = false;
            }
             else 
            {
            if ($('.alertify-log-error').length == 0) {
            alertify.error("Please enter ContractorName");
            }
            }
        }
          vm.getcategory = getcategory;
         function getcategory(data)
         {
             var category = vm.api.company.category;
            category = $filter('filter')(category, {_id: data}, true)[0];
            if(category){
                return category.name;
            }
         }

        
    }
})();
