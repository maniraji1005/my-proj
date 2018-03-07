(function () {
    'use strict';

    angular
        .module('todo.purchase.directives')
        .directive('purchaseIndentAdd', purchaseIndentAdd);

    purchaseIndentAdd.$inject = ['api', '$filter'];
    function purchaseIndentAdd(api, $filter) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: PurchaseIndentAddController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/purchase/views/purchaseIndentAdd.view.html',
            scope: {
                item: '=item',
                index: '@'
            }
        };
        return directive;

        function link(scope, element, attrs, vm, api) {
            // console.log("scope", scope.vm.item);
        }
    }
    /* @ngInject */
    function PurchaseIndentAddController(api, $filter) {
        var vm = this;
        vm.api = api;
        vm.Category = vm.api.MaterialCategory;
        vm.item.sno = parseInt(vm.index);
        vm.getMaterial = getMaterial;
        vm.MaterialCheck = MaterialCheck;
        vm.materialDet = [];
        vm.matCheck = matCheck;
        vm.categoryCheck = categoryCheck;
        vm.QuantityCheck = QuantityCheck;
        vm.quantityVal = validation;
        vm.item.row = false;
        vm.materialDet = vm.api.piMaterial;
        vm.uomList = vm.api.piUOM;
        vm.getCompDet = '';
        vm.sizeList = vm.api.getSize;
        
        vm.getCompDet = vm.api.profile.company;
        vm.proj = vm.api.piProject;

        function getMaterial(data) {
            // if (data == null) {
            //     vm.item.quantity = "";
            //     vm.item.id = "";
            //     vm.item.uom = "";
            //     vm.item.name = "";
            //     vm.item.avlquantity = "";
            // }
            vm.item.quantity = "";
            vm.item.id = "";
            vm.item.uom = "";
            vm.item.name = "";
            vm.item.avlquantity = "";
            if(data !== null && data !== undefined){
                var category = {
                "category": data
            };
              vm.api.getUom({}, function(err, data){
                    if(!err){
                        vm.uomList = data.uomList;
                    }                   
            });
            vm.api.materialLists(category, function (err, data) {
                if (err) {

                } else {
                    vm.materialDet = data.materialsList;
                }
            })
            }else{
                vm.materialDet = [];
            }
            
        }
        function MaterialCheck(MaterialID) {
            for (var i in vm.materialDet) {
                if (MaterialID == vm.materialDet[i].id) {
                    vm.item.id = vm.materialDet[i].id;
                    vm.item.name = vm.materialDet[i].name;
                    vm.item.matType = vm.materialDet[i].material_type_name;
                    if(vm.getCompDet == 'CH0001') {
                    vm.item.size = $filter('filter')(vm.sizeList, { _id: vm.materialDet[i].size }, true)[0];
                    vm.item.specification = vm.materialDet[i].specification;    
                    }
                    
                    vm.item.uom  = $filter('filter')(vm.uomList, {_id : vm.materialDet[i].uom}, true)[0];
                    // vm.item.avlquantity = vm.materialDet[i].quantity;
                    vm.item._id = vm.materialDet[i]._id;

                    if (vm.srhDt1 == undefined || vm.srhDt1 == "") {
        // vm.srhDt1 = new Date();
        var date = new Date();
        var day = date.getDate();
        var monthIndex = date.getMonth() + 1;
        var year = date.getFullYear();
        if (monthIndex < 10) {
          if (day < 10) {
            vm.srhDt1 = year + "-0" + monthIndex + "-0" + day;
          }
          else {
            vm.srhDt1 = year + "-0" + monthIndex + "-" + day;
          }

        }
        else {
          vm.srhDt1 = year + "-" + monthIndex + "-" + day;
        }

      }
                   vm.item.mat_date = vm.srhDt1;

                    var getStockDet = { "project": vm.proj, "material": vm.item._id };
                        // console.log("TEST",JSON.stringify(getStockDet));

                        vm.api.stockAvailable(getStockDet, function (e, data) {
                            if (!e) {
                                vm.getQuantity = data.materialsList;
                                if (data.materialsList) {
                                    if (data.materialsList[0].material == vm.item._id) {
                                        for (var j = 0; j < data.materialsList.length; j++) {
                                            vm.item.avlquantity = data.materialsList[j].available_quantity;
                                        }
                                    }
                                }
                                else {
                                    vm.item.avlquantity = 0;
                                }
                            }
                        });
                }
            }
        }

        function categoryCheck(data) {
            if (data == '0') {
                return 'highlit';
            } else {
                return "";
            }
        }

        function matCheck(data) {
            if (data == '0') {
                return 'highlit';
            } else {
                return "";
            }
        }
        // function categoryEx(data)
        // {
        //    // alert(JSON.stringify(data));
        //    console.log(data);
        //    console.log(JSON.stringify("saff",vm.getMaterial));
        //    angular.forEach(vm.PurchaseIndentMaterials, function(err , data)
        //    {
    
        //    if(data !== data)
        //    {
        //        if($('.alertify-log').length == 0){
        //        alertify.log('cannot choose multiple categroy');
        //        return ;
        //        }
        //    }
        // });
        // }
       //Search DDL Select
  $('.search-panel .dropdown-menu').find('a').click(function (e) {
    e.preventDefault();
    var param = $(this).attr("title").replace("#", "");
    var concept = $(this).text();
    $('.search-panel span#search_concept').text(concept);
    $('.input-group #search_param').val(param);
    vm.searchType = param;
    if (param === "MRDate") {
      $("#srhDt").show();
      $("#srhTxt").hide();
      $("#srhBranch").hide();
      $("#projectFrom").hide();
      $("#projectTo").hide();
    } else if (param === "Branch") {
      $("#srhBranch").show();
      $("#srhTxt").hide();
      $("#srhDt").hide();
      $("#projectFrom").hide();
      $("#projectTo").hide();
    }
    else if (param === "ProjectFrom") {
      $("#projectFrom").show();
      $("#projectTo").hide();
      $("#srhBranch").hide();
      $("#srhTxt").hide();
      $("#srhDt").hide();
    }
    else if (param === "ProjectTo") {
      $("#projectTo").show();
      $("#projectFrom").hide();
      $("#srhBranch").hide();
      $("#srhTxt").hide();
      $("#srhDt").hide();
    }
    else {
      $("#srhBranch").hide();
      $("#srhDt").hide();
      $("#srhTxt").show();
      $("#projectFrom").hide();
      $("#projectTo").hide();
    }
  });

  $('.input-group1.date').datepicker({
    calendarWeeks: true,
    todayHighlight: true,
    autoclose: true,
    // maxDate: '0',
    startDate: '+0d',
    closeText: 'Clear',
    clearBtn: false
    // $("#srhDt").datepicker().datepicker("setDate", new Date());
  });

        function validation() {
            var reg = new RegExp('^[0-9]+$');
            if (!reg.test(vm.item.quantity) && vm.item.quantity !== '') {
                vm.item.quantity = "";
                if($('.alertify-log').length == 0){
                    alertify.log('Only numbers are allowed');
                }
            }
        }

        function QuantityCheck(data) {
            if (data == '0') {
                return 'highlit';
            } else {
                return "";
            }
        }
    }
})();