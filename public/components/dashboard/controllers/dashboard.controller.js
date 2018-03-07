(function () {
  'use strict';

  angular
    .module('todo.dashboard.controllers')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$state', '$scope', 'api', 'storage', '$stateParams','$filter'];
  function DashboardController($state, $scope, api, storage, $stateParams, $filter) {
    var vm = this;
    var index = $stateParams.index;
    var status = $stateParams.status;
    vm.api = api;
    vm.piList = [];
    vm.poList = [];
    vm.lowQtyList = [];
    vm.branchList = [];
    vm.vendorList = [];
    vm.executiveList = [];
    vm.SelectedBranch = '';
    vm.SelectedStoreType = '';
    vm.SelectedStore = '';
    vm.SelectedVendor = '';
    vm.dashboardRes = dashboardRes;
    vm.getStoreType = getStoreType;
    vm.getStoreName = getStoreName;
    vm.getStore = getStore;
    vm.getVendor = getVendor;
    vm.getExeList = getExeList;
    vm.addPIDet = addPIDet;
    vm.addPMDet = addPMDet;
    vm.vendorInitial = '';
    vm.empList = '';
    // vm.exeList = vm.api.profile._id;
    vm.mrPending = mrPending;
    vm.miStatus = miStatus;
    vm.piStatus = piStatus;
    vm.poStatus = poStatus;
    vm.mrnStatus = mrnStatus;
    // vm.SelectedProject = '';
    // vm.SelectedProjectType = '';
    // vm.mrListWait = 0;
    // vm.piListRej = 0;
    //  vm.miListClosed = 0;
    //    vm.miListRejected = 0;
    //    vm.miListIssue = 0;
    //    vm.miListNotIssue = 0;
    //    vm.mrListRej = 0;
    //    vm.mrListApp = 0;
    //     vm.mrnListClosed = 0;
    //      vm.mrnListApp = 0;
    //      vm.poListApp = 0;
    //      vm.piListApp = 0;

    vm.getCompDet = vm.api.profile.company;
    vm.dashboardRes(false);

    api.ProjectDDL({}, function (err, data) {
        if (err) {
          //alert("No Data");
        }
        else {
          vm.toprojectList = data.projectList;
          // alert(JSON.stringify(vm.projShCode));
        }
      });

    var profileName = {
      'id': vm.api.profile._id,
      'name': vm.api.profile.names
    }

    function addPIDet(buttonId) {
      var hideBtn, showBtn, menuToggle;
      if (buttonId == 'button1') {
        menuToggle = 'menu2';
        showBtn = 'button2';
        hideBtn = 'button1';
      } else {
        menuToggle = 'menu3';
        showBtn = 'button1';
        hideBtn = 'button2';
      }


      document.getElementById(hideBtn).style.display = 'none';
      document.getElementById(showBtn).style.display = '';
    }

    function addPMDet(buttonId) {
      var hideBtn, showBtn, menuToggle;
      if (buttonId == 'button3') {
        menuToggle = 'menu2';
        showBtn = 'button4';
        hideBtn = 'button3';
      } else {
        menuToggle = 'menu3';
        showBtn = 'button3';
        hideBtn = 'button4';
      }


      document.getElementById(hideBtn).style.display = 'none';
      document.getElementById(showBtn).style.display = '';
    }

    function getStoreType(branch) {
      if (branch == null) {
        vm.storeTypeList = [];
        vm.storeNameList = [];

      }
      api.storeType.storeType(branch, function (err, data) {
        if (err) {
          //alert("No Data");
        }
        else {
          vm.storeTypeList = data;
          vm.dashboardRes();

        }
      });
    }

    function getStoreName(store) {
      api.storeName.storeName(store, function (err, data) {
        if (err) {
          // $('#mainLoading').hide();
          //alert("No Data");
        }
        else {
          vm.storeNameList = data;
          vm.dashboardRes();

        }
      });
    }

    function getStore(selectedStore) {
      vm.dashboardRes();
    }

    function getVendor() {
      vm.dashboardRes();
    }

    function getExeList(exeList) {
      vm.dashboardRes();
    }

    vm.getProject = getProject;
    function getProject(data) {
      vm.dashboardRes();
    }


    api.branch.branchDDL(function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        vm.branchList = data.branches;
      }
    });

    api.exeDDL(vm.empList, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        vm.executiveList = data;
      }
    });

    api.vendorDDL(vm.vendorInitial, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        vm.vendorList = data.vendorsList;
      }
    });



    function mrPending(status) {
      var moduleAccess = vm.api.company.modules;
      for (var i = 0; i < moduleAccess.length; i++) {
        if (vm.api.profile.roles == moduleAccess[i]._id) {
          var modAccessPO = moduleAccess[i].module[1];
          var modulePO = modAccessPO.m_sub_modules[0].s_access;
        }
      }
      storage.put("subMenuSelected",0);
      storage.put("mainMenuSelected",1); 
      $state.go('master.matrerialrequisition', { status: status, access: modulePO, branch: vm.SelectedBranch, storeType: vm.SelectedStoreType, store: vm.SelectedStore, vendor: vm.SelectedVendor, executive: vm.exeList });

    }

    function miStatus(status) {
      var moduleAccess = vm.api.company.modules;
      for (var i = 0; i < moduleAccess.length; i++) {
        if (vm.api.profile.roles == moduleAccess[i]._id) {
          var modAccessPO = moduleAccess[i].module[1];
          var modulePO = modAccessPO.m_sub_modules[1].s_access;
        }
      }
      storage.put("subMenuSelected",1);
      storage.put("mainMenuSelected",1); 
      $state.go('master.materialIssue', { status: status, access: modulePO, branch: vm.SelectedBranch, storeType: vm.SelectedStoreType, store: vm.SelectedStore, vendor: vm.SelectedVendor, executive: vm.exeList });
    }

    function piStatus(status) {
      var moduleAccess = vm.api.company.modules;
      for (var i = 0; i < moduleAccess.length; i++) {
        if (vm.api.profile.roles == moduleAccess[i]._id) {
          var modAccessPO = moduleAccess[i].module[2];
          var modulePO = modAccessPO.m_sub_modules[0].s_access;
        }
      }
      storage.put("subMenuSelected",0);
      storage.put("mainMenuSelected",2);
      $state.go('master.purchase', { status: status, access: modulePO, branch: vm.SelectedBranch, storeType: vm.SelectedStoreType, store: vm.SelectedStore, vendor: vm.SelectedVendor, executive: vm.exeList });
    }

    function poStatus(status) {
      var moduleAccess = vm.api.company.modules;
      for (var i = 0; i < moduleAccess.length; i++) {
        if (vm.api.profile.roles == moduleAccess[i]._id) {
          var modAccessPO = moduleAccess[i].module[2];
          var modulePO = modAccessPO.m_sub_modules[1].s_access;
        }
      }
      storage.put("subMenuSelected",1);
      storage.put("mainMenuSelected",2); 
      $state.go('master.purchaseOrder', { status: status, access: modulePO, branch: vm.SelectedBranch, storeType: vm.SelectedStoreType, store: vm.SelectedStore, vendor: vm.SelectedVendor, executive: vm.exeList });
    }

    function mrnStatus(status) {
      var moduleAccess = vm.api.company.modules;
      for (var i = 0; i < moduleAccess.length; i++) {
        if (vm.api.profile.roles == moduleAccess[i]._id) {
          var modAccessPO = moduleAccess[i].module[1];
          var modulePO = modAccessPO.m_sub_modules[2].s_access;
        }
      }
      if(vm.getCompDet !== 'CH0001' && vm.getCompDet == 'CO00001') {
      storage.put("subMenuSelected",2);
      storage.put("mainMenuSelected",1); 
      }
      else {
        storage.put("subMenuSelected",3);
      storage.put("mainMenuSelected",1); 
      }
      $state.go('master.mrn', { status: status, access: modulePO, branch: vm.SelectedBranch, storeType: vm.SelectedStoreType, store: vm.SelectedStore, vendor: vm.SelectedVendor, executive: vm.exeList });
    }

