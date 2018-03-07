'use strict';
angular.module('todo.settings.controllers')
    .controller('contractorcontroller', contractorcontroller);
contractorcontroller.$inject = ['$scope', '$state', 'api', '$timeout', 'storage','$filter'];
function contractorcontroller($scope, $state, api, $timeout, storage, $filter) {
    var vm = this;
    vm.api = api;
    $scope.step = 1;
    vm.ddlRowsChange = ddlRowsChange;
    vm.rowCnt = 0;
    var status = "";
    vm.contractMaster = contractMaster;
    vm.ddlRows = "10";
    vm.ddlRowsApp = "10";
    var begin = "0";
    var end = "10";
    vm.begin = "0";
    vm.end = "10";
    vm.count = 1;
    vm.reload = reload;
    vm.searchTxt = searchTxt;
    vm.addRow = addRow;
    var initializing = true;

    // Default DDL Select
    vm.ddlRows = "10";
    vm.ddlRowsApp = "10";
    vm.status = "";
    vm.searchType = 'cateName';
    vm.srhcateName = '';
    vm.srhcontract = '';
     
     //get category
    var category = vm.api.company.category;
    vm.categoryList = category;

    //contractMaster Grid
    function contractMaster(isSrh, begin, end) {
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
                "name": vm.searchType == 'contract' ? (vm.srhcontract ? vm.srhcontract : undefined) : undefined,
                "catID": vm.searchType == 'cateName' ? (vm.srhcateName ? vm.srhcateName : undefined) : undefined
            };
        }
        vm.api.contractorGrid(filterSearch, function (err, data) {
            if (err) {
                //alert("No Data");
            }
            else {
                if ('catID' != vm.srhcateName || 'name' != vm.contract) {
                    vm.rowCnt = 0;
                }
                vm.paginationNumber = parseInt(vm.begin) == 0 ? 1 : parseInt(vm.begin) + 1;
                vm.contractor = data.contractorList;
                vm.rowCnt = data.count;
                vm.ddlRowsApp = "10";
            }
        });
    }

    vm.contractMaster(false, begin, end);

    function ddlRowsChange(data) {
        vm.begin = "0";
        $scope.currentPage = 1;
        vm.contractMaster(false, vm.begin, vm.ddlRows);
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
            vm.contractMaster(true, begin, end);
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
        vm.srhcontract= "";
        vm.srhcateName = "";
        vm.cateName = "";
        vm.contract = "";
        $scope.currentPage = 1;
        ddlRowsChange = [];
        vm.ddlRows = "10";
        vm.contractMaster(false, begin, vm.ddlRows);
    }
    //add new element in category
    function addRow() {

        if (vm.cateName == undefined || vm.cateName == "") {
            if ($('.alertify-log').length == 0) {
                alertify.log(" please Select category");
            }
            return;
        }
        if (vm.contract == undefined || vm.contract == "") {
            if ($('.alertify-log').length == 0) {
                alertify.log("Enter contractor Name");
            }
            return;
        }

        var ObjContract = new Object();
        ObjContract.catID = vm.cateName;
        ObjContract.name = vm.contract;
        ObjContract.status = "Active";
        ObjContract.category_name = $filter('filter')(vm.categoryList, {_id : vm.cateName}, true)[0].name;
        ObjContract.updated_by = vm.api.profile._id;
        vm.api.contractAdd(ObjContract, function (err, data) {
            if (err) {
                //alert("No Data");
                if ($('.alertify-log').length == 0) {
                alertify.error(err.data);
            }}
            else {
                vm.cateName = "";
                vm.contract = "";
                vm.contractMaster(false, vm.begin, vm.end);
                if ($('.alertify-log-success').length == 0) {
                    alertify.success(data);
                }

            }
        });
    }
    //    search text clear
    function searchTxt() {
        vm.srhcateName = '';
        vm.srhcontract = '';
    }

   // edit contractor
      $scope.$on('updateContractor', function (e, data) {
        data.updated_by = vm.api.profile._id;
        data.status = "Active";
        data.catID = data.category;
        vm.api.updateContract(data, function (err, data) {
            if (!err) {
                if ($('.alertify-log-success').length == 0) {
                    alertify.success("successfully updated");
                }
            } else {
               if ($('.alertify-log').length == 0) {
                    alertify.error(err.data);
                }
                vm.contractMaster(false, vm.begin, vm.end);
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
        if (param === "cateName") {
            $("#srhcateName").show();
            $("#srhcontract").hide();
        } else if (param === "contract") {
            $("#srhcontract").show();
            $("#srhcateName").hide();
        }
    });



}
