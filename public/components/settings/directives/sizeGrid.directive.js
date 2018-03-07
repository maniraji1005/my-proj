(function () {
    'use strict';

    angular
        .module('todo.settings.directives')
        .directive('sizeGrid', sizeGrid);

    sizeGrid.$inject = ['api'];
    function sizeGrid(api) {
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
            templateUrl: 'components/settings/views/size.grid.html',
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
          vm.editMode = false;
          vm.save = save;
          function edit(){
            vm.editMode = true;
           // vm.uomList = vm.api.uomList;
        }

        function save(data){
            if(data.name)
            {
            $scope.$emit('sizeupdate', data);
            vm.editMode = false;
            }
            else
            {
            if ($('.alertify-log-error').length == 0) {
            alertify.error("Please enter Size");
            }
            }
        }

    }
})();
