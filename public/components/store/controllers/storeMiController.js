'use strict';
angular.module('todo.storeMiController', [])
  // .controller('storeMiController', function ($scope, $state, api, storage, $timeout,CONSTANTS) {
.controller('storeMiController', storeMiController);

storeMiController.$inject = ['$scope', '$state', 'api', '$timeout', 'storage', '$filter', 'SETTINGS','$stateParams']

function storeMiController($scope, $state, api, $timeout, storage, $filter, CONSTANTS,$stateParams) {

    var vm = this;
    vm.rowCnt = 0;
    vm.begin = 0;
    vm.end = 10;
    var begin = 0;
    var end = 10;
    vm.filterSearch = filterSearch;
    var initializing = true;
    vm.miApp = [];
    vm.ddlRows = "10";
    vm.statusList = [];
    vm.api = api;
    vm.ddlRowsChange = ddlRowsChange;
    $scope.openTrackSheet = function () {
      $state.go("master.trackSheet", { 'index': 2 });
    }

  vm.status = "574450f469f12a253c61bca2";
  // var status = $stateParams.status;
  // alert(JSON.stringify(status));
  var noRows = vm.ddlRows;
  vm.searchType = 'MINo';
  // vm.searchMr = searchMr;
  vm.srhTxt = '';
  vm.srhDt = '';
  vm.searchbranch = '';
  vm.stateParams = '';
  vm.executiveList = [];
  vm.reload = reload;
  vm.access = '';
  vm.miGridBind = miGridBind;
    // vm.statusList = CONSTANTS.mi_status;
    //     alert(JSON.stringify(vm.statusList));

vm.getCompDet = '';
        
 vm.getCompDet = vm.api.profile.company;
api.branch.branchDDL(function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      var branch = vm.api.company.branches;
      var status = vm.api.company.mr_status;
      var category = vm.api.company.category;
      vm.branchList = branch;
      vm.statusList = $filter('filter')(CONSTANTS.mi_status, function(stat){
        return stat.name !== 'Delete' && stat.name !== 'Partially Issued';
      }, true);
      vm.categoryList = category;
      vm.api.MaterialCategory = vm.categoryList;
    }
  });
    // For getting Start Limit and End Limit
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
        vm.end = vm.ddlRows.toString();;
        vm.filterSearch(null, begin, vm.end);
      }
      // vm.items = vm.materialList.filter(function (row) {
      //   if (row.row) {
      //     vm.materialList.splice(row.sno, 1);
      //   }
      // });

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

    // Dropdown Rows Per Page change
    function ddlRowsChange() {
      $scope.currentPage = 1;
      vm.begin = "0";
      vm.miGridBind(false, vm.begin, vm.ddlRows);
    }

    api.exeDDL(vm.empList, function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      vm.executiveList = data;
    }
  });

   api.ProjectDDL({}, function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      vm.projectList = data.projectList;
      // console.log(JSON.stringify([EmpId]));
      vm.api.projectList = vm.projectList;
    }
  });

  function miGridBind(isSrh, begin, end, flag) {
    vm.stateParams = null;
    // var access = storage.get('access');
    var access = vm.access;

    if (flag === '2') {
      vm.ddlRows = vm.ddlRowsApp;
    }
    var filterSearch = {
      "limit": vm.ddlRows.toString(),
      "skip": begin,
      "role_id": vm.api.profile.roles,
      "created_by": vm.status == '574450f469f12a253c61bca3' ? vm.api.profile._id : undefined,
      "access": access,
      "status": [vm.status]
    };
    searchClear();
    if (isSrh) {
      filterSearch = {
        "status": [vm.status],
        "limit": vm.end,
        "skip": vm.begin,
        "role_id": vm.api.profile.roles,
        "access": access,
        "flg": flag,
      };
    }
    api.filterMI.filterMI(filterSearch, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        // console.log(data);
        // vm.mrApp = [];
        vm.paginationNumber = parseInt(vm.begin) == 0 ? 1 : parseInt(vm.begin) + 1;
          // vm.mrApp = [];
          vm.miApp = data.miList;
          vm.rowCnt = data.count;
          $stateParams.status = null;
          vm.stateParams = $stateParams.status;

      }
    });
  }


    // Display MR Grid , Search , Pagination
    vm.filterTxt = '';
    function filterSearch(isSrh, begin, end) {

      if($stateParams.status == null)
      {
        var access = storage.get("access");
      access = JSON.parse(access);
      var filterSearch = {
        "limit": end,
        "skip": begin,
        "role_id": vm.api.profile.roles,
        "created_by": vm.status == '574450f469f12a253c61bca3' ? vm.api.profile._id : undefined,
        "status": [vm.status],
        "access": access
      };

      if (isSrh) {
         filterSearch = {
        "status": [vm.status],
        "limit": vm.end,
        "skip": vm.begin,
        "role_id": vm.api.profile.roles,
        "access": access,
        "id": vm.searchType == 'MINo' ? ( vm.srhTxt ? vm.srhTxt.toUpperCase() : undefined): undefined,
        "created_name": vm.searchType == 'Executive' ? (vm.srhTxt  ? vm.srhTxt : undefined) : undefined,
        "branch": vm.searchType == 'Branch' ?  (vm.searchbranch ? vm.searchbranch : undefined) : undefined,
        "datetime": vm.searchType == 'MIDate' ? (vm.srhDt ? vm.srhDt : undefined) : undefined,
        "project": vm.searchType == 'ProjectFrom' ? ([vm.searchprojectFrom] ? [vm.searchprojectFrom] : undefined) : undefined
      };
      }
      }
      else
      {
        var status = $stateParams.status;
        var branch = $stateParams.branch;
      var storeType = $stateParams.storeType;
      var store = $stateParams.store;
      var executive = $stateParams.executive;
       var access = $stateParams.access;
        vm.status = status;
        vm.branch = branch;
      vm.storeType = storeType;
      vm.store = store;
      vm.executive = executive;
      vm.access = access;
      //   var access = storage.get("access");
      // access = JSON.parse(access);
      var filterSearch = {
        "limit": end,
        "skip": begin,
        "role_id": vm.api.profile.roles,
        "created_by": vm.executive,
        "status": [vm.status],
        "access": vm.access,
        "branch": vm.branch,
        "storeType": vm.storeType,
        "store": vm.store,
        // "exeList": vm.executive
      };

      if (isSrh) {
         filterSearch = {
        "status": [vm.status],
        "limit": vm.end,
        "skip": vm.begin,
        "role_id": vm.api.profile.roles,
        "access": access,
        "id" : vm.searchType == 'MINo' ? vm.srhTxt.toUpperCase() : undefined,
        "created_by" : vm.searchType == 'Executive' ? vm.srhTxt : undefined,
        "branch" : vm.searchType == 'Branch' ? vm.searchbranch : undefined,
        "datetime":vm.searchType == 'MIDate' ? vm.srhDt : undefined
      };
      }
      }

      
      api.filterMI.filterMI(filterSearch, function (err, data) {
        if (err) {
          // $('#mainLoading').hide();
          //alert("No Data");
        }
        else {
          vm.paginationNumber = parseInt(vm.begin) == 0 ? 1 : parseInt(vm.begin) + 1;
          // vm.mrApp = [];
          vm.miApp = data.miList;
          vm.rowCnt = data.count;
          // $stateParams.status = null;
          vm.stateParams = $stateParams.status;
        if (vm.executive !== null) {
          for (var j = 0; j < vm.executiveList.length; j++) {
            if (executive == vm.executiveList[j]._id) {
              vm.exeList = vm.executiveList[j].names;
            }
          }
        }

        if (vm.branch !== null) {
          var branch = vm.api.company.branches;
          if(branch) {
                for (var i = 0; i < branch.length; i++) {
            if (vm.branch == branch[i]._id) {
              vm.branchName = branch[i].name;
            }
          }
          }
          
        }

        if (vm.storeType !== null) {
          var storeType = vm.api.company.stores_types;
          if(storeType) {
              for (var j = 0; j < storeType.length; j++) {
            if (vm.storeType == storeType[j]._id) {
              vm.storeTypeName = storeType[j].name;
            }
          }
          }
          
        }
 
        if (vm.store !== null) {
           var store = vm.api.company.stores;
           if(store) {
              for (var k=0;k<store.length;k++){
          if(vm.store == store[k]._id) {
            vm.storeName = store[k].name;
          }
        }
           }
        
        }
          // vm.mrApp.push(data);

        }
      });
    }

    vm.filterSearch(false, begin, end);


    api.branch.branchDDL(function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        // var comp_master = storage.get('company_master');
        // var comp_det = storage.get('company_det');
        // var contact = JSON.parse(comp_master);
        // console.log(contact);
        // var compDet = JSON.parse(comp_det);
        //  vm.branchList = data.branches;
        // var branch = vm.api.company.branches;
        // var status = vm.api.company.mr_status;
        vm.branchList = vm.api.company.branches;
        var status = vm.api.company.mi_status;
        
      }
    });

    // Get Store Type based on Branch
    $scope.getStoreType = function (branch) {
      api.storeType.storeType(branch, function (err, data) {
        if (err) {
          $('#mainLoading').hide();
          //alert("No Data");
        }
        else {
          vm.storeTypeList = data;

        }
      });
    }

    //Search DDL Select
  $('.search-panel .dropdown-menu').find('a').click(function (e) {
    e.preventDefault();
    var param = $(this).attr("title").replace("#", "");
    var concept = $(this).text();
    $('.search-panel span#search_concept').text(concept);
    $('.input-group #search_param').val(param);
    vm.searchType = param;
    if (param === "MIDate") {
      $("#srhDt").show();
      $("#srhTxt").hide();
      $("#srhBranch").hide();
      $("#projectFrom").hide();
      $("#projectTo").hide();
    } else if(param === "Branch"){
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

    $scope.$on('mitracksheet', function (e, data) {
      var mrid = data.mrid;
      $state.go("master.trackSheet", { 'index': 2, 'mrid': mrid, 'access': data.access });
    })

    // Get Store Name based on Store Type
    $scope.getStoreName = function (store) {
      api.storeName.storeName(store, function (err, data) {
        if (err) {
          $('#mainLoading').hide();
          //alert("No Data");
        }
        else {
          vm.storeNameList = data;
        }
      });
    }

     $('.input-group.date').datepicker({
    calendarWeeks: true,
    todayHighlight: true,
    autoclose: true,
    endDate: '+0d',
    closeText: 'Clear',
    clearBtn: true
});

  function reload() {
    vm.status = "574450f469f12a253c61bca2";
    $scope.currentPage = 1;
    vm.srhTxt = '';
    vm.srhDt = '';
    vm.searchbranch = '';
    vm.miGridBind(false, 0, 10);
    vm.ddlRows = "10";
  }

    vm.searchClear = searchClear;
  function searchClear() {
    vm.srhTxt = '';
    vm.srhDt = '';
    vm.searchbranch = '';
  }

  }
  

  // .filter('range', function () {
  //   return function (n) {
  //     var res = [];
  //     for (var i = 0; i < n; i++) {
  //       res.push(i);
  //     }
  //     return res;
  //   };
  // });