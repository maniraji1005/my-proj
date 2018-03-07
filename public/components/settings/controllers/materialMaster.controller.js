'use strict';
angular.module('todo.settings.controllers')
    .controller('materialMasterController', materialMasterController);
materialMasterController.$inject = ['$scope', '$state', 'api', '$timeout', 'storage','$stateParams', '$filter'];
function materialMasterController($scope, $state, api, $timeout, storage, $stateParams, $filter) {
    var vm = this;
    vm.api = api;
    vm.ddlRowsApp = "10";
    vm.mmApp = [];
    vm.ddlRowsChange = ddlRowsChange;
    vm.rowCnt = 0;
    vm.ddlRows = "10";
    vm.edit = mmedit;
    vm.searchfilterSearch = searchfilterSearch;
    vm.filterTxt = '';
    var begin = "0";
    var end = "10";
    var flag = 1;
    vm.begin = "0";
    vm.end = "10";
    vm.close = modalClose;
    vm.searchTxt = searchTxt;
    vm.count = "1";
    vm.reload = reload;
    vm.addRow = addRow;
    vm.materialMasterList = [];
    vm.materialsAdd = [];
    var initializing = true;
    vm.categoryList = [];
    vm.newmaterialAdd = newmaterialAdd;
    vm.statusOpt = '';
    vm.materialDuplicate = materialDuplicate;

    // Default DDL Select
   // vm.ddlRows = "10";
    vm.ddlRowsApp = "10";
    vm.status = "";
    vm.searchType = 'srhName';
    vm.srhName = '';
    vm.srhId = '';
    vm.srhpro = '';
    vm.srhCate = '';
    vm.srhSubCate = '';
    var access = storage.get('access');
    if(access){
        vm.MaterialMasterAccess = JSON.parse(access);
        vm.api.mmAccess = vm.MaterialMasterAccess;
    }
    vm.getCompDet = '';
        
   vm.getCompDet = vm.api.profile.company;
     vm.api.companyDet(function(err, data){
       
          vm.companyId = data._id;
     });
     vm.api.getUom({}, function(err, data){
         
     });


    // default loading

function materialDuplicate() {
    var flag = 0;
    var materials = [];
    var mat = [];
   if(vm.getCompDet == "CO00001") {
       angular.forEach(vm.materialsAdd, function(material){
       mat = $filter('filter')(vm.materialsAdd, {name: material.name}, true);
       if(mat.length > 1){
          materials = mat
       }
   })
    if(materials.length > 1){
      angular.forEach(materials, function(d){
          $filter('filter')(vm.materialsAdd, function(a){
            if(d.name == a.name){
              flag = 1
              return a.nameIsEmpty = true;
            }else if(a.nameIsEmpty){
              a.nameIsEmpty = false;
            }
          }, true)
      })
    }
   }
    if(vm.getCompDet == "CH0001") {
    angular.forEach(vm.materialsAdd, function(material){
    mat = $filter('filter')(vm.materialsAdd, function(g){
           return g.name == material.name && g.category == material.category
       }, true);
       if(mat.length > 1){
          materials = mat
       }
   })
    if(materials.length > 1){
      angular.forEach(materials, function(d){
          $filter('filter')(vm.materialsAdd, function(a){
            if(d.name == a.name && d.category == a.category){
              flag = 1
              return a.nameIsEmpty = true;
            }else if(a.nameIsEmpty){
              a.nameIsEmpty = false;
            }
          }, true)
      })
    }
   }
return flag;
  }

  function searchfilterSearch(isSrh, begin, end) {
        var access = storage.get("access");
        access = JSON.parse(access);
        var filterSearch = {
           "limit": end,
           "skip": begin,
           "role_id": vm.api.profile.roles,
           "created_by": vm.api.profile._id,
           "status": "Active",
           "access": access
    };


    if (isSrh || vm.srhMatId || vm.srhCate) {
      filterSearch = {
        "limit": vm.end,
        "skip": begin,
        "role_id": vm.api.profile.roles,
        "status": "Active",
        "access": access,
     //   "id": vm.searchType == 'MatId' ? ( vm.srhMatId ? vm.srhMatId.toUpperCase() : undefined): undefined,
        "name": vm.searchType == 'srhName' ?  (vm.srhName ? vm.srhName : undefined) : undefined,
        "category": vm.searchType == 'srhCate' ? (vm.srhCate ? vm.srhCate : undefined) : undefined, 
        "sub_category": vm.searchType == 'srhSubCate' ? (vm.srhSubCate ? vm.srhSubCate : undefined) : undefined ,
        "id": vm.searchType == 'srhId' ? (vm.srhId ? vm.srhId : undefined) : undefined 
      };
    }
           vm.api.getUom({},function (err, data) {
            if (!err) {
                vm.api.uomList = data.uomList;
            }
        });
        vm.api.getsizeList({}, function (err ,data) {
            if(!err) {
              vm.api.getSizeList = data.materialSizeList;
            }
        });
         vm.api.mmGrid.mmGrid(filterSearch, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
           if ('name' != vm.srhName || 'category' != vm.srhCate || 'subcategory' != vm.srhSubCate  || 'id' != vm.srhId) {
                    vm.rowCnt = 0;
                }
        vm.paginationNumber = parseInt(vm.begin) == 0 ? 1 : parseInt(vm.begin) + 1;
        vm.mmApp = data.materialsList;
        vm.rowCnt = data.count;
        vm.ddlRowsApp = "10";
      }
    });
  }


    //addRpw for materialRequest
    vm.searchfilterSearch(false, begin, end);

    function ddlRowsChange() {
        vm.begin = "0";
        $scope.currentPage = 1;
        vm.searchfilterSearch(false, vm.begin, vm.ddlRows);
    }
    function mmedit(data) {
        vm.item.qunatity = data.materialList.quantity;
    }

    function addRow() {
        if (vm.category == undefined || vm.category == "") {
            if($('.alertify-log').length == 0){
            alertify.log("Please select category");
            }
            return;
        }
        if(vm.getCompDet == 'CH0001' && vm.subCategory == "" || vm.getCompDet == 'CH0001' && vm.subCategory == undefined) {
            if($('.alertify-log').length == 0) {
                alertify.log("please select subCategory");
            }
            return;
        }
        var count = vm.count;


      

        for (var i = 0; i < count; i++) {
            var ObjMaterial = new Object();
            ObjMaterial.category = vm.category;
            ObjMaterial.catName=$("#popCatDDL option:selected").html();
            ObjMaterial.subcategory = vm.subCategory;
            ObjMaterial.id = "";
            ObjMaterial.company = vm.getCompDet;
            ObjMaterial.name = "";
            ObjMaterial.uom = "";
            ObjMaterial.matSize = "";
            ObjMaterial.specification = "";
            ObjMaterial.minimum_quantity = "";
            ObjMaterial.quantity = "";
            ObjMaterial.rate = "";
            ObjMaterial.status = "Active";
            ObjMaterial.flag = true;
            ObjMaterial.branch = vm.api.profile.branch;
            ObjMaterial.store = vm.api.profile.store;
            ObjMaterial.matType ="";
          //  ObjMaterial.matType_name = "LOCAL";
            ObjMaterial.store_type = vm.api.profile.store_type;
            ObjMaterial.created_by = vm.api.profile._id,
            vm.materialsAdd.push(ObjMaterial);
        }

    }
     $scope.$on('deleteAddMaterilas', function(e,data)
    {

        vm.materialsAdd.splice(data, 1);
    })

    function modalClose()
    {
        vm.materialsAdd = [];
        vm.category = [];
        vm.count = "1";
        vm.subCategory = [];
        vm.subCategoryList = "";

    }
 
 
 //get projectlist
    vm.api.proGrid({}, function (err, data) {
    if (!err) {
      vm.projectList = data.projectList;
     // vm.api.projectList = data.projectList;
    }
  });

