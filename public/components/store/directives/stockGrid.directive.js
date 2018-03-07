(function () {
    'use strict';

    angular
        .module('todo.store.directives')
        .directive('stockUpdateGrid', stockUpdateGrid);
    stockUpdateGrid.$inject = ['api'];
    function stockUpdateGrid(api) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: stockUpdateGridController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/store/views/stockUpdate.grid.html',
            scope: {
                item: '=item',
                index: '@',
            }
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

    function stockUpdateGridController(api,$filter, $scope) {
        var vm = this;
        vm.api = api;
        vm.editItem = editItem;
        function editItem(category,sub_category,issuedNo,issuedDate,project,remarks, materials,materialTypeName) {
         var data = "test";
          var Objdata = new Object(); 
             //  Objdata.category = category;
             //  Objdata.sub_category = sub_category;
               Objdata.issuedNo = issuedNo;
               Objdata.issuedDate = issuedDate;
               Objdata.project = project;
               Objdata.materials = materials; 
               Objdata.remarks = remarks     
               Objdata.materialTypeName = materialTypeName;   
             $scope.$emit('editstock', Objdata);
        }
        vm.getproject = getproject;
        function getproject(data) {
            var project = $filter('filter')(vm.api.projectList, { _id: data }, true)[0];
            if (project) {
                return project.name;
            }
        }
         vm.api.exeDDL({}, function (err, data) {
                if (!err) {
                    vm.employeeList = data;
                }
            });
        vm.getEmp = getEmp;
        function getEmp(data) {
            if(data)
            {
            var getEmp = $filter('filter')(vm.employeeList, { _id: data }, true)[0];
            if (getEmp) {
                return getEmp.names;
            }
    }
        }
    }

})();
