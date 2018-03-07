(function () {
    'use strict';

    angular
        .module('todo.settings.directives')
        .directive('materialMasterGrid', materialMasterGrid);

    materialMasterGrid.$inject = ['api', '$filter'];
    function materialMasterGrid(api, $filter) {
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
            templateUrl: 'components/settings/views/materialMaster.grid.html',
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
        vm.deleteItem = deleteItem;
        vm.getCategoryName = getCategoryName;
        vm.getUomName = getUomName;
        vm.access = vm.api.mmAccess;
        vm.getCategoryId = getCategoryId;
        vm.getSizeName = getSizeName;
        vm.getSubCategory = getSubCategory;
         vm.getCompDet = '';
        
        vm.getCompDet = vm.api.profile.company;

        vm.api.getSubCategory({}, function (err, data) {
        if (!err) {
            //laert("No Data");
            vm.subCategoryList = data.subcatgoriesList;
        }
        });
        function getSubCategory(data) {
            if(data)
            {
            var subcategory = $filter('filter')(vm.subCategoryList, { _id: data }, true)[0];
        if (subcategory) {
            return subcategory.name;
        }
        }}

        function edit(){
            vm.editMode = true;
            vm.uomList = vm.api.uomList;
        }

        function save(data){
            if(vm.getCompDet == "CH0001")
            {
            if(data.name && data.specification)
            {
            $scope.$emit('editedMaterial', data);
            vm.editMode = false;
        }
        else
        {
             if ($('.alertify-log-error').length == 0) {
            alertify.error("some fileds missing");
        }
        }
            }
            else
            {
                $scope.$emit('editedMaterial', data);
            vm.editMode = false;
            }
    }
        function deleteItem(data){
                alertify.confirm("Are you sure to delete this Material ?", function(e){
                    if (e) {
                       $scope.$emit('Materialdelete', data);
                    } else {
                    }
                });
            }
        function getCategoryName(data){
            var category = vm.api.company.category;
            category = $filter('filter')(category, {_id: data}, true)[0];
            if(category){
               // alert(JSON.stringify(category));
                return category.name;
            }
        }

        function getCategoryId(data){
            var category = vm.api.company.category;
            category = $filter('filter')(category, {_id: data}, true)[0];
            if(category){
                return category.id;
            }
        }

        function getUomName(data) {
            var uom = $filter('filter')(vm.api.uomList, {_id:data}, true)[0];
            if(uom){
                return uom.name;
            }
        }
        function getSizeName(data) {
            var getsize = $filter('filter')( vm.api.getSizeList, {_id:data}, true)[0];
            if(getsize){
                return getsize.name;
            }
        }
    }
})();