// for subcategoryList
vm.api.getSubCategory({}, function (err, data) {
     if (err) {
        //alert("No Data");
     } else {
       vm.subCategoryList = data.subcatgoriesList;
     }
   });

    // pagination
    // Rows per Page
    var noRows = vm.ddlRows;
    // For getting Start Limit and End Limit
    $scope.currentPage = 1
        , $scope.numPerPage = parseInt(vm.ddlRows)
        , $scope.maxSize = 3;
//          $scope.numPerPage = function () {
//     return Math.ceil($scope.mmApp.length / vm.ddlRows);
//   };
    $scope.$watch('currentPage + numPerPage', function () {
        var begin = (($scope.currentPage - 1) *  vm.ddlRows)
            , end =  vm.ddlRows;
        $scope.slno = begin;
        if (initializing) {
            $timeout(function () {
                initializing = false;
            });
        } else {
            vm.begin = begin;
            vm.end = vm.ddlRows.toString();
            vm.searchfilterSearch(true, vm.begin, vm.end);
        }
    });
      

    $scope.checkCnt = function (rowCnt) {
        var noRows = $("#ddlNoRows").val();
        if (parseInt(rowCnt) > parseInt(vm.ddlRows)) {
            return true;
        }
        else {
            return false;
        }
    }

    // reload
        function reload()
        {   
            $scope.currentPage = 1;
            vm.srhName = "";
            vm.srhId = "";
            vm.srhpro = "";
            vm.srhCate = "";
            vm.srhSubCate = "";
            vm.count = "1";
            vm.ddlRows = "10";
            vm.searchfilterSearch(false, begin, vm.ddlRows);
         }
    //Search DDL Select
   $('.search-panel .dropdown-menu').find('a').click(function(e) {
    e.preventDefault();
  var param = $(this).attr("title").replace("#","");
  var concept = $(this).text();
   $('.search-panel span#search_concept').text(concept);
  $('.input-group #search_param').val(param);
    
     
    
    
 });

 api.categoryGrid.categoryGrid({}, function (err, data) {
        if (err) {
            //alert("No Data");

        } else {
           vm.categoryList  = data.categoryList;
        }
    });

    api.branch.branchDDL(function (err, data) {
            if (err) {
                //alert("No Data");
            }
            else {
                var branch = vm.api.company.branches;
                var status = vm.api.company.mr_status;
                var category = vm.api.company.category;
                vm.branchList = branch;
                vm.statusList = status;
               // vm.categoryList = category;
                vm.api.MaterialCategory = vm.categoryList;

            }
        });
      
 //for colorhomes
    vm.getsubCategory = getsubCategory;
    function getsubCategory (data)
    {
        if(data == null)
        {
            vm.subCategoryList = "";
            vm.sizeList = "";
            vm.api.getSize = "";
        }
        else{
        var category = {
            "catID" : data
        }
        vm.api.getSubCategory(category, function (err, data) {
            if(err) {
                //laert("No Data");
            } else {
                vm.subCategoryList = data.subcatgoriesList;
            }
        });
             vm.api.getsizeList(category, function (err ,data) {
            if(!err) {
               vm.sizeList = data.materialSizeList;
               vm.api.getSize = vm.sizeList;
            }
        });}
    }
    function newmaterialAdd() {
        var flag = 0;
     
        if(vm.materialsAdd == undefined || vm.materialsAdd == "")
        {
            if($('.alertify-log').length == 0)
            {
                alertify.log("please Add Material");
            }
             return;
        }
        angular.forEach(vm.materialsAdd, function (materials) {
            if (materials.id == "" && vm.getCompDet == "CO00001" ) {
                materials.idIsEmpty = true;
                flag = 1;
            } else {
                flag = 0;
            }
            if (materials.matType == ""  && vm.getCompDet == "CH0001") {
                materials.MatTypeEmpty = true;
                flag = 1;
            }
            else {
                materials.MatTypeEmpty = false;
                flag = 0;
            }
            if (materials.matType == ""  && vm.getCompDet == "CH0001") {
                materials.MatTypeEmpty = true;
                flag = 1;
            }
            else {
                materials.MatTypeEmpty = false;
                flag = 0;
            }
            if (materials.matSize == ""  && vm.getCompDet == "CH0001") {
                materials.sizeIsEmpty = true;
                flag = 1;
            }
            else {
                materials.sizeIsEmpty = false;
                flag = 0;
            }
            if (materials.name == "") {
                materials.nameIsEmpty = true;
                flag = 1;
            }
            else {
                 materials.nameIsEmpty = false;
               flag = 0;
            }
            if (materials.specification == ""  && vm.getCompDet == "CH0001" ) {
                materials.specIsEmpty = true;
                flag = 1;
            }
            else {
                 materials.specIsEmpty = false;
               flag = 0;
            }
            if (materials.quantity == "" && vm.getCompDet == "CO00001") {
                materials.quantityIsEmpty = true;
                flag = 1;
            }
            if (materials.minimum_quantity == ""  && vm.getCompDet == "CO00001") {
            // if (materials.quantity == "" && vm.companyId == "CO00001") {
            //     materials.quantityIsEmpty = true;
            //     flag = 1;
            // }
                materials.minimum_quantityIsEmpty = true;
                flag = 1;
            }
            if (materials.rate == "" && vm.getCompDet == "CO00001") {
                materials.rateIsEmpty = true;
                flag = 1;
            }
            if (materials.uom == "") {
                materials.uomIsEmpty = true;
                flag = 1;
            }
            else{
                 materials.uomIsEmpty = false;
                 flag = 0;
            }
           
        });
         var matdup = vm.materialDuplicate();
         
            if(matdup)
            {
               // vm.materialsAdd[i].nomat = "0";
               if($('.alertify-log').length == 0){
                alertify.log("Repeated material name not allowed");
               }
                return;
            }
         if (flag == 1) {
            if($('.alertify-log').length == 0){
            alertify.log("Some fields missing");
            }
            return;
        }
      // console.log("MAT",JSON.stringify(vm.item.matType));
        vm.api.insertMaterial(angular.toJson(vm.materialsAdd), function (err, data) {
            if (!err) {
                // // console.log(data);
                // // if(data.length > 0){
                // //     if ($('.alertify-log-error').length == 0) {
                // //         alertify.error("Material Already Exist");
                // //     }
                //     if ($('.alertify-log-error').length == 0) {
                //         alertify.error(data[0].error);
                //     }
                //     // var material = [];
                //     // var filteredMaterials = [];
                //     // angular.forEach(data, function(e){
                //     //         filteredMaterials =  $filter('filter')(vm.materialsAdd, function(a){
                //     //         return e.id == a.id
                //     //     }, true);
                //     // })
                //     // vm.materialsAdd = filteredMaterials;


            if(data.length > 0){

                    if ($('.alertify-log-error').length == 0) {
                        alertify.error(data[0].error);
                        return;
                    }
                    var material = [];
                    var filteredMaterials = [];
                    angular.forEach(data, function(e){
                            filteredMaterials =  $filter('filter')(vm.materialsAdd, function(a){
                            return e.id == a.id
                        }, true);
                    })
                    vm.materialsAdd = filteredMaterials;
                }
                else if(data.failure){
                     if ($('.alertify-log-error').length == 0) {
                        alertify.error("Material Already Exist");
                        return;
                    }
                    var material = [];
                    var filteredMaterials = [];
                    angular.forEach(data.failure, function(e){
                            filteredMaterials =  $filter('filter')(vm.materialsAdd, function(a){
                            return e.id == a.id
                        }, true);
                    })
                    vm.materialsAdd = filteredMaterials;
                }else{
                    if ($('.alertify-log-success').length == 0) {
                        alertify.success("Successfully Inserted");
                    }
                   vm.searchfilterSearch(false, begin, vm.ddlRows);
                    reload();
                    vm.materialsAdd = [];
                    vm.category = [];
                    vm.count = "1";
                    vm.subCategory = [];
                    vm.subCategoryList = "";
                    $('#addpopup').modal("toggle");
                }
                }else{

                }
        });
    }
    
    $scope.$on('editedMaterial', function (e, data) {
        data.updated_by = {
            "_id":vm.api.profile._id,
            "name":vm.api.profile.name
        };
        // console.log(JSON.stringify(data));
        vm.api.editMaterial(data, function (err, data) {
            if (!err) {
                if ($('.alertify-log-success').length == 0) {
          alertify.success(data);
            vm.searchfilterSearch(false, vm.begin, vm.end);
        }
            }else{
                 if ($('.alertify-log-error').length == 0) {
                     alertify.error("Material Name already Exist");
                    vm.searchfilterSearch(false, vm.begin, vm.end);
                 }
                   return;
            }
        });
    });
   
    // delete
 $scope.$on('Materialdelete', function (e, data) {
        data.updated_by = {
            "_id":vm.api.profile._id,
            "name":vm.api.profile.name
        };
        data.status ="Inactive";
        // console.log(JSON.stringify(data));
        vm.api.editMaterial(data, function (err, data) {
            if (!err) {
                if($('.alertify-log-success').length == 0){
                alertify.success("successfully deleted");
                }
                vm.searchfilterSearch(false, vm.begin, vm.end);
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
    if (param === "srhName") {
      $("#srhName").show();
      $("#srhId").hide();
      $("#srhCate").hide();
      $("#srhSubCate").hide();
    }  else if (param === "srhId") {
      $("#srhId").show();
      $("#srhName").hide();
      $("#srhCate").hide();
      $("#srhSubCate").hide();
    }else if (param === "srhCate") {
      $("#srhId").hide();
      $("#srhName").hide();
      $("#srhCate").show();
      $("#srhSubCate").hide();
    }
    else {
      $("#srhId").hide();
      $("#srhName").hide();
      $("#srhCate").hide();
      $("#srhSubCate").show();
    }
  });
  function searchTxt()
  {
        vm.srhName = '';
        vm.srhId = '';
        vm.srhpro = '';
        vm.srhCate = '';
        vm.srhSubCate = '';
  }
 
  function getsize(data)
  {
      var size = {
                "catID" : data
            } 
             vm.api.getsizeList(size, function (err ,data) {
            if(!err) {
               vm.sizeList = data.materialSizeList;
               vm.api.getSize = vm.sizeList;
            }
        });
  }
}