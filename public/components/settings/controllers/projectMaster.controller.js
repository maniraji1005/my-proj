'use strict';
angular.module('todo.settings.controllers')
    .controller('projectMasterController', projectMasterController);
projectMasterController.$inject = ['$scope', '$state', 'api', '$timeout', 'storage'];
function projectMasterController($scope, $state, api, $timeout, storage) {
     var vm = this;
    vm.api = api;
    $scope.step = 1;
    vm.ddlRowsChange = ddlRowsChange;
    vm.rowCnt = "0";
    var status = "";
     vm.ddlRows = "10";
    vm.ddlRowsApp = "10";
    vm.filterTxt = '';
    var begin ="0";
    var end = "10";
    vm.begin = "0";
    vm.end = "10";
    vm.count = 1;
    vm.reload = reload;
    vm.searchTxt = searchTxt;
    vm.addRow = addRow;
    var initializing = true;
    vm.projectMasfil = projectMasfil;

    // Default DDL Select
    vm.ddlRows = "10";
    vm.ddlRowsApp = "10";
    vm.status = "";
    vm.searchType = 'proName';
    vm.srhLocate = '';
    vm.srhProName = '';
    vm.save = true;

    //grid bind
    function projectMasfil(isSrh, begin, end) {
         var access = storage.get("access");
         access = JSON.parse(access);
         var filterSearch = {
             "limit" : end,
             "skip" : begin,
             "role_id" : vm.api.profile.roles,
             "status" : "Active",
             "access" : access
         };
         if(isSrh || vm.srhProName || vm.srhLocate || vm.srhRaisedBy || vm.srhDt) {
             filterSearch = {
                 "limit" : vm.end,
                 "skip" : begin,
                 "role_id" : vm.api.profile.roles,
                 "status" : "Active",
                 "access" : access,
                 "name": vm.searchType == 'proName' ? ( vm.srhProName ? vm.srhProName : undefined): undefined,
                 "location": vm.searchType == 'locate' ? ( vm.srhLocate ? vm.srhLocate : undefined): undefined
             };

         }
         vm.api.proGrid(filterSearch, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
          if( 'name' != vm.srhProName || 'location' != vm.srhLocate)
          {
              vm.rowCnt = 0;
          }
        vm.paginationNumber = parseInt(vm.begin) == 0 ? 1 : parseInt(vm.begin) + 1;
        vm.proList = data.projectList;
        vm.rowCnt = data.count[0].count;
        vm.ddlRowsApp = "10";
      }
    });
  }
    vm.projectMasfil(false, begin, end);
    function ddlRowsChange(data) {
        vm.begin = "0";
        $scope.currentPage = 1;
        vm.projectMasfil(false, vm.begin, vm.ddlRows);
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
            vm.projectMasfil(true, begin, end);
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
    //reload page
    function reload()
    {
      //  vm.projectMasfil = [];
        vm.pname = "";
        vm.locate = "";
        vm.desc = "";
        $scope.currentPage = 1;
        vm.ddlRows = "10"; 
        vm.srhDt = "";
        vm.srhLocate = ""
        vm.srhProName = "";
        vm.srhRaisedBy = "";
        vm.projectMasfil(false, begin, vm.ddlRows);

    } 

    //add new project
    function addRow()
    {
        if(vm.pname == undefined  || vm.pname =="" )
        {
            if ($('.alertify-log-error').length == 0) {
            alertify.error("Please Enter Project");
            }
            return ;
        }
        if(vm.locate == undefined || vm.locate == "")
        {
            if ($('.alertify-log-error').length == 0) {
            alertify.error("Please enter Location");
            }
            return ;
        }
        var ObjPro = new Object();
        ObjPro.name = vm.pname;
        ObjPro.location = vm.locate;
       // ObjPro.short_code = vm.desc;
        ObjPro.status = "Active";
        ObjPro.updated_by = vm.api.profile._id;
         vm.api.projectAdd(ObjPro, function (err, data) {
            if (err) {
                //alert("No Data");
                 if ($('.alertify-log').length == 0) {
                        alertify.error(err.data);
                        }
            }
            else {
                vm.pname = "";
                vm.locate = "";
                vm.desc = "";
                vm.projectMasfil(false, vm.begin, vm.end);
                if ($('.alertify-log-success').length == 0) {
                        alertify.success(data);
                        }
                }
        });

    }

    //edit project
$scope.$on('proEdit', function (e, data) {
        data.updated_by = vm.api.profile._id;
        data.status = "Active";
        // console.log(JSON.stringify(data));
        vm.api.projectEdit(data, function (err, data) {
            if (!err) {
                if ($('.alertify-log-success').length == 0) {
                    alertify.success("successfully updated");
        }
            }else{
                //alert(JSON.stringify(err));
            }
        });
    });

    //Search DDL Select
  $('.search-panel .dropdown-menu').find('a').click(function (e) {
    e.preventDefault();
    var param = $(this).attr("title").replace("#", "");
    var concept = $(this).text();
    $('.search-panel span#search_concept').text(concept);
    $('.input-group #search_param').val(param);
    vm.searchType = param;
    if (param === "proName") {
      $("#srhProName").show();
      $("#srhLocate").hide();
    } else {
      $("#srhProName").hide();
      $("#srhLocate").show();
    }
  });

  //date
  $('.input-group.date').datepicker({
    calendarWeeks: true,
    todayHighlight: true,
    autoclose: true,
    endDate: '+0d',
    closeText: 'Clear',
    clearBtn: true
  });

  //clear searchtext
  function searchTxt()
  {
      vm.srhProName = '';
      vm.srhRaisedBy = '';
      vm.srhLocate = '';
      vm.srhDt = '';
  }
}
