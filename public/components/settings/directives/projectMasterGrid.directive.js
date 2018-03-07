(function () {
    'use strict';

    angular
        .module('todo.settings.directives')
        .directive('projectMasterGrid', projectMasterGrid);

    projectMasterGrid.$inject = ['api'];
    function projectMasterGrid(api) {
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
            templateUrl: 'components/settings/views/projectMasterGrid.html',
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
          vm.edit = edit;
          vm.editMode = false;
          vm.save = save;
          vm.deleteItem = deleteItem;

          function edit(){
            vm.editMode = true;
           // vm.uomList = vm.api.uomList;
        }

        function save(data){
            if(data.location){
                $scope.$emit('proEdit', data);
                vm.editMode = false;
            }
            else 
            {
            if ($('.alertify-log-error').length == 0) {
            alertify.error("Please enter Location");
            }
            }
            
        }
        function deleteItem(data) {
            alertify.confirm("Are you sure to delete this project", function (e) {
                if(e) {
                       $scope.$emit("proDelete",data); }
                else {}
            });
        }
    }
})();
