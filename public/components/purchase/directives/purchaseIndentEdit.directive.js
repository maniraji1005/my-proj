(function () {
    'use strict';

    angular
        .module('todo.store.directives')
        .directive('purchaseIndentEdit', purchaseIndentEdit);

    purchaseIndentEdit.$inject = ['api'];
    function purchaseIndentEdit(api) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: PiEditController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/purchase/views/purchaseIndentEdit.view.html',
            scope: {
                item: '=item',
                index: '@'
            }
        };
        return directive;

        function link(scope, element, attrs) {
           // console.log("scope", scope.vm.item);
        }

    }
    function PiEditController(api, $scope, $filter) {
        var vm = this;
        vm.api = api;
        vm.editmaterialchange = editmat;
        vm.matqty = matqty;
        vm.item.sno = parseInt(vm.index);
        vm.validation = validation;
        vm.class = classes;
        vm.matcheck = matcheck;
        vm.categoryList = vm.api.MaterialCategory;
        vm.matRes = matRes;
        vm.materialAlldet = vm.api.MaterialMaster;
        vm.matId = '';
        vm.catcheck = catcheck;
        vm.item.row = false;
        vm.initialLoading = initialLoading;
        // vm.materialdet = vm.api.piEditMaterial;
        vm.uomList = vm.api.piUOM;

        vm.editfromProject = vm.api.piProject;

        function classes(test) {
            if (test === 0) {
                return "highlit";
            } else {
                return "";
            }
        }

        function matcheck(nomat) {
            if (nomat === 0) {
                return "highlit";
            } else {
                return "";
            }
        }

        function catcheck(nocat) {
            if (nocat === 0) {
                return "highlit";
            } else {
                return "";
            }
        }

        function editmat(selected) {
            if (selected) {
                for (var j = 0; j < vm.materialdet.length; j++) {
                    if (selected.mat_code == vm.materialdet[j].id) {
                        vm.item.category = vm.materialdet[j].category;
                        vm.item.id = vm.materialdet[j].id,
                        vm.item.name = vm.materialdet[j].name,
                        vm.item.matType = vm.materialdet[j].material_type_name;
                        if(vm.getCompDet == 'CH0001') {
                        vm.item.sizeDet = $filter('filter')(vm.sizeList, {_id : vm.materialdet[j].size}, true)[0];
                        // vm.item.size = vm.item.sizeDet.name;
                        vm.item.specification = vm.materialdet[j].specification;
                        }
                            // vm.item.uom = vm.materialdet[j].uom,
                        vm.item.uom  = $filter('filter')(vm.uomList, {_id : vm.materialdet[j].uom}, true)[0];
                        vm.item.avlblQty = vm.materialdet[j].quantity;
                        vm.item._id = vm.materialdet[j]._id;

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

                        var getStockDet = { "project": vm.editfromProject, "material": vm.item._id };
                        // console.log(JSON.stringify(getStockDet));

                        vm.api.stockAvailable(getStockDet, function (e, data) {
                            if (!e) {
                                vm.getQuantity = data.materialsList;
                                if (data.materialsList) {
                                    if (data.materialsList[0].material == vm.item._id) {
                                        for (var j = 0; j < data.materialsList.length; j++) {
                                            vm.item.avlblQty = data.materialsList[j].available_quantity;
                                        }
                                    }
                                }
                                else {
                                    vm.item.avlblQty = 0;
                                }
                            }
                        });
                    }
                }
            } else {
                vm.item.id = "";
                vm.item.category = '';
                vm.item.id = "";
                vm.item.name = "";
                vm.item.uom = "";
                vm.item.avlblQty = "";
            }
        }

        function matRes(data) {
            if (!data) {
                vm.materialdet = [];
                vm.item.id = "";
                vm.item.uom = "";
                vm.item.avlblQty = "";
            } else {
                 vm.item.id = "";
                vm.item.uom = "";
                vm.item.avlblQty = "";
                // vm.materialdet = $filter('filter')(vm.materialAlldet, { 'category': data });
                vm.api.getUom({}, function(err, data){
                    if(!err){
                        vm.uomList = data.uomList;
                    }                   
                });
                var cat = { 'category': data }
                vm.api.materialLists(cat, function (err, data) {
                    if (!err) {
                        vm.materialdet = data.materialsList;
                    }
                })
            }
        }

        function initialLoading(data) {
            vm.matId = data.id;
            if (data == "") {
                vm.materialdet = [];
                vm.item.name = "";
                vm.item.uom = "";
                vm.item.avlquantity = "";
            } else {
                
                // vm.materialdet = $filter('filter')(vm.materialAlldet, { 'category': data });
                vm.api.getUom({}, function(err, data){
                    if(!err){
                        vm.uomList = data.uomList;
                    }                   
                });
                var category = {
                "category" : data.category,
                "sub_category" : data.sub_category
            };
            vm.api.getsizeList(category, function (err, data) {
        if (!err) {
          vm.sizeList = data.materialSizeList;
          vm.api.getSize = vm.sizeList;
        }
      });
            // console.log(JSON.stringify(category));
                vm.api.materialLists(category, function (err, data) {
                    if (!err) {
                         vm.materialdet = data.materialsList;
                        vm.sizeList = vm.api.getSize;
                        vm.materialdet = $filter('filter')(vm.materialdet, function(a){
                            return a.mat_code = a.id;
                        }, true);

                        vm.matList = '';
                         for(var i=0; i<vm.materialdet.length;i++) {
                               vm.matList  = $filter('filter')(data.materialsList, {_id : vm.materialdet[i]._id}, true)[0];
                         }

                         var getStockDet = { "project": vm.editfromProject, "mat_id": vm.matId};
                        //  console.log(JSON.stringify(vm.editfromProject));
                        //  console.log(JSON.stringify(vm.matList._id));
                        //  console.log(JSON.stringify(getStockDet));

                        vm.api.stockAvailable(getStockDet, function (e, data) {
                            if (!e) {

// console.log(JSON.stringify(getStockDet));

                                vm.getQuantity = data.materialsList;
                                if (data.materialsList) {
                                    if (data.materialsList[0].material == vm.matId) {
                                        for (var j=0; j < data.materialsList.length; j++) {
                                            vm.item.avlblQty = data.materialsList[j].available_quantity;
                                        }
                                    }
                                }
                                else {
                                    vm.item.avlblQty = 0;
                                }
                            }
                        });
                    }
                })
            }
        }

        function matqty(data) {
            if(data.id !== ""){
            var cat = { 'category': data.category_id,
        "sub_category" : data.sub_category_id }
        if(vm.getCompDet !== 'CH0001' && vm.getCompDet == 'CO00001') {
                vm.api.materialLists(cat, function (err, data) {
                if (!err) {
                    vm.item.avlblQty = data.materialsList[0].quantity;
                }
            })
        }
        else {
            return;
        }
            
        }
        }

        $scope.getMaterialType = function (category) {
            $scope.$emit('category', category);
        }

        function validation() {
            var reg = new RegExp('^[0-9]+$');
            if (!reg.test(vm.item.quantity) && vm.item.quantity !== '') {
                if($('.alertify-log').length == 0){
                alertify.log('Only numbers are allowed');
                }
                vm.item.quantity = "";
            }
        }
    }
})();