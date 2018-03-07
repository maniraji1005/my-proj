'use strict';
angular
  .module('todo.storeMrController', ['angucomplete-alt', 'daterangepicker'])
  .controller('storeMrController', storeMrController);

storeMrController.$inject = ['$scope', '$state', 'api', '$timeout', 'storage', '$filter', 'SETTINGS', '$stateParams']

function storeMrController($scope, $state, api, $timeout, storage, $filter, CONSTANTS, $stateParams) {

  var vm = this;
  var index = $stateParams.index;
  // var status = $stateParams.status;
  // alert(JSON.stringify(status));
  vm.status = status;
  $scope.material = [];
  vm.addrow = addrow;
  vm.materialReq = materialReq;
  vm.count = "1";
  vm.editcount = "1";
  vm.api = api;
  vm.materialdet = api.MaterialMaster;
  $scope.step = 1;
  vm.materialList = [];
  vm.mrRemarks = "";
  var status = "";
  vm.deleterow = deleterow;
  vm.storeMR = "";
  vm.mrApp = [];
  vm.mrAppList = [];
  vm.sendMaterialReq = sendMaterialReq;
  vm.close = ModalClose;
  vm.editmaterials = [];
  vm.editaddrow = editaddrow;
  vm.updatematreq = updatematerialreq;
  vm.editmrdet = [];
  vm.mreditRemarks = '';
  vm.branchList = [];
  vm.statusList = [];
  vm.categoryList = [];
  vm.updatemat = updatemat;
  // vm.getallmats = getallmats;
  vm.matrid = "";
  vm.mrTrackData = [];
  vm.filterSearch = filterSearch;
  vm.ddlRowsChange = ddlRowsChange;
  vm.rowCnt = 0;
  vm.begin = '0';
  vm.end = '10';
  var begin = '0';
  var end = '10';
  var flag = "1";
  vm.mrGridBind = mrGridBind;
  vm.branch = '';
  vm.storeType = '';
  vm.option2 = '';
  vm.category = '';
  vm.empList = '';
  vm.getStatus = getStatus;
  vm.storeTypeList = [];
  vm.stateParams = '';
  vm.executive = '';
  vm.clear = clear;
  // vm.MaterialValidation = validation;
  var profileName = {
    'id': vm.api.profile._id,
    'name': vm.api.profile.names
  }
  // For Getting Project based on Emp ID for CH
  var EmpId = {
    "empID": vm.api.profile._id
  }
  vm.Editvalidation = Editvalidation;
  vm.InsertValidation = InsertValidation;
  vm.deletedMaterials = [];
  vm.rowCnt1 = 0;
  //vm.getallbranch = getallbranch;

  // Default DDL Select
  vm.ddlRows = "10";
  vm.ddlRowsApp = "10";
  vm.status = "574450f469f12a253c61bca3";
  vm.searchType = 'MRNo';
  vm.srhTxt = '';
  vm.srhDt = '';
  vm.searchbranch = '';
  vm.reload = reload;
  vm.access = '';
  var access = storage.get('access');
  if (access) {
    access = JSON.parse(access);
    vm.mraccess = access;
  }

  vm.getCompDet = '';

  vm.getCompDet = vm.api.profile.company;
  vm.categoryListMR = vm.api.company.category;

  vm.getCompDet = '';

  vm.getCompDet = vm.api.profile.company;



  //  CH Change Starts
  vm.fromProject = '';
  vm.toProject = '';
  vm.subCategory = '';
  vm.editCategoryMR = '';
  vm.matRes = matRes;
  vm.editfromProject = '';
  vm.edittoProject = '';
  vm.editSubCategoryMR = '';
  vm.getSubCategory = getSubCategory;
  vm.getMaterial = getMaterial;
  vm.getToProject = getToProject;
  vm.projValidate = projValidate;
  vm.api.toProjectId = vm.toProject;


  function disablePopup() {

  }
  function updatematerialreq(status) {
    // For Colorhomes
    if (vm.getCompDet == 'CH0001') {
      if (vm.editfromProject == "" || vm.editfromProject == null) {
        if ($('.alertify-log').length == 0) {
          alertify.error("please select From Project");
        }
        return;
      }
      if (vm.edittoProject == "" || vm.edittoProject == null) {
        if ($('.alertify-log').length == 0) {
          alertify.error("please select To Project");
        }
        return;
      }
      if (vm.editCategoryMR == "") {
        if ($('.alertify-log').length == 0) {
          alertify.error("please select Category");
        }
        return;
      }
      if (vm.editSubCategoryMR == "") {
        if ($('.alertify-log').length == 0) {
          alertify.error("please add Sub Category");
        }
        return;
      }
    }

    // For Timbe
    else {
      if (vm.Editbranch == "" || vm.Editbranch == null) {
        if ($('.alertify-log').length == 0) {
          alertify.error("please select branch");
        }
        return;
      }
      if (vm.EditstoreType == "") {
        if ($('.alertify-log').length == 0) {
          alertify.error("please select branch");
        }
        return;
      }
    }

    var status = vm.getStatus(status);
    var flag = 0;
    var zero = false;
    for (var i = 0; i < vm.editmaterials.length; i++) {
      if (vm.editmaterials[i].name == "" || vm.editmaterials[i].id == "") {
        vm.editmaterials[i].nomat = "0";
        flag = 1;
      }
      if (vm.editmaterials[i].quantity == "") {
        vm.editmaterials[i].noqty = "0";
        flag = 1;
      } else if (parseInt(vm.editmaterials[i].quantity) == 0) {
        vm.editmaterials[i].noqty = "0";
        zero = true;
      }
      if (vm.editmaterials[i].category == "") {
        vm.editmaterials[i].nocat = "0";
        flag = 1;
      }
    }
    if (zero) {
      if ($('.alertify-log').length == 0) {
        alertify.error("Please enter quantity");
      }
      return;
    }
    if (flag !== 0) {
      if ($('.alertify-log').length == 0) {
        alertify.error("Some fields are missing");
      }
      return;
    }
    var Editvalidation = vm.InsertValidation(vm.editmaterials);
    if (Editvalidation !== 0) {
      if ($('.alertify-log').length == 0) {
        alertify.error("Repeated entries not allowed");
      }
      return;
    }
    if (vm.mreditRemarks == "") {
      if ($('.alertify-log').length == 0) {
        alertify.error("please enter Remarks");
      }
      return;
    }

    var mat_status = vm.getStatus('Pending');
    vm.material = [];
    for (var z = 0; z < vm.editmaterials.length; z++) {
      vm.material.push({
        'id': vm.editmaterials[z].id,
        'mat_code' : vm.editmaterials[z].mat_code,
        'name': vm.editmaterials[z].name,
        'quantity': vm.editmaterials[z].quantity,
        'avlblQty' : vm.editmaterials[z].avlblQty,
        'uom': vm.editmaterials[z].uom,
        'category': vm.editmaterials[z].category,
        'status': mat_status,
        'size': vm.editmaterials[z].size,
        'specification': vm.editmaterials[z].specification,
        'mat_type' : vm.editmaterials[z].matType,
        'flag': true
      })
    }
    // console.log("Penging",JSON.stringify(vm.editmaterials));
    var mat_status = vm.getStatus('Delete');
    for (var y in vm.deletedMaterials) {
      vm.material.push({
        'id': vm.deletedMaterials[y].id,
        'mat_code' : vm.deletedMaterials[y].mat_code,
        'name': vm.deletedMaterials[y].name,
        'quantity': vm.deletedMaterials[y].quantity,
        'avlblQty' : vm.deletedMaterials[y].avlblQty,
        'uom': vm.deletedMaterials[y].uom,
        'category': vm.deletedMaterials[y].category,
        'status': mat_status,
        'size': vm.deletedMaterials[y].size,
        'specification': vm.deletedMaterials[y].specification,
        'mat_type' : vm.deletedMaterials[z].matType,
      })
    }

    var project = vm.api.projectList;
            if(project) {
        var filterProj = $filter('filter')(project, { _id: vm.editfromProject }, true)[0];
        vm.filterProjCode = filterProj.short_code;
                    // console.log("werwer",JSON.stringify(filterProj));
            }

    var editmaterialRequest = {
      'id': vm.editmrdet.id,
      'material': vm.material,
      'remarks': vm.mreditRemarks,
      'updated_by': profileName,
      'status': status,
      'branch': vm.Editbranch,
      'store_type': vm.EditstoreType,
      'store': vm.Editstore,
      'from_project': vm.editfromProject,
      'project_code' : vm.filterProjCode,
      'to_project': vm.edittoProject,
      'category_id': vm.editCategoryMR,
      'sub_category_id': vm.editSubCategoryMR
    };
    // console.log("dfsfsd",JSON.stringify(editmaterialRequest));
    vm.updatemat(editmaterialRequest);
  }
  function Editvalidation() {
    var sorted_mat = vm.editmaterials.slice().sort();
    var flag = 0
    for (var i = 0; i < vm.editmaterials.length - 1; i++) {
      if (sorted_mat[i + 1].id == sorted_mat[i].id) {
        vm.editmaterials[i + 1].nomat = "0";
        vm.editmaterials[i].nomat = "0";
        flag = 1;
      }
    }
    return flag;
  }

  function InsertValidation(data) {
    var flag = 0;
    var materials = [];
    var mat = [];
    angular.forEach(data, function (material) {
      if (material.id !== undefined) {
        mat = $filter('filter')(data, { id: material.id }, true);
        if (mat.length > 1) {
          materials = mat
        }
      }
    })
    if (materials.length > 1) {
      angular.forEach(materials, function (d) {
        $filter('filter')(data, function (a) {
          if (d.id == a.id) {
            flag = 1
            return a.nomat = "0"
          } else if (a.nomat == "0") {
            a.nomat = "1"
          }
        }, true)
      })
    }
    return flag;
  }

  function updatemat(data) {
    vm.api.updateMr(data, function (err, data) {
      if (err) {
        //alert(JSON.stringify(err));
      } else {
        $('#modal-id').modal('toggle');
        if ($('.alertify-log-success').length == 0) {
          alertify.success(data);
        }
        vm.filterSearch(false, vm.begin, vm.end);
        clear();
      }
    });
  }

  function editaddrow() {
    // if (!vm.Editbranch) {
    //   if ($('.alertify-log').length == 0) {
    //   alertify.error("please select branch");
    //   }
    //   return;
    // }
    var count = vm.editcount;
    for (var y = 0; y < count; y++) {
      var Objmat = new Object();
      
      Objmat._id = "";
      Objmat.name = "";
      Objmat.quantity = "";
      Objmat.nomat = "1";
      Objmat.noqty = "1";
      Objmat.category_id = vm.editCategoryMR;
      Objmat.sub_category_id = vm.editSubCategoryMR;
      Objmat.flag = false;
      // vm.getEditMaterial(vm.editSubCategoryMR);
      vm.editmaterials.push(Objmat);

      // console.log(JSON.stringify(Objmat));
      // console.log(JSON.stringify(vm.editmaterials));
    }
  }

  function materialReq(status) {
    // if (vm.materialList.length > 0) {
    var status = vm.getStatus(status);
    var zero = false;
    var flag = 0;
    // CH Changes Starts

    // For Colorhomes
    if (vm.getCompDet == 'CH0001') {
      if (vm.fromProject == "" || vm.fromProject == null) {
        if ($('.alertify-log').length == 0) {
          alertify.error("please select From Project");
        }
        return;
      }
      if (vm.toProject == "" || vm.toProject == null) {
        if ($('.alertify-log').length == 0) {
          alertify.error("please select To Project");
        }
        return;
      }
      if (vm.category == "") {
        if ($('.alertify-log').length == 0) {
          alertify.error("please select Category");
        }
        return;
      }
      if (vm.subCategory == "") {
        if ($('.alertify-log').length == 0) {
          alertify.error("please add Sub Category");
        }
        return;
      }
    }
    // For Timbe
    else {
      if (vm.branch == "" || vm.branch == null) {
        if ($('.alertify-log').length == 0) {
          alertify.error("please select branch");
        }
        return;
      }
      if (vm.storeType == "") {
        if ($('.alertify-log').length == 0) {
          alertify.error("please select storeType");
        }
        return;
      }
    }
    // CH Changes Ends

    // Common for both CH and Timbe

    if (vm.materialList == "") {
      if ($('.alertify-log').length == 0) {
        alertify.error("please add materials");
      }
      return;
    }
    for (var i = 0; i < vm.materialList.length; i++) {
      if (vm.materialList[i].name == "" || vm.materialList[i].id == "") {
        vm.materialList[i].nomat = "0";
        flag = 1;
      }
      else {
        vm.materialList[i].nomat = "1";
      }
      if (vm.materialList[i].quantity == "") {
        vm.materialList[i].noqty = "0";
        flag = 1;
      } else if (parseInt(vm.materialList[i].quantity) == 0) {
        vm.materialList[i].noqty = "0";
        zero = true;
      }
      else {
        vm.materialList[i].noqty = "1";
      }

      if (vm.materialList[i].category == "") {
        vm.materialList[i].nocat = "0";
        flag = 1;
      }
      else {
        vm.materialList[i].nocat = "1";
      }

    }

    var materialValidation = vm.InsertValidation(vm.materialList);
    if (materialValidation !== 0) {
      if ($('.alertify-log').length == 0) {
        alertify.error("Repeated entries not allowed");
      }
      return;
    }
    if (zero) {
      if ($('.alertify-log').length == 0) {
        alertify.error("Please enter quantity");
      }
      return;
    }
    if (flag !== 0) {
      if ($('.alertify-log').length == 0) {
        alertify.error("some fileds missing");
      }
      return;
    }

    if (vm.mrRemarks == "") {
      if ($('.alertify-log').length == 0) {
        alertify.error("Please enter remarks");
      }
      return;
    }

    var material_status = CONSTANTS.mr_status;
    for (var j in material_status) {
      if (material_status[j].name == 'Pending') {
        var matstatus = {
          '_id': material_status[j]._id,
          'name': material_status[j].name
        }
        break;
      }
    }
    vm.material = [];
    // console.log("MATLIST1",JSON.stringify(vm.materialList));
    if (vm.getCompDet == 'CH0001' && vm.getCompDet !== 'CO00001') {
      for (var z = 0; z < vm.materialList.length; z++) {
        if(vm.materialList[z].size) {
            vm.material.push({
          'category_id': vm.category,
          'sub_category_id': vm.subCategory,
          'id': vm.materialList[z]._id,
          'mat_code' : vm.materialList[z].id,
          'name': vm.materialList[z].name,
          'quantity': vm.materialList[z].quantity,
          'avlblQty' : vm.materialList[z].avlquantity,
          'uom': vm.materialList[z].uom,
          'size': vm.materialList[z].size.name,
          'specification': vm.materialList[z].specification,
          'mat_type' : vm.materialList[z].matType,
          'status': matstatus,
          'flag': true
        })
        }
        else {
          vm.material.push({
          'category_id': vm.category,
          'sub_category_id': vm.subCategory,
          'id': vm.materialList[z]._id,
          'mat_code' : vm.materialList[z].id,
          'name': vm.materialList[z].name,
          'quantity': vm.materialList[z].quantity,
          'avlblQty' : vm.materialList[z].avlquantity,
          'uom': vm.materialList[z].uom,
          'size': vm.materialList[z].size,
          'specification': vm.materialList[z].specification,
          'mat_type' : vm.materialList[z].matType,
          'status': matstatus,
          'flag': true
        })
        }
        
      }
    }
    else {
      for (var z = 0; z < vm.materialList.length; z++) {
        vm.material.push({
          'category': vm.materialList[z].category,
          'id': vm.materialList[z].id,
          'name': vm.materialList[z].name,
          'quantity': vm.materialList[z].quantity,
          'uom': vm.materialList[z].uom,
          'status': matstatus,
          'flag': true
        })
      }
    }

    // console.log("TIMNE",JSON.stringify(vm.material));

    if (vm.getCompDet == 'CH0001' && vm.getCompDet !== 'CO00001') {

    var project = vm.api.projectList;
            if(project) {
        var filterProj = $filter('filter')(project, { _id: vm.fromProject }, true)[0];
        vm.filterProjCode = filterProj.short_code;
                    // console.log("werwer",JSON.stringify(filterProj));
            }

            var category = vm.api.company.category;
        if(category) {
              var filterCat = $filter('filter')(category, { _id: vm.category }, true)[0];
              vm.filterCatName = filterCat.name;
              // return filterCat.name;
        }
    }


    // console.log("MATLIST2", JSON.stringify(vm.material));

    var materialRequest = {
      'material': vm.material,
      'remarks': vm.mrRemarks,
      'created_by': profileName,
      'status': status,
      'branch': vm.branch,
      'store_type': vm.storeType,
      'store': vm.store,
      'from_project': vm.fromProject,
      'project_code' : vm.filterProjCode,
      'to_project': vm.toProject,
      'category_id': vm.category,
      'sub_category_id': vm.subCategory,
      'category_name' : vm.filterCatName
    };
    // console.log(JSON.stringify(materialRequest));
    vm.sendMaterialReq(materialRequest);
    //  } 
  }



  function sendMaterialReq(material) {
    api.insertMr(material, function (err, data) {
      if (err) {
        //alert(JSON.stringify(err));
      } else {
        vm.materialList = [];
        $('#addpopup').modal('toggle');
        if ($('.alertify-log-success').length == 0) {
          alertify.success(data);
        }
        vm.filterSearch(false, vm.begin, vm.end);
      }
    });
  }

  function addrow() {
    // if (!vm.branch) {
    //   if ($('.alertify-log').length == 0) {
    //   alertify.error("please select branch");
    //   }
    //   return;
    // }
    // if(vm.getCompDet == 'CH0001') {
    //   if(!vm.category) {
    //     if ($('.alertify-log').length == 0) {
    //     alertify.error('Please choose Category');
    //   }
    //   return;
    //   }
    // }
    if (vm.getCompDet == 'CH0001') {
      if (!vm.fromProject) {
        if ($('.alertify-log').length == 0) {
          alertify.error("please select From Project");
        }
        return;
      }
      if (!vm.toProject) {
        if ($('.alertify-log').length == 0) {
          alertify.error('Please choose To Project');
        }
        return;
      }
      if (!vm.category) {
        if ($('.alertify-log').length == 0) {
          alertify.error('Please choose Category');
        }
        return;
      }
      if (!vm.subCategory) {
        if ($('.alertify-log').length == 0) {
          alertify.error('Please choose Sub Category');
        }
        return;
      }
    }
    else {
      if (!vm.branch) {
        if ($('.alertify-log').length == 0) {
          alertify.error("please select branch");
        }
        return;
      }
    }

    vm.api.toProjectId = vm.toProject;


    var count = vm.count;
    for (var i = 0; i < count; i++) {
      var ObjMaterial = new Object();
      ObjMaterial._id = "";
      ObjMaterial.name = "";
      ObjMaterial.quantity = "";
      ObjMaterial.nomat = "1";
      ObjMaterial.noqty = "1";
      ObjMaterial.category = vm.category;
      ObjMaterial.nocat = "1";
      vm.materialList.push(ObjMaterial);
      // console.log(JSON.stringify(vm.materialList));
    }
  }

  function deleterow(mode) {
    if (mode == 'add')
      vm.materialList = $filter('filter')(vm.materialList, { row: false }, true);
    else {
      angular.copy(vm.editmaterials, vm.deletedMaterials);
      vm.editmaterials = $filter('filter')(vm.editmaterials, { row: false }, true);
      vm.deletedMaterials = $filter('filter')(vm.deletedMaterials, { row: true, flag: true }, true);
    }
  }

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
      vm.begin = begin;
      vm.end = vm.ddlRows.toString();
      vm.filterSearch(null, begin, vm.end);
      // $scope.testing1(null,begin,end);
    }
    vm.items = vm.materialList.filter(function (row) {
      if (row.row) {
        vm.materialList.splice(row.sno, 1);
      }
    });

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

  api.branch.branchDDL(function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      vm.branchList = data.branches;
    }
  });

  // Getting Project based on EmpId for CH
  api.ProjectDDL(EmpId, function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      vm.projectList = data.projectList;
      // console.log(JSON.stringify([EmpId]));
      vm.api.projectList = vm.projectList;
    }
  });

  function getToProject(proj) {
    if (proj == null) {
      vm.toprojectList = [];
    }
    else {
      vm.toprojectList = '';
      api.ProjectDDL({}, function (err, data) {
        if (err) {
          //alert("No Data");
        }
        else {
          vm.toprojectList = data.projectList;
        }
      });
    }

  }

  api.ProjectDDL({}, function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      vm.toprojectList1 = data.projectList;
      vm.api.toProjectList = vm.toprojectList1;
    }
  });

  function projValidate(val) {
    // console.log("VAL", JSON.stringify(val));
    if (val == null) {
      return;
    }
    else if (val == vm.fromProject) {
      alertify.error("You should not choose Same Project");
      vm.toProject = "Select to Project";
      return;
    }

  }


  // CH Changes Starts
  function getMaterial(data) {
    vm.clear();

    // vm.item.category = 'Select Material';
    if (data) {
      var category = {
        "category": vm.category,
        "sub_category": data
      };
      // console.log(JSON.stringify(category));
      // vm.category = data;
      vm.materialType = "";
      // vm.item.uom = "";
      // vm.item.avlquantity = "";
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

        } else {
          vm.materialdet = data.materialsList;
          vm.api.mrMaterial = vm.materialdet;
          //  alert(JSON.stringify(vm.api.mrMaterial))
          // vm.editmaterials = data.materialsList;
          vm.api.mrMatEdit = vm.materialdet;
          // alert(JSON.stringify(vm.api.mrMatEdit));
        }
      })
    } else {
      vm.materialType = "";
      vm.item.uom = "";
      vm.item.avlquantity = "";
    }
  }

  vm.getEditMaterial = getEditMaterial;

  function getEditMaterial(data) {
    alert("caeeld");

    // vm.item.category = 'Select Material';
    if (data) {
      var category = {
        "category": vm.editCategoryMR,
        "sub_category": data
      };
      // vm.category = data;
      vm.materialType = "";
      // vm.item.uom = "";
      // vm.item.avlquantity = "";
      vm.api.getUom({}, function (err, data) {
        if (!err) {
          vm.uomList = data.uomList;
          vm.api.mrUOM = vm.uomList;
        } else {
          alert('no data');
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

        } else {
          vm.materialdet = data.materialsList;
          vm.api.mrEditMaterial = vm.materialdet;
          // vm.editmaterials = data.materialsList;
          // vm.api.mrMatEdit = vm.materialdet;
          console.log(JSON.stringify(vm.api.mrEditMaterial));
        }
      })
    } else {
      vm.materialType = "";
      vm.item.uom = "";
      vm.item.avlquantity = "";
    }
  }

  vm.initialLoading = initialLoading;

  function initialLoading(data) {
    vm.clear();

    // vm.item.category = 'Select Material';
    if (data) {
      var category = {
        "category": vm.category,
        "sub_category": data
      };
      // vm.category = data;
      vm.materialType = "";
      // vm.item.uom = "";
      // vm.item.avlquantity = "";
      vm.api.getUom({}, function (err, data) {
        if (!err) {
          vm.uomList = data.uomList;
          vm.api.mrUOM = vm.uomList;
        } else {
          alert('no data');
        }
      });
      // console.log("Called12345",category);
      vm.api.materialLists(category, function (err, data) {
        if (err) {

        } else {
          // vm.materialdet = data.materialsList;
          // vm.api.mrMaterial = vm.materialdet;
          vm.editmaterials = data.materialsList;
          vm.api.mrMatEdit = vm.editmaterials;
          // alert(JSON.stringify(vm.api.mrMatEdit));
        }
      })
    } else {
      vm.materialType = "";
      // vm.item.uom = "";
      // vm.item.avlquantity = "";
    }
  }

  vm.initialLoading1 = initialLoading1;
  function initialLoading1(category) {
    // alert(JSON.stringify(category));

    vm.storeType = "";
    vm.store = "";
    vm.EditstoreType = "";
    vm.Editstore = "";
    var catList = {
      "catID": category
    }
    api.getSubCategory(catList, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        // console.log(JSON.stringify(data.subcatgoriesList));
        vm.subCategoryList = data.subcatgoriesList;
      }
    });
  }

  function matRes(data) {
    if (!data) {
      data.id = "";
      data.uom = "";
      data.avlblQty = "";
      vm.materialdet = [];
    } else {
      alertify.confirm("Are you sure to Change this Category ?", function (e) {
        if (e) {
          vm.editmaterials = [];
          vm.api.getUom({}, function (err, data) {
            if (!err) {
              vm.uomList = data.uomList;
              vm.api.mrUOM = vm.uomList;
            }
          });
          var category = {
            "category": vm.category,
            "sub_category": data
          };
          vm.api.materialLists(cat, function (err, data) {
            if (!err) {
              vm.materialdet = data.materialsList;
              vm.api.mrMaterial = vm.materialdet;
            }
          })
        } else {
        }
      });

    }
  }

  // CH Change Ends

  function ModalClose() {
    vm.materialList = [];
    vm.editmaterials = [];
    vm.mrRemarks = "";
    vm.branch = '';
    vm.storeType = '';
    vm.store = '';
    vm.count = "1";
    vm.fromProject = '';
    vm.toProject = '';
    vm.category = '';
    vm.subCategory = '';
  }

  // Dropdown Rows Per Page change
  function ddlRowsChange() {
    $scope.currentPage = 1;
    vm.begin = "0";
    vm.mrGridBind(false, vm.begin, vm.ddlRows);
  }

  // Switch Button - For Binding Data in Grid both for Draft and Approvals
  function mrGridBind(isSrh, begin, end) {
    vm.stateParams = null;
    // if (flag === '2') {
    //   vm.ddlRows = vm.ddlRowsApp;
    //   status.push("57444c9569f12a253c61bc9a", "574450f469f12a253c61bca0", "574450f469f12a253c61bca1");
    // }
    // else {
    //   status.push("574450f469f12a253c61bca3");
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

    if (isSrh || vm.srhTxt || vm.searchbranch || vm.srhDt) {
      filterSearch = {
        "limit": vm.end,
        "skip": vm.begin,
        "role_id": vm.api.profile.roles,
        "status": [vm.status],
        "access": access,
        "id": vm.searchType == 'MRNo' ? (vm.srhTxt ? vm.srhTxt.toUpperCase() : undefined) : undefined,
        "created_name": vm.searchType == 'Executive' ? (vm.srhTxt ? vm.srhTxt : undefined) : undefined,
        "branch": vm.searchType == 'Branch' ? (vm.searchbranch ? vm.searchbranch : undefined) : undefined,
        "datetime": vm.searchType == 'MRDate' ? (vm.srhDt ? vm.srhDt : undefined) : undefined
      };
    }
    api.filter.filter(filterSearch, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        // console.log(data);
        // vm.mrApp = [];
        if (flag === '1') {
          $scope.step = 1;
          vm.mrApp = data.mrList;
          vm.rowCnt = data.count;
          $scope.currentPage = 1;
          vm.begin = "0";
          $stateParams.status = null;
          searchClear();
        }
        else {
          $scope.step = 2;
          vm.mrAppList = data.mrList;
          vm.rowCnt1 = data.count;
          $scope.currentPage = 1;
          vm.begin = "0";
          $stateParams.status = null;
          searchClear();
        }
      }
    });
  }

  api.branch.branchDDL(function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      var branch = vm.api.company.branches;
      var status = vm.api.company.mr_status;
      var category = vm.api.company.category;
      vm.branchList = branch;
      vm.statusList = $filter('filter')(CONSTANTS.mr_status, function (stat) {
        return stat.name !== 'Delete';
      }, true);
      vm.categoryList = category;
      vm.api.MaterialCategory = vm.categoryList;
    }
  });

  // Get Store Type based on Branch
  function getallbranch() {
    // var branch = storage.get('company_master');
    // branch = JSON.parse(branch);
    vm.branchList = vm.api.company.branches;
  }

  $scope.getStoreType = function (branch) {
    // if(branch == null)
    //   {
    //     vm.storeTypeList = [];
    //    vm.storeNameList = [];

    //  }
    vm.storeType = "";
    vm.store = "";
    vm.EditstoreType = "";
    vm.Editstore = "";
    api.storeType.storeType(branch, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        vm.storeTypeList = data;
      }
    });
  }

  // Get Store Name based on Store Type
  $scope.getStoreName = function (store) {
    if (store == "") {
      vm.storeNameList = [];
      return;
    }
    api.storeName.storeName(store, function (err, data) {
      if (err) {
        // $('#mainLoading').hide();
        //alert("No Data");
      }
      else {
        vm.storeNameList = data;

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


  function getSubCategory(category) {

    vm.storeType = "";
    vm.store = "";
    vm.EditstoreType = "";
    vm.Editstore = "";
    var catList = {
      "catID": category
    }
    api.getSubCategory(catList, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        // console.log(JSON.stringify(data.subcatgoriesList));
        vm.subCategoryList = data.subcatgoriesList;
      }
    });
  }


  // Display MR Grid , Pagination
  vm.filterTxt = '';

  function filterSearch(isSrh, begin, end) {
    api.branch.branchDDL(function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        vm.branchList = data.branches;
      }
    });

    vm.projectDet = [];
    vm.projectDet = vm.api.profile.projects;

    // console.log("projDet", JSON.stringify(vm.projectDet));

    if ($stateParams.status == null) {
      var access = storage.get("access");
      access = JSON.parse(access);
      var filterSearch = {
        "limit": vm.ddlRows.toString(),
        "skip": begin,
        "role_id": vm.api.profile.roles,
        "created_by": vm.status == '574450f469f12a253c61bca3' ? vm.api.profile._id : undefined,
        "status": [vm.status],
        "access": access
        // "from_project": vm.api.profile,
      };


      if (isSrh || vm.srhTxt || vm.searchbranch || vm.srhDt || vm.searchprojectFrom || vm.searchprojectTo) {
        filterSearch = {
          "limit": vm.end,
          "skip": vm.begin,
          "role_id": vm.api.profile.roles,
          "status": [vm.status],
          "access": access,
          "id": vm.searchType == 'MRNo' ? (vm.srhTxt ? vm.srhTxt.toUpperCase() : undefined) : undefined,
          "created_name": vm.searchType == 'Executive' ? (vm.srhTxt ? vm.srhTxt : undefined) : undefined,
          "branch": vm.searchType == 'Branch' ? (vm.searchbranch ? vm.searchbranch : undefined) : undefined,
          "datetime": vm.searchType == 'MRDate' ? (vm.srhDt ? vm.srhDt : undefined) : undefined,
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
      var access = $stateParams.access;
      vm.status = status;
      vm.branch = branch;
      vm.storeType = storeType;
      vm.store = store;
      vm.executive = executive;
      vm.access = access;


      // var access = storage.get("access");
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
        // "executive_id": vm.executive
      };

      if (isSrh) {
        filterSearch = {
          "status": [vm.status],
          "limit": vm.end,
          "skip": vm.begin,
          "role_id": vm.api.profile.roles,
          "access": access,
          "id": vm.searchType == 'MRNo' ? vm.srhTxt.toUpperCase() : undefined,
          "created_by": vm.searchType == 'Executive' ? vm.srhTxt : undefined,
          "branch": vm.searchType == 'Branch' ? vm.searchbranch : undefined,
          "datetime": vm.searchType == 'MRDate' ? vm.srhDt : undefined
        };
      }
    }
    // console.log(JSON.stringify(filterSearch));
    api.filter.filter(filterSearch, function (err, data) {
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
        // vm.mrApp = [];
        vm.paginationNumber = parseInt(vm.begin) == 0 ? 1 : parseInt(vm.begin) + 1;
        vm.mrApp = data.mrList;
        vm.rowCnt = data.count;
        vm.ddlRowsApp = "10";
        vm.stateParams = $stateParams.status;
        if (vm.executive !== null) {
          if(vm.executiveList) {
              for (var j = 0; j < vm.executiveList.length; j++) {
            if (executive == vm.executiveList[j]._id) {
              vm.exeList = vm.executiveList[j].names;
            }
          }
          }
        }

        if (vm.branch !== null) {
          var branch = vm.api.company.branches;
          if (branch) {
            for (var i = 0; i < branch.length; i++) {
              if (vm.branch == branch[i]._id) {
                vm.branchName = branch[i].name;
              }
            }
          }

        }
        else {
          vm.branch = null;
        }

        if (vm.storeType !== null) {
          var storeType = vm.api.company.stores_types;
          if (storeType) {
            for (var j = 0; j < storeType.length; j++) {
              if (vm.storeType == storeType[j]._id) {
                vm.storeTypeName = storeType[j].name;
              }
            }
          }

        }
        else {
          vm.storeType = null;
        }

        if (vm.store !== null) {
          var store = vm.api.company.stores;
          if (store) {
            for (var k = 0; k < store.length; k++) {
              if (vm.store == store[k]._id) {
                vm.storeName = store[k].name;
              }
            }
          }

        }
        else {
          vm.store = null;
        }
      }
    });
  }

  vm.filterSearch(false, begin, end);


  // Edit Binding Data for Popup
  $scope.$on('mredit', function (e, data) {
    vm.matrid = { 'data': data };
    var category = vm.api.company.category;
    vm.api.MaterialCategory = category;
    vm.api.getMr(data, function (err, data) {
      if (err) {
        //alert(JSON.stringify(err));
      } else {
        // console.log(JSON.stringify(data));
        vm.editmrdet = data;
        vm.mreditRemarks = data.remarks;
        vm.editmaterials = data.material;
        vm.api.editMR = data;
        // vm.api.mrMaterial = vm.editmaterials;
        // console.log("asdf",JSON.stringify(vm.editmaterials));
        vm.Editbranch = data.branch;
        $scope.getStoreType(vm.Editbranch);
        vm.editCategoryMR = data.material[0].category_id;
        vm.editfromProject = data.from_project;
        vm.edittoProject = data.to_project;
        vm.api.toProjectId = vm.edittoProject;
        // console.log("asdf123",JSON.stringify(vm.edittoProject));
        vm.editSubCategoryMR = data.sub_category_id;
        vm.api.mrMatEdit = vm.editmaterials;
        vm.api.editCat = vm.editCategoryMR;
        $('#modal-id').modal();
        // console.log(JSON.stringify(vm.editCategoryMR));
        vm.initialLoading1(vm.editCategoryMR);
        vm.getToProject();
        vm.EditstoreType = data.store_type;
        $scope.getStoreName(vm.EditstoreType);
        vm.Editstore = data.store;
      }
    });
  })

  $scope.$on('category', function (e, catg) {
    var materialCatgList = {
      "category": catg,
      "sub_category": vm.editSubCategoryMR
    }
    // console.log("catg",JSON.stringify(materialCatgList));
    vm.api.materialLists(materialCatgList, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        vm.materialTypeList = data;
        vm.api.MaterialMaster = vm.materialTypeList;

      }
    });
  })

  $scope.$on('mrdelete', function (e, data) {
    var deleteList = {
      "id": data,
      "status": {
        "_id": "574450f469f12a253c61bca4",
        "name": "Delete"
      }
    };
    // console.log(JSON.stringify(deleteList));
    vm.api.deleteMr(deleteList, function (err, data) {
      if (err) {
        //alert(JSON.stringify(err));
      } else {
        if ($('.alertify-log-success').length == 0) {
          alertify.success(data);
        }
        vm.filterSearch(false, begin, end);
      }
    });
  })

  $scope.$on('mrtracksheet', function (e, data) {
    var mrid = data;
    $state.go("master.trackSheet", { 'index': 1, 'mrid': mrid });
  })

  $scope.$on('mrapprovaldata', function (e, data) {
    var matid = data.mrid;
    $state.go("master.trackSheet", { 'index': 1, 'mrid': matid });
  })
  var initializing = true;


  function getStatus(status) {
    for (var i in CONSTANTS.mr_status) {
      if (status == CONSTANTS.mr_status[i].name) {
        var status = {
          '_id': CONSTANTS.mr_status[i]._id,
          'name': CONSTANTS.mr_status[i].name
        }
      }
    }
    return status;
  }


