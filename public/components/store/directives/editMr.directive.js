(function () {
    'use strict';

    angular
        .module('todo.store.directives')
        .directive('materialRequestEdit', materialRequestEdit);

    materialRequestEdit.$inject = ['api','SETTINGS'];
    
    

    
    function materialRequestEdit(api, CONSTANTS) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: MrEditController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/store/views/materialRequestEdit.view.html',
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
    MrEditController.$inject = ['api','$scope', '$filter', 'SETTINGS']
    function MrEditController(api, $scope, $filter, CONSTANTS) {
        var vm = this;
        vm.api = api;
        vm.editmaterialchange = editmat;
        vm.matqty = matqty;
        vm.validation = validation;
        vm.class = classes;
        vm.matcheck = matcheck;
        vm.categoryList = vm.api.MaterialCategory;
        vm.matRes = matRes;
        vm.materialAlldet = vm.api.MaterialMaster;
        vm.item.row = false;
        vm.status = status;
        vm.mr_status = CONSTANTS.mr_status;
        vm.initialLoading = initialLoading;
        vm.getCompDet = '';
        
        vm.getCompDet = vm.api.profile.company;

        // vm.materialdet = vm.api.mrMaterial;
        vm.uomList = vm.api.mrUOM;
        vm.sizeList = vm.api.getSize;
        vm.editCategoryMR = vm.api.editCat;

        vm.toProject = vm.api.toProjectId;
        vm.editmaterials = vm.api.editMR;
        // vm.api.editMR = data;
        vm.matId = '';

         vm.edittoProject = vm.api.toProjectId;
         vm.materialdet =  vm.api.mrEditMaterial;
         console.log(vm.item);
        //  console.log(JSON.stringify(vm.api.mrEditMaterial));
        

        function classes(test) {
            if (test === '0') {
                return "highlit";
            } else {
                return "";
            }
        }

        function matcheck(nomat) {
            if (nomat === '0') {
                return "highlit";
            } else {
                return "";
            }
        }

        function catcheck(nocat) {
            if (nocat === '0') {
                return "highlit";
            } else {
                return "";
            }
        }

        function editmat(selected) {
            if (selected) {
                for (var j = 0; j < vm.materialdet.length; j++) {
                    if(vm.getCompDet == 'CH0001' && vm.getCompDet !== 'CO00001') {
                        if (selected.mat_code == vm.materialdet[j].id) {
                        vm.item.category = vm.materialdet[j].category;
                       
                        vm.item.id = vm.materialdet[j].id;
                        vm.item.name = vm.materialdet[j].name;
                                vm.item.sizeDet = $filter('filter')(vm.sizeList, {_id : vm.materialdet[j].size}, true)[0];
                        vm.item.size = vm.item.sizeDet.name;
                        vm.item.specification = vm.materialdet[j].specification;
                        
                        // vm.item.uom = vm.materialdet[j].uom,
                        vm.item.uom  = $filter('filter')(vm.uomList, {_id : vm.materialdet[j].uom}, true)[0];
                        // vm.item.avlblQty = vm.materialdet[j].quantity;
                         vm.item._id = vm.materialdet[j]._id;

                        var getStockDet = { "project": vm.edittoProject, "material": vm.item._id };
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
                    else  {
                        if (selected.id == vm.materialdet[j].id) {
                        vm.item.category = vm.materialdet[j].category;
                       
                        vm.item.id = vm.materialdet[j].id;
                        vm.item.name = vm.materialdet[j].name;
                        
                        // vm.item.uom = vm.materialdet[j].uom,
                        vm.item.uom  = $filter('filter')(vm.uomList, {_id : vm.materialdet[j].uom}, true)[0];
                        // vm.item.avlblQty = vm.materialdet[j].quantity;
                         vm.item._id = vm.materialdet[j]._id;

                        var getStockDet = { "project": vm.edittoProject, "material": vm.item._id };
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
                    
                }
            } else {
                vm.item.category = '';
                vm.item.id = "";
                vm.item.name = "";
                vm.item.uom = "";
                vm.item.avlblQty = "";
            }
        }
        

        function matRes(data) {
            if (!data.category) {
                data.id="";
                data.uom ="";
                data.avlblQty = "";
                vm.materialdet = [];
            } else {
                data.id="";
                data.uom ="";
                data.avlblQty = "";
                vm.api.getUom({},function(err, data){
                    if(!err){
                        vm.uomList = data.uomList;
                    }                   
                });
                if(vm.getCompDet !== 'CH0001' && vm.getCompDet == 'CO00001') {
                        var cat = { 'category': data.category }
                }
                else {
                    var cat = { 'category': data.category_id,
            "sub_category" : data.sub_category_id }
                }
                
            
                vm.api.materialLists(cat, function(err, data){
                    if(!err){
                        vm.materialdet = data.materialsList;
                    }
                })
            }
        }

        function matqty(data) {
            if(data.id !== undefined){
            var cat = { 'id': data.id }
                vm.api.materialLists(cat, function(err, data){
                    if(!err){
                        if(data.materialsList) {
                                vm.item.avlblQty = data.materialsList[0].quantity;
                                if(vm.item.quantity > vm.item.avlblQty){
                            vm.item.noqty = "0";
                        }
                        }
                        
                        
                    }
                })
            }
        }

        var catDetRes = vm.editCategoryMR;

        $scope.getMaterialType = function (catDetRes) {
            $scope.$emit('category', catDetRes);
        }

        function validation() {
            var reg = new RegExp('^[0-9]+$');
            if (!reg.test(vm.item.quantity) && vm.item.quantity !== '') {
                alertify.log('Only numbers are allowed');
                vm.item.quantity = "";
            }
            if (parseInt(vm.item.quantity) > parseInt(vm.item.avlblQty)) {
                alertify.log("You cannot enter quantity more than available quantity");
                vm.item.quantity = "";
            }
        }


        function initialLoading(data){
            // console.log("dsad",JSON.stringify(data));
            vm.matId = data.id;
            // console.log("TEST1",JSON.stringify(data));
            if (data == "") {
                vm.materialdet = [];
            } else {
                vm.api.getUom({},function(err, data){
                    if(!err){
                        vm.uomList = data.uomList;
                    }                   
                });

                var category = {
                "category" : data.category_id,
                "sub_category" : data.sub_category_id,
                "project" : data.to_project
            };

            vm.api.getsizeList(category, function (err, data) {
        if (!err) {
          vm.sizeList = data.materialsList;
          vm.api.getSize = vm.sizeList;
        }
      });

            // console.log(JSON.stringify(category));
            
            var catDet = data.category;

                vm.api.materialLists(category, function(err, data){
                    if(!err){
                        
                        // vm.materialdet1 = data.materialsList;
                        //  vm.materialdet = vm.api.mrMaterial;
                         
                        //  vm.sizeList = vm.api.getSize;
                        // //  console.log(JSON.stringify(data));
                        // vm.matIdList = [];
                        //  angular.forEach(vm.materialdet, function (a) { 
                        //      vm.matIdList += a.id;

                        //  });
                        //  console.log(JSON.stringify(vm.matIdList));
                        vm.materialdet = data.materialsList;
                        vm.sizeList = vm.api.getSize;
                        vm.materialdet = $filter('filter')(vm.materialdet, function(a){
                            return a.mat_code = a.id;
                        }, true);

                         vm.matList = [];
                         for(var i=0; i<vm.materialdet.length;i++) {
                               vm.matList  = $filter('filter')(data.materialsList, {_id : vm.materialdet[i]._id}, true)[0];
                         }

                        //  console.log(JSON.stringify(vm.matList));

                        

                        //  var getStockDet = { "project": vm.edittoProject, "material": vm.matList._id};
                        if(vm.getCompDet !== 'CH0001' && vm.getCompDet == 'CO00001') {
                            return;
                        }
                        else {
                                var getStockDet = { "project": vm.edittoProject, "mat_id": vm.matId};

                        //  console.log("tetet",JSON.stringify(getStockDet));

                        vm.api.stockAvailable(getStockDet, function (e, data) {
                            if (!e) {
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
                         

                         
                    }
                })
            }
        }
    }
})(); 