'use strict';
angular.module('todo.purchaseIndentController', [])

  .controller('purchaseIndentController', purchaseIndentController);
purchaseIndentController.$inject = ['$scope', '$state', 'api', '$timeout', 'storage', 'SETTINGS', '$filter', '$stateParams']
function purchaseIndentController($scope, $state, api, $timeout, storage, CONSTANTS, $filter, $stateParams) {
  var vm = this;
  vm.api = api;
  vm.materialdet = api.MaterialMaster;
  vm.addrow = PIaddrow;
  $scope.step = 1;
  vm.PurchaseIndentMaterials = [];
  // vm.pirowcnt = 0;
  vm.getallbranch = getallbranch;
  vm.branchList = [];
  vm.getStoreType = getStoreType;
  vm.storeTypeList = [];
  vm.storeNameList = [];
  vm.getStoreName = getStoreName;
  vm.InsertPurchaseIndent = InsertPurchaseIndent;
  vm.InsertNewPI = InsertNewPI;
  vm.PIRemarks = "";
  vm.filterSearch = filterSearch;
  vm.ddlRowsChange = ddlRowsChange;
  vm.rowCnt = 0;
  vm.begin = 0;
  vm.end = 10;
  var begin = 0;
  var end = 10;
  var flag = "1";
  vm.piGridBind = piGridBind;
  vm.branch = '';
  vm.storeType = '';
  vm.option2 = '';
  vm.category = '';
  vm.close = ModalClose;
  // Default DDL Select
  vm.ddlRows = "10";
  vm.ddlRowsApp = "10";
  var initializing = true;
  vm.PurchaseIndentEditMaterials = [];
  vm.PurchaseIndentEdit = [];
  vm.updatePurchaseIndent = updatePurchaseIndent;
  vm.UpdatePI = UpdatePI;
  vm.PiEditAddRow = PiEditAddRow;
  vm.piEditrowcnt = "1";
  vm.pirowcnt = "1";
  vm.getPiStatus = getPiStatus;
  vm.deletedMaterials = [];
  vm.deleterow = deleterow;
  vm.status = "574450f469f12a253c61bca3";
  vm.statusList = [];
  vm.executiveList = [];
  vm.stateParams = '';
  vm.statusList = $filter('filter')(CONSTANTS.pi_status, function (stat) { return stat.name !== 'Delete' }, true);

  vm.getCompDet = '';
  vm.editCategory = '';

  vm.getCompDet = vm.api.profile.company;
  // var access = storage.get('access');
  // access = JSON.parse(access);
  // if (access !== undefined)
  //   vm.purchaseIndentAccess = access;
  // console.log(access);
  vm.access = '';
  vm.purchaseOrderAccess = vm.access;
  vm.searchType = 'PINo';
  vm.srhTxt = '';
  vm.srhDt = '';
  vm.searchbranch = '';
  // vm.branchList = vm.api.company.branches;
  vm.reload = reload;
  vm.InsertValidation = InsertValidation;
  vm.categoryCH = vm.api.company.category;
  // vm.initialLoading = initialLoading;
  vm.editmaterialchange = editmat;
  vm.matRes = matRes;

  //  CH Change Starts
  // vm.fromProject = '';
  // vm.toProject = '';
  // vm.category = '';
  // vm.subCategory = '';
  // vm.editCategoryPI = '';
  // vm.matRes = matRes;
  // vm.editfromProject = '';
  // vm.edittoProject = '';
  // vm.editSubCategoryMR = '';

  //  CH Change Starts
  vm.fromProject = '';
  vm.toProject = '';
  vm.subCategory = '';
  vm.editCategoryMR = '';
  vm.matRes = matRes;
  vm.editfromProject = '';
  vm.edittoProject = '';
  vm.editSubCategoryPI = '';
  vm.getSubCategory = getSubCategory;
  vm.getMaterial = getMaterial;
  vm.getToProject = getToProject;
  vm.projValidate = projValidate;
  vm.api.toProjectId = vm.toProject;
  vm.initialLoading1 = initialLoading1;
  vm.getEditMaterial = getEditMaterial;
  // For Getting Project based on Emp ID for CH
  var EmpId = {
    "empID": vm.api.profile._id
  }

  $scope.openTrackSheet = function () {
    $state.go("master.purchaseTrackSheet", { 'index': 1 });
  }
  vm.api.companyDet(function(err, data){
       
          vm.companyId = data._id;
     });
  api.branch.branchDDL(function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      vm.branchList = data.branches;
    }
  });

  vm.category = '';

  // Getting Project based on EmpId for CH
  api.ProjectDDL(EmpId, function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
       console.log("Project List",JSON.stringify(data));
       console.log("Project List",JSON.stringify(data.projectList));
      vm.projectList = data.projectList;
      vm.api.projectList = vm.projectList;
    }
  });

  api.ProjectDDL({}, function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      // console.log(JSON.stringify(data.projectList));
      vm.projectList1 = data.projectList;
      vm.api.projectListGrid = vm.projectList1;
    }
  });

  function getToProject(proj) {
    vm.api.piProject = proj;
    if (proj == null) {
      vm.toprojectList = [];
    }
    else {
      api.ProjectDDL({}, function (err, data) {
        if (err) {
          //alert("No Data");
        }
        else {
          vm.toprojectList = data.projectList;
          var filterCat = $filter('filter')(vm.toprojectList, { _id: proj }, true)[0];
          vm.projShCode = filterCat.short_code;
          // alert(JSON.stringify(vm.projShCode));
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

  function getSubCategory(category) {

    vm.storeType = "";
    vm.store = "";
    vm.EditstoreType = "";
    vm.Editstore = "";
    var catList = {
      "catID": category
    }
    // console.log(JSON.stringify(catList));
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

  function getMaterial(data) {
    vm.PurchaseIndentMaterials = [];
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
          vm.api.piUOM = vm.uomList;
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
          vm.api.piMaterial = vm.materialdet;
          // alert(JSON.stringify(vm.api.mrMatEdit));
        }
      })
    } else {
      vm.materialDet = [];
    }

  }

  function getEditMaterial(data) {

    // vm.item.category = 'Select Material';
    if (data) {
      var category = {
        "category": vm.editCategory,
        "sub_category": data
      };
      // vm.category = data;
      vm.materialType = "";
      // vm.item.uom = "";
      // vm.item.avlquantity = "";
      vm.api.getUom({}, function (err, data) {
        if (!err) {
          vm.uomList = data.uomList;
           vm.api.piUOM = vm.uomList;
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
          vm.api.piEditMaterial = vm.materialdet;
          // vm.editmaterials = data.materialsList;
          // vm.api.mrMatEdit = vm.materialdet;
          // alert(JSON.stringify(vm.api.mrMatEdit));
        }
      })
    } else {
      vm.materialType = "";
      vm.item.uom = "";
      vm.item.avlquantity = "";
    }
  }

  function matRes(data) {
    if (!data) {
      vm.materialdet = [];
      // vm.item.id = "";
      // vm.item.uom = "";
      // vm.item.avlblQty = "";
    } else {
      alertify.confirm("Are you sure to Change this Category ?", function (e) {
        if (e) {
          vm.PurchaseIndentEditMaterials = [];
          // vm.materialdet = $filter('filter')(vm.materialAlldet, { 'category': data });
          vm.api.getUom({}, function (err, data) {
            if (!err) {
              vm.uomList = data.uomList;
              vm.api.piUOM = vm.uomList;
            }
          });
          var cat = { 'category': data }
          vm.api.materialLists(cat, function (err, data) {
            if (!err) {
              vm.materialdet = data.materialsList;
              vm.api.piMaterial = vm.materialdet;
            }
          })
        } else {
        }
      });

    }
  }

  // function initialLoading(data) {
  //   if (data == "") {
  //     vm.materialdet = [];
  //     vm.item.name = "";
  //     vm.item.uom = "";
  //     vm.item.avlquantity = "";
  //   } else {

  //     // vm.materialdet = $filter('filter')(vm.materialAlldet, { 'category': data });
  //     vm.api.getUom({}, function (err, data) {
  //       if (!err) {
  //         vm.uomList = data.uomList;
  //         vm.api.piUOM = vm.uomList;
  //       }
  //     });
  //     var cat = { 'category': data }
  //     vm.category = data;
  //     vm.api.materialLists(cat, function (err, data) {
  //       if (!err) {
  //         vm.materialdet = data.materialsList;
  //         vm.api.piMaterial = vm.materialdet;
  //       }
  //     })
  //   }
  // }

  

  function editmat(selected) {
    if (selected) {
      for (var j = 0; j < vm.materialdet.length; j++) {
        if (selected == vm.materialdet[j].id) {
          vm.item.category = vm.editCategory;
          vm.item.id = vm.materialdet[j].id,
            vm.item.name = vm.materialdet[j].name,
            // vm.item.uom = vm.materialdet[j].uom,
            vm.item.uom = $filter('filter')(vm.uomList, { _id: vm.materialdet[j].uom }, true)[0];
          vm.item.avlblQty = vm.materialdet[j].quantity
        }
      }
    } else {
      vm.item.id = "";
      vm.item.category = '';
      vm.item.id = "";
      vm.item.name = "";
      vm.item.uom = "";
      vm.item.avlblQty = "";
    }
  }


  function PIaddrow() {
    if (vm.getCompDet == 'CH0001') {
      if (!vm.fromProject) {
        if ($('.alertify-log').length == 0) {
          alertify.error("please select From Project");
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
      if (!vm.poType) {
        if ($('.alertify-log').length == 0) {
          alertify.error('Please choose Order Type');
        }
        return;
      }
    }
    else {
      if (!vm.SelectedBranch) {
      if ($('.alertify-log').length == 0) {
        alertify.error('Please choose branch');
      }
      return;
    }
    if (!vm.SelectedStoreType) {
      if ($('.alertify-log').length == 0) {
        alertify.error('Please choose storeType');
      }
      return;
    }
    if (vm.getCompDet == 'CH0001') {
      if (!vm.category) {
        if ($('.alertify-log').length == 0) {
          alertify.error('Please choose Category');
        }
        return;
      }
    }
    }
    
    // var category = storage.get('company_master');
    //     category = JSON.parse(category);
    vm.api.MaterialCategory = vm.api.company.category;
    var count = vm.pirowcnt;
    for (var i = 0; i < count; i++) {
      var ObjPI = new Object();
      ObjPI.category_id = vm.editCategory;
      ObjPI.sub_category_id = vm.editSubCategoryPI;
      ObjPI.id = "";
      ObjPI.name = "";
      ObjPI.uom = "";
      ObjPI.quantity = "";
      ObjPI.nomat = 1;
      ObjPI.noqty = 1;
      ObjPI.nocat = 1;
      ObjPI.flag = false;
      vm.PurchaseIndentMaterials.push(ObjPI);
    }
  }
  function getallbranch() {
    // var branch = storage.get('company_master');
    // branch = JSON.parse(branch);
    vm.branchList = vm.api.company.branches;
  }

  function getStoreType(branch) {
    // if(branch == null)
    //   {
    //    vm.storeTypeList = [];
    //   }
    vm.SelectedEditStoreType = "";
    vm.SelectedStoreType = "";
    vm.SelectedStore = "";
    vm.SelectedEditStore = "";

    vm.api.storeType.storeType(branch, function (err, data) {
      if (!err) {
        vm.storeTypeList = data;
      }
    })
  }

  function getStoreName(storetype) {
    if (storetype == "") {
      //    alertify.log("select store type and name");
      vm.storeNameList = [];
      return;
    }
    vm.api.storeName.storeName(storetype, function (err, data) {
      if (!err) {
        vm.storeNameList = data;
      }
    })
  }

  function ModalClose() {
    vm.PurchaseIndentMaterials = [];
    vm.editmaterials = [];
    vm.PurchaseIndentEditMaterials = [];
    vm.PurchaseIndentEdit = [];
    vm.deletedMaterials = [];
    vm.PIRemarks = '';
    vm.pirowcnt = "1";
    vm.SelectedBranch = "";
    vm.SelectedStoreType = "";
    vm.SelectedStore = "";
    vm.fromProject = '';
    vm.category = '';
    vm.subCategory = '';
    vm.poType = '';
  }

  function InsertPurchaseIndent(status) {
    //   if (vm.PurchaseIndentMaterials.length > 0) {
    var status = getPiStatus(status);

    var flag = 0;
    var zero = false;
    // For Colorhomes
    if (vm.getCompDet == 'CH0001') {
      if (vm.fromProject == "" || vm.fromProject == null) {
        if ($('.alertify-log').length == 0) {
          alertify.error("please select From Project");
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
      if (vm.poType == "") {
        if ($('.alertify-log').length == 0) {
          alertify.error("please add Order Type");
        }
        return;
      }
    }
    // For Timbe
    else {
      if (!vm.SelectedBranch) {
      if ($('.alertify-log').length == 0) {
        alertify.error('Please choose branch');
      }
      return;
    }
    if (!vm.SelectedStore) {
      if ($('.alertify-log').length == 0) {
        alertify.error('Please choose store type');
      }
      return;
    }
    }
    

    angular.forEach(vm.PurchaseIndentMaterials, function (values) {
      if (values.id == "" || values.name == "") {
        values.nomat = 0;
        flag = 1;
      }
      else {
        values.nomat = 1;
      }
      if (values.quantity == "") {
        values.noqty = 0;
        flag = 1;
      } else if (parseInt(values.quantity) == 0) {
        values.noqty = 0;
        zero = true;
      }
      else {
        values.noqty = 1;
      }
      if (values.category == "") {
        values.nocat = 0;
        flag = 1;
      }
      else {
        values.nocat = 1;
      }
    });
    var validation = vm.InsertValidation(vm.PurchaseIndentMaterials);
    if (validation == 1) {
      if ($('.alertify-log').length == 0) {
        alertify.error('Repeated Materials not allowed');
      }
      return;
    }
    if (zero) {
      if ($('.alertify-log').length == 0) {
        alertify.error('Please enter quantity');
      }
      return;
    }
    if (flag == 1) {
      if ($('.alertify-log').length == 0) {
        alertify.error('Some fields missing');
      }
      return;
    }
    if (vm.PurchaseIndentMaterials == "") {
      if ($('.alertify-log').length == 0) {
        alertify.error('Purchase Indent is empty');
      }
      return;
    }
    if (vm.PIRemarks == "") {
      if ($('.alertify-log').length == 0) {
        alertify.error('please enter remarks');
      }
      return;
    }

    var mat_status = vm.getPiStatus('Pending');
    vm.materials = [];
    if (vm.getCompDet == 'CH0001' && vm.getCompDet !== 'CO00001') { 
       angular.forEach(vm.PurchaseIndentMaterials, function (materials) {
         if(materials.size) {
            vm.materials.push({
        'category_id': vm.category,
        'sub_category_id': vm.subCategory,
        'id': materials._id,
        'mat_code' : materials.id,
        'name': materials.name,
        'uom': materials.uom,
        'quantity': materials.quantity,
        'avlblQty' : materials.avlquantity,
        'size': materials.size.name,
        'specification': materials.specification,
        'mat_type' : materials.matType,
        'expected_date' : materials.mat_date,
        'flag': true,
        'status': mat_status
      });
         }
         else {
           vm.materials.push({
        'category_id': vm.category,
        'sub_category_id': vm.subCategory,
        'id': materials._id,
        'mat_code' : materials.id,
        'name': materials.name,
        'uom': materials.uom,
        'quantity': materials.quantity,
        'avlblQty' : materials.avlquantity,
        'size': materials.size,
        'specification': materials.specification,
        'mat_type' : materials.matType,
        'expected_date' : materials.mat_date,
        'flag': true,
        'status': mat_status
      });
         }
      
    });
    }
    else {
       angular.forEach(vm.PurchaseIndentMaterials, function (materials) {
      vm.materials.push({
        'category': materials.category,
        'id': materials.id,
        'name': materials.name,
        'uom': materials.uom,
        'quantity': materials.quantity,
        'flag': true,
        'status': mat_status
      });
    });
    }

    // console.log("MATLIST2", JSON.stringify(vm.materials));

   
    var profileName = {
      'id': vm.api.profile._id,
      'name': vm.api.profile.names
    }
    var PurchaseIndent = {
      'company': vm.api.company._id,
      'store': vm.SelectedStore,
      'materials': vm.materials,
      'created_by': profileName,
      'store_type': vm.SelectedStoreType,
      'branch': vm.SelectedBranch,
      'status': status,
      'remarks': vm.PIRemarks,
      'project': vm.fromProject,
      'project_code' : vm.projShCode,
      'category_id': vm.category,
      'sub_category_id': vm.subCategory,
      'order_type':vm.poType
    }
    // console.log('Insert', JSON.stringify(PurchaseIndent));
    vm.InsertNewPI(PurchaseIndent);
    // ModalClose();
  }


  function InsertNewPI(data) {
    vm.api.InsertPI(data, function (err, data) {
      if (!err) {
        // alertify.success(data);
        if ($('.alertify-log-success').length == 0) {
          alertify.success(data);
        }
        $('#modal-id').modal('toggle');
        vm.piGridBind(false, begin, vm.ddlRows);
      } else {
        //alert(JSON.stringify(err));
      }
    })
  }

  // Edit PI 
  $scope.$on('piEdit', function (e, data) {
    var piNo = {
      'pi': [data]
    };
    vm.IndentNo = data;
    vm.getallbranch();
    // var category = storage.get('company_master');
    // category = JSON.parse(category);
    vm.api.MaterialCategory = vm.api.company.category;
    // vm.api.getallmaterials();
    // console.log(piNo);
    vm.api.getPI(piNo, function (err, data) {
      if (!err) {
        //  console.log('edit', data);
        vm.matDetailsPI = data[0].materials;
        vm.PurchaseIndentEdit = data[0];
        vm.PurchaseIndentEditMaterials = data[0].materials;
        // console.log("PI Edit",JSON.stringify(vm.PurchaseIndentEditMaterials));
        vm.getStoreName(data[0].store_type);
        vm.getStoreType(data[0].branch);
        vm.SelectedEditBranch = data[0].branch;
        vm.SelectedEditStoreType = data[0].store_type;
        vm.SelectedEditStore = data[0].store;
        vm.PIEditRemarks = data[0].remarks;
        vm.editCategory = vm.matDetailsPI[0].category_id;
        vm.editSubCategoryPI = vm.matDetailsPI[0].sub_category_id;
        vm.api.piEditMaterial = vm.matDetailsPI;
        vm.editfromProject = data[0].project;
        vm.api.piProject = vm.editfromProject;
        vm.editOrder = data[0].order_type;
        vm.editProjCode = data[0].project_code;
        vm.initialLoading1(vm.editCategory);
        $('#editpopup').modal('toggle');
      } else {

      }
    })
  })

  function updatePurchaseIndent(status) {
    //  if (vm.PurchaseIndentEditMaterials.length > 0) {
    var status = vm.getPiStatus(status);
    var flag = 0;
    var zero = true;
    // For Colorhomes
    if (vm.getCompDet == 'CH0001') {
      if (vm.editfromProject == "" || vm.editfromProject == null) {
        if ($('.alertify-log').length == 0) {
          alertify.error("please select From Project");
        }
        return;
      }
      if (vm.editCategory == "") {
        if ($('.alertify-log').length == 0) {
          alertify.error("please select Category");
        }
        return;
      }
      if (vm.editSubCategoryPI == "") {
        if ($('.alertify-log').length == 0) {
          alertify.error("please add Sub Category");
        }
        return;
      }
      if (vm.editOrder == "") {
        if ($('.alertify-log').length == 0) {
          alertify.error("please add Order Type");
        }
        return;
      }
    }
    // For Timbe
    else {
      if (!vm.SelectedEditBranch) {
      if ($('.alertify-log').length == 0) {
        alertify.error('Please choose branch');
      }
      return;
    }
    if (!vm.SelectedEditStore) {
      if ($('.alertify-log').length == 0) {
        alertify.error('Please choose store type');
      }
      return;
    }
    }
    
    angular.forEach(vm.PurchaseIndentEditMaterials, function (values) {
      if (values.id == "" || values.name == "") {
        values.nomat = 0;
        flag = 1;
      }
      else {
        values.nomat = 1;
      }
      if (values.quantity == "") {
        values.noqty = 0;
        flag = 1;
      } else if (parseInt(values.quantity) == 0) {
        values.noqty = 0;
        zero = true;
      }
      else {
        values.noqty = 1;
      }
      if (values.category == "") {
        values.nocat = 0;
        flag = 1;
      }
      else {
        values.nocat = 1;
      }
    });
    var validation = vm.InsertValidation(vm.PurchaseIndentEditMaterials);
    if (validation == 1) {
      if ($('.alertify-log').length == 0) {
        alertify.error('Repeated Materials not allowed');
      }
      return;
    }
    if (flag == 1) {
      if ($('.alertify-log').length == 0) {
        alertify.error('Some fields missing');
      }
      return;
    }
    if (vm.PIEditRemarks == "") {
      if ($('.alertify-log').length == 0) {
        alertify.error('Please enter Remarks');
      }
      return;
    }
    var mat_status = vm.getPiStatus('Pending');
    vm.materials = [];
    // console.log(JSON.stringify(vm.PurchaseIndentEditMaterials));
    if (vm.getCompDet == 'CH0001') {
    angular.forEach(vm.PurchaseIndentEditMaterials, function (materials) {
      vm.materials.push({
        'category_id': vm.editCategory,
        'sub_category_id': vm.editSubCategoryPI,
        'id': materials.id,
        'mat_code' : materials.mat_code,
        'name': materials.name,
        'uom': materials.uom,
        // 'category': materials.category,
        'size': materials.size,
        'specification': materials.specification,
        'mat_type' : materials.mat_type,
        'expected_date' : materials.expected_date,
        'quantity': materials.quantity,
        'avlblQty' : materials.avlblQty,
        'flag': true,
        'status': mat_status
      });
    });
    }
    else {
      angular.forEach(vm.PurchaseIndentEditMaterials, function (materials) {
      vm.materials.push({
        'category_id': materials.category,
        'sub_category_id': vm.editSubCategoryPI,
        'id': materials.id,
        'mat_code' : materials.mat_code,
        'name': materials.name,
        'uom': materials.uom,
        // 'category': materials.category,
        'quantity': materials.quantity,
        'avlblQty' : materials.avlblQty,
        'flag': true,
        'status': mat_status
      });
    });
    }
    if (vm.getCompDet == 'CH0001') {
    if (vm.deletedMaterials.length > 0) {
      var mat_status = vm.getPiStatus('Delete');
      for (var y in vm.deletedMaterials) {
        vm.materials.push({
          'category_id': vm.editCategory,
          'sub_category_id': vm.editSubCategoryPI,
          'id': vm.deletedMaterials[y].id,
          'name': vm.deletedMaterials[y].name,
          'quantity': vm.deletedMaterials[y].quantity,
          'avlblQty' : vm.deletedMaterials[y].avlblQty,
          'uom': vm.deletedMaterials[y].uom,
          // 'category': vm.deletedMaterials[y].category,
          // 'size': vm.deletedMaterials[y].size.name,
          // 'specification': vm.deletedMaterials[y].specification,
          'mat_type' : vm.deletedMaterials[y].matType,
          'expected_date' : vm.deletedMaterials[y].mat_date,
          'status': mat_status
        })
      }
    }
    }
    else {
      if (vm.deletedMaterials.length > 0) {
      var mat_status = vm.getPiStatus('Delete');
      for (var y in vm.deletedMaterials) {
        vm.materials.push({
          'category_id': vm.deletedMaterials[y].category,
          'sub_category_id': vm.editSubCategoryPI,
          'id': vm.deletedMaterials[y].id,
          'name': vm.deletedMaterials[y].name,
          'quantity': vm.deletedMaterials[y].quantity,
          'avlblQty' : vm.deletedMaterials[y].avlblQty,
          'uom': vm.deletedMaterials[y].uom,
          // 'category': vm.deletedMaterials[y].category,
          // 'size': vm.deletedMaterials[y].size.name,
          // 'specification': vm.deletedMaterials[y].specification,
          'status': mat_status
        })
      }
    }
    }

    // console.log(JSON.stringify(vm.deletedMaterials));

    var profileName = {
      'id': vm.api.profile._id,
      'name': vm.api.profile.names
    }
    var PurchaseIndent = {
      'id': vm.PurchaseIndentEdit.id,
      'company': vm.api.company._id,
      'store': vm.SelectedEditStore,
      'materials': vm.materials,
      'updated_by': profileName,
      'store_type': vm.SelectedEditStoreType,
      'branch': vm.SelectedEditBranch,
      'status': status,
      'remarks': vm.PIEditRemarks,
      'project': vm.editfromProject,
      'project_code' : vm.editProjCode,
      'category_id': vm.editCategory,
      'category_name' : vm.filterCatName,
      'sub_category_id': vm.editSubCategoryPI,
      'order_type':vm.editOrder
    }
    // console.log(JSON.stringify(PurchaseIndent));
    vm.UpdatePI(PurchaseIndent);
    // } else {
    //   if ($('.alertify-log-error').length == 0) {
    //   alertify.error("Purchase indent is Empty");
    //   }
    // }
  }

  function UpdatePI(data) {
    vm.api.UpdatePI(data, function (err, data) {
      if (!err) {
        if ($('.alertify-log-success').length == 0) {
          alertify.success(data);
        }
        $('#editpopup').modal('toggle');
        vm.filterSearch(false, begin, end);
      } else {
        //alert(JSON.stringify(err));
      }
    })
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
      vm.filterSearch(true, begin, vm.end);
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

  // Dropdown Rows Per Page change
  function ddlRowsChange() {
    $scope.currentPage = 1;
    vm.begin = "0";
    if ($scope.step === 2) {
      vm.piGridBind(false, vm.begin, vm.ddlRows);
    }
    else {
      vm.piGridBind(false, vm.begin, vm.ddlRows);
    }

  }

  function piGridBind(isSrh, begin, end) {
    vm.stateParams = null;
    // var access = storage.get('access');
    var access = vm.access;
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
        "limit": vm.end,
        "skip": vm.begin,
        "role_id": vm.api.profile.roles,
        "access": access,
        "status": [vm.status],
      };
    }
    api.storePI.piGrid(filterSearch, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        // console.log(data);
        // vm.mrApp = [];
        // if (flag === '1') {
        vm.paginationNumber = parseInt(vm.begin) == 0 ? 1 : parseInt(vm.begin) + 1;
        $scope.step = 1;
        vm.piApp = data.piList;
        vm.rowCnt = data.count;
        $scope.currentPage = 1;
        // vm.begin = "0";
        // }
        // else {
        //   $scope.step = 2;
        //   vm.piAppList = data.piList;
        //   vm.rowCnt1 = data.count;
        //   $scope.currentPage = 1;
        //   vm.begin = "0";
        // }

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

  function filterSearch(isSrh, begin, end) {
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
        'status': [vm.status]
      };


      if (isSrh) {
        filterSearch = {
          "limit": vm.end,
          "skip": vm.begin,
          "role_id": vm.api.profile.roles,
          'access': access,
          'status': [vm.status],
          "id": vm.searchType == 'PINo' ? (vm.srhTxt ? vm.srhTxt.toUpperCase() : undefined) : undefined,
          "created_name": vm.searchType == 'Executive' ? (vm.srhTxt ? vm.srhTxt : undefined) : undefined,
          "branch": vm.searchType == 'Branch' ? (vm.searchbranch ? vm.searchbranch : undefined) : undefined,
          "datetime": vm.searchType == 'PIDate' ? (vm.srhDt ? vm.srhDt : undefined) : undefined,
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
      vm.purchaseOrderAccess = vm.access;

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
          "id": vm.searchType == 'PINo' ? vm.srhTxt.toUpperCase() : undefined,
          "created_by": vm.searchType == 'Executive' ? vm.srhTxt : undefined,
          "branch": vm.searchType == 'Branch' ? vm.searchbranch : undefined,
          "datetime": vm.searchType == 'PIDate' ? vm.srhDt : undefined
        };
      }
    }
    // console.log(JSON.stringify(filterSearch));
    api.storePI.piGrid(filterSearch, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        vm.paginationNumber = parseInt(vm.begin) == 0 ? 1 : parseInt(vm.begin) + 1;
        vm.piApp = data.piList;
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
      }
    });
  }

  vm.filterSearch(false, begin, end);

  function PiEditAddRow() {
    // var category = storage.get('company_master');
    // category = JSON.parse(category);
    if (vm.getCompDet == 'CH0001') {
      if (!vm.editfromProject) {
        if ($('.alertify-log').length == 0) {
          alertify.error("please select From Project");
        }
        return;
      }
      if (!vm.editCategory) {
        if ($('.alertify-log').length == 0) {
          alertify.error('Please choose Category');
        }
        return;
      }
      if (!vm.editSubCategoryPI) {
        if ($('.alertify-log').length == 0) {
          alertify.error('Please choose Sub Category');
        }
        return;
      }
    }
    else {
     if (!vm.SelectedEditStore) {
      if ($('.alertify-log').length == 0) {
        alertify.error('Please choose store type');
      }
      return;
    }
    }
    
    vm.api.MaterialCategory = vm.api.company.category;
    var count = vm.piEditrowcnt;
    for (var i = 0; i < count; i++) {
      var ObjPI = new Object();
      // vm.getEditMaterial(vm.editSubCategoryPI);
      ObjPI.category_id = vm.editCategory;
      ObjPI.sub_category_id = vm.editSubCategoryPI;
      ObjPI.id = "";
      ObjPI.name = "";
      ObjPI.uom = "";
      ObjPI.quantity = "";
      ObjPI.nomat = 1;
      ObjPI.noqty = 1;
      ObjPI.nocat = 1;
      ObjPI.flag = false;
      vm.PurchaseIndentEditMaterials.push(ObjPI);
    }
  }

  $scope.$on('piTrackSheet', function (e, data) {
    var piNo = {
      'pi': [data]
    };
    $state.go("master.purchaseTrackSheet", { 'index': 1, 'piNo': piNo });
  })

  //Search DDL Select
  $('.search-panel .dropdown-menu').find('a').click(function (e) {
    e.preventDefault();
    var param = $(this).attr("title").replace("#", "");
    var concept = $(this).text();
    $('.search-panel span#search_concept').text(concept);
    $('.input-group #search_param').val(param);

    vm.searchType = param;
    if (param === "PIDate") {
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

  $('.input-group.date').datepicker({
    calendarWeeks: true,
    todayHighlight: true,
    autoclose: true,
    endDate: '+0d',
    closeText: 'Clear',
    clearBtn: true
  });

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

  function deleterow(mode) {
    if (mode == 'add') {
      vm.PurchaseIndentMaterials = $filter('filter')(vm.PurchaseIndentMaterials, { row: false }, true);
    }
    else {
      angular.copy(vm.PurchaseIndentEditMaterials, vm.deletedMaterials);
      vm.PurchaseIndentEditMaterials = $filter('filter')(vm.PurchaseIndentEditMaterials, { row: false }, true);
      vm.deletedMaterials = $filter('filter')(vm.deletedMaterials, { row: true, flag: true }, true);
    }
  }

  $scope.$on('piDelete', function (e, data) {
    var status = vm.getPiStatus('Delete');
    var pi = {
      'company': vm.api.profile.company,
      'id': data,
      'status': status
    };
    // console.log(JSON.stringify(pi));
    vm.api.piDelete(pi, function (err, data) {
      if (!err) {
        if ($('.alertify-log-success').length == 0) {
          alertify.success(data);
        }
        vm.filterSearch(false, begin, end);
      }
    });
  });

  function reload() {
    vm.status = "574450f469f12a253c61bca3";
    $scope.currentPage = 1;
    vm.srhTxt = '';
    vm.srhDt = '';
    vm.searchbranch = '';
    vm.piGridBind(false, 0, 10);
    vm.ddlRows = "10";
  }
  function close() {

  }
  vm.searchClear = searchClear;
  function searchClear() {
    vm.srhTxt = '';
    vm.srhDt = '';
    vm.searchbranch = '';
  }

  vm.clean = clean;
  function clean() { vm.close(); }

  function InsertValidation(data) {
    var flag = 0;
    var materials = [];
    var mat = [];
    angular.forEach(data, function (material) {
      if (material.id !== "") {
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
            return a.nomat = 0
          } else if (a.nomat == 0) {
            a.nomat = 1
          }
        }, true)
      })
    }
    return flag;
  }
}
