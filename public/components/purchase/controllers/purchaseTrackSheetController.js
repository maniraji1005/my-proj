'use strict';
angular.module('todo.purchaseTrackSheetController', [])
  .controller('purchaseTrackSheetController', purchaseTrackSheetController);
purchaseTrackSheetController.$inject = ['$scope', '$state', '$stateParams', 'storage', 'api', 'SETTINGS', '$filter'];
function purchaseTrackSheetController($scope, $state, $stateParams, storage, api, CONSTANTS, $filter) {
  var vm = this;
  var index = $stateParams.index;
  var PiNo = $stateParams.piNo;
  var PoNo = $stateParams.poNo;
  var mrnNo = $stateParams.mrnNo;
  vm.reqDetails = [];
  vm.deliveredDetails = [];
  vm.mrnDetails = [];
  vm.getPI = getPI;
  vm.api = api;
  vm.PIdetails = [];
  vm.getNo = getNo;
  vm.selectStep = selectStep;
  vm.quantityCheck = quantityCheck;
  vm.statusChange = statusChange;
  vm.InputDisabled = false;
  vm.UpdatePI = UpdatePI;
  vm.piTrackRemarks = '';
  var profileName = {
    'id': vm.api.profile._id,
    'name': vm.api.profile.names
  }
  vm.getPiStatus = getPiStatus;
  var piRejected = false;
  vm.Step1DataDisable = false;
  vm.Step2DataDisable = false;
  vm.Step3DataDisable = false;
  vm.Step4DataDisable = false;
  vm.getPODetails = getPODetails;
  vm.PurchaseTrackSheetIndex = '';
  vm.PurchaseOrderDetails = [];
  vm.PurchaseOrderMaterials = [];
  vm.stepNavigation = stepNavigation;
  vm.getMrnDetails = getMrnDetails;
  vm.getMrnDetailsAudit = getMrnDetailsAudit;
  vm.MrnDetails = [];
  vm.completedStatus = '';
  vm.mrnopenNav1 = mrnopenNav1;
  vm.mrncloseNav1 = mrncloseNav1;
  vm.poopenNav1 = poopenNav1;
  vm.pocloseNav1 = pocloseNav1;
  vm.closePO = closePO;
  vm.closePI = closePI;
  vm.updatePurchaseOrder = updatePurchaseOrder;
  vm.updateMRNDetails = updateMRNDetails;
  vm.updateMRNDetailsUpdate = updateMRNDetailsUpdate;
  vm.calunitRateRed = calunitRateRed;
  vm.calunitRateRedMRN = calunitRateRedMRN;
  vm.calunitRateRedMRNAudit = calunitRateRedMRNAudit;
  vm.categoryCH = vm.api.company.category;
  // vm.statusChangePO = statusChangePO;
  // vm.net_amount = 0;
  var access = storage.get('access');
  if (access !== undefined) {
    access = JSON.parse(access);
    vm.trackSheetAccess = access.t;
  }

  vm.getCompDet = '';
  // vm.filterCatName = '';
  vm.getCompDet = vm.api.profile.company;
  vm.fromProject = fromProject;
  vm.calunitRate = calunitRate;
  vm.calunitRateMRN = calunitRateMRN;
  vm.calunitRateMRNAudit = calunitRateMRNAudit;
  vm.po_taxCH = '0';
  vm.po_discountCH = '0';
  vm.exeList = vm.api.profile._id;
  vm.freightType = "Company";
  vm.loadType = "Company";
  vm.po_tax = '0';
  vm.po_discount = '0';
   vm.freight_total = 0;
  vm.load_total = 0;
  vm.vendorMrnLen = '0';

  $('.input-group1.date').datepicker({
    calendarWeeks: true,
    todayHighlight: true,
    autoclose: true,
    // maxDate: '0',
    startDate: '+0d',
    closeText: 'Clear',
    clearBtn: false
    // $("#srhDt").datepicker().datepicker("setDate", new Date());
  });

  api.exeDDL(vm.empList, function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      vm.executiveList = data;
    }
  });

  function calunitRate(data) {
  if(data.rate == "" || data.rate == undefined || data.rate == 0) {
    data.total = 0;
    vm.total = 0;
    angular.forEach( vm.PurchaseOrderDetails, function(a){
        vm.net_amount += a.total;
        vm.gross_amount =  vm.net_amount;
    });
     return data.total;
  }
  else {
    if(parseInt(data.quantity) > parseInt(data.approved_quantity)) {
      if ($('.alertify-log-error').length == 0) {
                    alertify.error('Quantity is more than available quantity');
                    alertify.log(' Approved quantity is ' + data.approved_quantity, 0);
                    return;
                }
                
    }
    data.total = data.rate * data.quantity;
    vm.net_amount = 0;
    vm.matDet = '';
     var discount = data.total * (data.discount / 100);
var  disTot = (data.total - discount);
   var taxTot = disTot * (data.tax / 100);

   var tax = data.total * (data.tax / 100);
   vm.matTax = tax;
   vm.totalMaterial = 0;
   data.total = disTot + taxTot;

    vm.totalMaterial = disTot + taxTot;
    for(var i=0;i< vm.PurchaseOrderDetails.length;i++) {
      vm.matDet = vm.PurchaseOrderDetails[i].materials;
      // vm.matTotal = vm.matDet[i].total;
    }
    vm.matTotal = 0;
    angular.forEach( vm.matDet, function(a){
   vm.totalMaterial = 0;
        vm.matTotal += a.total;
//         vm.gross_amount =  vm.net_amount;
    });
//     vm.matDet = vm.PurchaseOrderDetails.materials;
    angular.forEach( vm.PurchaseOrderDetails, function(a){
        vm.net_amount += vm.matTotal;
        var discount = vm.net_amount * (a.discount / 100);

    // var tax = (ltotal * ltax)/100;
    var disTot = (vm.net_amount - discount);
    vm.disAmt = discount;
    var tax = vm.net_amount * (a.tax / 100);
    vm.taxAmt = tax;

    var taxTot = disTot * (a.tax / 100);

        vm.gross_amount =  disTot + taxTot  + a.freight_charge + a.loading_unloading_charge;
    });
     return data.total;
  }
}

