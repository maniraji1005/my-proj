subcategoryController
'use strict';
angular.module('todo.settings.controllers')
    .controller('subcategoryController', subcategoryController);
subcategoryController.$inject = ['$scope', '$state', 'api', '$timeout', 'storage'];
function subcategoryController($scope, $state, api, $timeout, storage) {
    var vm = this;
    vm.api = api;
    $scope.step = 1;
    vm.ddlRowsChange = ddlRowsChange;
    vm.rowCnt = "0";
    var status = "";
    vm.ddlRows = "10";
    vm.ddlRowsApp = "10";
    vm.filterTxt = '';
    var begin = "0";
    var end = "10";
    vm.begin = "0";
    vm.end = "10";
    vm.count = 1;
    vm.reload = reload;
    vm.addRow = addRow;
    var initializing = true;
    vm.subCategoryMaster = subCategoryMaster;
    // Default DDL Select
    vm.ddlRows = "10";
    vm.ddlRowsApp = "10";
    vm.status = "";
    vm.searchType = 'catName';
    vm.srhcate = '';
    vm.srhsubcate = '';
    vm.searchTxt = searchTxt;

     vm.api.categoryGrid.categoryGrid({}, function (err, data)
    {
        if(!err) {
            vm.categoryList = data.categoryList;
            vm.api.category = vm.categoryList;
        }
    })

    //grid bind
    function subCategoryMaster(isSrh, begin, end) {
        var access = storage.get("access");
        access = JSON.parse(access);
        var filterSearch = {
            "limit": end,
            "skip": begin,
            "role_id": vm.api.profile.roles,
            "status": "Active",
            "access": access
        };
        if (isSrh) {
            filterSearch = {
                "limit": vm.end,
                "skip": begin,
                "role_id": vm.api.profile.roles,
                "status": "Active",
                "access": access,
                "catID": vm.searchType == 'catName' ? (vm.srhcate ? vm.srhcate : undefined) : undefined,
                "name": vm.searchType == 'subcatName' ? (vm.srhsubcate ? vm.srhsubcate : undefined) : undefined,

            };
        }
        vm.api.subCategoryGrid(filterSearch, function (err, data) {
            if (err) {
                //alert("No Data");
            }
            else {
                if ('catID' != vm.srhcate || 'name' != vm.srhsubcate) {
                    vm.rowCnt = 0;
                }
                vm.paginationNumber = parseInt(vm.begin) == 0 ? 1 : parseInt(vm.begin) + 1;
                vm.subCategory = data.subcatgoriesList;
                vm.rowCnt = data.count;
                vm.ddlRowsApp = "10";
            }
        });
    }
    vm.subCategoryMaster(false, begin, end);

    function ddlRowsChange(data) {
        vm.begin = "0";
        $scope.currentPage = 1;
        vm.subCategoryMaster(false, vm.begin, vm.ddlRows);
    }

    //  pagination
    // Rows per Page
    var noRows = vm.ddlRows;
    //   For getting Start Limit and End Limit
    $scope.currentPage = 1
        , $scope.numPerPage = parseInt(vm.ddlRows)
        , $scope.maxSize = 3;
    $scope.$watch('currentPage + numPerPage', function () {
        var begin = (($scope.currentPage - 1) * vm.ddlRows)
            , end = vm.ddlRows;
        $scope.slno = begin;
        if (initializing) {
            $timeout(function () {
                initializing = false;
            });
        } else {
            vm.begin = begin;
            vm.end = vm.ddlRows.toString();
            vm.subCategoryMaster(true, begin, end);
        }
    });

    $scope.checkCnt = function (rowCnt) {
        var noRows = $("#ddlNoRows").val();
        if (parseInt(rowCnt) > parseInt(noRows)) {
            return true;
        }
        else {
            return false;
        }
    }
    
    //add new subcategory
    function addRow() {
        if (vm.cateName == undefined || vm.cateName == "") {
            if ($('.alertify-log').length == 0) {
                alertify.log("please Select Category");
            }
            return;
        }
        if (vm.name == undefined || vm.name == "") {
            if ($('.alertify-log').length == 0) {
                alertify.log("please enter subcategory");
            }
            return;
        }
        var ObjSubcat = new Object();
        ObjSubcat.name = vm.name;
        ObjSubcat.catID = vm.cateName;
        ObjSubcat.status = "Active";
        ObjSubcat.updated_by = vm.api.profile._id;
        vm.api.subCategoryAdd(ObjSubcat, function (err, data) {
            if (err) {
                if ($('.alertify-log').length == 0) {
                    alertify.error(err.data);
                }
            } else {
                vm.cateName = "";
                vm.name = "";
                vm.subCategoryMaster(false, vm.begin, vm.end);
                if ($('.alertify-log-success').length == 0) {
                    alertify.success(data);
                }
            }
        });
    }
    
    //reload grid
    function reload() {
        vm.cateName = "";
        vm.name = "";
        $scope.currentPage = 1;
        vm.srhcate = "";
        vm.srhsubcate = "";
        vm.ddlRows = "10";
        vm.subCategoryMaster(false, begin, vm.ddlRows);
    }

    //clear searchText
    function searchTxt() {
        vm.srhcate = '';
        vm.srhsubcate = '';
    }

    //edit subcategory Master
    $scope.$on('editSubcategory', function (e, data) {
        data.updated_by = vm.api.profile._id;
        data.status = "Active";
        data.catID = data.category;
        vm.api.subCategoryEdit(data, function (err, data) {
            if (!err) {
                if ($('.alertify-log-success').length == 0) {
                    alertify.success("successfully updated");
                }
            } else {
                if($('alertify-log').length == 0) {
                    alertify.error(err.data);
                }
                 vm.subCategoryMaster(false, vm.begin, vm.end);
            }
        });
    });
    //    Search 
    $('.search-panel .dropdown-menu').find('a').click(function (e) {
        e.preventDefault();
        var param = $(this).attr("title").replace("#", "");
        var concept = $(this).text();
        $('.search-panel span#search_concept').text(concept);
        $('.input-group #search_param').val(param);
        vm.searchType = param;
        if (param === "catName") {
            $("#srhcate").show();
            $("#srhsubcate").hide();
        } else if (param === "subcatName") {
            $("#srhsubcate").show();
            $("#srhcate").hide();
        }
    });
}
