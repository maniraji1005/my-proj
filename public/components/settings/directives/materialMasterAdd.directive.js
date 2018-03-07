(function () {
    'use strict';

    angular
        .module('todo.settings.directives')
        .directive('materialMasterAdd', materialMasterAdd);

    materialMasterAdd.$inject = ['api'];
    function materialMasterAdd(api) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: materialMasterAddController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/settings/views/materialMasterAdd.view.html',
            scope: {
                item: '=item',
                index: '@',
                onRemove: "&"
            }
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

    /* @ngInject */
    function materialMasterAddController(api, $scope) {
        var vm = this;
        vm.api = api;
        vm.validation = validation;
        vm.check = check;
        vm.deleteAdd = deleteAdd;
        vm.materialsAdd = [];
        vm.matidcheck = matidcheck;
      //  vm.getsize = getsize;
         vm.getCompDet = '';
        
        vm.getCompDet = vm.api.profile.company;

        vm.api.getUom({},function (err, data) {
            if (!err) {
                vm.uomDetails = data.uomList;
            }
        });
        vm.sizeList = vm.api.getSize;
        function validation(data) {
            if (data) {
                return 'highlit';
            } else {
                return '';
            }
        }
        function matidcheck(nomat)
        {
        
             if(nomat === '0'){
                return "highlit";
            }else{
                return "";
            }
        }
        if(vm.getCompDet == 'CH0001') {
         vm.materialTypeList = [];
        var Mat = vm.api.company.material_type;
        for( var k = 0 ; k < Mat.length ; k++) {
             vm.materialTypeList.push(Mat[k]);
        }
        }
        function check(data) {
            
        }
        vm.getUomSize = getUomSize;
        function getUomSize(data)
        {
            var size = {
                "catID" : data.category,
                "subCatID" : data.subcategory,
                "uom": data.uom
            }
            vm.api.sizeGrid(size, function (err ,data) {
            if(!err) {
               vm.sizeList = data.materialSizeList;
             //  vm.api.getSize = vm.sizeList;
            }
        });
        }
         function deleteAdd(data)
        { 
            $scope.$emit('deleteAddMaterilas', data);
        } 
    }
})();
