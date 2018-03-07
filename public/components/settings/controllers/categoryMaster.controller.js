'use strict';
angular.module('todo.settings.controllers')
    .controller('categoryMasterController', categoryMasterController);
categoryMasterController.$inject = ['$scope', '$state', 'api', '$timeout', 'storage'];
function categoryMasterController($scope, $state, api, $timeout, storage) {
    var vm = this;
    vm.api = api;
    $scope.step = 1;
    vm.categoryApp = [];
    vm.ddlRowsChange = ddlRowsChange;
    vm.rowCnt = 0;
    var status = "";
    vm.categoryMasterfilter = categoryMasterfilter;
    vm.ddlRows = "10";
    vm.ddlRowsApp = "10";
    vm.filterTxt = '';
    var begin = "0";
    var end = "10";
    vm.begin = "0";
    vm.end = "10";
    vm.count = 1;
    vm.reload = reload;
    vm.searchTxt = searchTxt;
    vm.addRow = addRow;
    var initializing = true;
    var catename = [];
     vm.api.companyDet(function (err, data) {

        vm.companyId = data._id;
    });
    vm.getCompDet = '';
        
    vm.getCompDet = vm.api.profile.company;
    // Default DDL Select
    vm.ddlRows = "10";
    vm.ddlRowsApp = "10";
    vm.status = "";
    vm.searchType =  vm.getCompDet == "CO00001" ?  'cateId' : 'cateName';
    vm.srhcateId = '';
    vm.srhcateName = '';
    var access = storage.get('access');
    if (access) {
        vm.categoryAccess = JSON.parse(access);
    }
   
    //for grid 
    function categoryMasterfilter(isSrh, begin, end) {
        var access = storage.get("access");
        access = JSON.parse(access);
        var filterSearch = {
            "limit": end,
            "skip": begin,
            "role_id": vm.api.profile.roles,
            //    "created_by": vm.api.profile._id,
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
                "id": vm.companyId == "CO00001" ? (vm.searchType == 'cateId' ? (vm.srhcateId ? vm.srhcateId : undefined) : undefined) : undefined,
                "name": vm.searchType == 'cateName' ? (vm.srhcateName ? vm.srhcateName : undefined) : undefined,
            };
        }

        api.categoryGrid.categoryGrid({}, function (err, data) {
            if (err) {
                //alert("No Data");

            } else {
                catename = data.categoryList;
            }
        });
        vm.api.categoryGrid.categoryGrid(filterSearch, function (err, data) {
            if (err) {
                //alert("No Data");
            }
            else {
                if ('id' != vm.srhcateId || 'name' != vm.srhcateName) {
                    vm.rowCnt = 0;
                }
                vm.paginationNumber = parseInt(vm.begin) == 0 ? 1 : parseInt(vm.begin) + 1;
                vm.categoryApp = data.categoryList;
                vm.rowCnt = data.count[0].count;
                vm.ddlRowsApp = "10";
            }
        });
    }

    vm.categoryMasterfilter(false, begin, end);
    //Row change
    function ddlRowsChange(data) {
        vm.begin = "0";
        $scope.currentPage = 1;
        vm.categoryMasterfilter(false, vm.begin, vm.ddlRows);
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
            vm.categoryMasterfilter(true, begin, end);
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
    // reload
    function reload() {
        vm.srhcateId = "";
        vm.srhcateName = "";
        vm.id = "";
        vm.name = "";
        $scope.currentPage = 1;
        ddlRowsChange = [];
        vm.ddlRows = "10";
        vm.categoryMasterfilter(false, begin, vm.ddlRows);
    }
    //add new element in category
    function addRow() {

        if (vm.id == undefined && vm.companyId !== 'CH0001' || vm.id == "" && vm.companyId !== 'CH0001') {
            if ($('.alertify-log').length == 0) {
                alertify.log("category id missing");
            }
            return;
        }
        if (vm.name == undefined || vm.name == "") {
            if ($('.alertify-log').length == 0) {
                alertify.log("category name missing");
            }
            return;
        }
        var flag = 1;
        angular.forEach(catename, function (data) {
            // console.log(data); 
            if (data.name.toUpperCase() == vm.name.toUpperCase()) {
                if ($('.alertify-log').length == 0) {
                    alertify.log(" category name already exists");
                }
                flag = 0;
            }
            if (vm.companyId !== 'CH0001') {
                if (data.id == vm.id) {
                    if ($('.alertify-log').length == 0) {
                        alertify.log(" category id already exists");
                    }
                    flag = 0;
                }
            }
        });
        if (flag == 0) {
            return;
        }

        var ObjCategory = new Object();
        ObjCategory.id = vm.id;
        ObjCategory.name = vm.name;
        ObjCategory.branch = vm.api.profile.branch;
        ObjCategory.store_type = vm.api.profile.store_type;
        ObjCategory.store = vm.api.profile.store;
        ObjCategory.status = "Active";
        ObjCategory.updated_by = vm.api.profile._id;
        vm.api.categoryMasterAdd(ObjCategory, function (err, data) {
            if (err) {
                if ($('.alertify-log').length == 0) {
                    alertify.error("category name already exists");
                } return;
            }
            else {
                vm.id = "";
                vm.name = "";
                vm.categoryMasterfilter(false, vm.begin, vm.end);
                if ($('.alertify-log-success').length == 0) {
                    alertify.success(data);
                }

            }
        });
    }
    //    search text clear
    function searchTxt() {
        vm.srhcateName = '';
        vm.srhcateId = '';
    }

    $scope.$on('categoryEdit', function (e, data) {
        data.updated_by = vm.api.profile._id;
        data.status = "Active";
        data.id = "";
        data.branch = "";
        data.store = "";
        data.store_type = "";
        vm.api.categoryEdit(data, function (err, data) {
            if (!err) {
                if ($('.alertify-log-success').length == 0) {
                    alertify.success("successfully updated");
                }
            } else {
               if ($('.alertify-log').length == 0) {
                    alertify.error(err.data);
                }
                vm.categoryMasterfilter(false, vm.begin, vm.end);
            }
        });
    });

    //    Search category
    $('.search-panel .dropdown-menu').find('a').click(function (e) {
        e.preventDefault();
        var param = $(this).attr("title").replace("#", "");
        var concept = $(this).text();
        $('.search-panel span#search_concept').text(concept);
        $('.input-group #search_param').val(param);
        vm.searchType = param;
        if (param === "cateId") {
            $("#srhcateId").show();
            $("#srhcateName").hide();
        } else if (param === "cateName") {
            $("#srhcateName").show();
            $("#srhcateId").hide();
        }
    });

    //    Search categoryColorHomes
    $('.search-panel .dropdown-menu').find('b').click(function (e) {
        e.preventDefault();
        var param = $(this).attr("title").replace("#", "");
        var concept = $(this).text();
        $('.search-panel span#search_concept').text(concept);
        $('.input-group #search_param').val(param);
        vm.searchType = param;
        if (param === "cateId") {
            $("#srhcateId").show();
            $("#srhcateName").hide();
        } else if (param === "cateName") {
            $("#srhcateName").show();
            $("#srhcateId").hide();
        }
    });



}