// get MRN
  vm.getMRN = getMRN;

  function getMRN(data) {

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
      "status": "57650efb818d3b1cd808c404",
      "category_id" : data
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


  //Search DDL Select
  $('.search-panel .dropdown-menu').find('a').click(function (e) {
    e.preventDefault();
    var param = $(this).attr("title").replace("#", "");
    var concept = $(this).text();
    $('.search-panel span#search_concept').text(concept);
    $('.input-group #search_param').val(param);
    vm.searchType = param;
    if (param === "MRDate") {
      $("#srhDt").show();
      $("#srhTxt").hide();
      $("#srhBranch").hide();
      $("#projectFrom").hide();
      $("#projectTo").hide();
    } else if (param === "Branch") {
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

  // Datepicker
  $('.input-group.date').datepicker({
    calendarWeeks: true,
    todayHighlight: true,
    autoclose: true,
    endDate: '+0d',
    closeText: 'Clear',
    clearBtn: true
  });

  function clear() {
    vm.materialList = [];
    vm.editmaterials = [];
    vm.mrRemarks = '';
    vm.count = "1";
  }

  function reload() {
    vm.status = "574450f469f12a253c61bca3";
    $scope.currentPage = 1;
    vm.srhTxt = '';
    vm.srhDt = '';
    vm.searchbranch = '';
    vm.mrGridBind(false, 0, 10);
    vm.ddlRows = "10";
  }

  vm.searchClear = searchClear;
  function searchClear() {
    vm.srhTxt = '';
    vm.srhDt = '';
    vm.searchbranch = '';
  }
  $('#addpopup, #modal-id').on('hidden.bs.modal', function () {
    vm.materialList = [];
    vm.branch = '';
    vm.storeType = '';
    vm.store = '';
    vm.mrRemarks = '';
    vm.count = "1";
  });
  vm.clean = clean;
  function clean() { close(); }
}



