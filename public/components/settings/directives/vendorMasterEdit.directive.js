(function () {
    'use strict';

    angular
        .module('todo.settings.directives')
        .directive('vendorMasterEdit', vendorMasterEdit);

    // materialRequestGrid.$inject = ['api'];
    function vendorMasterEdit() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: vendorEditController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/settings/views/vendorMasterEdit.view.html',
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


    function vendorEditController($scope, api, $filter) {
        var vm = this;
        vm.api = api;
        vm.getCategory = getCategory;
        vm.addVendorDet = addVendorDet;
          vm.subCategoryList = vm.api.subcate;
          vm.api.companyDet(function (err, data) {

        vm.companyId = data._id;
         });
         if(vm.api.profile.company == "CH0001")
           {
             vm.getSubcate  =getSubcate;
    function getSubcate(data) {
            var subcate = $filter('filter')(vm.subCategoryList, {_id:data}, true)[0];
            if(subcate){
                return subcate.name;
            }
        }
           }
        function getCategory(cat) {
            var category = vm.api.company.category;
            var filterCat = $filter('filter')(category, { _id: cat }, true)[0];
            return filterCat.name;
        }

        vm.materialcheck = materialcheck;
        vm.removeCategory = removeCategory;

        function materialcheck(data, index) {
            if(vm.api.vendorMaterialsDet)
            {
        
         //  alert(vm.api.profile.company);
      
           if(vm.api.profile.company == "CO00001")
           {
                  var material = $filter('filter')(vm.api.vendorMaterialsDet, {id : data.id}, true)[0];
               if(material){
               data.flag = true;
               vm.api.vendorAddedMaterials.push({
                "id": data.id,
                "name": data.name,
                "category": data.category,
            })
           }
           }
           else
           {
              var material = $filter('filter')(vm.api.vendorMaterialsDet, {material : data._id}, true)[0];
           if(material){
               data.flag = true;
               vm.api.vendorAddedMaterials.push({
                "material": data._id,
                 "id": data._id,
                "mat_code" : data.id,
                "name": data.name,
                "category": data.category
            })
           }
        }
            }
        }

        function addVendorDet(venDet, catId, index, flag) {
            // console.log(venDet);
            if(vm.api.profile.company == "CH0001")
            {
            var chVenDet = venDet[index];
            if(flag){
                vm.api.vendorAddedMaterials.push({
                "material": chVenDet['_id'],
                 "id": chVenDet['_id'],
                "mat_code": chVenDet['id'],
                "name": chVenDet['name'],
                "category": chVenDet['category'],
            })
            }else{
                // vm.api.vendorAddedMaterials = $filter('filter')(vm.api.vendorAddedMaterials)
               vm.api.vendorAddedMaterials =  _.filter(vm.api.vendorAddedMaterials, function(data){ return data.mat_code !== chVenDet.id; });
               vm.api.vendorMaterialsDet =  _.filter(vm.api.vendorMaterialsDet, function(data){ return data.mat_code !== chVenDet.id; });
            }
            }
            else
            {
                 var chVenDet = venDet[index];
            if(flag){
                vm.api.vendorAddedMaterials.push({
                "id": chVenDet['id'],
                "name": chVenDet['name'],
                "category": chVenDet['category'],
            })
            }else{
                // vm.api.vendorAddedMaterials = $filter('filter')(vm.api.vendorAddedMaterials)
               vm.api.vendorAddedMaterials =  _.filter(vm.api.vendorAddedMaterials, function(data){ return data.id !== chVenDet.id; });
               vm.api.vendorMaterialsDet =  _.filter(vm.api.vendorMaterialsDet, function(data){ return data.id !== chVenDet.id; });
            }
            }
            // console.log(vm.api.vendorAddedMaterials);
        }

        function removeCategory(id){
            $scope.$emit('editremoveCategory', id);
        }
    }

})();