vm.calunitRateTrack = calunitRateTrack;
function calunitRateTrack(data) {
  if(data.po_unit_rate == "" || data.po_unit_rate == undefined || data.po_unit_rate == 0) {
    data.po_total = 0;
    vm.po_total = 0;
    angular.forEach( $scope.poGetDet, function(a){
        vm.po_total += a.po_total;
        vm.grand_totalch =  vm.po_total;
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

// calculation for colorHomes
vm.calNetAmtChTrack = calNetAmtChTrack;
function calNetAmtChTrack(data) {
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


vm.calGrossAmtChTrack = calGrossAmtChTrack;
function calGrossAmtChTrack() {
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

function calunitRateMRN(data) {
  if(data.rate == "" || data.rate == undefined || data.rate == 0) {
    data.total = 0;
    vm.total = 0;
    angular.forEach( vm.MrnDetails, function(a){
        vm.net_amount += a.total;
        vm.gross_amount =  vm.net_amount;
    });
     return data.total;
  }
  else {
    if(parseInt(data.quantity) > parseInt(data.received_quantity)) {
      if ($('.alertify-log-error').length == 0) {
                    alertify.error('Quantity is more than available quantity');
                }
                alertify.log(' Requested quantity is ' + data.received_quantity, 0);
                // data.quantity = data.received_quantity;
                return;
    }
    data.total = data.rate * data.quantity;
    vm.net_amount = 0;
    var discount = data.total * (data.discount / 100);
var  disTot = (data.total - discount);
   var taxTot = disTot * (data.tax / 100);

   var tax = data.total * (data.tax / 100);
   vm.matTax = tax;

    data.total = disTot + taxTot;
    vm.matDet = '';
    for(var i=0;i<vm.MrnDetails.length;i++) {
      vm.matDet = vm.MrnDetails[i].materials;
      // vm.matTotal = vm.matDet[i].total;
    }
    vm.matTotal = 0;
    angular.forEach( vm.matDet, function(a){
      
        vm.matTotal += a.total;
//         vm.gross_amount =  vm.net_amount;
    });
//     vm.matDet = vm.PurchaseOrderDetails.materials;
    angular.forEach( vm.MrnDetails, function(a){
        vm.net_amount += vm.matTotal;
        var discount = vm.net_amount * (a.discount / 100);

    // var tax = (ltotal * ltax)/100;
    var disTot = (vm.net_amount - discount);
    vm.disAmt = discount;
    var tax = vm.net_amount * (a.tax / 100);
    vm.taxAmt = tax;

    var taxTot = disTot * (a.tax / 100);

        vm.gross_amount =  disTot + taxTot  + a.freight_charge + a.loading_unloading_charge;
    });
     return data.total;
  }
}

function calunitRateMRNAudit(data) {
  if(data.rate == "" || data.rate == undefined || data.rate == 0) {
    data.total = 0;
    vm.total = 0;
    data.total = data.rate * data.received_quantity;
    vm.net_amount = 0;
    var discount = data.total * (data.discount / 100);
var  disTot = (data.total - discount);
   var taxTot = disTot * (data.tax / 100);

   var tax = data.total * (data.tax / 100);
   vm.matTax = tax;

    data.total = disTot + taxTot;
    vm.matDet = '';
    for(var i=0;i<vm.MrnDetailsAudit.length;i++) {
      vm.matDet = vm.MrnDetailsAudit[i].materials;
      // vm.matTotal = vm.matDet[i].total;
    }
    vm.matTotal = 0;
    angular.forEach( vm.matDet, function(a){
      
        vm.matTotal += a.total;
//         vm.gross_amount =  vm.net_amount;
    });
    angular.forEach( vm.MrnDetailsAudit, function(a){
        vm.net_amount += vm.matTotal;
        vm.gross_amount =  vm.net_amount;
    });
     return data.total;
  }
  else {
    if(parseInt(data.received_quantity) > parseInt(data.quantity)) {
      if ($('.alertify-log-error').length == 0) {
                    alertify.error('Quantity is more than available quantity');
                }
                alertify.log(' Requested quantity is ' + data.quantity, 0);
                return;
    }
    data.total = data.rate * data.received_quantity;
    vm.net_amount = 0;
    var discount = data.total * (data.discount / 100);
var  disTot = (data.total - discount);
   var taxTot = disTot * (data.tax / 100);

   var tax = data.total * (data.tax / 100);
   vm.matTax = tax;

    data.total = disTot + taxTot;
    vm.matDet = '';
    for(var i=0;i<vm.MrnDetailsAudit.length;i++) {
      vm.matDet = vm.MrnDetailsAudit[i].materials;
      // vm.matTotal = vm.matDet[i].total;
    }
    vm.matTotal = 0;
    angular.forEach( vm.matDet, function(a){
      
        vm.matTotal += a.total;
//         vm.gross_amount =  vm.net_amount;
    });
//     vm.matDet = vm.PurchaseOrderDetails.materials;
    angular.forEach( vm.MrnDetailsAudit, function(a){
        vm.net_amount += vm.matTotal;
        var discount = vm.net_amount * (a.discount / 100);

    // var tax = (ltotal * ltax)/100;
    var disTot = (vm.net_amount - discount);
    vm.disAmt = discount;
    var tax = vm.net_amount * (a.tax / 100);
    vm.taxAmt = tax;

    var taxTot = disTot * (a.tax / 100);

        vm.gross_amount =  disTot + taxTot  + a.freight_charge + a.loading_unloading_charge;
    });
     return data.total;
  }
}

vm.calGrossAmtCh = calGrossAmtCh;

function calGrossAmtCh(data) {
  var reg = new RegExp('^[+]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$');
            if(!reg.test(vm.gross_tax) && vm.gross_tax !== ''){
                if($('.alertify-log').length == 0){
                    alertify.log('Negative numbers , letters not allowed');
                }
                vm.gross_tax = "";
            }
            if(!reg.test(vm.gross_discount) && vm.gross_discount !== ''){
                if($('.alertify-log').length == 0){
                    alertify.log('Negative numbers , letters not allowed');
                }
                vm.gross_discount = "";
            }
            if(vm.net_amount == 0) {
              vm.net_amount = data.net_amount;
            }
            
              vm.freight_charge = parseInt(data.freight_charge);
              vm.load_total = parseInt(data.loading_unloading_charge);
                var discount = vm.net_amount * (vm.gross_discount / 100);

    // var tax = (ltotal * ltax)/100;
    var disTot = (vm.net_amount - discount);
    vm.disAmt = discount;
    var tax = vm.net_amount * (vm.gross_tax / 100);
    vm.taxAmt = tax;

    var taxTot = disTot * (vm.gross_tax / 100);

    vm.gross_amount = disTot + taxTot + vm.freight_charge + vm.load_total;
            

            
    
}

vm.calGrossAmtChMRN = calGrossAmtChMRN;

function calGrossAmtChMRN(data) {
  var reg = new RegExp('^[+]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$');
            if(!reg.test(vm.gross_tax) && vm.gross_tax !== ''){
                if($('.alertify-log').length == 0){
                    alertify.log('Negative numbers , letters not allowed');
                }
                vm.gross_tax = "";
            }
            if(!reg.test(vm.gross_discount) && vm.gross_discount !== ''){
                if($('.alertify-log').length == 0){
                    alertify.log('Negative numbers , letters not allowed');
                }
                vm.gross_discount = "";
            }
            if(vm.net_amount == 0) {
              vm.net_amount = data.net_amount;
            }
            
              vm.freight_charge = parseInt(data.freight_charge);
              vm.load_total = parseInt(data.loading_unloading_charge);
                var discount = vm.net_amount * (vm.gross_discount / 100);

    // var tax = (ltotal * ltax)/100;
    var disTot = (vm.net_amount - discount);
    vm.disAmt = discount;
    var tax = vm.net_amount * (vm.gross_tax / 100);
    vm.taxAmt = tax;

    var taxTot = disTot * (vm.gross_tax / 100);

    vm.gross_amount = disTot + taxTot + vm.freight_charge + vm.load_total;
            

            
    
}

   // For Getting Project based on Emp ID for CH
  var EmpId = {
    "empID": vm.api.profile._id
  }

  api.ProjectDDL([EmpId], function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      vm.projectList1 = data.projectList;
    //   vm.api.projectList = vm.projectList;
    }
  });

        function fromProject(fromProject) {
            if(fromProject) {
                  var filterCat = $filter('filter')(vm.projectList, { _id: fromProject }, true);
                  // console.log("rwrerr",JSON.stringify(filterCat));
                  if(filterCat) {
                    vm.projectCode = filterCat[0].short_code;
                    // console.log("rwrerr",JSON.stringify(vm.projectCode));
                       return filterCat[0].name;
                  }
                  
            }
    
    
  }

  function getAccess() {
    if(vm.api.company.modules){
    var modules = $filter('filter')(vm.api.company.modules, { _id: vm.api.profile.roles[0] }, true)[0];
    // 57651b60818d3b1cd808c40d  Store Module ID
    var purchaseModule = $filter('filter')(modules.module, { m_name: "Purchase Management" }, true)[0];
    // 57651b60818d3b1cd808c40f MI sub module ID
    var purchaseIndentSub = $filter('filter')(purchaseModule.m_sub_modules, { s_name: "Purchase Indent" }, true)[0];
    vm.piaccess = purchaseIndentSub.s_access;
    var purchasesubmodule = $filter('filter')(purchaseModule.m_sub_modules, { s_name: "Purchase Order" }, true)[0];
    vm.poaccess = purchasesubmodule.s_access;
    var mrnModule = $filter('filter')(modules.module, { m_name: "Stock Management" }, true)[0];
    // 57651b60818d3b1cd808c40e MR sub module ID
    var mrnsubmodule = $filter('filter')(mrnModule.m_sub_modules, { s_name: "MRN" }, true)[0];
    vm.mrnaccess = mrnsubmodule.s_access;
    }
  }
  getAccess();

  // Po popup
  vm.vendorsList = [];
  vm.vendorTypeList = [];
  vm.pogetDet = [];
  vm.poopenNav = poopenNav;
  vm.pocloseNav = pocloseNav;
  vm.insertPurchaseOrder = insertPurchaseOrder;
  vm.sendPIMaterial = sendPIMaterial;
  vm.tax = '';
  vm.discount = '';
  vm.close = ModalClose;
  vm.PORemarks = '';
  vm.vendor = [];
  $scope.poGetDet = [];
  vm.grand_total = 0;
  vm.po_total = 0;
  vm.calNetAmt = calNetAmt;
  vm.count = '0';
  vm.poNo = '';

  // mrn pop up
  vm.mrnVendorList = [];
  vm.mrnVendorTypeList = [];
  vm.mrngetDet = [];
  vm.mrnopenNav = mrnopenNav;
  vm.mrncloseNav = mrncloseNav;
  vm.insertMRN = insertMRN;
  vm.sendPOMaterial = sendPOMaterial;
  vm.mrntax = '';
  vm.mrndiscount = '';
  vm.mrnvendor = [];
  vm.vendorMRNList = [];
  vm.mrncount = '0';
  vm.mrnclose = ModalClose;
  vm.mrnRemarks = '';
  vm.invoiceNo = '';
  $scope.mrnGetDet = [];
  $scope.mrngetDet = [];
  vm.poId = [];
  vm.mrncalNetAmt = mrncalNetAmt;
  vm.mrnPo_total = 0;
  vm.mrngrand_total = 0;
  vm.calculateTotal = calculateTotal;
  vm.vendorInitial = '';
  var poNoRes = '';
  vm.chkStatus = chkStatus;
  vm.srhDt = '';
  vm.closeMRN = closeMRN;
  vm.calNetAmtCh = calNetAmtCh;

  //  get company id
  vm.api.companyDet(function ( err, data)
  {
    vm.companyId = data._id;
  });
  // Default load after page refreshing
  function getNo() {
    if(index){
      storage.put('POIndex', index);
    }
    index = storage.get('POIndex');
    if (PiNo !== null) {
      storage.put('PiNo', JSON.stringify(PiNo));
    }
    if (PiNo !== undefined && PiNo !== null)
      PiNo = storage.get('PiNo');
    if (PoNo !== null) {
      storage.put('PoNo', JSON.stringify(PoNo));
    }
    PoNo = storage.get('PoNo');
    if (PoNo !== undefined && PoNo !== null)
      PoNo = JSON.parse(PoNo);
    if (mrnNo !== null) {
      storage.put('mrnNo', JSON.stringify(mrnNo));
    }
    mrnNo = storage.get('mrnNo');
    if (mrnNo !== undefined && mrnNo !== null)
      mrnNo = JSON.parse(mrnNo);
  }
  vm.getNo();




  function getPI(data) {
    // console.log('getPI', data);
    vm.api.getPI(data, function (err, data) {
      if (!err) {
        vm.PurchaseTrackSheetIndex = '1';
        if (index == 1) {
          vm.PIdetails = data;
          if (vm.PIdetails[0].status.name == 'Approved' || vm.PIdetails[0].status.name == 'Closed') {
            vm.Step1DataDisable = true;
            vm.poNos = [];
            angular.forEach(vm.PIdetails[0].materials, function (materials) {
              if (materials.po_id) {
                vm.poNos.push(materials.po_id);
              }
            });
            if (vm.poNos.length > 0) {
              PoNo = {
                'po': vm.poNos
              }
              vm.getPODetails(PoNo);
              $scope.step2('');
              vm.PIdetails = data;
              vm.Step1DataDisable = true;
            } else {
              $scope.step2('h');
            }

          } else if (vm.PIdetails[0].status.name == 'Rejected') {
            vm.Step1DataDisable = true;
          }
        } else {
          vm.PIdetails = data;
        }
      } else {
        //alert("No Data");
      }
    });
  }

  vm.getPITrack = getPITrack;

  function getPITrack(data) {

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
      "project" : [vm.fromProject1]
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

  function selectStep() {
  }

  function chkStatus(item) {
    if (item.status.name == 'Manual Closed' || item.status.name == 'Closed' || item.status.name == 'Approved') {
      return true;
    }
    else {
      return false;
    }

  }

  $scope.step1 = function (flg) {
    $scope.step = 1;
    // $scope.step2Flg = '0';
    // $scope.step3Flg = '3';
    angular.element('#new_crumbs_menu2').addClass("list_active");
    angular.element('#new_crumbs_menu3').removeClass("list_active");
    angular.element('#new_crumbs_menu4').removeClass("list_active");
    angular.element('#new_crumbs_menu5').removeClass("list_active");
  }


  $scope.step2 = function (flg) {

    if (flg === "") {
      $scope.step2Flg = '1';
    }
    else {
      $scope.step2Flg = '2';
    }
    $scope.step = 2;
    angular.element('#new_crumbs_menu3').addClass("list_active");
    angular.element('#new_crumbs_menu2').addClass("list_active");
    angular.element('#new_crumbs_menu4').removeClass("list_active");
    angular.element('#new_crumbs_menu5').removeClass("list_active");

  }

  $scope.step3 = function (flg) {

    if (flg === "") {
      $scope.step3Flg = '1';
      vm.PurchaseTrackSheetIndex = '3';
    }
    else {
      $scope.step3Flg = '2';
    }
    $scope.step = 3;
    angular.element('#new_crumbs_menu4').addClass("list_active");
    angular.element('#new_crumbs_menu2').addClass("list_active");
    angular.element('#new_crumbs_menu3').addClass("list_active");
    angular.element('#new_crumbs_menu5').removeClass("list_active");
  }

  $scope.step4 = function (flg) {
    $scope.step = 4;
    vm.PurchaseTrackSheetIndex = '4';
    angular.element('#new_crumbs_menu5').addClass("list_active");
    angular.element('#new_crumbs_menu4').addClass("list_active");
    angular.element('#new_crumbs_menu2').addClass("list_active");
    angular.element('#new_crumbs_menu3').addClass("list_active");
    angular.element('#new_crumbs_menu4').addClass("list_active");
  }


  if (index == 1) {
    $scope.step1('');
    vm.getPI(PiNo);
  } else if (index == 2) {
    $scope.step2('');
    vm.getPODetails(PoNo);
  } else if (index == 3) {
    $scope.step3('');
    vm.getMrnDetails(mrnNo);
  } else if (index == 4) {
    $scope.step4('');
    vm.getMrnDetailsAudit(mrnNo);
  }

  // stockavailability
  function quantityCheck(item) {
    var comp1 = parseInt(item.quantity);
    var comp2 = parseInt(item.appQty);

    if (parseInt(item.quantity) < parseInt(item.appQty)) {
      if ($('.alertify-log').length == 0){alertify.log("You cannot enter quantity more than requested quantity");}
      item.appQty = "";
    }
    var reg = new RegExp('^[0-9]+$');
    if (!reg.test(parseInt(item.appQty)) && item.appQty !== 0 && item.appQty !== "") {
      if ($('.alertify-log').length == 0){alertify.log("numbers only allowed");}
      item.appQty = "";
    }
    if (item.appQty !== "") {
            if(parseInt(item.appQty) == 0){
                item.stat = "R";
            }
            else if (comp2 < comp1) {
                item.stat = "P";
            }
            else {
                item.stat = "A";
            }
        } else {
            item.stat = "";
        }
  }



  // if (index === 1) {
  //   $scope.step1("");
  // }
  // else if (index === 2) {
  //   $scope.step2("");
  // } else if (index === 3) {
  //   $scope.step3("");
  // } else if (index !== null) {
  //   $scope.step4("");
  // }

  $scope.pageRedirect = function (index) {
    if (index === 1) {
      storage.put("subMenuSelected",0);
      storage.put("mainMenuSelected",2);
      $state.go("master.purchase");
    }
    else if (index === 2) {
      storage.put("subMenuSelected",1);
      storage.put("mainMenuSelected",2); 
      $state.go("master.purchaseOrder");
    }
    else {
      storage.put("subMenuSelected",2);
      storage.put("mainMenuSelected",1); 
      $state.go("master.mrn");
    }
  }

  function statusChange(status, childIndex, parentIndex) {
    if (status == 'Approved') {
      vm.PIdetails[parentIndex].materials[childIndex].appQty = vm.PIdetails[parentIndex].materials[childIndex].quantity;
      // vm.InputDisabled = true;
    } else {
      vm.PIdetails[parentIndex].materials[childIndex].appQty = 0;
      // vm.InputDisabled = true;
    }
    vm.PIdetails[parentIndex].materials[childIndex].status = vm.getPiStatus(status);
  }

  function UpdatePI() {
    var flag = 0;
    angular.forEach(vm.PIdetails[0].materials, function (values) {
      if (!values.appQty && values.appQty !== 0) {
        values.res = 1;
        flag = 1;
      }
      if (parseInt(values.appQty) !== 0) {
        if (parseInt(values.appQty) < parseInt(values.quantity)) {
          values.status = vm.getPiStatus('Pending');
        } else {
          values.status = vm.getPiStatus('Approved');
        }
      } else {
        values.status = vm.getPiStatus('Rejected');
      }
    });
    if (flag == 1) {
      if ($('.alertify-log-error').length == 0) {
        alertify.error("Some fields missing");
      }
      return;
    }
    if (vm.piTrackRemarks == "") {
      if ($('.alertify-log-error').length == 0) {
        alertify.error("Please enter remarks");
      }
      return;
    }

    // console.log(JSON.stringify(vm.PIdetails[0].materials));

    vm.material = [];
    if(vm.getCompDet == 'CH0001' && vm.getCompDet !== 'CO00001') {
        angular.forEach(vm.PIdetails[0].materials, function (materials) {
      vm.material.push({
        'id': materials.id,
        'mat_code' : materials.mat_code,
        'name': materials.name,
        'uom': materials.uom,
        'category_id': materials.category,
        'sub_category_id':materials.sub_category_id,
        'quantity': materials.quantity,
        'flag': true,
        'status': materials.status,
        'approved_quantity': materials.appQty,
        'size' : materials.size,
        'specification' : materials.specification,
        'mat_type' : materials.mat_type,
        'expected_date' :  materials.expected_date
      })
    })
    }
    else {
      angular.forEach(vm.PIdetails[0].materials, function (materials) {
      vm.material.push({
        'id': materials.id,
        'name': materials.name,
        'uom': materials.uom,
        'category_id': materials.category,
        'quantity': materials.quantity,
        'flag': true,
        'status': materials.status,
        'approved_quantity': materials.appQty
      })
    })
    }
    
    // overall status
    var approvedcnt = 0;
    var rejcnt = 0;
    var pendingcnt = 0;
    angular.forEach(vm.PIdetails[0].materials, function (details) {
      if (details.status.name == "Approved") {
        approvedcnt += 1;
      } else if (details.status.name == "Rejected") {
        rejcnt += 1;
      } else {
        pendingcnt += 1;
      }
    })

    if (rejcnt > 0 && approvedcnt == 0 && pendingcnt == 0) {
      var status = vm.getPiStatus('Rejected');
    } else if (approvedcnt > 0 || pendingcnt > 0) {
      var status = vm.getPiStatus('Approved');
    }

    // console.log(JSON.stringify(vm.PIdetails));
    

    var PurchaseIndent = {
      'id': vm.PIdetails[0].id,
      'company': vm.PIdetails[0].company,
      'store': vm.PIdetails[0].store,
      'materials': vm.material,
      'updated_by': profileName,
      'store_type': vm.PIdetails[0].store_type,
      'branch': vm.PIdetails[0].branch,
      'status': status,
      'remarks': vm.piTrackRemarks,
      'category_id' : vm.PIdetails[0].category_id,
      'category_name' : vm.filterCatName,
      'sub_category_id' : vm.PIdetails[0].sub_category_id,
      'project' : vm.PIdetails[0].project,
      'project_code' : vm.projectCode,
      'order_type' : vm.PIdetails[0].order_type
    }
    // console.log('update', JSON.stringify(PurchaseIndent));
    if (status.name == 'Rejected') {
      piRejected = true;
    }
    vm.api.UpdatePI(PurchaseIndent, function (err, data) {
      if (!err) {
        if (piRejected) {
          vm.TrackSheetIndex = 1;
          vm.Step1DataDisable = true;
        } else {
          $scope.step2('H');
          vm.getPI(PiNo);
          vm.TrackSheetIndex = 2;
          vm.Step1DataDisable = true;
        }
      } else {
        //alert(JSON.stringify(err));
      }
    });
  }

  function getPiStatus(status) {
    for (var i in CONSTANTS.pi_status) {
      if (status == CONSTANTS.pi_status[i].name) {
        var status = {
          '_id': CONSTANTS.pi_status[i]._id,
          'name': CONSTANTS.pi_status[i].name
        }
      }
    }
    return status;
  }

  function getPODetails(data) {
    // console.log(JSON.stringify(data.po[0]));
    vm.poNo = data;
    // console.log('getPO', data);
    vm.api.getPObyIds(data, function (err, data) {
      if (err) {

      } else {
        vm.PurchaseTrackSheetIndex = '2';
        vm.PurchaseOrderDetails = data;
        // vm.net_amount = data.net_amount;
        // console.log(JSON.stringify(vm.PurchaseOrderDetails));
        // vm.Step2DataDisable = false;
        // console.log('purchase', data);
        if (index == 2 || index == 1) {
          vm.mrnNO = [];
          angular.forEach(vm.PurchaseOrderDetails, function (po) {
             vm.net_amount = po.net_amount;
             vm.gross_tax = po.tax;
             vm.gross_discount = po.discount;
             vm.gross_amount = po.gross_amount;
             if(po.status.name == "Approved" && po.status.name !== "Audited")
             {
               vm.Step2DataDisable = true;
               vm.PurchaseTrackSheetIndex = '3';
               $scope.step3('H');
               vm.Step3DataDisable = false;
               return;
             }
             else {
               vm.Step2DataDisable = false;
             }
            angular.forEach(po.materials, function (materials) {
              if (materials.mrn_id) {
                if (materials.mrn_id.length > 0) {
                  angular.forEach(materials.mrn_id, function (mrnid) {
                    vm.mrnNO.push(mrnid);
                  });
                } else {
                  vm.mrnNO.push(materials.mrn_id);
                }
              }
            })
          });
          if (vm.mrnNO.length > 0) {
            var nos = {
              'mrn': vm.mrnNO
            }

            vm.getMrnDetails(nos);
            $scope.step3('');
          }
        }
      }
    });
  }
  vm.vendorMaterials = [];
  vm.vendorMat = [];
  // Get PI List based on Vendor
  $scope.getVendor = function (vendor) {
    vm.vendorMat = [];
    vm.vendorTypeList = [];
    $scope.poGetDet = [];
    //vm.SelectedVendor = "Select Vendor";
    document.getElementById("viewCart").style.visibility = "hidden";
    vm.count = '0';
    vm.po_total = 0;
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
    api.vendorList(vendorList, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        // vm.api.ve??ndorallList = data;
        vm.vendorTypeList = data;
        vm.vendorMat = [];
      }
    });
  }
  // function stepNavigation(stage){
  //   if(index == 1){
  //     if(stage == 1){
  //       if($scope.step2Flg == '2'){
  //         $scope.step1('');
  //       }else if($scope.step2Flg == '1'){
  //          vm.Step1DataDisable = true;
  //         vm.indents = [];
  //         if (vm.PurchaseOrderDetails.length > 0) {
  //           angular.forEach(vm.PurchaseOrderDetails, function (indents) {
  //             angular.forEach(indents.indents, function (ind) {
  //               vm.indents.push(ind);
  //             })
  //           });
  //           PiNo = {
  //             'pi': vm.indents
  //           }
  //         } else {
  //           PiNo = {
  //             'pi': vm.PurchaseOrderDetails[0].indents
  //           }
  //         }
  //         vm.getPI(PiNo);
  //         $scope.step1('');
  //       }
  //     }else if(stage == 2){
  //       if($scope.step2Flg == '2'){
  //         $scope.step2('h');
  //       }else if($scope.step2Flg == '1'){
  //         $scope.step2('');
  //       }else if($scope.step2flg == undefined){
  //         return;
  //       }
  //     }else if(stage == 3){
  //       if($scope.step3Flg == '2'){
  //         $scope.step3('h');
  //       }else if($scope.step3Flg == '1'){
  //         $scope.step3('');
  //       }else if($scope.step2Flg == '1') {
  //         $scope.step3('h');
  //       }else if($scope.step3flg == undefined){
  //         return;
  //       }
  //     }
  //   }else
  //   if(index == 2){
  //     if(stage == 1){

  //     }else if(stage == 2){

  //     }else if(stage == 3){
        
  //     }
  //   }else
  //   if(index == 3){
  //     if(stage == 1){

  //     }else if(stage == 2){

  //     }else if(stage == 3){
        
  //     }
  //   }
  // }
  function stepNavigation(stage) {
    if (stage == '1') {
      if (index == 1) {
        $scope.step1('');
      } else
        if (index == 1 || index == 2 || index == 3) {
          vm.Step1DataDisable = true;
          vm.indents = [];
          if (vm.PurchaseOrderDetails.length > 0) {
            angular.forEach(vm.PurchaseOrderDetails, function (indents) {
              angular.forEach(indents.indents, function (ind) {
                vm.indents.push(ind);
              })
            });
            PiNo = {
              'pi': vm.indents
            }
          } else {
            PiNo = {
              'pi': vm.PurchaseOrderDetails[0].indents
            }
          }
          vm.getPI(PiNo);
          $scope.step1('');
        } else if (index == 3) {
          $scope.step1('');
        } else if (index == 1) {
          $scope.step1('');
        }
    } else if (stage == '2') {
      if(index == 1){
        if($scope.step2Flg == '2'){
          $scope.step2('H')
        }else if($scope.step2Flg == '1'){
          $scope.step2('');
        }else if($scope.step3Flg == '1'){
          $scope.step3('');
        }else if($scope.step3Flg == '2'){
          $scope.step3('H');
        }
      }
      if(index == 1 && $scope.step2Flg == '2'){
        $scope.step2('H');
      }else if($scope.step2Flg == undefined && $scope.step3Flg !== '1' ){
        return
      }else
      // if (index == 1 && vm.PurchaseTrackSheetIndex == '2' || vm.PurchaseTrackSheetIndex == '3') {
      // if (vm.PurchaseTrackSheetIndex == '1' || vm.PurchaseTrackSheetIndex == '2') {
      //   $scope.step2('');
      // } else
        if(index == 1 && $scope.step2Flg == '1'){
          return;
        }else if (index == 1 && $scope.step2Flg == '0' && $scope.step3Flg !== '1') {
          $scope.step2('H');
          return;
        } else
          if (index == 1 && $scope.step2Flg == '2') {
            $scope.step2('H');
          } else if (index == 1) {
            $scope.step2('');
          } else
            if (index == 4) {
              PoNo = {
                'po': vm.MrnDetails[0].po
              }
              vm.getPODetails(PoNo);
              $scope.step2('');
            } else if (index == 2) {
              if ($scope.step2Flg == '2') {
                $scope.step2('H');
              } else {
                $scope.step2('');
              }
            } else if (index == 3) {
              vm.Step2DataDisable = true;
              PoNo = {
                'po': vm.MrnDetails[0].po
              }
              vm.getPODetails(PoNo);
              $scope.step2('');
            }
    } else if (stage == '3') {
      if (index == '1') {
        if (vm.MrnDetails.length > 0 && $scope.step2Flg !== '2') {
            $scope.step3('');
          } else if($scope.step2Flg == '2' || $scope.step2Flg == undefined){
            return;
          }else {
            $scope.step3('H');
          }
      } else if (index == 2) {
        if (vm.MrnDetails.length > 0) {
          $scope.step3('');
        } else {
          $scope.step3('H');
        }
      } else if (index == 3) {
        $scope.step3('');
      }
    } else if (stage == '4') {
      if (index == '1') {
        if (vm.MrnDetailsAudit.length > 0 && $scope.step3Flg !== '3') {
            $scope.step4('');
          } else if($scope.step3Flg == '3' || $scope.step3Flg == undefined){
            return;
          }else {
            $scope.step4('H');
          }
      } else if (index == 2) {
        if (vm.MrnDetailsAudit.length > 0) {
          $scope.step4('');
        } else {
          $scope.step4('H');
        }
      } else if (index == 4) {
        $scope.step4('');
      }
      else {
        if(index == 3 || index == 4) {
          $scope.step4('');
        }
      }
    }
  }

  function getMrnDetails(data) {

    // console.log('mrn', data);
    vm.api.getMrnById(data, function (err, data) {
      if (!err) {
        vm.PurchaseTrackSheetIndex = '3';
        vm.MrnDetails = data;
        $scope.step3('');
        if(vm.getCompDet == 'CH0001') {
                if (index == 3 || index == 2) {
          vm.mrnNO = [];
          angular.forEach(vm.MrnDetails, function (mrn) {
             vm.net_amount = mrn.net_amount;
             vm.gross_tax = mrn.tax;
             vm.gross_discount = mrn.discount;
             vm.gross_amount = mrn.gross_amount;
             if(mrn.status.name == "Approved" || mrn.status.name == "Audited")
             {
               vm.Step3DataDisable = true;
               vm.mrnNO.push(mrn.id);
               if (vm.mrnNO.length > 0) {
            var nos = {
              'mrn': vm.mrnNO
            }

            vm.getMrnDetailsAudit(nos);
            $scope.step4('');
          }
             }
             else {
               vm.Step3DataDisable = false;
               return;
             }
          });
        }
        }
      }
    });
  }

  function getMrnDetailsAudit(data) {

     vm.api.getMrnById(data, function (err, data) {
      if (!err) {
        vm.PurchaseTrackSheetIndex = '4';
        vm.MrnDetailsAudit = data;
        $scope.step4('');
        if(vm.getCompDet == 'CH0001') {
                if (index == 4 || index == 3) {
          vm.mrnNOAudit = [];
          angular.forEach(vm.MrnDetailsAudit, function (mrn) {
             vm.net_amount = mrn.net_amount;
             vm.gross_tax = mrn.tax;
             vm.gross_discount = mrn.discount;
             vm.gross_amount = mrn.gross_amount;
             if(mrn.status.name == "Audited")
             {
               vm.Step4DataDisable = true;
             }
             else {
               vm.Step4DataDisable = false;
               return;
             }
          });
          $scope.step4('');
          // if (vm.mrnNO.length > 0) {
          //   var nos = {
          //     'mrn': vm.mrnNO
          //   }

          //   vm.getMrnDetailsAudit(nos);
          //   $scope.step4('');
          // }
        }
        }
      }
    });

  }

  // add po popup
  function calNetAmt() {
     var reg = new RegExp('^[+]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$');
            if(!reg.test(vm.tax) && vm.tax !== ''){
                if($('.alertify-log').length == 0){
                    alertify.log('Negative numbers , letters not allowed');
                }
                vm.tax = "";
            }
            if(!reg.test(vm.discount) && vm.discount !== ''){
                if($('.alertify-log').length == 0){
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
function calNetAmtCh(data) {
  if(data.po_total !== null)
  {
    data.po_total = data.qty * data.po_unit_rate;
  }
 var reg = new RegExp('^[+]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$');
            if(!reg.test(vm.tax) && vm.tax !== ''){
                if($('.alertify-log').length == 0){
                    alertify.log('Negative numbers , letters not allowed');
                }
                item.tax = "";
            }
            if(!reg.test(vm.discount) && vm.discount !== ''){
                if($('.alertify-log').length == 0){
                    alertify.log('Negative numbers , letters not allowed');
                }
              vm.discount = "";
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
     vm.grand_total = 0;
    angular.forEach($scope.mrngetDet, function(a){
        vm.grand_total += a.po_total;
        vm.grand_totalch =  vm.grand_total;
    });
     return data.po_total;
  }
  // data.po_total = 0;
  var discount = data.po_total * (data.discount / 100);
var  disTot = (data.po_total - discount);
   var taxTot = disTot * (data.tax / 100);

    data.po_total = disTot + taxTot;
    var pototal = data.po_total;
vm.grand_total = 0;
    angular.forEach($scope.mrngetDet, function(a){
        vm.grand_total += a.po_total;
        vm.grand_totalch =  vm.grand_total;
    });
   // return vm.grand_total;
  //  vm.grand_totalch = vm.grand_totalch + data.po_total;
}

// Update Purchase Order Data
  function updatePurchaseOrder(po) {
    if (vm.poTrackRemarks == "" || vm.poTrackRemarks == undefined) {
        if ($('.alertify-log-error').length == 0) {
          alertify.error('please enter remarks');
        }
        return;
      }
    if ([po].length > 0) {
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
      
      vm.getPO = [];
      vm.getPO = po.materials;
      // console.log("test",JSON.stringify(vm.getPO));

      

      
        for (var z = 0; z < vm.getPO.length; z++) {
          if(vm.getPO[z].stat == "A") {
        var status2 = "Created";
        for (var i in CONSTANTS.po_status) {
      if (status2 == CONSTANTS.po_status[i].name) {
        var status = {
          '_id': CONSTANTS.po_status[i]._id,
          'name': CONSTANTS.po_status[i].name
        }
      }
      
    }
  
      }
      if(vm.getPO[z].stat == "R") {
        var status2 = "Rejected";
        for (var i in CONSTANTS.po_status) {
      if (status2 == CONSTANTS.po_status[i].name) {
        var status = {
          '_id': CONSTANTS.po_status[i]._id,
          'name': CONSTANTS.po_status[i].name
        }
      }
      
    }
    }
        vm.poMaterial.push({
          "indent": vm.getPO[z].indent,
          "id": vm.getPO[z].id,
          "mat_code" : vm.getPO[z].mat_code,
          'name': vm.getPO[z].name,
          'sub_category_id' : vm.getPO[z].sub_category_id,
          'quantity': vm.getPO[z].quantity,
          'pending_quantity' : vm.getPO[z].pending_quantity,
          'uom': vm.getPO[z].uom,
          'size' : vm.getPO[z].size,
          'specification' : vm.getPO[z].specification,
          'tax' : vm.getPO[z].tax,
          'discount' : vm.getPO[z].discount,
          "rate": vm.getPO[z].rate,
          'status': status,
          'total': vm.getPO[z].total,
          'expected_date' : vm.getPO[z].expected_date
        })
      }
      
      // console.log("TESTING PUR",JSON.stringify(vm.poMaterial));
      for (var k = 0; k < vm.poMaterial.length; k++) {
        if (vm.poMaterial[k].indent.indexOf(',') !== -1) {
          var temp = vm.poMaterial[k].indent.split(',');
        } else {
          var temp = [vm.poMaterial[k].indent];
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
      // console.log(JSON.stringify(po));
      // alert(JSON.stringify(po.id));
      var approvedcnt = 0;
    var rejcnt = 0;
    var pendingcnt = 0;
    angular.forEach(vm.poMaterial, function (details) {
      if (details.status.name == "Created") {
        approvedcnt += 1;
      } else if (details.status.name == "Rejected") {
        rejcnt += 1;
      } else {
        pendingcnt += 1;
      }
    })

    if (rejcnt > 0 && approvedcnt == 0 && pendingcnt == 0) {
      // var status = vm.getPiStatus('Rejected');
      var  status1 = "Rejected";
      for (var i in CONSTANTS.po_status) {
      if (status1 == CONSTANTS.po_status[i].name) {
        var status = {
          '_id': CONSTANTS.po_status[i]._id,
          'name': CONSTANTS.po_status[i].name
        }
      }
    }
    } else if (approvedcnt > 0 || pendingcnt > 0) {
      var status1 = "Approved";
      for (var i in CONSTANTS.po_status) {
      if (status1 == CONSTANTS.po_status[i].name) {
        var status = {
          '_id': CONSTANTS.po_status[i]._id,
          'name': CONSTANTS.po_status[i].name
        }
      }
    }
    }
      // status = vm.getPOstatus("Approved");
         var piList = {
        'company': vm.api.company._id,
        'id' : po.id,
        "indents": vm.getIndent,
        'materials': vm.poMaterial,
        'vendor': po.vendor,
        'ordered_by': profileName,
        'remarks': po.remarks,
        'status': status,
        'branch': vm.api.profile.branch,
        'store_type': vm.api.profile.store_type,
        'tax': vm.gross_tax,
        'discount': vm.gross_discount,
        'gross_amount': vm.gross_amount,
        'net_amount': vm.net_amount,
        'contact_incharge_name' : po.contact_incharge_name,
        'contact_inchage_phone' : po.contact_inchage_phone,
        'freight_type' : po.freight_type,
        'freight_charge' : po.freight_charge,
        'loading_unloading' : po.loading_unloading,
        'loading_unloading_charge' : po.loading_unloading_charge,
        'payment_terms' : po.payment_terms,
        'discount_amount' : vm.disAmt,
        'tax_amount' : vm.taxAmt,
        'net_tax_amount' : po.net_tax_amount,
        'order_type' : po.order_type,
        'approved_remarks' : vm.poTrackRemarks,
        'project' : po.project,
        'project_code' : po.project_code,
        'category_id' : po.category_id,
        'category_name' : vm.filterCatName
      };
      // console.log("POO",JSON.stringify(piList));
      vm.updatePOStatus(piList);
      // vm.sendPIMaterial(piList);
    } else {
      if ($('.alertify-log').length == 0){
        alertify.log('Empty');
      }
    }
  }


  // Update MRN
  function updateMRNDetails(mrn) {
    // console.log("MRN",JSON.stringify(mrn));
    // if (vm.PORemarks == "") {
    //     if ($('.alertify-log-error').length == 0) {
    //       alertify.error('please enter remarks');
    //     }
    //     return;
    //   }
    if ([mrn].length > 0) {
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


      vm.poMaterial = [];
      vm.getIndent = [];
      
      vm.getMRN = [];
      vm.getMRN = mrn.materials;
      // console.log("test",JSON.stringify(vm.getMRN));

      

      
        for (var z = 0; z < vm.getMRN.length; z++) {
          if(vm.getMRN[z].stat == "A") {
        var status1 = "Created";
        for (var i in CONSTANTS.mrn_status) {
      if (status1 == CONSTANTS.mrn_status[i].name) {
        var status2 = {
          '_id': CONSTANTS.mrn_status[i]._id,
          'name': CONSTANTS.mrn_status[i].name
        }
      }
    }
    
      }
      if(vm.getMRN[z].stat == "R") {
         var status1 = "Rejected";
         for (var i in CONSTANTS.mrn_status) {
      if (status1 == CONSTANTS.mrn_status[i].name) {
        var status2 = {
          '_id': CONSTANTS.mrn_status[i]._id,
          'name': CONSTANTS.mrn_status[i].name
        }
      }
    }
      }
        vm.poMaterial.push({
          "po": vm.getMRN[z].po,
          "id": vm.getMRN[z].id,
          "mat_code" : vm.getMRN[z].mat_code,
          'name': vm.getMRN[z].name,
          'sub_category_id' : vm.getMRN[z].sub_category_id,
          'approved_quantity': vm.getMRN[z].quantity,
          'rejected_quantity' : vm.getMRN[z].pending_quantity,
          'uom': vm.getMRN[z].uom,
          'size' : vm.getMRN[z].size,
          'specification' : vm.getMRN[z].specification,
          'tax' : vm.getMRN[z].tax,
          'discount' : vm.getMRN[z].discount,
          "rate": vm.getMRN[z].rate,
          'status': status2,
          'total': vm.getMRN[z].total,
          'expected_date' : vm.getMRN[z].expected_date
        })
      }
      
      // console.log("TESTING PUR",JSON.stringify(vm.poMaterial));
      for (var k = 0; k < vm.poMaterial.length; k++) {
        if (vm.poMaterial[k].po.indexOf(',') !== -1) {
          var temp = vm.poMaterial[k].po.split(',');
        } else {
          var temp = [vm.poMaterial[k].po];
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
      // console.log(JSON.stringify(mrn));
      // console.log(JSON.stringify("PI",vm.PIdetails));
      // overall status
    var approvedcnt = 0;
    var rejcnt = 0;
    var pendingcnt = 0;
    angular.forEach(vm.poMaterial, function (details) {
      if (details.status.name == "Created") {
        approvedcnt += 1;
      } else if (details.status.name == "Rejected") {
        rejcnt += 1;
      } else {
        pendingcnt += 1;
      }
    })

    if (rejcnt > 0 && approvedcnt == 0 && pendingcnt == 0) {
      // var status = vm.getPiStatus('Rejected');
      var  status = "Rejected";
      for (var i in CONSTANTS.mrn_status) {
      if (status == CONSTANTS.mrn_status[i].name) {
         status = {
          '_id': CONSTANTS.mrn_status[i]._id,
          'name': CONSTANTS.mrn_status[i].name
        }
      }
    }
    } else if (approvedcnt > 0 || pendingcnt > 0) {
      var status = {
        "_id" : "5767b0ec69f12a0e94baa70f", 
        "name" : "Approved"
    }
    }
      // alert(JSON.stringify(po.id));
    //   status = {
    //     "_id" : "5767b0ec69f12a0e94baa70f", 
    //     "name" : "Approved"
    // }
         var poList = {
        'company': vm.api.company._id,
        'id' : mrn.id,
        'category_id': mrn.category_id,
        'category_name' : mrn.category_name,
        "invoice_no": mrn.invoice_no,
        "invoice_date" : mrn.invoice_dt,
        "po": vm.getIndent,
        "project": mrn.project,
        'materials': vm.poMaterial,
        'vendor': mrn.vendor,
        'ordered_by': profileName,
        'updated_by' : profileName,
        'remarks': mrn.remarks,
        'status': status,
        'branch': vm.api.profile.branch,
        'store_type': vm.api.profile.store_type,
        'tax': vm.gross_tax,
        'discount': vm.gross_discount,
        'gross_amount': vm.gross_amount,
        'net_amount': vm.net_amount,
        'contact_incharge_name' : mrn.contact_incharge_name,
        'contact_inchage_phone' : mrn.contact_inchage_phone,
        'freight_type' : mrn.freight_type,
        'freight_charge' : mrn.freight_charge,
        'loading_unloading' : mrn.loading_unloading,
        'loading_unloading_charge' : mrn.loading_unloading_charge,
        'payment_terms' : mrn.payment_terms,
        'discount_amount' : vm.disAmt,
        'tax_amount' : vm.taxAmt,
        'net_tax_amount' : mrn.net_tax_amount,
        'order_type' : mrn.order_type,
        'approved_by' : profileName,
        'approved_remarks' : vm.mrnTrackRemarks
      };
      // console.log("POO",JSON.stringify(poList));
      vm.updateMRNStatus(poList);
      // vm.sendPIMaterial(piList);
    } else {
      if ($('.alertify-log').length == 0){
        alertify.log('Empty');
      }
    }
  }

  vm.categoryName = categoryName;
 
  function categoryName(data) {
    var category = vm.api.company.category;
    if(data) {
           if(category) {
          var filterCat = $filter('filter')(category, { _id: data.category_id }, true)[0];
          if(vm.subCategoryList) {
              var filterSubCat = $filter('filter')(vm.subCategoryList, { _id: data.sub_category_id }, true)[0];
              vm.filterSubCatName = filterSubCat.name;
          }
          vm.filterCatName = filterCat.name; 
          return filterCat.name;
    }
    }
   
    
  }
  vm.categoryName1 = categoryName1;
 
  function categoryName1(data) {
    var category = vm.api.company.category;
    // if(data) {
    //        if(category) {
    //       var filterCat = $filter('filter')(category, { _id: data }, true)[0];
    //       vm.filterCatName = filterCat.name;
    //       return filterCat.name;
     var filterCat = $filter('filter')(category, { _id: data }, true)[0];
    return filterCat.name;    
  }

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

  api.getSubCategory({}, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        // console.log(JSON.stringify(data.subcatgoriesList));
        vm.subCategoryList = data.subcatgoriesList;
      }
    });

 

  vm.getProject = getProject;

  function getProject(proj) {
            var project = vm.api.projectList;
            if(project) {
                    var filterCat = $filter('filter')(project, { _id: proj }, true)[0];
                    // console.log("werwer",JSON.stringify(filterCat));
                    vm.proj = proj;
            return filterCat.name;
            }
            
        }


  // Update MRN Approval 2
  function updateMRNDetailsUpdate(mrn) {
    // console.log("MRN",JSON.stringify(mrn));
    if ([mrn].length > 0) {
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


      vm.poMaterial = [];
      vm.getIndent = [];
      
      vm.getMRN = [];
      vm.getMRN = mrn.materials;
      // console.log("test",JSON.stringify(vm.getMRN));
 
        for (var z = 0; z < vm.getMRN.length; z++) {
          if(vm.getMRN[z].stat == "A") {
        var status1 = "Created";
        for (var i in CONSTANTS.mrn_status) {
      if (status1 == CONSTANTS.mrn_status[i].name) {
        var status = {
          '_id': CONSTANTS.mrn_status[i]._id,
          'name': CONSTANTS.mrn_status[i].name
        }
      }
      
    }
      }
      if(vm.getMRN[z].stat == "R") {
        var status1 = "Rejected";
        for (var i in CONSTANTS.mrn_status) {
      if (status1 == CONSTANTS.mrn_status[i].name) {
        var status = {
          '_id': CONSTANTS.mrn_status[i]._id,
          'name': CONSTANTS.mrn_status[i].name
        }
      }
    }
    }
        vm.poMaterial.push({
          "po": vm.getMRN[z].po,
          "id": vm.getMRN[z].id,
          "mat_code" : vm.getMRN[z].mat_code,
          'name': vm.getMRN[z].name,
          'sub_category_id' : vm.getMRN[z].sub_category_id,
          'approved_quantity': vm.getMRN[z].quantity,
          'rejected_quantity' : vm.getMRN[z].pending_quantity,
          'uom': vm.getMRN[z].uom,
          'size' : vm.getMRN[z].size,
          'specification' : vm.getMRN[z].specification,
          'tax' : vm.getMRN[z].tax,
          'discount' : vm.getMRN[z].discount,
          "rate": vm.getMRN[z].rate,
          'status': status,
          'total': vm.getMRN[z].total,
          'expected_date' : vm.getMRN[z].expected_date
        })
      }
      
      // console.log("TESTING PUR",JSON.stringify(vm.poMaterial));
      for (var k = 0; k < vm.poMaterial.length; k++) {
        if (vm.poMaterial[k].po.indexOf(',') !== -1) {
          var temp = vm.poMaterial[k].po.split(',');
        } else {
          var temp = [vm.poMaterial[k].po];
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
      // console.log(JSON.stringify(mrn));
      var approvedcnt = 0;
    var rejcnt = 0;
    var pendingcnt = 0;
    angular.forEach(vm.poMaterial, function (details) {
      if (details.status.name == "Created") {
        approvedcnt += 1;
      } else if (details.status.name == "Rejected") {
        rejcnt += 1;
      } else {
        pendingcnt += 1;
      }
    })

    if (rejcnt > 0 && approvedcnt == 0 && pendingcnt == 0) {
      // var status = vm.getPiStatus('Rejected');
      var  status1 = "Rejected";
      for (var i in CONSTANTS.mrn_status) {
      if (status1 == CONSTANTS.mrn_status[i].name) {
        var status = {
          '_id': CONSTANTS.mrn_status[i]._id,
          'name': CONSTANTS.mrn_status[i].name
        }
      }
    }
    } else if (approvedcnt > 0 || pendingcnt > 0) {
      var status = {
        "_id" : "5767b0ec69f12a0e94baa712", 
        "name" : "Audited"
    }
    }
      
         var poList = {
        'company': vm.api.company._id,
        'category_id': mrn.category_id,
        'category_name' : mrn.category_name,
        "invoice_no": mrn.invoice_no,
        "invoice_date" : mrn.invoice_dt,
        'id' : mrn.id,
        "po": vm.getIndent,
        "project": mrn.project,
        'materials': vm.poMaterial,
        'vendor': mrn.vendor,
        'ordered_by': profileName,
        'updated_by' : profileName,
        'remarks': mrn.remarks,
        'status': status,
        'branch': vm.api.profile.branch,
        'store_type': vm.api.profile.store_type,
        'tax': vm.gross_tax,
        'discount': vm.gross_discount,
        'gross_amount': vm.gross_amount,
        'net_amount': vm.net_amount,
        'contact_incharge_name' : mrn.contact_incharge_name,
        'contact_inchage_phone' : mrn.contact_inchage_phone,
        'freight_type' : mrn.freight_type,
        'freight_charge' : mrn.freight_charge,
        'loading_unloading' : mrn.loading_unloading,
        'loading_unloading_charge' : mrn.loading_unloading_charge,
        'payment_terms' : mrn.payment_terms,
        'discount_amount' : vm.disAmt,
        'tax_amount' : vm.taxAmt,
        'net_tax_amount' : mrn.net_tax_amount,
        'order_type' : mrn.order_type,
        'approved_by' : profileName,
        'approved_remarks' : vm.mrnTrackRemarks,
        'audited_remarks' : vm.mrnAuditedRemarks,
        'audited_by' : profileName
      };
      // console.log("POO",JSON.stringify(poList));
      vm.updateMRNStatusApp(poList);
      // vm.sendPIMaterial(piList);
    } else {
      if ($('.alertify-log').length == 0){
        alertify.log('Empty');
      }
    }
  }

  vm.updatePOStatus = updatePOStatus;
  function updatePOStatus(udpatePO) {
    vm.api.poListUpdate(udpatePO, function (err, data) {
      if (err) {
        //alert(JSON.stringify(err));
      }
      else {
        if ($('.alertify-log-success').length == 0) {
      alertify.success(data);
      }
      vm.Step2DataDisable = true;
      document.getElementById("updatePO").style.display = "none";
      // console.log(JSON.stringify(udpatePO));
    PoNo = {"po":[udpatePO.id]};
    // console.log(JSON.stringify(PoNo));
      // $scope.step3('');
      vm.getPODetails(PoNo);
      }
      
    });
  }

  vm.updateMRNStatus = updateMRNStatus;
  function updateMRNStatus(udpateMRN) {
    vm.api.mrnListUpdate(udpateMRN, function (err, data) {
      if (err) {
        //alert(JSON.stringify(err));
      }
      else {
        if ($('.alertify-log-success').length == 0) {
      alertify.success("Successfully Updated");
      }
      vm.Step3DataDisable = true;
      var  mrnNoDet = {'mrn':[udpateMRN.id]};
      // console.log(JSON.stringify(mrnNoDet));
      document.getElementById("updateMRN").style.display = "none";
      vm.getMrnDetails(mrnNoDet);
      }
      
    });
  }

  vm.updateMRNStatusApp = updateMRNStatusApp;
  function updateMRNStatusApp(udpateMRN) {
    vm.api.mrnListUpdate(udpateMRN, function (err, data) {
      if (err) {
        //alert(JSON.stringify(err));
      }
      else {
        if ($('.alertify-log-success').length == 0) {
      alertify.success("Successfully Updated");
      }
      vm.Step4DataDisable = true;
      document.getElementById("updateMRN").style.display = "none";
      $scope.step4('');
      // vm.getPODetails(udpatePO);
      }
      
    });
  }

  function calunitRateRed(data) {
      if(data.rate == "" || data.rate == undefined || data.rate == 0 || data.stat == "R") {
    data.total = 0;
    data.quantity = 0;
    vm.net_amount = 0;
    for(var i=0;i<vm.PurchaseOrderDetails.length;i++) {
      vm.matDet = vm.PurchaseOrderDetails[i].materials;
      // vm.matTotal = vm.matDet[i].total;
    }
    angular.forEach( vm.matDet, function(a){
        vm.net_amount += a.total;
        vm.gross_amount =  vm.net_amount;
    });
     return data.total;
  }
  else {
    if(data.stat == "A") {
      data.quantity = data.pending_quantity;
    }
    data.total = data.rate * data.quantity;
    vm.net_amount = 0;
    var discount = data.total * (data.discount / 100);
var  disTot = (data.total - discount);
   var taxTot = disTot * (data.tax / 100);

   var tax = data.total * (data.tax / 100);
   data.total = disTot + taxTot;
   vm.matTax = tax;
    vm.matDet = '';
    for(var i=0;i<vm.PurchaseOrderDetails.length;i++) {
      vm.matDet = vm.PurchaseOrderDetails[i].materials;
      // vm.matTotal = vm.matDet[i].total;
    }
    vm.matTotal = 0;
    angular.forEach( vm.matDet, function(a){
      
   vm.totalMat = 0;

    vm.totalMat = a.total;
        vm.matTotal += vm.totalMat;
//         vm.gross_amount =  vm.net_amount;
    });
//     vm.matDet = vm.PurchaseOrderDetails.materials;
    angular.forEach( vm.PurchaseOrderDetails, function(a){
        vm.net_amount += vm.matTotal;
        var discount = vm.net_amount * (a.discount / 100);

    // var tax = (ltotal * ltax)/100;
    var disTot = (vm.net_amount - discount);
    vm.disAmt = discount;
    var tax = vm.net_amount * (a.tax / 100);
    vm.taxAmt = tax;

    var taxTot = disTot * (a.tax / 100);

        vm.gross_amount =  disTot + taxTot  + a.freight_charge + a.loading_unloading_charge;
    });
     return data.total;
  }
  }


  function calunitRateRedMRN(data) {
      if(data.rate == "" || data.rate == undefined || data.rate == 0 || data.stat == "R") {
    data.total = 0;
    data.quantity = 0;
    vm.net_amount = 0;
    for(var i=0;i<vm.MrnDetails.length;i++) {
      vm.matDet = vm.MrnDetails[i].materials;
      // vm.matTotal = vm.matDet[i].total;
    }
    vm.matTotal = 0;
    angular.forEach( vm.matDet, function(a){
      
        vm.matTotal += a.total;
//         vm.gross_amount =  vm.net_amount;
    });
    angular.forEach( vm.MrnDetails, function(a){
        vm.net_amount += vm.matTotal;
        var discount = vm.net_amount * (a.discount / 100);

    // var tax = (ltotal * ltax)/100;
    var disTot = (vm.net_amount - discount);
    vm.disAmt = discount;
    var tax = vm.net_amount * (a.tax / 100);
    vm.taxAmt = tax;

    var taxTot = disTot * (a.tax / 100);
        vm.gross_amount =  disTot + taxTot  + a.freight_charge + a.loading_unloading_charge;
    });
     return data.total;
  }
  else {
    if(data.stat == "A") {
      data.quantity = data.received_quantity;
    }
    data.total = data.rate * data.quantity;
    vm.net_amount = 0;
    var discount = data.total * (data.discount / 100);
var  disTot = (data.total - discount);
   var taxTot = disTot * (data.tax / 100);

   var tax = data.total * (data.tax / 100);
   vm.matTax = tax;

    data.total = disTot + taxTot;
    vm.matDet = '';
    for(var i=0;i<vm.MrnDetails.length;i++) {
      vm.matDet = vm.MrnDetails[i].materials;
      // vm.matTotal = vm.matDet[i].total;
    }
    vm.matTotal = 0;
    angular.forEach( vm.matDet, function(a){
      
        vm.matTotal += a.total;
//         vm.gross_amount =  vm.net_amount;
    });
//     vm.matDet = vm.PurchaseOrderDetails.materials;
    angular.forEach( vm.MrnDetails, function(a){
        vm.net_amount += vm.matTotal;
        var discount = vm.net_amount * (a.discount / 100);

    // var tax = (ltotal * ltax)/100;
    var disTot = (vm.net_amount - discount);
    vm.disAmt = discount;
    var tax = vm.net_amount * (a.tax / 100);
    vm.taxAmt = tax;

    var taxTot = disTot * (a.tax / 100);

        vm.gross_amount =  disTot + taxTot  + a.freight_charge + a.loading_unloading_charge;
    });
     return data.total;
  }
  }

  function calunitRateRedMRNAudit(data) {
      if(data.rate == "" || data.rate == undefined || data.rate == 0 || data.stat == "R") {
    data.total = 0;
    data.quantity = 0;
    vm.net_amount = 0;
    for(var i=0;i<vm.MrnDetailsAudit.length;i++) {
      vm.matDet = vm.MrnDetailsAudit[i].materials;
      // vm.matTotal = vm.matDet[i].total;
    }
    angular.forEach( vm.matDet, function(a){
        vm.net_amount += a.total;
        vm.gross_amount =  vm.net_amount;
    });
     return data.total;
  }
  else {
    if(data.stat == "A") {
      data.quantity = data.received_quantity;
    }
    data.total = data.rate * data.quantity;
    vm.net_amount = 0;
    var discount = data.total * (data.discount / 100);
var  disTot = (data.total - discount);
   var taxTot = disTot * (data.tax / 100);

   var tax = data.total * (data.tax / 100);
   vm.matTax = tax;

    data.total = disTot + taxTot;
    vm.matDet = '';
    for(var i=0;i<vm.MrnDetailsAudit.length;i++) {
      vm.matDet = vm.MrnDetailsAudit[i].materials;
      // vm.matTotal = vm.matDet[i].total;
    }
    vm.matTotal = 0;
    angular.forEach( vm.matDet, function(a){
      
        vm.matTotal += a.total;
//         vm.gross_amount =  vm.net_amount;
    });
//     vm.matDet = vm.PurchaseOrderDetails.materials;
    angular.forEach( vm.MrnDetailsAudit, function(a){
        vm.net_amount += vm.matTotal;
        var discount = vm.net_amount * (a.discount / 100);

    // var tax = (ltotal * ltax)/100;
    var disTot = (vm.net_amount - discount);
    vm.disAmt = discount;
    var tax = vm.net_amount * (a.tax / 100);
    vm.taxAmt = tax;

    var taxTot = disTot * (a.tax / 100);

        vm.gross_amount =  disTot + taxTot  + a.freight_charge + a.loading_unloading_charge;
    });
     return data.total;
  }
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
    // vm.SelectedVendor = "Select Vendor";
    document.getElementById("viewCartPO").style.visibility = "hidden";
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
    vm.api.vendorList(vendorList, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        vm.vendorTypeList = data;
        vm.api.vendorallList = data;
      }
    });
  }

  // Insert Purchase Order Data
  function insertPurchaseOrder(status) {
     if (vm.PORemarks == "") {
      if ($('.alertify-log-error').length == 0) {
        alertify.error("Please enter remarks");
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
      if(vm.getCompDet !== 'CH0001' && vm.getCompDet == 'CO00001') {
      for (var z = 0; z < vm.pogetDet.length; z++) {
        vm.poMaterial.push({
          "indent": vm.pogetDet[z].pi_no,
          "id": vm.pogetDet[z].id,
          'name': vm.pogetDet[z].material,
          'category': vm.pogetDet[z].category,
          'quantity': vm.pogetDet[z].qty,
          'uom': vm.pogetDet[z].UOM,
          "pending_quantity": vm.pogetDet[z].qty,
          "rate": vm.pogetDet[z].po_unit_rate,
          'status': status,
          'total': vm.pogetDet[z].po_total
        })
      }
      }
      else {
        for (var z = 0; z < vm.pogetDet.length; z++) {
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
          'total': vm.pogetDet[z].po_total
        })
      }

      }
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
      }

      if(vm.freightType == "Company") {
        vm.freight_total = 0;
      }
      if(vm.loadType == "Company") {
        vm.load_total = 0;
      }
      vm.api.vendor = vm.SelectedVendor;
    for (var i = 0; i < vm.vendorsList.length; i++) {
      if (vm.vendorsList[i]['_id'] == vm.SelectedVendor) {
        vm.vendor = vm.vendorsList[i]['id'];
      }
    }

      status = vm.getPOstatus("Created");
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
      // var json = angular.toJson( vm.materialList );
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
        'net_amount': vm.grand_total
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
         }
      }
      // console.log(JSON.stringify(piList));
      vm.sendPIMaterial(piList);
    } else {
      if ($('.alertify-log-success').length == 0) {
      alertify.success('Empty');
      }
    }
  }

  // Api Call for Adding  PO
  function sendPIMaterial(material) {
    api.poList(material, function (err, data) {
      if (err) {
        //alert(JSON.stringify(err));
      } else {
        // console.log(data);
        $('#addpopup').modal('toggle');
        if ($('.alertify-log-success').length == 0) {
          alertify.success(data.message);
        }
        vm.closePI(vm.getIndent);
        PoNo = {"po":[data.POid]};
        vm.getPODetails(PoNo);
        $scope.step2('');
        vm.close();
        vm.SelectedVendor ="";
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

  $('.search-panel .dropdown-menu').find('a').click(function (e) {
    e.preventDefault();
    var param = $(this).attr("title").replace("#", "");
    var concept = $(this).text();
    $('.search-panel span#search_concept').text(concept);
    $('.input-group #search_param1').val(param);
    vm.searchType = param;
      // $("#srhDt1").show();
      // $("#srhTxt1").hide();
    
    // else {
    //   $("#srhDt1").show();
    //   $("#srhTxt1").hide();
    // }
  });


  // Datepicker
  $('.input-group.date').datepicker({
    calendarWeeks: true,
    todayHighlight: true,
    autoclose: true,
    endDate: '+0d',
    closeText: 'Clear',
    clearBtn: false
  });

   


  $scope.$on('pogetDetails', function (e, data) {

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
          vm.grand_totalch = vm.po_total;
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
          vm.po_total = parseInt(vm.po_total) - parseInt(data[itemIndex].po_total);
          vm.grand_totalch = vm.po_total;
          angular.element(document.getElementById('poAct' + data[itemIndex].pi_no + data[itemIndex].ctrlIndex)).html('<i class="fa fa-plus fa-lg" aria-hidden="true"></i>');
          // console.log(vm.pogetDet[index].qty);
          if (parseInt(vm.pogetDet[index].qty) <= 0) {

            var index = $scope.poGetDet.indexOf(vm.pogetDet[index]);
            $scope.poGetDet.splice(index, 1);
            vm.count = $scope.poGetDet.length;
            if(vm.count == 0) {
         document.getElementById("viewCartPO").style.visibility = "hidden";
  }
  else{
          document.getElementById("viewCartPO").style.visibility = "visible";
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
         document.getElementById("viewCartPO").style.visibility = "hidden";
  }
  else{
          document.getElementById("viewCartPO").style.visibility = "visible";
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
         document.getElementById("viewCartPO").style.visibility = "hidden";
  }
  else{
          document.getElementById("viewCartPO").style.visibility = "visible";
  }
    }
  })

  $scope.$on('count', function (e, data) {
    var count = data;
    vm.count = count;
  })

  api.vendorDDL(vm.vendorInitial, function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      vm.vendorsList = data.vendorsList;
      vm.api.vendorallList = data.vendorsList;
    }
  });


  function poopenNav() {
    document.getElementById("poSidenav").style.display = "block";
    document.getElementById("poSidenav").style.width = "100%";
    document.getElementById("poSidenav").style.marginTop = "0%";
    document.getElementById("pofullClose").style.display = "none";
    document.getElementById("pocloseNav").style.display = "block";
    document.getElementById("pomain").style.display = "none";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }

  function pocloseNav() {
    document.getElementById("poSidenav").style.display = "none";
    document.getElementById("pofullClose").style.display = "block";
    document.getElementById("pocloseNav").style.display = "none";
    document.getElementById("pomain").style.display = "block";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }

  function ModalClose() {
    vm.pogetDet = [];
    vm.vendorTypeList = [];
    $scope.poGetDet = [];
    vm.PORemarks = [];
    vm.count = '0';
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
    vm.fromProject1 = '';
    vm.category = '';
    $scope.mrngetDet = [];
    vm.SelectedVendor = "Select Vendor";
  }
  // mrn details
  function mrncalNetAmt() {
    var reg = new RegExp('^[+]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$');
            if(!reg.test(vm.mrntax) && vm.mrntax !== ''){
                if($('.alertify-log').length == 0){
                    alertify.log('Negative numbers , letters not allowed');
                }
                vm.mrntax = "";
            }
            if(!reg.test(vm.mrndiscount) && vm.mrndiscount !== ''){
                if($('.alertify-log').length == 0){
                    alertify.log('Negative numbers , letters not allowed');
                }
                vm.mrndiscount = "";
            }
    var discount = vm.mrnPo_total * (vm.mrndiscount / 100);

    // var tax = (ltotal * ltax)/100;
    var disTot = (vm.mrnPo_total - mrndiscount);

    var taxTot = disTot * (vm.mrntax / 100);

    vm.mrngrand_total = disTot + taxTot;
  }

  vm.vendorMaterials = [];
  vm.vendorMat = [];
  // Get PI List based on Vendor
  $scope.getVendorList = function (vendor) {
    vm.vendorMat = [];
    vm.vendorTypeList = [];
    $scope.mrngetDet = [];
    vm.count = 0;
    vm.po_total = 0;
    vm.tax = 0;
    vm.discount = 0;
    vm.grand_total = 0;
    if(vm.count == 0) {
         document.getElementById("viewCart").style.visibility = "hidden";
  }
    if (vendor == null) {
      vm.vendorTypeList = [];
      vm.vendorMat = [];
      return;
    }
    vm.api.vendor = vendor;
    for (var i = 0; i < vm.vendorsList.length; i++) {
      if (vm.vendorsList[i]['_id'] == vendor) {
        vm.vendor = vm.vendorsList[i]['id'];
      }
    }
    var vendorList = {
      "status" : "57650efb818d3b1cd808c401",
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
        vm.api.vendorallList = data;
      }
    });
  }

  function mrnopenNav() {
    document.getElementById("mrnSidenav").style.display = "block";
    document.getElementById("mrnSidenav").style.width = "100%";
    document.getElementById("mrnSidenav").style.marginTop = "0%";
    document.getElementById("mrnfullClose").style.display = "none";
    document.getElementById("mrncloseNav").style.display = "block";
    document.getElementById("mrnmain").style.display = "none";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    $('#srhDt1').datepicker('setDate', 'today');
  }

  function mrncloseNav() {
    document.getElementById("mrnSidenav").style.display = "none";
    document.getElementById("mrnfullClose").style.display = "block";
    document.getElementById("mrncloseNav").style.display = "none";
    document.getElementById("mrnmain").style.display = "block";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    $('#srhDt1').datepicker('setDate', 'today');
  }

  function mrnopenNav1() {
    document.getElementById("mrnrightnav").style.display = "block";
    document.getElementById("mrnrightnav").style.width = "45%";
    document.getElementById("mrnrightnav").style.height = "100%";
    document.getElementById("mrnrightnav").style.marginLeft = "60%";
    document.getElementById("mrnrightnav").style.marginTop = "-4%";
    document.getElementById("mrnrightnav").style.borderLeft = "1px solid #CCC";
    document.getElementById("mrnCount").style.display = "none";
    document.getElementById("mrnmain").style.overflow = "hidden";
    document.getElementById("mrnpopup").style.overflow = "hidden";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    $('#srhDt1').datepicker('setDate', 'today');
  }



  function mrncloseNav1() {
    document.getElementById("mrnrightnav").style.display = "none";
    document.getElementById("mrnCount").style.display = "block";
    document.getElementById("mrnCount").style.marginLeft = "95%";
    document.getElementById("main").style.overflow = "scroll";
    document.getElementById("mrnpopup").style.overflow = "scroll";
    document.body.style.backgroundColor = "white";
  }

  function poopenNav1() {
    document.getElementById("porightnav").style.display = "block";
    document.getElementById("porightnav").style.width = "40%";
    document.getElementById("porightnav").style.height = "100%";
    document.getElementById("porightnav").style.marginLeft = "60%";
    document.getElementById("porightnav").style.marginTop = "-4%";
    document.getElementById("porightnav").style.borderLeft = "1px solid #CCC";
    document.getElementById("poCount").style.display = "none";
    document.getElementById("addpopup").style.overflow = "hidden";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }



  function pocloseNav1() {
    document.getElementById("porightnav").style.display = "none";
    document.getElementById("poCount").style.display = "block";
    document.getElementById("poCount").style.marginLeft = "93%";
    // document.getElementById("main").style.overflow = "scroll";
    document.getElementById("addpopup").style.overflow = "scroll";
    document.body.style.backgroundColor = "white";
  }

  function closePO(poNo) {
    poNoRes = poNo;
    var poUpdate = {
      'po': poNo
    }
    var poListUpdate = {
      'id': poNo,
      'status': {
        "_id": "578f673c3d4dce0370afed48",
        "name": "Manual Closed"
      }
    }
    vm.api.poListUpdate(poListUpdate, function (err, data) {
      if (err) {
        //alert(JSON.stringify(err));
      }
      else {
      }
      if ($('.alertify-log-success').length == 0) {
      alertify.success(data);
      }
      document.getElementById(poNo).style.display = "none";
    });
  }

  vm.getPOstatus = getPOstatus;
  vm.getPIstatus = getPIstatus;
  vm.getMRNStatus = getMRNstatus;

  function getPOstatus(status) {
    for (var i in CONSTANTS.po_status) {
      if (status == CONSTANTS.po_status[i].name) {
        var status = {
          '_id': CONSTANTS.po_status[i]._id,
          'name': CONSTANTS.po_status[i].name
        }
      }
    }
    return status;
  }

  function getPIstatus(status) {
    var stat = CONSTANTS.pi_status;
    angular.forEach(stat, function (stats) {
      if (staus == stats.name)
        var status = {
          '_id': stats._id,
          'name': stats.name
        }
    })
    return status;
  }

  function getMRNstatus(status) {
    var stat = CONSTANTS.mrn_status;
    angular.forEach(stat, function (stats) {
      if (status == stats.name)
        var status = {
          '_id': stats._id,
          'name': stats.name
        }
    })
    return status;
  }

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
          vm.po_total = vm.mrngetDet[index].po_total;
          vm.net_amount = vm.mrngetDet[index].po_total;
          vm.grand_total = vm.po_total;
          vm.grand_totalch = vm.po_total;
           vm.grand_totalch1 = vm.net_amount;
          vm.mrngetDet[index].pi_no += "," + data[itemIndex].pi_no;
          angular.element(document.getElementById('mrnAct' + data[itemIndex].pi_no + data[itemIndex].ctrlIndex)).html('<i class="fa fa-minus fa-lg" aria-hidden="true"></i>');
        }
        else {
          $("#notificationMRN").animate({
        top: '-65px',
    });
    document.getElementById("notificationMRN").innerText="Your MRN has been removed";
          vm.mrngetDet[index].qty = parseInt(vm.mrngetDet[index].qty) - parseInt(data[itemIndex].qty);
          vm.mrngetDet[index].po_total = vm.mrngetDet[index].qty * vm.mrngetDet[index].po_unit_rate;
          // vm.po_total = vm.mrngetDet[index].po_total;
          vm.po_total = parseInt(vm.po_total) - parseInt(data[itemIndex].po_total);
          vm.grand_total = vm.po_total;
          vm.grand_totalch = vm.po_total;
          vm.grand_totalch1 = vm.net_amount;
          angular.element(document.getElementById('mrnAct' + data[itemIndex].pi_no + data[itemIndex].ctrlIndex)).html('<i class="fa fa-plus fa-lg" aria-hidden="true"></i>');
          // console.log(vm.mrngetDet[index].qty);
          if (parseInt(vm.mrngetDet[index].qty) <= 0) {

            var index = $scope.mrngetDet.indexOf(vm.mrngetDet[index]);
            $scope.mrngetDet.splice(index, 1);
            vm.count = $scope.mrngetDet.length;
            if(vm.count == 0) {
         document.getElementById("viewCart").style.visibility = "hidden";
  }
  else{
          document.getElementById("viewCart").style.visibility = "visible";
  }

          }
        }

        // console.log($scope.mrngetDet);
        return;
      }

    }


    if (actFlg.indexOf("fa-plus") !== -1) {
      vm.po_total = parseInt(vm.po_total) + parseInt(data[itemIndex].po_total);
      vm.grand_total = vm.po_total;
      vm.grand_totalch = vm.po_total;
      angular.element(document.getElementById('mrnAct' + data[itemIndex].pi_no + data[itemIndex].ctrlIndex)).html('<i class="fa fa-minus fa-lg" aria-hidden="true"></i>');
      $scope.mrngetDet.push(data[itemIndex]);
      vm.mrngetDet = $scope.mrngetDet;
      vm.count = vm.mrngetDet.length;
      if(vm.count == 0) {
         document.getElementById("viewCart").style.visibility = "hidden";
  }
  else{
          document.getElementById("viewCart").style.visibility = "visible";
  }
    }
    else {
      vm.po_total = parseInt(vm.po_total) - parseInt(data[itemIndex].po_total);
      vm.grand_total = vm.po_total;
      vm.grand_totalch = vm.po_total;
      angular.element(document.getElementById('mrnAct' + data[itemIndex].pi_no + data[itemIndex].ctrlIndex)).html('<i class="fa fa-plus fa-lg" aria-hidden="true"></i>');

      var index = $scope.mrngetDet.indexOf(data[itemIndex]);
      $scope.mrngetDet.splice(index, 1);

      //  $scope.poGetDet.push(data[0]);
      vm.mrngetDet = $scope.mrngetDet;
      vm.count = vm.mrngetDet.length;
      if(vm.count == 0) {
         document.getElementById("viewCart").style.visibility = "hidden";
  }
  else{
          document.getElementById("viewCart").style.visibility = "visible";
  }
    }
  })

  // Insert Purchase Order Data
  vm.shrDt1 = "";
  function insertMRN(status) {
    var flag = 0;
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
 if(vm.getCompDet == 'CO00001') {
      if (vm.po_total == "" || vm.po_total == 0) {
        if ($('.alertify-log').length == 0) {
        alertify.log('Please enter quantity');
        }
        return;
      }
    }
      if (vm.invoiceNo == "") {
        if ($('.alertify-log-error').length == 0) {
          alertify.error("Please enter Invoice no");
        }
        return;
      }
if(vm.getCompDet == 'CH0001')
{
  if (vm.invoiceNo == "") {
        if ($('.alertify-log-error').length == 0) {
          alertify.error("Please enter Invoice no");
        }
        return;
}
}
      if(vm.srhDt1 == undefined) {
        // vm.srhDt1 = new Date();
        var date = new Date();
        var day = date.getDate();
var monthIndex = date.getMonth() + 1;
var year = date.getFullYear();
if(monthIndex < 10) {
  if(day < 10) {
    vm.srhDt1 = year + "-0" + monthIndex + "-0" + day; 
  }
  else{
    vm.srhDt1 = year + "-0" + monthIndex + "-" + day; 
  }

}
else {
  vm.srhDt1 = year + "-" + monthIndex + "-" + day; 
}

      }

      if (vm.srhDt1 == undefined) {
        if ($('.alertify-log-error').length == 0) {
        alertify.error("Please enter Invoice Date");
        }
          return ;
      }

      for(var k=0;k < vm.mrngetDet.length;k++) {
             if (vm.mrngetDet[k].quantity == "") {
        if ($('.alertify-log-error').length == 0) {
        alertify.error("Please enter Quantity");
        }
        return;
      }
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

      if(vm.tax == '')  {
        vm.tax = '0';
      }
      if(vm.discount == '') {
        vm.discount = '0';
      }

      vm.poMaterial = [];
      vm.getOrder = [];
      
      for (var z = 0; z < vm.mrngetDet.length; z++) {
        if(vm.mrngetDet[z].pending_quantity == 0) {
          vm.mrngetDet[z].quantity = vm.mrngetDet[z].qty;
        }
         vm.project = vm.mrngetDet[z].project;
          var project = vm.api.projectList;
            if(project) {
        var filterProj = $filter('filter')(project, { _id: vm.project }, true)[0];
        vm.filterProjCode = filterProj.short_code;
                 //   console.log("werwer",JSON.stringify(filterProj));
            }
             vm.type = vm.mrngetDet[z].order_type;
         if (vm.getCompDet == "CO00001") {
        vm.poMaterial.push({
          "po": vm.mrngetDet[z].pi_no,
          "id": vm.mrngetDet[z].id,
          'name': vm.mrngetDet[z].material,
          'category': vm.mrngetDet[z].category,
          'quantity' : vm.mrngetDet[z].qty,
          'received_quantity': vm.mrngetDet[z].quantity,
          'uom': vm.mrngetDet[z].UOM,
          "pending_quantity": vm.mrngetDet[z].pending_quantity.toString(),
          "rate": vm.mrngetDet[z].po_unit_rate,
          "status": status,
          'total': vm.mrngetDet[z].po_total
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
// console.log(JSON.stringify(vm.poMaterial));

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
        'branch': vm.api.profile.branch,
        'store': vm.api.profile.store,
        'store_type': vm.api.profile.store_type,
        "invoice_no": vm.invoiceNo,
        "invoice_dt" : vm.srhDt1,
        "po": vm.getOrder,
        'materials': vm.poMaterial,
        'created_by': profileName,
        'vendor': vm.vendor,
        'remarks': vm.mrnRemarks,
        'status': status,
        'tax': vm.tax,
        'discount': vm.discount,
        'gross_amount': vm.po_total,
        'net_amount': vm.grand_total
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
          "invoice_dt": vm.srhDt11,
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
      if ($('.alertify-log-success').length == 0) {
      alertify.success('Empty');
      }
    }
  }



  // Api Call for Adding  PO
  function sendPOMaterial(material) {
    api.mrnList(material, function (err, data) {
      if (err) {
        //alert(JSON.stringify(err));
      } else {
        // console.log(data);
        $('#mrnpopup').modal('toggle');
        if ($('.alertify-log-success').length == 0) {
          alertify.success(data.message);
        }
        mrnNo = {'mrn':[data.MRNid]};
        vm.getMrnDetails(mrnNo);
        vm.closeMRN(vm.getOrder);
        $scope.step3('');
        vm.SelectedVendor = "";
        // $state.go("master.mrn");
        // vm.mrnGridBind(false, begin, vm.ddlRows, '1');
        vm.close();
      }
    });
  }

  function closeMRN(getOrder){
    var po = {
      'po' : getOrder
    }
    vm.api.getPObyIds(po, function(err, data) {
      if(!err){
        angular.forEach(data, function(d){
          var pending = $filter('filter')(d.materials, function(a){
            return a.pending_quantity > 0;
          })
          if(pending.length == 0){
            var poListUpdate = {
              'id' : d.id,
              'status' : {
                    "_id": "57650efb818d3b1cd808c402",
                    "name": "Closed"
          }
            }
            vm.api.poListUpdate(poListUpdate , function (err,data)
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

  function calculateTotal(item) {
    item.po_total = item.quantity * item.po_unit_rate;
    vm.po_total = 0;
    angular.forEach($scope.mrngetDet, function(a){
        vm.po_total += a.po_total;
        vm.grand_total =  vm.po_total;
    });

    var reg = new RegExp('^[0-9]+$');
            if(!reg.test(item.quantity) && item.quantity !== ''){
                if($('.alertify-log').length == 0){
                    alertify.log('Only numbers are allowed');
                }
                item.quantity = "";
                vm.grand_total = '';
                vm.tax = '';
                vm.discount = '';
                item.po_total = '';
                 angular.forEach($scope.mrngetDet, function(a){
                   vm.po_total = 0;  
        vm.po_total += a.po_total;
         vm.grand_total = vm.po_total;
        vm.tax = 0;
        vm.discount = 0;
    });
            }
    

    var appQty = JSON.parse(item.quantity);
    var qtyReq = JSON.parse(item.qty);
    if (appQty > qtyReq) {
      item.quantity = ""
      if($('.alertify-log').length == 0){
      alertify.log("You cannot enter quantity more than requested quantity"); 
      }
      item.po_total = '';
      angular.forEach($scope.mrngetDet, function(a){
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

  vm.exportExcel = exportExcel;

   function exportExcel(data) {            
    var exTable = $('#'+data).clone(); 
    exTable.find('.noExl').remove();              
    exTable.table2excel({
            exclude: ".noExl",
            name: "Purchase Order Details",
            filename: "Purchase Order Details",
            fileext: ".xls",  
            exclude_img: true,
            exclude_links: true,
            exclude_inputs: false         
        });       
    }

    vm.getBranchName = getBranchName;
    function getBranchName(id){
        var branchname = $filter('filter')(vm.api.company.branches, {_id:id}, true)[0];
        return branchname.name;
    }
vm.getvendorName = getvendorName;
function getvendorName(vendorid)
{
  if(vendorid) {
       var ven = $filter('filter')(vm.vendorsList , { id : vendorid },true)[0];
       if(ven) {
            return ven.name;
       }
     
  }
    
}
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
     "project": vm.project
    }
      api.vendorMRNList(vendorList, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
         vm.vendorTypeList = data;
         vm.vendorMRNList = data;
         vm.vendorMrnLen = vm.vendorMRNList.length;
        vm.api.vendorallList = vm.vendorTypeList;
      }
    });

  }
   vm.mrn_discount = 0;
  vm.mrn_tax = 0;
  vm.gross_tax = 0;
  vm.gross_discount = 0;
  vm.calunitRate1 = calunitRate1;
  vm.calGrossAmtCh1 = calGrossAmtCh1;
  vm.load_total = 0;
  vm.freight_charge = 0;
  vm.po_taxCH = 0;
  vm.po_discountCH = 0;
  vm.grand_totalch= 0;
 

  function calunitRate1(data) {
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
   //   data.quantity = data.qty;
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
    //  vm.grand_totalch1 = data.po_total;
      return data.po_total;

    }
  }

  function calGrossAmtCh1(data) {
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

}