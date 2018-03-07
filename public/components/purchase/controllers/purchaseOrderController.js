'use strict';
angular.module('todo.purchaseOrderController', [])
  .controller('purchaseOrderController', purchaseOrderController);
purchaseOrderController.$inject = ['$scope', '$state', 'api', '$timeout', 'storage', 'SETTINGS', '$filter', '$stateParams']
function purchaseOrderController($scope, $state, api, $timeout, storage, CONSTANTS, $filter, $stateParams) {
  $scope.step = 1;
  $scope.openTrackSheet = function () {
    $state.go("master.purchaseTrackSheet", { 'index': 2 });
  }
  var vm = this;
  vm.api = api;
  vm.vendorsList = [];
  vm.vendorTypeList = [];
  vm.pogetDet = [];
  vm.openNav = openNav;
  vm.poopenNav = poopenNav;
  vm.closeNav1 = closeNav1;
  vm.closeNav = closeNav;
  vm.insertPurchaseOrder = insertPurchaseOrder;
  vm.sendPIMaterial = sendPIMaterial;
  vm.tax = '';
  vm.discount = '';
  vm.close = ModalClose;
  vm.PORemarks = '';
  vm.count = '0';
  vm.filterSearch = filterSearch;
  vm.ddlRowsChange = ddlRowsChange;
  vm.rowCnt = 0;
  vm.begin = 0;
  vm.end = 10;
  var begin = 0;
  var end = 10;
  var flag = "1";
  vm.poGridBind = poGridBind;
  vm.ddlRows = "10";
  vm.ddlRowsApp = "10";
  var initializing = true;
  vm.vendor = [];
  $scope.poGetDet = [];
  vm.grand_total = 0;
  vm.po_total = 0;
  vm.calNetAmt = calNetAmt;
  vm.poadd = poadd;
  vm.status = "57650efb818d3b1cd808c401";
  vm.statusList = [];
  vm.statusList = $filter('filter')(CONSTANTS.po_status, function(stat){return stat.name!== 'Deleted'}, true);
 // vm.vendorInitial = '';
  // vm.branchList = vm.api.company.branches;
  // alert(JSON.stringify(vm.branchList));
  vm.clearData = [];

  // var access = storage.get('access');
  // access = JSON.parse(access);
  // if (access !== undefined)
  //   vm.purchaseOrderAccess = access;
  // console.log(access);
  vm.access = '';
  vm.purchaseOrderAccess = vm.access;
  vm.searchType = 'PONo';
  vm.srhTxt = '';
  vm.srhDt = '';
  vm.searchbranch = '';
  vm.executiveList = [];
  vm.stateParams = '';
  vm.reload = reload;
  vm.addrow = addrow;
  vm.displayList = [];
  vm.check = check;
  vm.closePI = closePI;
  vm.po_tax = '0';
  vm.po_discount = '0';
  vm.calNetAmtCh = calNetAmtCh;
  vm.calunitRate = calunitRate;
  vm.po_taxCH = '0';
  vm.po_discountCH = '0';
  vm.calGrossAmtCh = calGrossAmtCh;
  vm.exeList = vm.api.profile._id;
  vm.freightType = "Company";
  vm.loadType = "Company";
  vm.categoryCH = vm.api.company.category;
  // vm.grand_totalch = '0';
  vm.freight_total = 0;
  vm.load_total = 0;
  vm.paymentTerms = '';
  vm.disAmt = 0;
  vm.taxAmt = 0;
  vm.grandTax = 0;
  function check(id) {
    for (var i = 0; i < vm.materials.length; i++) {
      var v = vm.materials
      if (id.no == v[i]['id']) {
        vm.displayList.push(v[i]);
      }
    }
  }
  vm.remove = remove;
  function remove(id) {
    angular.forEach(vm.displayList, function (value, index) {
      if (id.no == value.id) {
        vm.displayList.splice(index, 1);
      }
    });
  }
  $scope.count = 1;
  function addrow() {
    var count = $scope.count;
    for (var i = 0; i < count; i++) {
      $scope.displayList.push({
        mat_code: '',
        mat_name: '',
        uom: '',
        PI_qty: '',
        PI_created_by: '',
        PI_approved_by: '',
        unit_rate: '',
      });
    }
  }
  vm.getCompDet = '';
        
 vm.getCompDet = vm.api.profile.company;
  api.branch.branchDDL(function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      vm.branchList = data.branches;
    }
  });

  // Getting Project based on EmpId for CH
  api.ProjectDDL({}, function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      vm.projectList = data.projectList;
      vm.api.projectList = vm.projectList;
    }
  });

  // For Getting Project based on Emp ID for CH
  var EmpId = {
    "empID": vm.api.profile._id
  }

  api.ProjectDDL([EmpId], function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      vm.projectList = data.projectList;
    //   vm.api.projectList = vm.projectList;
    }
  });

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
      vm.poGridBind(false, vm.begin, vm.ddlRows, '2');
    }
    else {
      vm.poGridBind(false, vm.begin, vm.ddlRows, '1');
    }

  }

  function poGridBind(isSrh, begin, end, flag) {
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
        "access": access
      };
    }
    api.poGrid(filterSearch, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        // console.log(data);
        // vm.mrApp = [];
          $scope.step = 1;
          vm.poApp = data.poList;
          vm.rowCnt = data.count;
          $scope.currentPage = 1;
          vm.begin = "0";
          $stateParams.status = null;
        

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

  vm.api.vendorDDL({}, function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else{
      vm.vendorsList = data.vendorsList;
      vm.api.vendorallList = data.vendorsList;
    }
  });


  vm.filterTxt = '';

  function filterSearch(isSrh, begin, end, flag) {
    flag = $scope.step.toString();

    if ($stateParams.status == null) {
      var access = storage.get('access');
      access = JSON.parse(access);
      vm.purchaseOrderAccess = access;

      var filterSearch = {
        "limit": end,
        "skip": begin,
        "role_id": vm.api.profile.roles,
        "created_by": vm.status == '574450f469f12a253c61bca3' ? vm.api.profile._id : undefined,
        'access': access,
        "status": [vm.status]
      };


      if (isSrh) {
        filterSearch = {
          "status": [vm.status],
          "limit": vm.end,
          "skip": vm.begin,
          "role_id": vm.api.profile.roles,
          'access': access,
          "id": vm.searchType == 'PONo' ? (vm.srhTxt ? vm.srhTxt.toUpperCase() : undefined) : undefined,
          "created_name": vm.searchType == 'Executive' ? (vm.srhTxt ? vm.srhTxt : undefined) : undefined,
          "branch": vm.searchType == 'Branch' ? (vm.searchbranch ? vm.searchbranch : undefined) : undefined,
          "datetime": vm.searchType == 'PODate' ? (vm.srhDt ? vm.srhDt : undefined) : undefined,
          "vendor": vm.searchType == 'Vendor' ? (vm.srhTxt ? vm.srhTxt : undefined) : undefined,
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
      vm.purchaseOrderAccess = vm.access;


      var filterSearch = {
        "limit": end,
        "skip": begin,
        "role_id": vm.api.profile.roles,
        "created_by": vm.executive,
        'access': vm.access,
        "status": [vm.status],
        "branch": vm.branch,
        "storeType": vm.storeType,
        "store": vm.store,
        // "exeList": vm.executive,
        "vendor": vm.vendorDet
      };


      if (isSrh) {
        filterSearch = {
          "status": [vm.status],
          "limit": vm.end,
          "skip": vm.begin,
          "role_id": vm.api.profile.roles,
          'access': access,
          "id": vm.searchType == 'PONo' ? (vm.srhTxt ? vm.srhTxt.toUpperCase() : undefined) : undefined,
          "created_by": vm.searchType == 'Executive' ? (vm.srhTxt ? vm.srhTxt : undefined) : undefined,
          "branch": vm.searchType == 'Branch' ? (vm.searchbranch ? vm.searchbranch : undefined) : undefined,
          "datetime": vm.searchType == 'PODate' ? (vm.srhDt ? vm.srhDt : undefined) : undefined,
          "vendor": vm.searchType == 'Vendor' ? (vm.srhTxt ? vm.srhTxt : undefined) : undefined,
        };
      }
    }
    api.poGrid(filterSearch, function (err, data) {
      if (err) {
        // $('#mainLoading').hide();
        //alert("No Data");
      }
      else {
        // if (flag === "2") {
        //   vm.mrAppList = data.mrList;
        //   vm.rowCnt1 = data.count;
        //   vm.ddlRows = "10";
        // } else {
        //   // vm.mrApp = [];
        
        vm.paginationNumber = parseInt(vm.begin) == 0 ? 1 : parseInt(vm.begin);
        vm.poApp = data.poList;
        vm.rowCnt = data.count;
        vm.ddlRowsApp = "10";
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
        // }
      }
    });
  }

  vm.filterSearch(false, begin, end, flag);

  function ModalClose() {
    vm.pogetDet = [];
    vm.vendorTypeList = [];
    $scope.poGetDet = [];
    vm.PORemarks = [];
    vm.count = '0';
    vm.po_total = '0';
    document.getElementById("mySidenav").style.display = "none";
    document.getElementById("main").style.display = "block";
    vm.SelectedVendor = "Select Vendor";
    document.getElementById("fullClose").style.display = "block";
  }

  function calNetAmt() {
    var discount = vm.po_total * (vm.discount / 100);

    // var tax = (ltotal * ltax)/100;
    var disTot = (vm.po_total - discount);

    var taxTot = disTot * (vm.tax / 100);

    vm.grand_total = disTot + taxTot;
  }
  vm.vendorMaterials = [];
  vm.vendorMat = [];
  // Get PI List based on Vendor
  $scope.getVendorList = function (vendor) {
    vm.vendorMat = [];
    vm.vendorTypeList = [];
    $scope.poGetDet = [];
    vm.count = '0';
    vm.po_total = 0;
    vm.selectVendor = vendor;
    // vm.SelectedVendor = "Select Vendor";
    document.getElementById("viewCart").style.visibility = "hidden";
    if (vendor == null) {
      vm.vendorTypeList = [];
      vm.vendorMat = [];
      return;
    }
    vm.api.vendor = vendor;
    for (var i = 0; i < vm.vendorsList.length; i++) {
      if (vm.vendorsList[i]['_id'] == vendor) {
        vm.vendor = vm.vendorsList[i]['id'];
        vm.vendorMaterials = vm.vendorsList[i]['materials'];
      }
    }

    for (var j = 0; j < vm.vendorMaterials.length; j++) {
      vm.vendorMat.push(vm.vendorMaterials[j]['id']);
    }
    var vendorList = {
      "status": "574450f469f12a253c61bca2",
      "materials": vm.vendorMat
    }
    if(vm.getCompDet == 'CH0001' && vm.getCompDet !== 'CO00001') {
      return;
    }
    else {
         api.vendorList(vendorList, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        vm.vendorTypeList = data;
        // vm.vendorMat = [];
      }
    });
    }
   
  }

  // Insert Purchase Order Data
  function insertPurchaseOrder(status) {
    if (vm.PORemarks == "") {
        if ($('.alertify-log-error').length == 0) {
          alertify.error('please enter remarks');
        }
        return;
      }
    if (vm.pogetDet.length > 0) {
       var status_id = CONSTANTS.po_status;

      for (var i = 0; i < status_id.length; i++) {
        if (status == status_id[i].name) {
          var status = {
            '_id': status_id[i]._id,
            'name': status_id[i].name
          };
          break;
        }
      }


      vm.poMaterial = [];
      vm.getIndent = [];
      // console.log("test",JSON.stringify(vm.pogetDet));

      if(vm.getCompDet !== 'CH0001' && vm.getCompDet == 'CO00001') {
          for (var z = 0; z < vm.pogetDet.length; z++) {
        vm.poMaterial.push({
          "indent": vm.pogetDet[z].pi_no,
          "id": vm.pogetDet[z].id,
          'name': vm.pogetDet[z].material,
          'category_id': vm.pogetDet[z].category,
          'quantity': vm.pogetDet[z].qty,
          'pending_quantity' : vm.pogetDet[z].qty,
          'uom': vm.pogetDet[z].UOM,
          "rate": vm.pogetDet[z].po_unit_rate,
          'status': status,
          'total': vm.pogetDet[z].po_total
        })
      }
      }
      
      else {
        for (var z = 0; z < vm.pogetDet.length; z++) {
           if (vm.pogetDet[z].po_unit_rate == "") {
      if ($('.alertify-log-error').length == 0) {
        alertify.error("Please enter Unit Rate");
      }
      return;
    }
    if (vm.pogetDet[z].tax == "") {
      if ($('.alertify-log-error').length == 0) {
        alertify.error("Please enter Tax");
      }
      return;
    }
    if (vm.pogetDet[z].discount == "") {
      if ($('.alertify-log-error').length == 0) {
        alertify.error("Please enter Discount");
      }
      return;
    }
        vm.poMaterial.push({
          "indent": vm.pogetDet[z].pi_no,
          "id": vm.pogetDet[z].id,
          "mat_code" : vm.pogetDet[z].mat_code,
          'name': vm.pogetDet[z].material,
          'category_id': vm.pogetDet[z].category,
          'sub_category_id' : vm.pogetDet[z].sub_category,
          'quantity': vm.pogetDet[z].qty,
          'approved_quantity' : vm.pogetDet[z].qty,
          'pending_quantity' : vm.pogetDet[z].qty,
          'uom': vm.pogetDet[z].UOM,
          'size' : vm.pogetDet[z].size,
          'specification' : vm.pogetDet[z].specification,
          'tax' : vm.pogetDet[z].tax,
          'discount' : vm.pogetDet[z].discount,
          "rate": vm.pogetDet[z].po_unit_rate,
          'status': status,
          'total': vm.pogetDet[z].po_total,
          'expected_date' : vm.pogetDet[z].mat_date
        })
      }
      }
      
      // console.log(JSON.stringify(vm.poMaterial));
      for (var k = 0; k < vm.pogetDet.length; k++) {
        if (vm.pogetDet[k].pi_no.indexOf(',') !== -1) {
          var temp = vm.pogetDet[k].pi_no.split(',');
        } else {
          var temp = [vm.pogetDet[k].pi_no];
        }
        angular.forEach(temp, function (temp) {
          vm.getIndent.push(temp);
        })
      }
      vm.getIndent = _.uniq(vm.getIndent);
      var profileName = {
        'id': vm.api.profile._id,
        'name': vm.api.profile.names
      }

      for(var i=0;i < vm.pogetDet.length;i++) {
        vm.catId = vm.pogetDet[i].category;
        var category = vm.api.company.category;
        if(category) {
              var filterCat = $filter('filter')(category, { _id: vm.catID }, true)[0];
              if(filterCat) {
                  vm.filterCatName = filterCat.name;
              // return filterCat.name;
              }
              
        }
        var project = vm.api.projectList;
            if(project) {
        var filterProj = $filter('filter')(project, { _id: vm.pogetDet[i].project }, true)[0];
        vm.filterProjCode = filterProj.short_code;
                    // console.log("werwer",JSON.stringify(filterProj));
            }
      }

      if(vm.freightType == "Company") {
        vm.freight_total = 0;
      }
      if(vm.loadType == "Company") {
        vm.load_total = 0;
      }
      status = vm.getPOstatus("Created");
      if(vm.getCompDet !== 'CH0001' && vm.getCompDet == 'CO00001') {
      var piList = {
        'company': vm.api.company._id,
        'store': vm.api.profile.store,
        "indents": vm.getIndent,
        'materials': vm.poMaterial,
        'vendor': vm.vendor,
        'ordered_by': profileName,
        'remarks': vm.PORemarks,
        'status': status,
        'branch': vm.api.profile.branch,
        'store_type': vm.api.profile.store_type,
        'tax': vm.tax,
        'discount': vm.discount,
        'gross_amount': vm.po_total,
        'net_amount': vm.grand_total,
        'contact_incharge_name' : vm.exeList,
        'contact_inchage_phone' : vm.contactNo,
        'freight_type' : vm.freightType,
        'freight_charge' : vm.freight_total,
        'loading_unloading' : vm.loadType,
        'loading_unloading_charge' : vm.load_total,
        'payment_terms' : vm.payment_terms,
        'discount_amount' : vm.discount_amount,
        'tax_amount' : vm.tax_amount,
        'net_tax_amount' : vm.net_tax_amount
        
      };
      }
      else {
         var piList = {
        'company': vm.api.company._id,
        'category_id':vm.catID,
        'category_name' : vm.filterCatName,
        'store': vm.api.profile.store,
        "indents": vm.getIndent,
        'materials': vm.poMaterial,
        'vendor': vm.vendor,
        'ordered_by': profileName,
        'remarks': vm.PORemarks,
        'status': status,
        'branch': vm.api.profile.branch,
        'store_type': vm.api.profile.store_type,
        'tax': vm.po_taxCH,
        'discount': vm.po_discountCH,
        'gross_amount': vm.grand_totalch,
        'net_amount': vm.po_total,
        'contact_incharge_name' : vm.exeList,
        'contact_inchage_phone' : vm.contactNo,
        'freight_type' : vm.freightType,
        'freight_charge' : vm.freight_total,
        'loading_unloading' : vm.loadType,
        'loading_unloading_charge' : vm.load_total,
        'payment_terms' : vm.paymentTerms,
        'discount_amount' : vm.disAmt,
        'tax_amount' : vm.taxAmt,
        'net_tax_amount' : vm.grandTax,
        'order_type' : vm.pogetDet[0].order_type,
        'project' : vm.pogetDet[0].project,
        'project_code' : vm.filterProjCode
      };
      }
      // console.log("POO",JSON.stringify(piList));
      vm.sendPIMaterial(piList);
    } else {
      if ($('.alertify-log').length == 0){
        alertify.log('Empty');
      }
    }
  }

  // Api Call for Adding  PO
  function sendPIMaterial(material) {
    api.poList(material, function (err, data) {
      if (err) {
        //alert(JSON.stringify(err));
      } else {
        $('#addpopup').modal('toggle');
        if ($('.alertify-log-success').length == 0) {
          alertify.success(data.message);
        }
        vm.closePI(vm.getIndent);
        vm.poGridBind(false, begin, vm.ddlRows, '1');
        vm.close();
        vm.SelectedVendor = "";
        //vm.mrGridBind(false,begin,vm.ddlRows,'1');
      }

    });
  }

  function closePI(indent) {
    var pi = {
      'pi' : indent
    }
    vm.api.getPI(pi, function(err, data) {
      if(!err){
        angular.forEach(data, function(d){
          
          var pending = $filter('filter')(d.materials, function (a) {
            return a.status.name == 'Approved' || a.status.name == 'Pending';
           })
          if(pending.length == 0){
            var piListUpdate = {
              'id' : d.id,
              'status' : {
                    "_id": "5798aa10c04d8514e0db6cc6",
                    "name": "Closed"
          }
            }
            vm.api.piUpdate(piListUpdate , function (err,data)
            {
              if(err)
              {
                //alert(JSON.stringify(err));
              }
              else{
              }
            });
          }
        })
      }
    })
  }

  vm.categoryName1 = categoryName1;
  function categoryName1(data) {
    var category = vm.api.company.category;
    if(category) {
          var filterCat = $filter('filter')(category, { _id: data.category_id }, true)[0];
          return filterCat.name;
    }
    
  }


  $scope.$on('pogetDetails', function (e, data) {
    // console.log('podetails', data);

    var itemIndex = data.length - 1;
    var actFlg = angular.element(document.getElementById('poAct' + data[itemIndex].pi_no + data[itemIndex].ctrlIndex)).html();

    var foundItem = [];
    if (vm.pogetDet.length !== 0) {
      foundItem = $filter('filter')(vm.pogetDet, { id: data[itemIndex].id }, true)[0];

      var index = vm.pogetDet.indexOf(foundItem);

      if (index != -1) {
        if (actFlg.indexOf("fa-plus") !== -1) {

          vm.pogetDet[index].qty = parseInt(vm.pogetDet[index].qty) + parseInt(data[itemIndex].qty);
          vm.pogetDet[index].po_total = vm.pogetDet[index].qty * vm.pogetDet[index].po_unit_rate;
          vm.po_total = vm.pogetDet[index].po_total;
          vm.pogetDet[index].pi_no += "," + data[itemIndex].pi_no;
          angular.element(document.getElementById('poAct' + data[itemIndex].pi_no + data[itemIndex].ctrlIndex)).html('<i class="fa fa-minus fa-lg" aria-hidden="true"></i>');
        }
        else {
           $("#notification").animate({
        top: '-65px',
    });
    document.getElementById("notification").innerText="Your Purchase order has been removed";
          vm.pogetDet[index].qty = parseInt(vm.pogetDet[index].qty) - parseInt(data[itemIndex].qty);
          vm.pogetDet[index].po_total = vm.pogetDet[index].qty * vm.pogetDet[index].po_unit_rate;
          // vm.po_total = vm.pogetDet[index].po_total;
          vm.po_total = parseInt(vm.po_total) - parseInt(data[itemIndex].po_total);
          angular.element(document.getElementById('poAct' + data[itemIndex].pi_no + data[itemIndex].ctrlIndex)).html('<i class="fa fa-plus fa-lg" aria-hidden="true"></i>');
          // console.log(vm.pogetDet[index].qty);
          if (parseInt(vm.pogetDet[index].qty) <= 0) {

            var index = $scope.poGetDet.indexOf(vm.pogetDet[index]);
            $scope.poGetDet.splice(index, 1);
            vm.count = $scope.poGetDet.length;
            if(vm.count == 0) {
         document.getElementById("viewCart").style.visibility = "hidden";
  }
  else{
          document.getElementById("viewCart").style.visibility = "visible";
  }
          }
        }
        // console.log($scope.poGetDet);
        return;
      }

    }

    if (actFlg.indexOf("fa-plus") !== -1) {
      vm.po_total = parseInt(vm.po_total) + parseInt(data[itemIndex].po_total);
      vm.grand_totalch = vm.po_total;
      angular.element(document.getElementById('poAct' + data[itemIndex].pi_no + data[itemIndex].ctrlIndex)).html('<i class="fa fa-minus fa-lg" aria-hidden="true"></i>');


      $scope.poGetDet.push(data[itemIndex]);
      vm.pogetDet = $scope.poGetDet;
      vm.count = vm.pogetDet.length;
      if(vm.count == 0) {
         document.getElementById("viewCart").style.visibility = "hidden";
  }
  else{
          document.getElementById("viewCart").style.visibility = "visible";
  }
    }
    else {
      vm.po_total = parseInt(vm.po_total) - parseInt(data[itemIndex].po_total);
      vm.grand_totalch = vm.po_total;
      angular.element(document.getElementById('poAct' + data[itemIndex].pi_no + data[itemIndex].ctrlIndex)).html('<i class="fa fa-plus fa-lg" aria-hidden="true"></i>');

      var index = $scope.poGetDet.indexOf(data[itemIndex]);
      $scope.poGetDet.splice(index, 1);

      //  $scope.poGetDet.push(data[0]);
      vm.pogetDet = $scope.poGetDet;
      vm.count = vm.pogetDet.length;
      if(vm.count == 0) {
         document.getElementById("viewCart").style.visibility = "hidden";
  }
  else{
          document.getElementById("viewCart").style.visibility = "visible";
  }
    }
  })

  $scope.$on('count', function (e, data) {
    var count = data;
    vm.count = count;
  })




  function openNav() {
    document.getElementById("mySidenav").style.display = "block";
    document.getElementById("mySidenav").style.width = "100%";
    document.getElementById("mySidenav").style.marginTop = "0%";
    document.getElementById("fullClose").style.display = "none";
    document.getElementById("closeNav").style.display = "block";
    document.getElementById("main").style.display = "none";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }

  function closeNav() {
    document.getElementById("mySidenav").style.display = "none";
    document.getElementById("fullClose").style.display = "block";
    document.getElementById("closeNav").style.display = "none";
    document.getElementById("main").style.display = "block";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }

  function poopenNav() {
    document.getElementById("myrightnav").style.display = "block";
    document.getElementById("myrightnav").style.width = "40%";
    document.getElementById("myrightnav").style.marginLeft = "60%";
    document.getElementById("myrightnav").style.marginTop = "-4%";
    document.getElementById("myrightnav").style.borderLeft = "1px solid #CCC";
    document.getElementById("poCount").style.display = "none";
    document.getElementById("main").style.overflow = "hidden";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }



  function closeNav1() {
    document.getElementById("myrightnav").style.display = "none";
    document.getElementById("poCount").style.display = "block";
    document.getElementById("poCount").style.marginLeft = "93%";
    document.getElementById("main").style.overflow = "scroll";
    document.body.style.backgroundColor = "white";
  }

  $scope.$on('PoTrackSheet', function (e, data) {
    var poNo = {
      'po': [data]
    }
    $state.go("master.purchaseTrackSheet", { 'index': 2, 'poNo': poNo });
  });

  // Category Name Conversion
  vm.categoryName = categoryName;
  function categoryName(data) {
    if(data) {
        var category = vm.api.company.category;
        if(category) {
              var filterCat = $filter('filter')(category, { _id: data }, true)[0];
              vm.filterCatName = filterCat.name;
              return filterCat.name;
        }
        
    }
    
  }

  function poadd() {
    $('#addpopup').modal("toggle");
  }


  vm.getPOstatus = getPOstatus;
  vm.getPIstatus = getPIstatus;

  function getPOstatus(staus) {
    for (var i in CONSTANTS.po_status) {
      if (staus == CONSTANTS.po_status[i].name) {
        var status = {
          '_id': CONSTANTS.po_status[i]._id,
          'name': CONSTANTS.po_status[i].name
        }
      }
    }
    return status;
  }

  //Search DDL Select
  $('.search-panel .dropdown-menu').find('a').click(function (e) {
    e.preventDefault();
    var param = $(this).attr("title").replace("#", "");
    var concept = $(this).text();
    $('.search-panel span#search_concept').text(concept);
    $('.input-group #search_param').val(param);
    $('.input-group1 #search_param').val(param);

    vm.searchType = param;
    if (param === "PODate") {
      $("#srhDt").show();
      $("#srhTxt").hide();
      $("#srhBranch").hide();
      $("#projectFrom").hide();
    } else if (param === "Branch") {
      $("#srhBranch").show();
      $("#srhTxt").hide();
      $("#srhDt").hide();
      $("#projectFrom").hide();
    }
    else if (param === "ProjectFrom") {
      $("#projectFrom").show();
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

  $('.input-group.date').datepicker({
    calendarWeeks: true,
    todayHighlight: true,
    autoclose: true,
    endDate: '+0d',
    closeText: 'Clear',
    clearBtn: true
  });

  $('.input-group1.date td').datepicker({
    calendarWeeks: true,
    todayHighlight: true,
    autoclose: true,
    // maxDate: '0',
    startDate: '+0d',
    closeText: 'Clear',
    clearBtn: false
    // $("#srhDt").datepicker().datepicker("setDate", new Date());
  });

  function getPIstatus(staus) {
    var stat = CONSTANTS.pi_status;
    angular.forEach(stat, function (stats) {
      if (staus == stats.name) {
        var status = {
          '_id': stats._id,
          'name': stats.name
        }
      }
    })
    return status;
  }

  // calculation for colorHomes
function calNetAmtCh(data) {
  if(data.po_total !== null)
  {
    data.po_total = data.qty * data.po_unit_rate;
  }
 var reg = new RegExp('^[+]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$');
            if(!reg.test(data.tax) && data.tax !== ''){
                if($('.alertify-log').length == 0){
                    alertify.log('Negative numbers , letters not allowed');
                }
                data.tax = "0";
            }
            if(!reg.test(data.discount) && data.discount !== ''){
                if($('.alertify-log').length == 0){
                    alertify.log('Negative numbers , letters not allowed');
                }
              data.discount = "0";
            }
            
            if(data.discount == "" || data.discount == undefined )
  {
   data.discount = 0;
  }
  //  var discount = data.po_total * (data.discount / 100);

    // var tax = (ltotal * ltax)/100;
 
  if(data.tax == undefined || data.tax == "")
  {
    data.tax = 0;
  }
  
  if( data.discount == 0 && data.tax == 0 )
  {
    data.po_total = 0;
     data.po_total = data.qty * data.po_unit_rate;
     vm.po_total = 0;
    angular.forEach( $scope.poGetDet, function(a){
        vm.po_total += a.po_total;
        vm.grandTax = 0;
        vm.freight_total = parseInt(vm.freight_total);
              vm.load_total = parseInt(vm.load_total);
                var discount = vm.po_total * (vm.po_discountCH / 100);

    // var tax = (ltotal * ltax)/100;
    var disTot = (vm.po_total - discount);
    vm.disAmt = discount;
    var tax = vm.po_total * (vm.po_taxCH / 100);
    vm.taxAmt = tax;

    var taxTot = disTot * (vm.po_taxCH / 100);

    vm.grand_totalch = disTot + taxTot + vm.freight_total + vm.load_total;
        // vm.grand_totalch =  vm.po_total;
    });
    //  return data.po_total;
  }
  // data.po_total = 0;
  var discount = data.po_total * (data.discount / 100);
var  disTot = (data.po_total - discount);
   var taxTot = disTot * (data.tax / 100);

   var tax = data.po_total * (data.tax / 100);
   vm.matTax = tax;

    data.po_total = disTot + taxTot;
    var pototal = data.po_total;
vm.po_total = 0;
vm.grandTax = 0;
    angular.forEach($scope.poGetDet, function(a){
        vm.po_total += a.po_total;
        vm.grandTax += vm.matTax;
        vm.freight_total = parseInt(vm.freight_total);
              vm.load_total = parseInt(vm.load_total);
                var discount = vm.po_total * (vm.po_discountCH / 100);

    // var tax = (ltotal * ltax)/100;
    var disTot = (vm.po_total - discount);
    vm.disAmt = discount;
    var tax = vm.po_total * (vm.po_taxCH / 100);
    vm.taxAmt = tax;

    var taxTot = disTot * (vm.po_taxCH / 100);

    vm.grand_totalch = disTot + taxTot + vm.freight_total + vm.load_total;
        // vm.grand_totalch =  vm.po_total;
    });
   // return vm.grand_total;
  //  vm.grand_totalch = vm.grand_totalch + data.po_total;
}

function calunitRate(data) {
  if(data.po_unit_rate == "" || data.po_unit_rate == undefined || data.po_unit_rate == 0) {
    data.po_total = 0;
    vm.po_total = 0;
    angular.forEach( $scope.poGetDet, function(a){
        vm.po_total += a.po_total;
        vm.freight_total = parseInt(vm.freight_total);
              vm.load_total = parseInt(vm.load_total);
                var discount = vm.po_total * (vm.po_discountCH / 100);

    // var tax = (ltotal * ltax)/100;
    var disTot = (vm.po_total - discount);
    vm.disAmt = discount;
    var tax = vm.po_total * (vm.po_taxCH / 100);
    vm.taxAmt = tax;

    var taxTot = disTot * (vm.po_taxCH / 100);

    vm.grand_totalch = disTot + taxTot + vm.freight_total + vm.load_total;
    });
     return data.po_total;
  }
  else {
    data.po_total = data.po_unit_rate * data.qty;
    vm.po_total = 0;
    angular.forEach( $scope.poGetDet, function(a){
        vm.po_total += a.po_total;
        vm.freight_total = parseInt(vm.freight_total);
              vm.load_total = parseInt(vm.load_total);
                var discount = vm.po_total * (vm.po_discountCH / 100);

    // var tax = (ltotal * ltax)/100;
    var disTot = (vm.po_total - discount);
    vm.disAmt = discount;
    var tax = vm.po_total * (vm.po_taxCH / 100);
    vm.taxAmt = tax;

    var taxTot = disTot * (vm.po_taxCH / 100);

    vm.grand_totalch = disTot + taxTot + vm.freight_total + vm.load_total;
    });
     return data.po_total;
  }
}

function calGrossAmtCh() {
  var reg = new RegExp('^[+]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$');
            if(!reg.test(vm.po_taxCH) && vm.po_taxCH !== ''){
                if($('.alertify-log').length == 0){
                    alertify.log('Negative numbers , letters not allowed');
                }
                vm.po_taxCH = "";
            }
            if(!reg.test(vm.po_discountCH) && vm.po_discountCH !== ''){
                if($('.alertify-log').length == 0){
                    alertify.log('Negative numbers , letters not allowed');
                }
                vm.po_discountCH = "";
            }
            
            if(vm.freightType == "Vendor" || vm.loadType == "Vendor") {
              vm.freight_total = parseInt(vm.freight_total);
              vm.load_total = parseInt(vm.load_total);
                var discount = vm.po_total * (vm.po_discountCH / 100);

    // var tax = (ltotal * ltax)/100;
    var disTot = (vm.po_total - discount);
    vm.disAmt = discount;
    var tax = vm.po_total * (vm.po_taxCH / 100);
    vm.taxAmt = tax;

    var taxTot = disTot * (vm.po_taxCH / 100);

    vm.grand_totalch = disTot + taxTot + vm.freight_total + vm.load_total;
            }

            else {
              var discount = vm.po_total * (vm.po_discountCH / 100);

    // var tax = (ltotal * ltax)/100;
    var disTot = (vm.po_total - discount);
    vm.disAmt = discount;
    var tax = vm.po_total * (vm.po_taxCH / 100);
    vm.taxAmt = tax;

    var taxTot = disTot * (vm.po_taxCH / 100);

    vm.grand_totalch = disTot + taxTot;
            }
    
}

  vm.getPI = getPI;

  function getPI(data) {

    vm.catID = data;

    vm.vendor = [];
    vm.vendorMaterials = [];
    vm.vendorMat = [];

    vm.api.vendor = vm.selectVendor;
    for (var i = 0; i < vm.vendorsList.length; i++) {
      if (vm.vendorsList[i]['_id'] == vm.selectVendor) {
        vm.vendor = vm.vendorsList[i]['id'];
        vm.vendorMaterials = vm.vendorsList[i]['materials'];
      }
    }

    for (var j = 0; j < vm.vendorMaterials.length; j++) {
      vm.vendorMat.push(vm.vendorMaterials[j]['id']);
    }
    var vendorList = {
      "status": "574450f469f12a253c61bca2",
      "category_id" : data,
      "project" : [vm.fromProject]
    }
   // console.log(JSON.stringify(vendorList));
  
         api.vendorList(vendorList, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        vm.vendorTypeList = data;
        // vm.vendorMat = [];
      }
    });

  }

  function reload() {
    vm.status = "57650efb818d3b1cd808c401";
    $scope.currentPage = 1;
    vm.srhTxt = '';
    vm.srhDt = '';
    vm.searchbranch = '';
    vm.poGridBind(false, 0, 10);
    vm.ddlRows = "10";
  }

   vm.searchClear = searchClear;
  function searchClear() {
    vm.srhTxt = '';
    vm.srhDt = '';
    vm.searchbranch = '';
  }
}

