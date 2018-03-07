'use strict';
angular.module('todo.settings.controllers')
    .controller('stockAvlController', stockAvlController);
stockAvlController.$inject = ['$scope', '$state', 'api', '$timeout', 'storage', '$filter'];
function stockAvlController($scope, $state, api, $timeout, storage, $filter) {
    var vm = this;
    vm.api = api;
    vm.ddlRowsChange = ddlRowsChange;
    vm.rowCnt = 0;
    var status = "";
    vm.ddlRows = "10";
    vm.ddlRowsApp = "10";
    var begin = "0";
    var end = "10";
    vm.begin = "0";
    vm.end = "10";
    vm.count = "1";
    vm.UomName - UomName;
    vm.stockavailability = [];
    var uomList = [];
    vm.stockAvl = stockAvl;
    var initializing = true;
    vm.reload = reload;
    vm.searchTxt = searchTxt;
    // Default DDL Select
  // vm.ddlRows = "10";
  vm.ddlRowsApp = "10";
  vm.searchType = 'matCode';
  vm.srhSubCate = '';
  vm.srhCate = '';
  vm.srhPro = '';
  vm.matCode = '';
  vm.matName = '';
  vm.project = "";
 vm.getStock = getStock;
 function getStock(data)
{
var getStockOpen = { "project": data}
     vm.api.materialLists(getStockOpen, function (err, data)
     {
         if(!err)
         {
               vm.stoclbal = data.materialBalance;
               vm.api.stockDate = vm.stoclbal;
         }
         vm.stockAvl(false, begin, end);
     });
}

var Employee = {
    "empID": vm.api.profile._id
}
 vm.project  = "";
vm.api.proGrid(Employee, function (err, data) {
    if (!err) {
        vm.project = data.projectList[0]._id;
      vm.projectEmpList = data.projectList;
       vm.api.projectList = data.projectEmpList;
     // vm.api.projectList = data.projectList;
    }
  });
    //for grid bind
    function stockAvl(isSrh, begin, end) {


        var filterSearch = {
            "limit": end,
            "skip": begin,
            "role_id": vm.api.profile.roles,
            "status": "Active",
             "project": vm.project
        };
        if (isSrh) {
            filterSearch = {
                "limit": vm.end,
                "skip": begin,
                "role_id": vm.api.profile.roles,
                "status": "Active",
                "id" : vm.searchType == 'matCode' ? (vm.matCode ? vm.matCode : undefined) : undefined,
                "category": vm.searchType == 'srhCate' ? (vm.srhCate ? vm.srhCate : undefined) : undefined,
                "subcategory": vm.searchType == 'srhSubCate' ? (vm.srhSubCate ? vm.srhSubCate : undefined) : undefined,
                "project" : vm.searchType == 'srhPro' ? (vm.srhPro ? vm.srhPro : undefined) : undefined,
                "name" : vm.searchType == 'matName' ? (vm.matName ? vm.matName : undefined) : undefined
               
            };
        }

        vm.api.materialLists(filterSearch, function (err, data) {
            if (!err) {
                if( 'id' != vm.matCode || 'category' != vm.srhCate || 'subcategory' != vm.srhSubCate || 'project' !=  vm.srhPro || 'name' != vm.matName)
          {
              vm.rowCnt = 0;
          }
                vm.paginationNumber = parseInt(vm.begin) == 0 ? 1 : parseInt(vm.begin) + 1;
                vm.stockavailability = data.materialsList;
                vm.stoclbal = data.materialBalance;
                vm.api.stockDate = vm.stoclbal;
                vm.rowCnt = data.count;
                vm.ddlRowsApp = "10";
            }
        });





    }
    
    
    vm.stockAvl(false, begin, end);
      vm.api.materialLists({}, function (err, data)
      {
          if(!err) {
              vm.stockBal =  data.materialBalance;
              for( var i = 0; i < vm.stockBal.length; i ++)
               vm.dateLast =  data.materialBalance[i].date
          }
      })
    vm.api.getUom({}, function (err, data) {
        if (!err) {
            uomList = data.uomList;
        }
    });
    function UomName(data) {
        var uomname = $filter('filter')(uomList, { _id: data }, true)[0];
        if (uomname)
            return uomname.name;
    }

    vm.api.getSubCategory({}, function (err, data) {
        if (!err) {
            //laert("No Data");
            vm.subCategoryList = data.subcatgoriesList;
            vm.api.getSub = vm.subCategoryList;
        }
    });
    vm.api.categoryGrid.categoryGrid({}, function (err, data) {
        if (!err) {
            vm.CategoryList = data.categoryList;
            vm.api.getcat = vm.CategoryList;
        }
    });

    //get projectlist
  vm.api.proGrid({}, function (err, data) {
    if (!err) {
      vm.projectList = data.projectList;
      vm.api.projectList = data.projectList;
    }
  });
  

    function ddlRowsChange(data) {
        vm.begin = "0";
        $scope.currentPage = 1;
        vm.stockAvl(false, vm.begin, vm.ddlRows);
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
            vm.stockAvl(true, begin, end);
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

//reload grid
  function reload() {
    vm.ddlRows = "10";
    $scope.currentPage = 1;
    vm.srhSubCate = "";
    vm.srhCate = "";
    vm.srhPro = "";
    vm.matCode = "";
    vm.matName = "";
    vm.stockAvl(false, begin, vm.ddlRows);
  }

  function searchTxt() {
    vm.srhSubCate = "";
    vm.srhCate = "";
    vm.srhPro = "";
    vm.matCode = "";
    vm.matName = "";
  }


     $('.search-panel .dropdown-menu').find('a').click(function (e) {
    e.preventDefault();
    var param = $(this).attr("title").replace("#", "");
    var concept = $(this).text();
    $('.search-panel span#search_concept').text(concept);
    $('.input-group #search_param').val(param);
    vm.searchType = param;
    if(param === "srhPro") {
      $("#srhPro").show();
      $("#srhCate").hide();
      $("#srhDt").hide();
      $("#srhSubCate").hide();
       $("#matName").hide();
    }
    else if (param === "srhCate") {
      $("#srhCate").show();
      $("#matCode").hide();
      $("#srhSubCate").hide();
       $("#srhPro").hide();
        $("#matName").hide();
    }
    else if (param === "srhSubCate") {
      $("#srhSubCate").show();
      $("#srhCate").hide();
      $("#matCode").hide();
       $("#srhPro").hide();
        $("#matName").hide();
    }
    else if (param === "matCode" ) {
      $("#srhSubCate").hide();
      $("#srhCate").hide();
      $("#matCode").show();
       $("#srhPro").hide();
        $("#matName").hide();
    }
    else {
      $("#srhCate").hide();
      $("#matName").show();
       $("#srhPro").hide();
       $("#matCode").hide();
        $("#srhSubCate").hide();
    }
  });
}