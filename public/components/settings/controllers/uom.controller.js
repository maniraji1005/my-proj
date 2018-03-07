'use strict';
angular.module('todo.settings.controllers')
    .controller('uomController', uomController);
uomController.$inject = ['$scope', '$state', 'api', '$timeout', 'storage'];
function uomController($scope, $state, api, $timeout, storage) {
    var vm = this;
    vm.api = api;
    $scope.step = 1;
    vm.uomApp = [];
    vm.ddlRowsChange = ddlRowsChange;
    vm.rowCnt = 0;
    var status = "";
    vm.ddlRows = "10";
    vm.ddlRowsApp = "10";
    var begin = 0;
    var end = 10;
    vm.begin = 0;
    vm.end = 10;
    vm.count = 1;
    vm.addRow = addRow;
    var initializing = true;
    var uomName = [];
    vm.reload = reload;
    var unitname = [];
    vm.uomfilter = uomfilter;
    // Default DDL Select
    vm.ddlRows = "10";
    vm.ddlRowsApp = "10";
    vm.status = "";
    vm.searchType = 'Uom';
    vm.srhUom = '';

    var access = storage.get('access');
    if (access) {
        vm.uomAccess = JSON.parse(access);
    }

    // default loading

    function uomfilter(isSrh, begin, end) {
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
                "name": vm.searchType == 'Uom' ? (vm.srhUom ? vm.srhUom : undefined) : undefined,
            };
        }
        //  console.log(JSON.stringify(filterSearch));

        api.uomGrid.uomGrid(filterSearch, function (err, data) {
            if (err) {
                //alert("No Data");
            }
            else {
                uomName = data.uomList;
                vm.uomApp = data.uomList;
                vm.rowCnt = data.count;
                vm.ddlRowsApp = "10";
            }
        });
    }

    vm.uomfilter(false, begin, end);
    function ddlRowsChange(data) {
        vm.begin = "0";
        $scope.currentPage = 1;
        vm.uomfilter(false, vm.begin, vm.ddlRows);
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
            vm.uomfilter(true, begin, end);
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

    // reload grid
    function reload() {
        vm.srhUom = "";
        vm.newuom = "";
        $scope.currentPage = 1;
        vm.ddlRows = "10";
        vm.uomfilter(false, begin, vm.ddlRows);
    }

    //add newuom
    function addRow() {
        if (vm.newuom == undefined || vm.newuom == "") {
            if ($('.alertify-log').length == 0) {
                alertify.log("please enter name");
            }
            return;
        }
        var flag = 1;
        angular.forEach(uomName, function (data) {
            // console.log(data); 
            if (data.name.toUpperCase() == vm.newuom.toUpperCase()) {
                if ($('.alertify-log').length == 0) {
                    alertify.log("already exists");
                }
                flag = 0;

            }
        });
        if (flag == 0) {
            return;
        }

        var Objuom = new Object();
        Objuom.name = vm.newuom;
        Objuom.status = "Active";
        Objuom.created_by = {
            "_id": vm.api.profile._id,
            "name": vm.api.profile.name
        }
        vm.api.uomAdd(Objuom, function (err, data) {
            if (err) {
                //alert("No Data");
            }
            else {
                //  alert(JSON.stringify(Objuom));
                vm.newuom = "";

                vm.uomfilter(false, begin, vm.ddlRows);
                if ($('.alertify-log-success').length == 0) {
                    alertify.success(data);
                }
            }
        });
    }

    //   deleteuom

    $scope.$on('deleteUom', function (e, data) {
        data.updated_by = {
            "id": vm.api.profile._id,
        };
        data.status = "Inactive";
        // console.log(JSON.stringify(data));
        vm.api.deleteUom(data, function (err, data) {
            if (!err) {
                alertify.log("successfully deleted");
                vm.uomfilter(false, vm.begin, vm.end);
            } else {
                //alert(JSON.stringify(err));
            }
        });
    });
}
