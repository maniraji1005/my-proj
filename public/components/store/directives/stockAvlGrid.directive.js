(function () {
    'use strict';

    angular
        .module('todo.store.directives')
        .directive('stockAvlGrid', stockAvlGrid);

    stockAvlGrid.$inject = ['api'];
    function stockAvlGrid(api) {
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
            templateUrl: 'components/store/views/stockAvlGrid.html',
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
    function ControllerController(api, $scope,$filter) {
          var vm = this;
          vm.api = api;
          vm.getsubcate = getsubcate;
          vm.getcate = getcate;
          vm.subCategoryList = vm.api.getSub;
          vm.CategoryList = vm.api.getcat;
          vm.materialBal = vm.api.stockDate;
          vm.total_quantity = 0;
        vm.totalConsume_quantity = 0;
        vm.project = vm.api.projectAvl;
          function getsubcate(data) {
        var subcategory = $filter('filter')(vm.subCategoryList, { _id: data }, true)[0];
        if (subcategory) {
            return subcategory.name;
        }
    }
    function getcate(data) {
        var category = $filter('filter')(vm.CategoryList, { _id: data }, true)[0];
        if (category) {
            return category.name;
        }
    }

      vm.api.getUom({}, function (err, data) {
        if (!err) {
          vm.uomList = data.uomList;
        } else {
          // alert('no data');
        }
      });
      vm.api.getsizeList({}, function (err, data) {
        if (!err) {
          vm.sizeList = data.materialSizeList;
          vm.api.getSize = vm.sizeList;
        }
      });
      vm.getopen = getopen;
    
     function getopen(data)
      {
                     if(vm.materialBal !== null)
                     {
                       for(var i = 0; i < vm.materialBal.length ; i++)
                       {
                             if(data == vm.materialBal[i].material){
                            vm.opening_quantity = vm.materialBal[i].opening_quantity;     
                            vm.mrn_received_quantity = vm.materialBal[i].mrn_received_quantity;
                            vm.total_quantity = vm.opening_quantity + vm.mrn_received_quantity;
                            vm.issued_quantity = vm.materialBal[i].sis_issued_quantity;
                            vm.available_quantity = vm.materialBal[i].available_quantity;
                            vm.sts_issued_quantity = vm.materialBal[i].sts_issued_quantity;
                            vm.totalConsume_quantity = vm.issued_quantity + vm.sts_issued_quantity;
                            if(vm.opening_quantity !== null || vm.opening_quantity !== "" || vm.opening_quantity !== undefined)
                            {
                                return i = 0;
                            }
                       }
                else
                {
                           vm.total_quantity = 0;
            vm.opening_quantity = 0;
            vm.totalConsume_quantity = 0;
            vm.mrn_received_quantity = 0;
            vm.issued_quantity = 0;
            vm.available_quantity = 0;
            vm.sts_issued_quantity = 0;
                       }
      }
      }
      else
                {
            vm.total_quantity = 0;
            vm.opening_quantity = 0;
            vm.totalConsume_quantity = 0;
            vm.mrn_received_quantity = 0;
            vm.issued_quantity = 0;
            vm.available_quantity = 0;
            vm.sts_issued_quantity = 0;
                       }
                    }
      
      
      vm.getUom = getUom;
      function getUom(data)
      {
          var uom = $filter('filter')(vm.uomList, {_id : data},true)[0];
          if(uom) {
              return uom.name;
          }
      }
      vm.getSize = getSize;
      function getSize(data) {
          var size = $filter('filter')(vm.sizeList, {_id : data}, true)[0];
          if(size) {
              return size.name;
          }
      }
    
    }

})();
