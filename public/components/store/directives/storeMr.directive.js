(function () {
    'use strict';

    angular
        .module('todo.store.directives')
        .directive('materialRequestAdd', materialRequestAdd);

    materialRequestAdd.$inject = ['api', '$filter'];
    function materialRequestAdd(api, $filter) {
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
            templateUrl: 'components/store/views/materialRequestAdd.view.html',
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

    /* @ngInject */
    function ControllerController(api, $scope, $filter) {
        var vm = this;
        vm.api = api;
        vm.matrl = matrl;
        vm.quantityVal = validation;
        vm.class = classes;
        vm.matcheck = matcheck;
        vm.categoryList = vm.api.MaterialCategory;
        // vm.materialdet = vm.api.MaterialMaster;
        vm.item.row = false;
        vm.catcheck = catcheck;
        vm.materialdet = vm.api.mrMaterial;
        // console.log("MR DIR",vm.api.mrMaterial);
        vm.uomList = vm.api.mrUOM;
        vm.sizeList = vm.api.getSize;
        vm.getCompDet = '';

        vm.getCompDet = vm.api.profile.company;
        vm.toProject = vm.api.toProjectId;
        vm.getQuantity = [];

        vm.getMaterial = function (data) {
            if (data) {
                var category = {
                    "category": data
                };
                vm.materialType = "";
                vm.item.uom = "";
                vm.item.avlquantity = "";
                vm.api.getUom({}, function (err, data) {
                    if (!err) {
                        vm.uomList = data.uomList;
                    } else {
                        alert('no data');
                    }
                });
                vm.api.materialLists(category, function (err, data) {
                    if (err) {

                    } else {
                        vm.materialdet = data.materialsList;
                        // vm.materialdet = vm.api.mrMaterial;
                        // console.log(vm.materialdet);
                    }
                })
            } else {
                vm.materialType = "";
                vm.item.uom = "";
                vm.item.avlquantity = "";
            }
        }

        function catcheck(nocat) {
            if (nocat === '0') {
                return "highlit";
            } else {
                return "";
            }
        }

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

        function matrl(selected) {
            // console.log("TO PRo",JSON.stringify(vm.toProject));
            if (selected) {
                var v = vm.materialdet;
                for (var i = 0; i < v.length; i++) {
                    if (selected == v[i].id) {
                        vm.item._id = v[i]._id;
                        vm.item.category = v[i].category;
                        vm.item.id = v[i].id;
                        vm.item.name = v[i].name;
                        vm.item.matType = v[i].material_type_name;
                        if(vm.getCompDet == 'CH0001' && vm.getCompDet !== 'CO00001') {
                        vm.item.size = $filter('filter')(vm.sizeList, { _id: v[i].size }, true)[0];
                        vm.item.specification = v[i].specification;
                        }
                        vm.item.uom = $filter('filter')(vm.uomList, { _id: v[i].uom }, true)[0];

                        if(vm.getCompDet == 'CH0001' && vm.getCompDet !== 'CO00001') {
                               var getStockDet = { "project": vm.toProject, "material": vm.item._id };
                        // console.log(JSON.stringify(getStockDet));

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
                        else {
                            vm.item.avlquantity = v[i].quantity;
                        }
                        

                        
                    }
                }
            } else {
                vm.item.category = '';
                vm.item.id = '';
                vm.item.name = '';
                vm.item.size = '';
                vm.item.specification = '';
                vm.item.uom = '';
                vm.item.quantity = '';
                vm.item.avlquantity = '';
            }
        }
        function validation() {
            var reg = new RegExp('^[0-9]+$');
            if (!reg.test(vm.item.quantity) && vm.item.quantity !== '') {
                if ($('.alertify-log').length == 0) {
                    alertify.log('Only numbers are allowed');
                }
                vm.item.quantity = "";
            }
            if (parseInt(vm.item.quantity) > parseInt(vm.item.avlquantity)) {
                if ($('.alertify-log').length == 0) {
                    alertify.log("You cannot enter quantity more than available quantity");
                }
                vm.item.quantity = "";
            }
        }
        $scope.getMaterialType = function (category) {
            $scope.$emit('category', category);
        }
    }

})();
