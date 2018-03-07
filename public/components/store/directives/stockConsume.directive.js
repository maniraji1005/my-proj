(function () {
    'use strict';

    angular
        .module('todo.store.directives')
        .directive('stockUpdateconsumeAdd', stockUpdateconsumeAdd);
    stockUpdateconsumeAdd.$inject = ['api'];
    function stockUpdateconsumeAdd(api) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: stockUpdateconsumeAddController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/store/views/stockConsume.Add.html',
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
    function stockUpdateconsumeAddController(api, $scope, $filter) {
        var vm = this;
        vm.api = api;
        vm.contractId = '';
        vm.getDet = getDet;
        vm.sizeList = vm.api.getSizeList;
        vm.contract = vm.api.getContractor;
        vm.deleteAdd = deleteAdd;
        vm.matcheck = matcheck;
        vm.validation = validation;
        // vm.getContract = getContract;
        vm.getsubCategory = getsubCategory;
        vm.categoryList = vm.api.company.category;
        vm.getMaterial = getMaterial;
        vm.materialTypeList = [];
        var Mat = vm.api.company.material_type;
        for (var k = 0; k < Mat.length; k++) {
            vm.materialTypeList.push(Mat[k]);
        }
        function deleteAdd(data) {
            $scope.$emit('deleteAddStock', data);
        }
        function getMaterial(data) {
            // vm.clear();
            vm.newStockAdd = [];
            // vm.item.category = 'Select Material';
            if (data) {
                var category = {
                    "category": vm.category,
                    "sub_category": data
                };


                var materialSearch = {
                    "category": data.category,
                    "sub_category": data.subCategory,
                    "matType": "57c0596e20a1d133e4eaf887"
                };




                vm.api.getUom({}, function (err, data) {
                    if (!err) {
                        vm.uomList = data.uomList;
                        vm.api.mrUOM = vm.uomList;
                    } else {
                        // alert('no data');
                    }
                });

                vm.api.getsizeList(category, function (err, data) {
                    if (!err) {
                        vm.sizeList = data.materialSizeList;
                        vm.api.getSize = vm.sizeList;
                    }
                });

                vm.api.materialLists(materialSearch, function (err, data) {
                    if (err) {
                        //alert("no data");
                    } else {
                        vm.materialdet = data.materialsList;
                        // vm.api.getMatId = vm.materialdet;
                    }
                })
            } else {
                //  vm.materialType = "";
                //vm.item.uom = "";
                // vm.item.avlquantity = "";
            }
        }

        function getDet(data) {
            if (data != null) {
                vm.item.available_quantity = "";
                // vm.item.issued_to = "";

                for (var i = 0; i < vm.materialdet.length; i++) {
                    if (data == vm.materialdet[i].id) {
                        vm.item._id = vm.materialdet[i]._id;
                        vm.item.name = vm.materialdet[i].name;
                        vm.item.uom1 = $filter('filter')(vm.uomList, { _id: vm.materialdet[i].uom }, true)[0];
                        vm.item.uom = vm.item.uom1.name;
                        // vm.item.issued_to = vm.api.getContractor[i].name;
                        vm.item.mat_size = $filter('filter')(vm.sizeList, { _id: vm.materialdet[i].size }, true)[0].name;
                        vm.item.material_type_name = vm.materialdet[i].material_type_name;
                        vm.item.specification = vm.materialdet[i].specification;
                        // vm.item.avlqty = vm.materialId[i].quantity;
                    }
                }
                var getStockDetcon = { "project": vm.api.project, "material": vm.item._id };
                vm.api.stockAvailable(getStockDetcon, function (e, data) {
                    if (!e) {
                        vm.getQuantity = data.materialsList;
                        if (vm.getQuantity !== undefined) {
                            for (var j = 0; j < vm.getQuantity.length; j++) {
                                // vm.item.opening_quantity = vm.getQuantity[j].opening_quantity;
                                vm.item.available_quantity = vm.getQuantity[j].available_quantity;
                                // vm.item.issued_qty = vm.getQuantity[j].issued_quantity;
                                // }
                            }
                        }
                    }
                });
            }
        }



        function getsubCategory(data) {
            vm.materialdet = "";
            vm.item.name = "";
            vm.item.uom = "";
            vm.item.available_quantity = "";
            // vm.item.issued_to = "";
            vm.item.mat_size = "";
            //  vm.item.matType ="";
            vm.item.issuedQty = "";
            var category = {
                "catID": data
            }


            vm.api.getSubCategory(category, function (err, data) {
                if (err) {
                    //laert("No Data");
                } else {
                    vm.subCategoryList = data.subcatgoriesList;
                    //  alert(JSON.stringify(data.))
                }
            });


            // Get all contractor list based on category
            vm.api.contractorGrid(category, function (err, data) {
                if (!err) {
                    vm.contractorList = data.contractorList;
                }
            });

            // Get all employee list based on project
            var project = {
                "project": [vm.api.project]
            }

            vm.api.exeDDL(project, function (err, data) {
                if (!err) {
                    vm.employeeList = data;
                }
            });


        }


        function matcheck(codeIsEmpty) {
            if (codeIsEmpty === '0') {
                return "highlit";
            } else {
                return "";
            }
        }
        function validation(data) {
            if (data === '0') {
                return "highlit";
            } else {
                return "";
            }
        }
        // function getContract(data) {
        //     vm.contractId = data;
        //     vm.api.contract = vm.contractId;
        // }

    }
})();
