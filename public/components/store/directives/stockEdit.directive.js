(function () {
    'use strict';

    angular
        .module('todo.store.directives')
        .directive('stockUpdateEdit', stockUpdateEdit);
    stockUpdateEdit.$inject = ['api'];
    function stockUpdateEdit(api) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: stockUpdateEditController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/store/views/stockUpdate.Edit.html',
            scope: {
                item: '=item',
                index: '@',
            }
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

    function stockUpdateEditController(api, $filter) {
        var vm = this;
        vm.api = api;
        vm.employeeList = vm.api.employeeList;
        vm.subCategoryList = vm.api.getSub;
        vm.CategoryList = vm.api.getcat;
        vm.contract = vm.api.getContractor;
        vm.getContract = getContract;
        vm.editMateials = vm.api.getStockMat;
        vm.getEmp = getEmp;
        angular.forEach(vm.editMateials, function(e)
        {
             vm.item.category = $filter('filter')(vm.CategoryList, {_id: e.category_id}, true)[0].name;
             vm.item.subcategory = $filter('filter')(vm.subCategoryList, {_id: e.sub_category_id}, true)[0].name;
             vm.item.id = e.mat_code;
        });
        function getContract(data)
        {

           var contract = $filter('filter')(vm.employeeList, {_id: data}, true)[0];
            if(contract){
                return contract.names;
        }
    }
    function getEmp(data)
        {

           var contract = $filter('filter')(vm.contract, {_id: data}, true)[0];
            if(contract){
                return contract.name;
        }
    }
    }
})();
