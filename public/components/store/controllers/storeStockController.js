'use strict';
angular.module('todo.settings.controllers')
  .controller('storeStockController', storeStockController);
storeStockController.$inject = ['$scope', '$state', 'api', '$timeout', 'storage', '$filter'];
function storeStockController($scope, $state, api, $timeout, storage, $filter) {
  var vm = this;
  vm.api = api;
  $scope.step = 1;
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
  vm.reload = reload;
  vm.searchTxt = searchTxt;
  var initializing = true;
  vm.close = close;
  vm.getsubCategory = getsubCategory;
  vm.stockUpdate = stockUpdate;
  vm.addRow = addRow;
  vm.newStockReq = newStockReq;
  vm.sendnewStockRequest = sendnewStockRequest;
  vm.catecall = catecall;
  vm.status = "Active";
  vm.addRow1 = addRow1;
  // Default DDL Select
  // vm.ddlRows = "10";
  vm.ddlRowsApp = "10";
  vm.searchType = 'srhPro';
  vm.srhSubCate = '';
  vm.srhDt = '';
  vm.srhCate = '';
  vm.srhPro = '';
  vm.materialType = "Consumable";
  vm.materialDuplicate = materialDuplicate;
  vm.getMaterial = getMaterial;
  vm.issuedAvl = 0;

  vm.api.project = "";

  var category = vm.api.company.category;
  vm.categoryList = category;
  vm.api.getcat = vm.categoryList;
  vm.addClear = addClear;
  function addClear() {
    vm.newStockAdd = [];
    vm.returnStockAdd = [];
    vm.api.project = vm.project;
  }
  function materialDuplicate() {
    var flag = 0;
    vm.issuedAvl = 0;
   var materials = [];
    var mat = [];
    for(var i = 0; i < vm.newStockAdd.length; i++){
      for(var j = 1; j < vm.newStockAdd.length; j++){
        if(vm.newStockAdd[i].name == vm.newStockAdd[j].name){
          vm.issuedAvl += parseInt(vm.newStockAdd[i].issuedQty);
      }
      }
    }
          if(vm.issuedAvl > vm.newStockAdd[0].available_quantity){
            if ($('.alertify-log').length == 0) {
            alertify.error("please check available quantity for "+ vm.newStockAdd[0].name + " material");
            flag = 1;
              }
        return flag;
      }
        
    }
  
  //get contract
  vm.api.contractorGrid({}, function (err, data) {
    if (!err) {
      vm.api.getContractor = data.contractorList;

    }
  });

  vm.api.exeDDL({}, function (err, data) {
    if (!err) {
      vm.api.employeeList = data;
    }
  });
  //get sizelist
  vm.api.getsizeList({}, function (err, data) {
    if (!err) {
      vm.api.getSizeList = data.materialSizeList;
    }
  });

  //get subcategory
  vm.api.subCategoryGrid({}, function (err, data) {
    if (!err) {
      vm.subcate = data.subcatgoriesList;
      vm.api.getSub = vm.subcate;
    }
  });
  // CH Changes Starts
  function getMaterial(data) {
    // vm.clear();
    vm.newStockAdd = [];
    // vm.item.category = 'Select Material';
    if (data) {
      var category = {
        "category": vm.category,
        "sub_category": data
      };

      vm.api.getUom({}, function (err, data) {
        if (!err) {
          vm.uomList = data.uomList;
          vm.api.mrUOM = vm.uomList;
        } else {
          // alert('no data');
        }
      });
      vm.api.getsizeList(category, function (err, data) {
        if (!err) {
          vm.sizeList = data.materialSizeList;
          vm.api.getSize = vm.sizeList;
        }
      });
      vm.api.materialLists(category, function (err, data) {
        if (err) {
          //alert("no data");
        } else {
          vm.materialdet = data.materialsList;
          vm.api.getMatId = vm.materialdet;
        }
      })
    } else {
      //  vm.materialType = "";
      //vm.item.uom = "";
      // vm.item.avlquantity = "";
    }
  }

  //get category 
  function catecall() {
    vm.category = "";
    var category = vm.api.company.category;
    vm.categoryList = category;
  }

  //get projectlist
  // vm.api.proGrid({}, function (err, data) {
  //   if (!err) {
  //     vm.projectList = data.projectList;
  //     vm.api.projectList = data.projectList;
  //   }
  // });
  var Employee = {
    "empID": vm.api.profile._id
}
 vm.project  = "";
vm.api.proGrid(Employee, function (err, data) {
    if (!err) {
      vm.projectList = data.projectList;
       vm.api.projectList = vm.projectList;
     // vm.api.projectList = data.projectList;
    }
  });

  //get subCategoryList
  function getsubCategory(data) {
    vm.newStockAdd = [];
    vm.issuedDt = "";
    vm.issuedNo = "";
    var category = {
      "catID": data
    }
    vm.api.getSubCategory(category, function (err, data) {
      if (err) {
        //laert("No Data");
      } else {
        vm.subCategoryList = data.subcatgoriesList;
        //  alert(JSON.stringify(data.))
      }
    });
    vm.api.contractorGrid(category, function (err, data) {
      if (!err) {
        vm.api.getContractor = data.contractorsList;
      }
    });
  }

  //for grid 
  function stockUpdate(isSrh, begin, end) {
    var filterSearch = {
      "limit": end,
      "skip": begin,
      "role_id": vm.api.profile.roles,
      "status": "Active"
    };
    if (isSrh) {
      filterSearch = {
        "limit": vm.end,
        "skip": begin,
        "role_id": vm.api.profile.roles,
        "status": "Active",
        "category": vm.searchType == 'srhCate' ? (vm.srhCate ? vm.srhCate : undefined) : undefined,
        "sub_category": vm.searchType == 'srhSubCate' ? (vm.srhSubCate ? vm.srhSubCate : undefined) : undefined,
        "issuedDate": vm.searchType == 'srhDt' ? (vm.srhDt ? vm.srhDt : undefined) : undefined,
        "project": vm.searchType == 'srhPro' ? (vm.srhPro ? vm.srhPro : undefined) : undefined
      };
    }

    vm.api.getStockDet(filterSearch, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        vm.paginationNumber = parseInt(vm.begin) == 0 ? 1 : parseInt(vm.begin) + 1;
        vm.stock = data.muList;
        vm.api.getmatcode = data.muList;
        vm.rowCnt = data.count;
        vm.ddlRowsApp = "10";
      }
    });
  }

  vm.stockUpdate(false, begin, end);

  function ddlRowsChange(data) {
    vm.begin = "0";
    $scope.currentPage = 1;
    vm.stockUpdate(false, vm.begin, vm.ddlRows);
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
      vm.stockUpdate(true, begin, end);
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
  function newStockReq() {
    var flag = 0;
    if (vm.newStockAdd == "" || vm.newStockAdd == undefined) {
      if ($('.alertify-log').length == 0) {
        alertify.log("please update Stock");
      }
      return;
    }

     angular.forEach(vm.newStockAdd, function (materials) {
      if (materials.category == undefined || materials.category == "") {
        materials.CatIDEmpty = '0';
        flag = 1;
      }
      else {
        materials.CatIDEmpty = '1';
        // flag = 0;
      }
      if (materials.subCategory == undefined || materials.subCategory == "") {
        materials.subCatIDEmpty = '0';
        flag = 1;
      }
      else {
        materials.subCatIDEmpty = '1';
        // flag = 0;
      }
      if (materials.id == undefined || materials.id == "") {
        materials.codeIsEmpty = "0";
        flag = 1;
      }
      else {
        materials.codeIsEmpty = "1";
        // flag = 0;
      }
      if (materials.issuedBy == "" || materials.issuedBy == undefined || materials.issuedBy == null) {
        materials.IssuedIs = "0";
        flag = 1;
      }
      else {
        materials.IssuedIs = "1";
        // flag = 0;
      }
      if (materials.issuedTo == "" || materials.issuedTo == undefined) {
        materials.conIdEmpty = '0';
        flag = 1;
      }
      else {
        materials.conIdEmpty = '1';
        // flag = 0;
      }
      if (materials.issuedQty == "" || materials.issuedQty == undefined) {
        materials.issQtyEmpty = '0';
        flag = 1;
      }
      else {
        materials.issQtyEmpty = '1';
        // flag = 0;
      }
      return flag;
    });
    if (flag == 1) {
      if ($('.alertify-log').length == 0) {
        alertify.log("some fields missing");
      }
      return;
    }
    if (vm.remarks == "" || vm.remarks == undefined) {
      if ($('.alertify-log').length == 0) {
        alertify.log("please Enter Remarks");
      }
      return;
    }
    vm.material = [];
    for (var i = 0; i < vm.newStockAdd.length; i++) {
      vm.material.push({
        'category_id': vm.newStockAdd[i].category,
        'sub_category_id': vm.newStockAdd[i].subCategory,
        'mat_code': vm.newStockAdd[i]._id,
        'mat_name': vm.newStockAdd[i].id,
        'mat_matname': vm.newStockAdd[i].name,
        'uom': vm.newStockAdd[i].uom,
        'mat_size': vm.newStockAdd[i].mat_size,
        'specification': vm.newStockAdd[i].specification,
        'issued_qty': vm.newStockAdd[i].issuedQty,
        'contractor_id': vm.newStockAdd[i].issuedBy,
        'issued_to': vm.newStockAdd[i].issuedTo,
        'available_quantity': vm.newStockAdd[i].available_quantity,
      })
    }
    // vm.StockIssue = 0;
    // for(var i = 0; i < material.length ; i++)
    // {
    //   if()
    //   vm.StockIssue += material[i].issued_qty;
    // }
    // if()
    var newStockRequest = {
      'project': vm.project,
      'updated_by': vm.api.profile._id,
      'issuedNo': vm.issuedNo,
      'issuedDate': vm.issuedDt,
      'materials': vm.material,
      'remarks': vm.remarks,
      'status': vm.status,
      'material_type': "57c0596e20a1d133e4eaf887",
      'material_type_name': "Consumable"
    }
    vm.sendnewStockRequest(newStockRequest);

  }

  function sendnewStockRequest(newStockRequest) {
    var flag = 0;
    var mat = newStockRequest.materials;

    var matdup = vm.materialDuplicate();
   if(matdup){
                return;
        }

    for (var j = 0; j < mat.length; j++) {
      if (mat[j].available_quantity < 0 || mat[j].available_quantity == 0) {
        if ($('.alertify-log').length == 0) {
          alertify.error("please check  " + mat[j].mat_name + "  available quantity");
        }
        return;
      }
    }

    vm.api.insertStock(newStockRequest, function (err, data) {
      if (err) {
        if ($('.alertify-log').length == 0) {
          alertify.error(err.data);
        }
        //alert("No Data");

      } else {
        vm.newStockAdd = [];
        $('#addpopup').modal('toggle');
        if ($('.alertify-log-success').length == 0) {
          alertify.success(data);
        }
        vm.stockUpdate(false, vm.beign, vm.end);
        close();
      }
    });
  }
  // add new stock
  vm.newStockAdd = [];
  function addRow() {
    if (vm.project == "" || vm.project == undefined) {
      if ($('.alertify-log').length == 0) {
        alertify.error("please Select Project");
      }
      return;
    }


    if (vm.issuedNo == "" || vm.issuedNo == undefined) {
      if ($('.alertify-log').length == 0) {
        alertify.error("please Enter IssuedNo");
      }
      return;
    }
    if (vm.issuedDt == "" || vm.issuedDt == undefined) {
      if ($('.alertify-log').length == 0) {
        alertify.error("please Enter IssuedDate");
      }
      return;
    }
    var count = vm.count;
    for (var i = 0; i < count; i++) {
      vm.mats = {
        'category': "",
        'sub_category': "",
        // 'mat_code': "",
        // 'mat_name': "",
        // 'uom': "",
        // 'mat_size': "",
        // 'issued_to': "",
        // 'issued_by': "",
        // 'issued_qty': "",
        'avlQty': ""
        // "todayQuan": "1",
        // 'recived_quantity': "",
        // 'nomat': "1"
      }
      vm.newStockAdd.push(vm.mats);
    }

  }

  // for returnable
  vm.returnStockAdd = [];
  function addRow1() {
    if (vm.project == "" || vm.project == undefined) {
      if ($('.alertify-log').length == 0) {
        alertify.error("please Select Project");
      }
      return;
    }

    if (vm.issuedNo == "" || vm.issuedNo == undefined) {
      if ($('.alertify-log').length == 0) {
        alertify.error("please Enter IssuedNo");
      }
      return;
    }
    if (vm.issuedDt == "" || vm.issuedDt == undefined) {
      if ($('.alertify-log').length == 0) {
        alertify.error("please Enter IssuedDate");
      }
      return;
    }
    var count = vm.count;
    for (var i = 0; i < count; i++) {
      vm.mats = {
        'category': "",
        'subcateogory': "",
        // 'mat_code ': "",
        //  'mat_name': "",
        // 'mat_size': "",
        //     'issued_to': "",
        //  'contractor_id': "",
        // 'issued_qty': "",
        //  'available_quantity': "",
        //  'recived_quantity': ""

      }
      vm.returnStockAdd.push(vm.mats);
    }
  }

  vm.sendReturnStockRequest = sendReturnStockRequest;
  vm.returnStockReq = returnStockReq;
  function returnStockReq() {
    var flag = 0;
    if (vm.returnStockAdd == "" || vm.returnStockAdd == undefined) {
      if ($('.alertify-log').length == 0) {
        alertify.log("please update Stock");
      }
      return;
    }
    angular.forEach(vm.returnStockAdd, function (materials) {
      if (materials.category == undefined || materials.category == "") {
        materials.CatIDEmpty = '0';
        flag = 1;
      }
      else {
        materials.CatIDEmpty = '1';
        // flag = 0;
      }
      if (materials.subCategory == undefined || materials.subCategory == "") {
        materials.subCatIDEmpty = '0';
        flag = 1;
      }
      else {
        materials.subCatIDEmpty = '1';
        // flag = 0;
      }
      if (materials.id == undefined || materials.id == "") {
        materials.codeIsEmpty = "0";
        flag = 1;
      }
      else {
        materials.codeIsEmpty = "1";
        // flag = 0;
      }
      if (materials.issuedBy == "" || materials.issuedBy == undefined || materials.issuedBy == null) {
        materials.IssuedIs = "0";
        flag = 1;
      }
      else {
        materials.IssuedIs = "1";
        // flag = 0;
      }
      if (materials.issuedTo == "" || materials.issuedTo == undefined) {
        materials.conIdEmpty = '0';
        flag = 1;
      }
      else {
        materials.conIdEmpty = '1';
        // flag = 0;
      }
      if (materials.received_quantity == "" || materials.received_quantity == undefined) {
        materials.issQtyEmpty = '0';
        flag = 1;
      }
      else {
        materials.issQtyEmpty = '1';
        // flag = 0;
      }
      return flag;
    });
    if (flag == 1) {
      if ($('.alertify-log').length == 0) {
        alertify.log("some fields missing");
      }
      return;
    }
     if (vm.remarks1 == "" || vm.remarks1 == undefined) {
      if ($('.alertify-log').length == 0) {
        alertify.log("please enter Remarks");
      }
      return;
    }
    vm.material = [];
    for (var i = 0; i < vm.returnStockAdd.length; i++) {
      vm.material.push({
        // 'id': vm.newStockAdd[i]._id,
        'category_id': vm.returnStockAdd[i].category,
        'sub_category_id': vm.returnStockAdd[i].subCategory,
        'mat_code': vm.returnStockAdd[i]._id,
        'mat_name': vm.returnStockAdd[i].id,
        "mat_matname": vm.returnStockAdd[i].name,
        'uom': vm.returnStockAdd[i].uom,
        'mat_size': vm.returnStockAdd[i].mat_size,
        'specification': vm.returnStockAdd[i].specification,
        'issued_qty': vm.returnStockAdd[i].received_quantity,
        'contractor_id': vm.returnStockAdd[i].issuedBy,
        'issued_to': vm.returnStockAdd[i].issuedTo
      })
    }
    var returnStockRequest = {
      'project': vm.project,
      'issuedDate': vm.issuedDt,
      'issuedNo': vm.issuedNo,
      'updated_by': vm.api.profile._id,
      'materials': vm.material,
      'remarks': vm.remarks1,
      'material_type': "57c0596e20a1d133e4eaf888",
      'material_type_name': "Returnable",
      'status': vm.status
    }
    vm.sendReturnStockRequest(returnStockRequest);
  }

  function sendReturnStockRequest(returnStockRequest) {
    var flag = 0;
    var mat = returnStockRequest.materials;

    for (var j = 0; j < mat.length; j++) {
      if (mat[j].avlQty < 0 || mat[j].avlQty == 0) {
        if ($('.alertify-log').length == 0) {
          alertify.error("please check  " + mat[j].mat_name + "  available quantity");
        }
        return;
      }
    }

    vm.api.insertStock(returnStockRequest, function (err, data) {
      if (err) {

        if ($('.alertify-log').length == 0) {
          alertify.error(err.data);
        }
        //alert("No Data");

      } else {
        vm.newStockAdd = [];
        $('#addpopup1').modal('toggle');
        if ($('.alertify-log-success').length == 0) {
          alertify.success(data);
        }
        vm.stockUpdate(false, vm.beign, vm.end);
        close();
        vm.remarks1 = "";
      }
    });
  }
  //add text clear
  function close() {
    vm.count = "1";
    vm.categoryList = "Select category";
    vm.subCategoryList = "";
    vm.remarks = "";
    vm.newStockAdd = [];
    vm.project = "";
    vm.catecall();
    vm.issuedDt = "";
    vm.issuedNo = "";
    vm.returnStockAdd = [];


  }

  $scope.$on('deleteAddStock', function (e, data) {

    vm.newStockAdd.splice(data, 1);
    vm.returnStockAdd.splice(data, 1);
  })





  //date
  $('.input-group.date').datepicker({
    calendarWeeks: true,
    todayHighlight: true,
    autoclose: true,
    endDate: '+0d',
    closeText: 'Clear',
    clearBtn: true
  });

  //reload grid
  function reload() {
    vm.ddlRows = "10";
    $scope.currentPage = 1;
    vm.srhDt = "";
    vm.srhSubCate = "";
    vm.srhCate = "";
    vm.srhPro = "";
    vm.stockUpdate(false, begin, vm.ddlRows);
  }
  $scope.$on('editstock', function (e, data) {
    if (data.materialTypeName == "Consumable") {
      vm.EditissuedDt = data.issuedDate;
      vm.Editproject = data.project;
      // vm.Editcategory = data.category;
      // vm.EditsubCategory = data.sub_category;
      vm.EditissuedNo = data.issuedNo;
      vm.editMateials = data.materials;
      vm.api.getStockMat = vm.editMateials;
      vm.remarks = data.remarks
      $('#editpopup').modal('toggle');
      //           }
      // });
    }
    if (data.materialTypeName == "Returnable") {
      vm.EditissuedDt = data.issuedDate;
      vm.Editproject = data.project;
      // vm.Editcategory = data.category;
      // vm.EditsubCategory = data.sub_category;
      vm.EditissuedNo = data.issuedNo;
      vm.editMateials = data.materials;
      vm.api.getStockMat = vm.editMateials;
      vm.remarks = data.remarks;
      $('#editpopup1').modal('toggle');
      //           }
      // });
    }
  });
  //clear searchTxt

  function searchTxt() {
    vm.srhDt = "";
    vm.srhSubCate = "";
    vm.srhCate = "";
    vm.srhPro = "";
  }
  $('.search-panel .dropdown-menu').find('a').click(function (e) {
    e.preventDefault();
    var param = $(this).attr("title").replace("#", "");
    var concept = $(this).text();
    $('.search-panel span#search_concept').text(concept);
    $('.input-group #search_param').val(param);
    vm.searchType = param;
    if (param === "srhPro") {
      $("#srhPro").show();
      $("#srhCate").hide();
      $("#srhDt").hide();
      $("#srhSubCate").hide();
    }
    else if (param === "srhCate") {
      $("#srhCate").show();
      $("#srhDt").hide();
      $("#srhSubCate").hide();
      $("#srhPro").hide();
    }
    else if (param === "srhSubCate") {
      $("#srhSubCate").show();
      $("#srhCate").hide();
      $("#srhDt").hide();
      $("#srhPro").hide();
    }
    else {
      $("#srhSubCate").hide();
      $("#srhCate").hide();
      $("#srhDt").show();
      $("#srhPro").hide();
    }
  });
}