// For Dashboard
    function dashboardRes() {
      if(vm.getCompDet !== 'CH0001' && vm.getCompDet == 'CO00001') {
            var created_by = {
        'executive_id': vm.exeList,
        'branch': vm.SelectedBranch,
        'store_type': vm.SelectedStoreType,
        'store': vm.SelectedStore,
        'vendor': vm.SelectedVendor
      }
      }
      else {
        if(vm.SelectedProjectType || vm.SelectedProject == undefined) {
          var created_by = {
        'project': '',
        'order_type': '',
      }
        }
        else {
            var created_by = {
        'project': [vm.SelectedProject],
        'order_type': vm.SelectedProjectType,
      }
        }
          
      }
      
      // console.log("fasf",JSON.stringify(created_by));
      api.dashboard(created_by, function (err, data) {
        // alert("called");
        if (err) {
          //alert("No Data");
        }
        else {
          // alert("called1");
          // console.log(JSON.stringify(data.purchaseIndent));

          // vm.SelectedBranch = vm.SelectedBranch;
          vm.piList = data.purchaseIndent;
          vm.poList = data.purchaseOrder;
          vm.mrnList = data.mrn;
          vm.mrList = data.materialRequest;
          vm.miList = data.materialIssue;
          vm.lowQtyList = data.materialsLowQuantity;

          if (vm.piList == null) {
            vm.piListApp = vm.piListWait = vm.piListRej = 0;
          }
          else {
            vm.piListApp = vm.piListWait = vm.piListRej = 0;
            angular.forEach(vm.piList, function (id) {
              if (id._id.status == '574450f469f12a253c61bca2') {
                vm.piListApp = id.pi_count;
              }
              else if (id._id.status == '57444c9569f12a253c61bc9a') {
                vm.piListWait = id.pi_count;
              }
              else if (id._id.status == '574450f469f12a253c61bca1') {
                vm.piListRej = id.pi_count;
              }

            });
          }

          if (vm.poList == null) {
            vm.poListApp = vm.poListMan = vm.poListCls = 0;
          }
          else {
            vm.poListApp = vm.poListMan = vm.poListCls = 0;
            angular.forEach(vm.poList, function (id) {
              if (id._id.status == '57650efb818d3b1cd808c401') {
                vm.poListCre = id.po_count;
              }
              else if (id._id.status == '578f673c3d4dce0370afed48') {
                vm.poListMan = id.po_count;
              }
              else if (id._id.status == '57650efb818d3b1cd808c402') {
                vm.poListCls = id.po_count;
              }
              else if (id._id.status == '57650efb818d3b1cd808c404') {
                vm.poListApp = id.po_count;
              }
            });
          }

          if (vm.mrnList == null) {
            vm.mrnListApp = vm.mrnListClosed = 0;
          }
          else {
            vm.mrnListApp = vm.mrnListClosed = 0;
            angular.forEach(vm.mrnList, function (id) {
              if (id._id.status == '5767b0ec69f12a0e94baa70f') {
                vm.mrnListApp = id.mrn_count;
              }
              else if (id._id.status == '5767b0ec69f12a0e94baa710') {
                vm.mrnListClosed = id.mrn_count;
              }
              else if(id._id.status == '5767b0ec69f12a0e94baa712') {
                vm.mrnListAudit = id.mrn_count;
              }
              else if(id._id.status == '57650efb818d3b1cd808c401') {
                vm.mrnListcre = id.mrn_count;
              }

            });
          }

          if (vm.mrList == null) {
            vm.mrListWait = vm.mrListApp = vm.mrListRej = 0;
          }
          else {
            vm.mrListWait = vm.mrListApp = vm.mrListRej = 0;
            angular.forEach(vm.mrList, function (id) {
              if (id._id.status == '57444c9569f12a253c61bc9a') {
                vm.mrListWait = id.mr_count;
              }
              else if (id._id.status == '574450f469f12a253c61bca1') {
                vm.mrListRej = id.mr_count;
              }

              else if (id._id.status == '574450f469f12a253c61bca0') {
                vm.mrListApp = id.mr_count;
              }

              else if (id._id.status == '574450f469f12a253c61bca5') {
                vm.mrListAccept = id.mr_count;
              }

            });
          }

          if (vm.miList == null) {
            vm.miListNotIssue = vm.miListIssue = vm.miListRejected = vm.miListClosed = 0;
          }
          else {
            vm.miListNotIssue = vm.miListIssue = vm.miListRejected = vm.miListClosed = 0;
            angular.forEach(vm.miList, function (id) {
              if (id._id.status == '574450f469f12a253c61bca1') {
                vm.miListNotIssue = id.mi_count;
              }
              else if (id._id.status == '574450f469f12a253c61bca2') {
                vm.miListIssue = id.mi_count;
              }
              else if (id._id.status == '576a5c81bd7ebf2facf2de81') {
                vm.miListRejected = id.mi_count;
              }
              else if (id._id.status == '57444c9569f12a253c61bc9a') {
                vm.miListClosed = id.mi_count;
              }

            });
          }



        }
      });
    }
    
  }


})();