(function () {
    'use strict';

    angular
        .module('todo.settings.directives')
        .directive('vendorMasterAdd', vendorMasterAdd);

    // materialRequestGrid.$inject = ['api'];
    function vendorMasterAdd() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: vendorAddController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/settings/views/vendorMasterAdd.view.html',
            scope: {
                item: '=item',
                index: '@',
                // mredit: '=method',
                mrdelete: '=method'
            }
        };
        return directive;

        function link(scope, element, attrs, vm) {

        }
    }


    function vendorAddController($scope, api, $filter) {
        var vm = this;
        vm.api = api;
        vm.pigetDet = [];
        vm.button = true;
        vm.getCategory = getCategory;
        vm.categoryList = vm.api.MaterialCategory;
        vm.categoryName = vm.api.categoryName;
        vm.addVendorDet = addVendorDet;
        vm.vengetDet = [];
        vm.getUomName = getUomName;
        vm.subCategoryList = vm.api.subcate;
         vm.api.companyDet(function (err, data) {

        vm.companyId = data._id;
    });
     vm.getCompDet = '';
        
        vm.getCompDet = vm.api.profile.company;
        // var vendorDet = [];
        vm.removeCategory = removecategory;
        function addVendorDet(venDet, catId, index,flag) {
            var chVenDet = venDet[index];
            if(vm.getCompDet == "CH0001"){
            if(flag){
                vm.api.vendorAddedMaterials.push({
                    "material": chVenDet['_id'],
                    "id" : chVenDet['_id'],
                    "mat_code": chVenDet['id'],
                    "name": chVenDet['name'],
                    "category": chVenDet['category'],
                })
            }else{
                vm.api.vendorAddedMaterials = $filter('filter')(vm.api.vendorAddedMaterials, function(a){
                    return a.mat_code !== chVenDet.id
                }, true);
        }}
        else{
             if(flag){
                vm.api.vendorAddedMaterials.push({
                    "id": chVenDet['id'],
                    "name": chVenDet['name'],
                    "category": chVenDet['category'],
                })
            }else{
                vm.api.vendorAddedMaterials = $filter('filter')(vm.api.vendorAddedMaterials, function(a){
                    return a.id !== chVenDet.id
                }, true);
            }
        }
        }
        function getCategory(cat) {
            var category = vm.api.company.category;
            var filterCat = $filter('filter')(category, { _id: cat }, true)[0];
            return filterCat.name;
        }
       

        function removecategory(id) {
            // vm.vengetDet = $filter('filter')(vm.vengetDet, function(a){
            //     return a.catId !== id;
            // }, true)
            $scope.$emit('removeCategory', id);
        }

        function getUomName(data) {
            var uom = $filter('filter')(vm.api.uomList, {_id:data}, true)[0];
            if(uom){
                return uom.name;
            }
        }
        if(vm.getCompDet == "CH0001")

{       vm.getSubcate  =getSubcate;
    function getSubcate(data) {
            var subcate = $filter('filter')(vm.subCategoryList, {_id:data}, true)[0];
            if(subcate){
                return subcate.name;
            }
        }
    }
    }

})();
