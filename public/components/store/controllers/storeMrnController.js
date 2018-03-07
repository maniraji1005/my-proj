'use strict';
angular.module('todo.storeMrnController', [])
  .controller('storeMrnController', storeMrnController);
storeMrnController.$inject = ['$scope', '$state', 'api', '$timeout', 'storage', 'SETTINGS', '$filter', '$stateParams']
function storeMrnController($scope, $state, api, $timeout, storage, CONSTANTS, $filter, $stateParams) {

  var vm = this;
  vm.api = api;
  vm.materialdet = api.MaterialMaster;
  vm.addrw = addrow;
  vm.mrnmat = mrnmatchange;
  vm.vendorsList = [];
  vm.vendorTypeList = [];
  vm.mrngetDet = [];
  vm.openNav = openNav;
  vm.closeNav = closeNav;
  vm.insertMRN = insertMRN;
  vm.sendPOMaterial = sendPOMaterial;
  vm.tax = '';
  vm.discount = '';
  vm.branchList = [];
  vm.branch = "";
  vm.vendor = [];
  vm.vendorMRNList = [];
  vm.count = '0';
  vm.close = ModalClose;
  vm.mrnRemarks = '';
  vm.invoiceNo = '';
  vm.filterSearch = filterSearch;
  vm.ddlRowsChange = ddlRowsChange;
  vm.rowCnt = 0;
  vm.begin = '0';
  vm.end = '10';
  var begin = '0';
  var end = '10';
  var flag = "1";
  vm.mrnGridBind = mrnGridBind;
  vm.categoryCH = vm.api.company.category;
  vm.ddlRows = "10";
  vm.ddlRowsApp = "10";
  var initializing = true;
  $scope.step = 1;
  $scope.mrnGetDet = [];
  $scope.mrngetDet = [];
  vm.poId = [];
  vm.calNetAmt = calNetAmt;
  // vm.calNetAmtCh = calNetAmtCh;
  vm.mrnopenNav = mrnopenNav;
  vm.closeNav1 = closeNav1;
  vm.SelectedVendor = "Select Vendor"
  // vm.statusList= [];
  // vm.status = "5767b0ec69f12a0e94baa711";
  // vm.status = CONSTANTS.mrn_status;
  vm.status = "5767b0ec69f12a0e94baa70f";
  vm.statusList = $filter('filter')(CONSTANTS.mrn_status, function (stat) {
    return stat.name !== 'Deleted';
  }, true);
  // vm.vendorInitial = '';
  //var status=vm.status;
  vm.grandTax = 0;
  vm.po_total = 0;
  vm.grand_total = 0;
  //vm.grand_totalch = 0;
  vm.categoryName = categoryName;
  // vm.setTodayDate = setTodayDate;
  // $('#srhDt1').datepicker('setDate', 'today');
  $scope.openTrackSheet = function () {
    $state.go("master.purchaseTrackSheet", { 'index': 3 });
  }
  vm.calculateTotal = calculateTotal;
  //  vm.projectDet = [];
  //   vm.project = vm.api.profile.projects;
  // var access = storage.get('access');
  // access = JSON.parse(access);
  // vm.mrnAccess = access;
  vm.searchType = 'MRNNo';
  vm.srhTxt = '';
  vm.srhDt = '';
  vm.searchbranch = '';
  vm.branchList = vm.api.company.branches;
  vm.getOrder = [];
  vm.executiveList = [];
  vm.stateParams = '';
  vm.closeMRN = closeMRN;
  vm.reload = reload;
  vm.access = '';
  vm.freightType = "Company";
  vm.loadType = "Company";
  var access = storage.get('access');
  if (access) {
    access = JSON.parse(access);
    vm.mrnAccess = access;
  }
 vm.api.proGrid({}, function (err, data)
 {
   if(!err) {
     vm.projectMrn = data.projectList;
   }
 });
  api.ProjectDDL({}, function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      vm.toprojectList1 = data.projectList;
      vm.api.projectList = vm.toprojectList1;
    }
  });
  // For Getting Project based on Emp ID for CH
  var EmpId = {
    "empID": vm.api.profile._id
  }

  api.ProjectDDL(EmpId, function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      vm.projectList = data.projectList;
    //   vm.api.projectList = vm.projectList;
    }
  });
  vm.api.companyDet(function (err, data) {

    vm.companyId = data._id;
  });
  vm.getCompDet = '';

  vm.getCompDet = vm.api.profile.company;
  vm.tax = 0;
  vm.discount = 0;

  function mrnmatchange(matid, index) {
    for (var i = 0; i < vm.materialrequisition.length; i++) {
      if (matid == vm.materialrequisition[i].mat_code) {
        $scope.materialrequisition[index] = vm.materialrequisition[i];
      }
    }
  }



  $scope.materialrequisition = [{
    'sno': '1',
    'material': '',
    'UOM': '',
    'qty': '',
    'receivedQty': '',
    'pendingQty': '',
    'totalamount': ''

  }]
  $scope.rwcount = 1;
  function addrow() {
    var count = $scope.rwcount;
    for (var i = 0; i < count; i++) {
      $scope.materialrequisition.push({
        'sno': i + 1,
        'material': '',
        'UOM': '',
        'qty': '',
        'receivedQty': '',
        'pendingQty': '',
        'totalamount': ''
      });
    }
  }
  function clear() {
    $scope.materialList = "";
    $scope.materialList = [{
      'sno': '1',
      'material': '',
      'uom': '',
      'qty': '',
    }]
  }

  function calNetAmt() {
    var reg = new RegExp('^[+]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$');
    if (!reg.test(vm.tax) && vm.tax !== '') {
      if ($('.alertify-log').length == 0) {
        alertify.log('Negative numbers , letters not allowed');
      }
      vm.tax = "";
    }
    if (!reg.test(vm.discount) && vm.discount !== '') {
      if ($('.alertify-log').length == 0) {
        alertify.log('Negative numbers , letters not allowed');
      }
      vm.discount = "";
    }

    var discount = vm.po_total * (vm.discount / 100);

    // var tax = (ltotal * ltax)/100;
    var disTot = (vm.po_total - discount);

    var taxTot = disTot * (vm.tax / 100);

    vm.grand_total = disTot + taxTot;
  }

  // calculation for colorHomes
  // function calNetAmtCh(data) {
  //   if(data.po_total !== null)
  //   {
  //     data.po_total = data.qty * data.po_unit_rate;
  //   }
  //  var reg = new RegExp('^[+]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$');
  //             if(!reg.test(vm.tax) && vm.tax !== ''){
  //                 if($('.alertify-log').length == 0){
  //                     alertify.log('Negative numbers , letters not allowed');
  //                 }
  //                 item.tax = "";
  //             }
  //             if(!reg.test(vm.discount) && vm.discount !== ''){
  //                 if($('.alertify-log').length == 0){
  //                     alertify.log('Negative numbers , letters not allowed');
  //                 }
  //               vm.discount = "";
  //             }

  //              if(data.discount == "" || data.discount == undefined )
  //   {
  //     data.discount = 0;
  //   }
  //   //  var discount = data.po_total * (data.discount / 100);

  //     // var tax = (ltotal * ltax)/100;

  //   if(data.tax == undefined || data.tax == "")
  //   {
  //     data.tax = 0;
  //   }

  //   if( data.discount == 0 && data.tax == 0 )
  //   {
  //     data.po_total = 0;
  //      data.po_total = data.qty * data.po_unit_rate;
  //      vm.grand_total = 0;
  //     angular.forEach($scope.mrngetDet, function(a){
  //         vm.grand_total += a.po_total;
  //         vm.grand_totalch =  vm.grand_total;
  //     });
  //      return data.po_total;
  //   }
  //   // data.po_total = 0;
  //   var discount = data.po_total * (data.discount / 100);
  // var  disTot = (data.po_total - discount);
  //    var taxTot = disTot * (data.tax / 100);

  //     data.po_total = disTot + taxTot;
  //     var pototal = data.po_total;
  // vm.grand_total = 0;
  //     angular.forEach($scope.mrngetDet, function(a){
  //         vm.grand_total += a.po_total;
  //         vm.grand_totalch =  vm.grand_total;
  //     });
  //    // return vm.grand_total;
  //   //  vm.grand_totalch = vm.grand_totalch + data.po_total;
  // }

  // Rows per Page
  var noRows = vm.ddlRows;
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
      vm.begin = begin + 1;
      vm.end = vm.ddlRows.toString();
      vm.filterSearch(null, begin, vm.end);
      // $scope.testing1(null,begin,end);
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
    if ($scope.step === 2) {
      vm.mrnGridBind(false, vm.begin, vm.ddlRows, '2');
    }
    else {
      vm.mrnGridBind(false, vm.begin, vm.ddlRows, '1');
    }

  }

  function mrnGridBind(isSrh, begin, end, flag) {
    vm.stateParams = null;
    // if (flag === '2') {
    //   vm.ddlRows = vm.ddlRowsApp;
    // }
    var access = vm.access;
    var filterSearch = {
      "limit": vm.ddlRows.toString(),
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
        "branch": vm.branch,
        "store_type": vm.storeType,
        "store": vm.option2,
        "access": access
      };
    }
    api.mrnGrid(filterSearch, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        $scope.step = 1;
        vm.mrnApp = data.mrnList;
        vm.rowCnt = data.count;
        $scope.currentPage = 1;
        vm.begin = "0";
      }
    });
  }

  api.exeDDL(vm.empList, function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      vm.executiveList = data;
    }
  });


  vm.filterTxt = '';

  function filterSearch(isSrh, begin, end, flag) {
    flag = $scope.step.toString();

    if ($stateParams.status == null) {
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
          "limit": vm.end,
          "skip": vm.begin,
          "role_id": vm.api.profile.roles,
          "status": [vm.status],
          "access": access,
          "id": vm.searchType == 'MRNNo' ? (vm.srhTxt ? vm.srhTxt.toUpperCase() : undefined) : undefined,
          "created_name": vm.searchType == 'Executive' ? (vm.srhTxt ? vm.srhTxt : undefined) : undefined,
          "branch": vm.searchType == 'Branch' ? (vm.searchbranch ? vm.searchbranch : undefined) : undefined,
          "datetime": vm.searchType == 'MRNDate' ? (vm.srhDt ? vm.srhDt : undefined) : undefined,
          "project": vm.searchType == 'ProjectFrom' ? ([vm.searchprojectFrom] ? [vm.searchprojectFrom] : undefined) : undefined
        };
      }
    }
    else {
      var status = $stateParams.status;
      var branch = $stateParams.branch;
      var storeType = $stateParams.storeType;
      var store = $stateParams.store;
      var executive = $stateParams.executive;
      var vendor = $stateParams.vendor;
      var access = $stateParams.access;
      vm.status = status;
      vm.branch = branch;
      vm.storeType = storeType;
      vm.store = store;
      vm.executive = executive;
      vm.vendorDet = vendor;
      vm.access = access;
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
        // "exeList": vm.executive,
        "vendor": vm.vendorDet
      };


      if (isSrh) {
        filterSearch = {
          "limit": vm.end,
          "skip": vm.begin,
          "role_id": vm.api.profile.roles,
          "status": [vm.status],
          "access": access,
          "id": vm.searchType == 'MRNNo' ? (vm.srhTxt ? vm.srhTxt.toUpperCase() : undefined) : undefined,
          "created_by": vm.searchType == 'Executive' ? (vm.srhTxt ? vm.srhTxt : undefined) : undefined,
          "branch": vm.searchType == 'Branch' ? (vm.searchbranch ? vm.searchbranch : undefined) : undefined,
          "datetime": vm.searchType == 'MRNDate' ? (vm.srhDt ? vm.srhDt : undefined) : undefined
        };
      }
    }
    // console.log(JSON.stringify(filterSearch));
    api.mrnGrid(filterSearch, function (err, data) {
      if (err) {
        // $('#mainLoading').hide();
        //alert("No Data");
      }
      else {
        vm.paginationNumber = parseInt(vm.begin) == 0 ? 1 : parseInt(vm.begin);
        vm.mrnApp = data.mrnList;
        vm.rowCnt = data.count;
        vm.ddlRows = "10";
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
              for (var k = 0; k < store.length; k++) {
            if (vm.store == store[k]._id) {
              vm.storeName = store[k].name;
            }
          }
          }
          
        }

        if (vm.vendorDet !== null) {
          var vendorListDet = vm.api.vendorListDet.vendorsList;
          if(vendorListDet) {
                for (var l = 0; l < vendorListDet.length; l++) {
            if (vm.vendorDet == vendorListDet[l].id) {
              vm.vendorName = vendorListDet[l].name;
            }
          }
          }
          
        }

      }
    });
  }

  vm.filterSearch(false, begin, end, flag);

  function ModalClose() {
    vm.mrngetDet = [];
    vm.vendorMRNList = [];
    $scope.mrnGetDet = [];
    vm.mrnRemarks = [];
    vm.count = '0';
    vm.tax = 0;
    vm.discount = 0;
    vm.po_total = 0;
    vm.grand_total = 0;
    vm.invoiceNo = '';
    $scope.mrngetDet = [];
    document.getElementById("mySidenav").style.display = "none";
    document.getElementById("main").style.display = "block";
    vm.SelectedVendor = "Select Vendor";
    document.getElementById("fullClose").style.display = "block";

  }

  vm.vendorMaterials = [];
  vm.vendorMat = [];
  // Get PI List based on Vendor
  $scope.getVendorList = function (vendor) {
    vm.vendorMat = [];
    vm.vendorTypeList = [];
    $scope.mrngetDet = [];
    vm.count = '0';
    vm.po_total = 0;
    vm.tax = 0;
    vm.discount = 0;
    vm.grand_total = 0;
    vm.selectVendor = vendor;
    document.getElementById("viewCart").style.visibility = "hidden";
    for (var i = 0; i < vm.vendorsList.length; i++) {
      if (vm.vendorsList[i]['_id'] == vendor) {
        vm.vendor = vm.vendorsList[i]['id'];
      }
    }
    var vendorList = {
      "status": "57650efb818d3b1cd808c401",
      "vendor": vm.vendor
    }
    if (vm.getCompDet == 'CH0001' && vm.getCompDet !== 'CO00001') {

      return;
    }
    api.vendorMRNList(vendorList, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        vm.vendorMRNList = data;
      }
    });
  }
 

  var poFinalTotal = [];
  // Insert Purchase Order Data
  function insertMRN(status) {
    if (vm.mrngetDet.length > 0) {
      var status_id = CONSTANTS.mrn_status;
      for (var i = 0; i < status_id.length; i++) {
        if (status == status_id[i].name) {
          var status = {
            '_id': status_id[i]._id,
            'name': status_id[i].name
          };
          break;
        }
      }
      if (vm.po_total == "" || vm.po_total == 0) {
        alertify.log('Please enter quantity');
        return;
      }
      if (vm.invoiceNo == "") {
        if ($('.alertify-log-error').length == 0) {
          alertify.error("Please enter invoice no");
        }
        return;
      }
      if (vm.srhDt1 == undefined) {
        // vm.srhDt1 = new Date();
        var date = new Date();
        var day = date.getDate();
        var monthIndex = date.getMonth() + 1;
        var year = date.getFullYear();
        if (monthIndex < 10) {
          if (day < 10) {
            vm.srhDt1 = year + "-0" + monthIndex + "-0" + day;
          }
          else {
            vm.srhDt1 = year + "-0" + monthIndex + "-" + day;
          }

        }
        else {
          vm.srhDt1 = year + "-" + monthIndex + "-" + day;
        }

      }
      // if (vm.srhDt1 == "") {
      //   if ($('.alertify-log-error').length == 0) {
      //   alertify.error("Please enter Invoice Date");
      //   }
      //   return;
      // }
      for (var k = 0; k < vm.mrngetDet.length; k++) {
        if (vm.mrngetDet[k].quantity == "") {
          if ($('.alertify-log-error').length == 0) {
            alertify.error("Please enter Quantity");
          }
          return;
        }
      }
      if (vm.tax == '') {
        vm.tax = '0';
      }
      if (vm.discount == '') {
        vm.discount = '0';
      }
      // if (vm.tax == "") {
      //   if ($('.alertify-log-error').length == 0) {
      //   alertify.error("Please enter Tax");
      //   }
      //   return;
      // }
      // if (vm.discount == "") {
      //   if ($('.alertify-log-error').length == 0) {
      //   alertify.error("Please enter Discount");
      //   }
      //   return;
      // }
      if (vm.mrnRemarks == "") {
        if ($('.alertify-log-error').length == 0) {
          alertify.error("Please enter Remarks");
        }
        return;
      }

      vm.poMaterial = [];
      for (var z = 0; z < vm.mrngetDet.length; z++) {
        if (vm.mrngetDet[z].pending_quantity == 0) {
          vm.mrngetDet[z].quantity = vm.mrngetDet[z].qty;
          vm.project = vm.mrngetDet[z].project;
          var project = vm.api.projectList;
            if(project) {
        var filterProj = $filter('filter')(project, { _id: vm.project }, true)[0];
        vm.filterProjCode = filterProj.short_code;
            }
          vm.type = vm.mrngetDet[z].order_type;
          // vm.mrngetDet[z].pending_quantity = 0;
        }
      
        if (vm.getCompDet == "CO00001") {
          vm.poMaterial.push({
            "po": vm.mrngetDet[z].pi_no,
            "id": vm.mrngetDet[z].id,
            'name': vm.mrngetDet[z].material,
            'category': vm.mrngetDet[z].category,
            'quantity': vm.mrngetDet[z].qty,
            'received_quantity': vm.mrngetDet[z].quantity,
            'uom': vm.mrngetDet[z].UOM,
            "pending_quantity": vm.mrngetDet[z].pending_quantity.toString(),
            "rate": vm.mrngetDet[z].po_unit_rate,
            "status": status,
            'total': vm.mrngetDet[z].po_total,
          })
        }
        if (vm.getCompDet == "CH0001") {
          vm.poMaterial.push({
            "po": vm.mrngetDet[z].pi_no,
            "id": vm.mrngetDet[z].id,
            "mat_code" : vm.mrngetDet[z].mat_code,
            'name': vm.mrngetDet[z].material,
            'category': vm.mrngetDet[z].category,
            'subcategory': vm.mrngetDet[z].sub_cateogry,
            // 'project' : vm.mrngetDet[z].project,
            'quantity': vm.mrngetDet[z].qty,
            'received_quantity': vm.mrngetDet[z].quantity,
            'uom': vm.mrngetDet[z].UOM,
            "pending_quantity": vm.mrngetDet[z].pending_quantity.toString(),
            "rate": vm.mrngetDet[z].po_unit_rate,
            "tax": vm.mrngetDet[z].tax,
            "discount": vm.mrngetDet[z].discount,
            "status": status,
            'total': vm.mrngetDet[z].po_total,
          })
        }
      }
  //    console.log(JSON.stringify(vm.poMaterial));
      for (var k = 0; k < vm.mrngetDet.length; k++) {
        if (vm.mrngetDet[k].pi_no.indexOf(',') !== -1) {
          var temp = vm.mrngetDet[k].pi_no.split(',');
        } else {
          var temp = [vm.mrngetDet[k].pi_no];
        }
        angular.forEach(temp, function (temp) {
          vm.getOrder.push(temp);
        })
      }
      vm.getOrder = _.uniq(vm.getOrder);
      var profileName = {
        'id': vm.api.profile._id,
        'name': vm.api.profile.names
      }

      // var json = angular.toJson( vm.materialList );
      if (vm.getCompDet == "CO00001") {
        var poList = {
          "invoice_no": vm.invoiceNo,
          "invoice_dt": vm.srhDt1,
          "po": vm.getOrder,
          'materials': vm.poMaterial,
          'created_by': profileName,
          'vendor': vm.vendor,
          'remarks': vm.mrnRemarks,
          'status': status,
          'tax': vm.tax,
          'discount': vm.discount,
          'gross_amount':  vm.po_total,
          'net_amount':vm.grand_total,
          'branch': vm.api.profile.branch,
          'store': vm.api.profile.store,
          'store_type': vm.api.profile.store_type
        };
      }
      if(vm.getCompDet == "CH0001")
      {
      var category = vm.api.company.category;
      vm.category = $filter('filter')(category, { _id: vm.category }, true)[0];
      vm.catename = vm.category.name;
      vm.cateId = vm.category._id;
      if (vm.getCompDet == "CH0001") {
        if(vm.freightType == "Company")
        {
          vm.freight_charge = "0";
        }
        if(vm.loadType = "Company") {
          vm.load_total = "0";
        }
        var poList = {
          "freight_type": vm.freightType,
          "loading_unloading": vm.loadType,
          "invoice_no": vm.invoiceNo,
          "invoice_dt": vm.srhDt1,
          "po": vm.getOrder,
          'category_id': vm.cateId,
          'category_name': vm.catename,
          'materials': vm.poMaterial,
          'project': vm.project,
          'project_code' :  vm.filterProjCode,
          'created_by': profileName,
          'vendor': vm.vendor,
          'remarks': vm.mrnRemarks,
          "payremarks": vm.paymentTerms,
          'status': status,
          'net_amount':vm.net_amount,
          'freight_charge': vm.freight_charge,
          'loading_unloading_charge': vm.load_total,
          'tax': vm.po_taxCH,
          'discount': vm.po_discountCH,
          'order_type' : vm.type,
          'gross_amount':  vm.grand_totalch,
          'branch': vm.api.profile.branch,
          'store': vm.api.profile.store,
          'store_type': vm.api.profile.store_type
        };
      }
      }
      vm.sendPOMaterial(poList);

    } else {
      alertify.success('Empty');
    }
  }


  function categoryName(data) {
    var category = vm.api.company.category;

    var filterCat = $filter('filter')(category, { _id: data }, true)[0];
    return filterCat.name;
  }

  // Api Call for Adding  PO
  function sendPOMaterial(material) {
    api.mrnList(material, function (err, data) {
      if (err) {
        //alert(JSON.stringify(err));
      } else {
        // console.log(data);
        $('#addpopup').modal('toggle');
        if ($('.alertify-log-success').length == 0) {
          alertify.success(data.message);
        }
        vm.closeMRN(vm.getOrder);
        vm.close();
        vm.mrnGridBind(false, begin, vm.ddlRows, '1');
        vm.SelectedVendor = "";
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
    $('.input-group #search_param1').val(param);
    vm.searchType = param;
    if (param === "MRNDate") {
      $("#srhDt").show();
      $("#srhTxt").hide();
      $("#srhTxt1").hide();
      $("#projectFrom").hide();
      $("#srhBranch").hide();
    } else if (param === "Branch") {
      $("#srhBranch").show();
      $("#srhTxt").hide();
      $("#srhDt").hide();
      $("#projectFrom").hide();
    }
    else if (param === "ProjectFrom") {
      $("#projectFrom").show();
      $("#projectTo").hide();
      $("#srhBranch").hide();
      $("#srhTxt").hide();
      $("#srhDt").hide();
    }
    else {
      $("#srhBranch").hide();
      $("#srhDt").hide();
      $("#srhTxt").show();
      $("#projectFrom").hide();
    }
  });

  // $('.search-panel .dropdown-menu srhdt').find('a').click(function (e) {
  //   e.preventDefault();
  //   var param = $(this).attr("title").replace("#", "");
  //   var concept = $(this).text();
  //   $('.search-panel span#search_concept').text(concept);
  //   $('.input-group #search_param1').val(param);
  //    $('#srhDt1').datepicker('setDate', 'today');
  //   vm.searchType = param;
  //     // $("#srhDt1").show();
  //     // $("#srhTxt1").hide();

  //   // else {
  //   //   $("#srhDt1").show();
  //   //   $("#srhTxt1").hide();
  //   // }
  // });




  // Datepicker
  $('.input-group.date').datepicker({
    calendarWeeks: true,
    todayHighlight: true,
    autoclose: true,
    // maxDate: '0',
    endDate: '+0d',
    closeText: 'Clear',
    clearBtn: true
    // $("#srhDt").datepicker().datepicker("setDate", new Date());
  });

  $('.input-group1.date').datepicker({
    calendarWeeks: true,
    todayHighlight: true,
    autoclose: true,
    // maxDate: '0',
    endDate: '+0d',
    closeText: 'Clear',
    clearBtn: false
    // $("#srhDt").datepicker().datepicker("setDate", new Date());
  });
  // alert(vm.count);




  $scope.$on('mrngetDetails', function (e, data) {
    var itemIndex = data.length - 1;
    var actFlg = angular.element(document.getElementById('mrnAct' + data[itemIndex].pi_no + data[itemIndex].ctrlIndex)).html();
    var foundItem = [];
    if (vm.mrngetDet.length !== 0) {
      foundItem = $filter('filter')(vm.mrngetDet, { id: data[itemIndex].id }, true)[0];

      var index = vm.mrngetDet.indexOf(foundItem);

      if (index != -1) {
        if (actFlg.indexOf("fa-plus") !== -1) {

          vm.mrngetDet[index].qty = parseInt(vm.mrngetDet[index].qty) + parseInt(data[itemIndex].qty);
          vm.mrngetDet[index].po_total = vm.mrngetDet[index].qty * vm.mrngetDet[index].po_unit_rate;
          vm.net_amount = vm.mrngetDet[index].po_total;
          vm.po_total = vm.mrngetDet[index].po_total;
          vm.grand_total = vm.po_total;
          vm.grand_totalch = vm.net_amount;
          vm.mrngetDet[index].pi_no += "," + data[itemIndex].pi_no;
          angular.element(document.getElementById('mrnAct' + data[itemIndex].pi_no + data[itemIndex].ctrlIndex)).html('<i class="fa fa-minus fa-lg" aria-hidden="true"></i>');
        }
        else {
          $("#notificationMRN").animate({
            top: '-65px',
          });
          document.getElementById("notificationMRN").innerText = "Your MRN has been removed";
          vm.mrngetDet[index].qty = parseInt(vm.mrngetDet[index].qty) - parseInt(data[itemIndex].qty);
          vm.mrngetDet[index].po_total = vm.mrngetDet[index].qty * vm.mrngetDet[index].po_unit_rate;
          // vm.po_total = vm.mrngetDet[index].po_total;
          vm.po_total = parseInt(vm.po_total) - parseInt(data[itemIndex].po_total);
          vm.net_amount = parseInt(vm.po_total) - parseInt(data[itemIndex].po_total);
          vm.grand_total = vm.po_total;
          vm.grand_totalch = vm.net_amount;
          angular.element(document.getElementById('mrnAct' + data[itemIndex].pi_no + data[itemIndex].ctrlIndex)).html('<i class="fa fa-plus fa-lg" aria-hidden="true"></i>');
          // console.log(vm.mrngetDet[index].qty);
          if (parseInt(vm.mrngetDet[index].qty) <= 0) {

            var index = $scope.mrngetDet.indexOf(vm.mrngetDet[index]);
            $scope.mrngetDet.splice(index, 1);
            vm.count = $scope.mrngetDet.length;
            if (vm.count == 0) {
              document.getElementById("viewCart").style.visibility = "hidden";
            }
            else {
              document.getElementById("viewCart").style.visibility = "visible";
            }

          }
        }

        // console.log($scope.mrngetDet);
        return;
      }

    }


    if (actFlg.indexOf("fa-plus") !== -1) {
      vm.net_amount = parseInt(vm.po_total) + parseInt(data[itemIndex].po_total);
      vm.po_total = parseInt(vm.po_total) + parseInt(data[itemIndex].po_total);
      vm.grand_total = vm.po_total;
      vm.grand_totalch = vm.net_amount;
      angular.element(document.getElementById('mrnAct' + data[itemIndex].pi_no + data[itemIndex].ctrlIndex)).html('<i class="fa fa-minus fa-lg" aria-hidden="true"></i>');
      $scope.mrngetDet.push(data[itemIndex]);
      vm.mrngetDet = $scope.mrngetDet;
      vm.count = vm.mrngetDet.length;
      if (vm.count == 0) {
        document.getElementById("viewCart").style.visibility = "hidden";
      }
      else {
        document.getElementById("viewCart").style.visibility = "visible";
      }
    }
    else {
      vm.po_total = parseInt(vm.po_total) - parseInt(data[itemIndex].po_total);
      vm.net_amount = parseInt(vm.po_total) - parseInt(data[itemIndex].po_total);
      vm.grand_total = vm.po_total;
      vm.grand_totalch = vm.net_amount;
      angular.element(document.getElementById('mrnAct' + data[itemIndex].pi_no + data[itemIndex].ctrlIndex)).html('<i class="fa fa-plus fa-lg" aria-hidden="true"></i>');

      var index = $scope.mrngetDet.indexOf(data[itemIndex]);
      $scope.mrngetDet.splice(index, 1);

      //  $scope.poGetDet.push(data[0]);
      vm.mrngetDet = $scope.mrngetDet;
      vm.count = vm.mrngetDet.length;
      if (vm.count == 0) {
        document.getElementById("viewCart").style.visibility = "hidden";
      }
      else {
        document.getElementById("viewCart").style.visibility = "visible";
      }
    }
  })

  //  $scope.$on('count', function (e, data) {
  //    alert(data);
  //   var count = data;
  //   vm.count = count;
  // })


  //  $scope.mrngetDet = [
  //    {
  //      "id" : "1",
  //      "category" : "UPVC",
  //      "material" : "Glass",
  //      "UOM" : "Nos",
  //      "qty" : "200"
  //    }
  //  ];


  vm.api.vendorDDL({}, function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      vm.vendorsList = data.vendorsList;
    }
  });

  function openNav() {
    document.getElementById("mySidenav").style.display = "block";
    document.getElementById("mySidenav").style.width = "100%";
    document.getElementById("mySidenav").style.marginTop = "0%";
    document.getElementById("fullClose").style.display = "none";
    document.getElementById("closeNav").style.display = "block";
    document.getElementById("main").style.display = "none";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";

    $('#srhDt1').datepicker('setDate', 'today');

  }

  function closeNav() {
    document.getElementById("mySidenav").style.display = "none";
    document.getElementById("fullClose").style.display = "block";
    document.getElementById("closeNav").style.display = "none";
    document.getElementById("main").style.display = "block";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }

  function mrnopenNav() {
    document.getElementById("myrightnav").style.display = "block";
    document.getElementById("myrightnav").style.width = "45%";
    document.getElementById("myrightnav").style.height = "100%";
    document.getElementById("myrightnav").style.marginLeft = "60%";
    document.getElementById("myrightnav").style.marginTop = "-4%";
    document.getElementById("myrightnav").style.borderLeft = "1px solid #CCC";
    document.getElementById("mrnCount").style.display = "none";
    document.getElementById("main").style.overflow = "hidden";
    document.getElementById("addpopup").style.overflow = "hidden";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }



  function closeNav1() {
    document.getElementById("myrightnav").style.display = "none";
    document.getElementById("mrnCount").style.display = "block";
    document.getElementById("mrnCount").style.marginLeft = "95%";
    document.getElementById("main").style.overflow = "scroll";
    document.getElementById("addpopup").style.overflow = "scroll";
    document.body.style.backgroundColor = "white";
  }


  $scope.testing = function () {
    $scope.step = 1;
  }

  $scope.testing1 = function () {
    $scope.step = 2;
  }
  $scope.$on('mrntracksheet', function (e, data) {
    var mrnNo = {
      'mrn': [data]
    }
    // console.log('mrn', mrnNo);
    $state.go("master.purchaseTrackSheet", { 'index': 3, 'mrnNo': mrnNo });
  });

  function calculateTotal(item) {

    item.po_total = item.quantity * item.po_unit_rate;
    vm.po_total = 0;
    angular.forEach($scope.mrngetDet, function (a) {
      vm.po_total += a.po_total;
      vm.grand_total = vm.po_total;
      vm.grand_totalch = vm.grand_total;
    });

    // alert(vm.discount);




    var reg = new RegExp('^[0-9]+$');
    if (!reg.test(item.quantity) && item.quantity !== '') {
      if ($('.alertify-log').length == 0) {
        alertify.log('Only numbers are allowed');
      }
      item.quantity = "";
      vm.grand_total = '';
      vm.tax = '';
      vm.discount = '';
      item.po_total = '';
      angular.forEach($scope.mrngetDet, function (a) {
        vm.po_total = 0;
        vm.po_total += a.po_total;
        vm.grand_total = vm.po_total;
        vm.tax = 0;
        vm.discount = 0;
      });
    }
    //         if(vm.discount == '' && vm.tax == '') {
    //   vm.po_total = vm.grand_total;
    // }

    // vm.po_total = po_total;
    var appQty = JSON.parse(item.quantity);
    var qtyReq = JSON.parse(item.qty);
    // alert(appQty);
    if (appQty > qtyReq) {
      item.quantity = ""
      if ($('.alertify-log').length == 0) {
        alertify.log("You cannot enter quantity more than requested quantity");
      }
      item.po_total = '';
      // vm.po_total = '';
      angular.forEach($scope.mrngetDet, function (a) {
        vm.po_total = 0;
        //  vm.grand_total = vm.po_total;
        vm.po_total += a.po_total;
        vm.grand_total = vm.po_total;
        vm.tax = 0;
        vm.discount = 0;
      });
    } else {
      item.pending_quantity = item.qty - item.quantity;
    }
  }
  function closeMRN(getOrder) {
    var po = {
      'po': getOrder
    }
    vm.api.getPObyIds(po, function (err, data) {
      if (!err) {
        angular.forEach(data, function (d) {
          var pending = $filter('filter')(d.materials, function (a) {
            return a.pending_quantity > 0;
          })
          if (pending.length == 0) {
            var poListUpdate = {
              'id': d.id,
              'status': {
                "_id": "57650efb818d3b1cd808c402",
                "name": "Closed"
              }
            }
            vm.api.poListUpdate(poListUpdate, function (err, data) {
              if (err) {
                //alert(JSON.stringify(err));
              }
              else {
              }
            });
          }
        })
      }
    })
  }

  function reload() {
    vm.status = "5767b0ec69f12a0e94baa70f";
    $scope.currentPage = 1;
    vm.srhTxt = '';
    vm.srhDt = '';
    vm.searchbranch = '';
    vm.mrnGridBind(false, 0, 10);
    vm.ddlRows = "10";
  }

  vm.searchClear = searchClear;
  function searchClear() {
    vm.srhTxt = '';
    vm.srhDt = '';
    vm.searchbranch = '';
  }
  vm.mrn_discount = 0;
  vm.mrn_tax = 0;
  vm.gross_tax = 0;
  vm.gross_discount = 0;
  vm.calunitRate = calunitRate;
  vm.calGrossAmtCh = calGrossAmtCh;
  vm.load_total = 0;
  vm.freight_charge = 0;
  vm.po_taxCH = "0";
  vm.po_discountCH = "0";
  vm.grand_totalch = 0;
 

  function calunitRate(data) {
    if (data.po_unit_rate == "" || data.po_unit_rate == undefined || data.po_unit_rate == 0) {
      data.po_total = 0;
      //  vm.total = 0;
      angular.forEach($scope.mrngetDet, function (a) {
        vm.net_amount += a.total;
        vm.gross_amount = vm.net_amount;
      });
      return data.po_total;
    }
    else {
      if (parseInt(data.quantity) > parseInt(data.qty)) {
        if ($('.alertify-log-error').length == 0) {
          alertify.error('Quantity is more than available quantity');
        }
        alertify.log(' Approved quantity is ' + data.qty, 0);
        return;
      }
    //  data.quantity = data.qty;
      data.po_total = data.po_unit_rate * data.quantity;
      vm.net_amount = 0;
      vm.matDet = '';
      var discount = data.po_total * (data.discount / 100);
      vm.discountAmt = discount;
      var disTot = (data.po_total - discount);

      var taxTot = disTot * (data.tax / 100);

      var tax = data.po_total * (vm.discount / 100);
      vm.matTax = tax;

      data.po_total = disTot + taxTot;
      // for (var i = 0; i < $scope.mrngetDet.length; i++) {
      //   vm.matDet = $scope.mrngetDet[i].materials;
      //   // vm.matTotal = vm.matDet[i].total;
      // }

      vm.matTotal = 0;
      // angular.forEach( vm.matDet, function(a){
      
    //  vm.matTotal += data.po_total;
      //         vm.gross_amount =  vm.net_amount;
      // });
      //     vm.matDet = vm.PurchaseOrderDetails.materials;.
        angular.forEach($scope.mrngetDet, function (a) {
          vm.matTotal += a.po_total;
        });
      angular.forEach(vm.vendorMRNList, function (a) {
        vm.net_amount = vm.matTotal;
        var discount = vm.net_amount * (a.discount / 100);

        // var tax = (ltotal * ltax)/100;
        var disTot = (vm.net_amount - discount);
        vm.disAmt = discount;
        var tax = vm.net_amount * (a.tax / 100);
        vm.taxAmt = tax;

        var taxTot = disTot * (a.tax / 100);

        vm.grand_totalch = disTot + taxTot + a.freight_charge + a.loading_unloading_charge;
      });
      // var dis1  = vm.net_amount * (vm.po_discountCH / 100);
      //   var disTot1 = (vm.net_amount - dis1);
    
      // var tax1 = vm.net_amount * (vm.po_taxCH / 100);
      //   vm.taxAmt = tax1;

      //   var taxTot1 = disTot1 * (vm.po_taxCH / 100);

      //   vm.grand_totalch = disTot + taxTot + disTot1 + taxTot1 + a.freight_charge + a.loading_unloading_charge;
         // vm.grand_totalch = data.po_total;
      return data.po_total;

    }
  }

  function calGrossAmtCh(data) {
    if (vm.freightType == "Company") {
      vm.freight_charge = 0;
    }
    if (vm.loadType == "Company") {
      vm.load_total = 0;
    }
    var reg = new RegExp('^[+]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$');
    if (!reg.test(vm.po_taxCH) && vm.po_taxCH !== '') {
      if ($('.alertify-log').length == 0) {
        alertify.log('Negative numbers , letters not allowed');
      }
      vm.po_taxCH = "";
    }
    if (!reg.test(vm.po_discountCH) && vm.po_discountCH !== '') {
      if ($('.alertify-log').length == 0) {
        alertify.log('Negative numbers , letters not allowed');
      }
      vm.po_discountCH = "";
    }

    if (vm.freightType == "Vendor" || vm.loadType == "Vendor") {
      vm.freight_charge = parseInt(vm.freight_charge);
      vm.load_total = parseInt(vm.load_total);
      var discount = vm.net_amount * (vm.po_discountCH / 100);

      // var tax = (ltotal * ltax)/100;
      var disTot = (vm.net_amount - discount);
      vm.disAmt = discount;
      var tax = vm.net_amount * (vm.po_taxCH / 100);
      vm.taxAmt = tax;

      var taxTot = disTot * (vm.po_taxCH / 100);
      if (vm.load_total == 0) {
        vm.grand_totalch = disTot + taxTot + vm.freight_charge;
      }
      if (vm.load_total !== 0) {
        vm.grand_totalch = disTot + taxTot + vm.freight_charge + vm.load_total;
      }
    }

    else {
      var discount = vm.net_amount * (vm.po_discountCH / 100);

      // var tax = (ltotal * ltax)/100;
      var disTot = (vm.net_amount - discount);
      vm.disAmt = discount;
      var tax = vm.net_amount * (vm.po_taxCH / 100);
      vm.taxAmt = tax;

      var taxTot = disTot * (vm.po_taxCH / 100);
      vm.grandTax = vm.matTax + taxTot;
      vm.grand_totalch = disTot + taxTot - vm.freight_charge - vm.load_total;
    }
    return vm.grand_totalch;
  }
  // get MRN
  vm.getMRN = getMRN;

  function getMRN(data) {

    vm.catID = data;

    vm.vendor = [];
    vm.vendorMaterials = [];
    vm.vendorMat = [];

    vm.api.vendor = vm.selectVendor;

   document.getElementById("viewCart").style.visibility = "hidden";
    for (var i = 0; i < vm.vendorsList.length; i++) {
      if (vm.vendorsList[i]['_id'] == vm.SelectedVendor) {
        vm.vendor = vm.vendorsList[i]['id'];
      }
    }
    var vendorList = {
      "status": "57650efb818d3b1cd808c404",
      "category_id": data,
      "vendor": vm.vendor,
      "project" : [vm.project]
    }
      api.vendorMRNList(vendorList, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {;
        vm.vendorMRNList = data;
       vm.vendorTypeList = data;
      vm.api.vendorallList = vm.vendorTypeList;
        // vm.vendorMat = [];
      }
    });

  }
}

