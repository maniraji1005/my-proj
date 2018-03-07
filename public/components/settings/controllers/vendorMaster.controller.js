(function () {
    'use strict';
    angular.module('todo.settings.controllers')
        .controller('vendorMasterController', vendorMasterController);
    vendorMasterController.$inject = ['$scope' ,'api', 'storage', '$filter', '$timeout'];
    function vendorMasterController($scope, api,storage, $filter, $timeout) {
        var vm = this;
        vm.vendorList = [];
        var vm = this;
        vm.api = api;
        vm.ddlRowsApp = "10";
        vm.mmApp = [];
        vm.ddlRowsChange = ddlRowsChange;
        vm.rowCnt = 0;
        vm.ddlRows = "10";
        // vm.edit = mmedit;
        vm.reload = reload;
        vm.searchTxt = searchTxt;
        vm.filterTxt = '';
        var begin = "0";
        var end = "10";
        var flag = 1;
        vm.begin = "0";
        vm.end = "10";
        vm.count = 1;
        vm.close = addClose;
        // vm.addRow = addRow;
        vm.vendorMasterList = [];
        vm.categoryList = [];
        vm.getMaterial = getMaterial;
        vm.categoryName = [];
        vm.materialdet = [];
        var catgResult = [];
        vm.matList = [];
        vm.vengetDet = [];
        $scope.vengetDet = [];
        vm.vendorId = '';
        vm.vendorName = '';
        vm.mobileNo = '';
        vm.address = '';
        vm.emailId = '';
        vm.pan = '';
        vm.tin = '';
        vm.bank = '';
        vm.branchName = '';
        vm.ifsc = '';
        vm.acc1 = '';
        vm.SelectedVendor = '';
        vm.sendVendorDet = sendVendorDet;
        vm.insertVendorDet = insertVendorDet;
        vm.vendorMasterSrh = vendorMasterSrh;
        vm.categoryId = [];
        vm.type = '';
        //  var vendorname = [];
        // Default DDL Select
        vm.ddlRows = "10";
        vm.ddlRowsApp = "10";
        vm.status = "";
        vm.searchType = 'vendorId';
        vm.vendorType == '57c0596e20a1d133e4eaf886';
        vm.srhvendorName = '';
        vm.vendorType = '';
        vm.catdisabled = {};
        vm.vendorEditedDet = {};
        var access = storage.get('access');
        if(access){
            vm.vendorAccess = JSON.parse(access);
            vm.api.vendorAccess = vm.vendorAccess;
        }
        vm.vendorIsMandatory = vendorIsMandatory;
        
        vm.getProfileDet = [];

         vm.api.companyDet(function(err, data){
       
          vm.companyId = data._id;
          });
        vm.getCompDet = '';
        
        vm.getCompDet = vm.api.profile.company;
         vm.api.getSubCategory({}, function (err, data) {
      if (err) {
        //laert("No Data");
      } else {
        vm.subCategoryList = data.subcatgoriesList;
        vm.api.subcate =  vm.subCategoryList;
        //  alert(JSON.stringify(data.))
      }
    });
        vm.api.bankDetails({}, function ( err, data) {
            if(!err) {
                vm.bankList = data.bankList;
            }
        });

      
        if(vm.getCompDet == "CH0001") {
        vm.vendorTypeList = [];
        var ven = vm.api.company.vendor_type;
        if(ven){
        for( var k = 0 ; k < ven.length ; k++) {
             vm.vendorTypeList.push(ven[k]);
        }
      
        }}

    //    console.log("son",CONSTANTS.mrn_status);

   
        var initializing = true;
        function vendorMasterSrh(isSrh, begin, end) {
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


            if (isSrh) {
                filterSearch = {
                    "limit": vm.end,
                    "skip": begin,
                    "role_id": vm.api.profile.roles,
                    "status": "Active",
                    "access": access,
                    "id": vm.searchType == 'vendorId' ? (vm.srhvendorId ? vm.srhvendorId.toUpperCase() : undefined) : undefined,
                    "name": vm.searchType == 'vendorName' ? (vm.srhvendorName ? vm.srhvendorName : undefined) : undefined,
                };
            }
            // console.log(JSON.stringify(filterSearch));
            vm.api.vendorDDL(filterSearch, function (err, data) {
                if (err) {
                    //alert("No Data");
                }
                else {
                    vm.paginationNumber = parseInt(vm.begin) == 0 ? 1 : parseInt(vm.begin) + 1;
                    //    vendorname = data.vendorsList;
                    vm.vendorList = data.vendorsList;
                    vm.rowCnt = data.count;
                    vm.ddlRowsApp = "10";
                }
            });
        }
        vm.vendorMasterSrh(false, begin, end);

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
                vm.categoryList = category;
                vm.api.MaterialCategory = vm.categoryList;

            }
        });

        function getMaterial(data) {
            if(data == "" || data == undefined || data == null){
                return;
            }
            // alert(JSON.stringify(data));
            vm.categoryId.push(data);
            var catList = $filter('filter')(vm.categoryList, { "_id": data }, true)[0];



            //    vm.api.categoryName = vm.categoryName;
            var category = {
                "category": data
            };
            vm.materialType = "";
            if (data == null) {
                vm.materialType = "";
            }
            vm.api.materialLists(category, function (err, data) {
                if (err) {

                } else {
                    vm.categoryName = catList;
                    vm.matList.push({
                        "materialdet": data.materialsList,
                        "categorydet": vm.categoryName
                    })
                }
            })
        }
        //addRpw for materialRequest
        

        function ddlRowsChange(data) {
            vm.begin = "0";
            $scope.currentPage = 1;
            vm.vendorMasterSrh(false, vm.begin, vm.ddlRows);
        }

        // pagination
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
                vm.vendorMasterSrh(true, begin, end);
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
        // reload
          function reload()
    {
        vm.srhvendorId = "";
        vm.srhvendorName = "";
        $scope.currentPage = 1;
        vm.ddlRows ="10";
        vm.vendorMasterSrh(false, begin, vm.ddlRows);
    }

    vm.vendorValidation = vendorvalidation;

    function vendorvalidation(){
        var flag = true;
        if (vm.vendorId == "" && vm.getCompDet == "CO00001") {
                if ($('.alertify-log-error').length == 0) {
                    alertify.error("Please enter Vendor Id");
                }
                flag = false;
            }
            if (vm.vendorName == "" && vm.getCompDet == "CO00001") {
                if ($('.alertify-log-error').length == 0) {
                    alertify.error("Please enter Vendor Name");
                }
                flag = false;
            }
             if (vm.vendorName == "" && vm.getCompDet == "CH0001") {
                if ($('.alertify-log-error').length == 0) {
                    alertify.error("Please enter Merchant Name");
                }
                flag = false;
            }
            //  if (vm.vendorType == "" &&  vm.getCompDet == "CO00001") {
            //     if ($('.alertify-log-error').length == 0) {
            //         alertify.error("Please Select Type");
            //     }
            //     flag = false;
            // }
             if (vm.vendorType == "" &&  vm.getCompDet == "CH0001" || vm.vendorType == null &&  vm.getCompDet == "CH0001") {
                if ($('.alertify-log-error').length == 0) {
                    alertify.error("Please Select MerchantType");
                }
                flag = false;
            }

            if (vm.mobileNo == "" && vm.getCompDet == "CO00001" || vm.mobileNo == "" && vm.vendorType._id == '57c0596e20a1d133e4eaf886') {
                if ($('.alertify-log-error').length == 0) {
                    alertify.error("Please enter Mobile No");
                }
                flag = false;
            }
            if (vm.mobileNo.length > 10 && vm.getCompDet == "CO00001" || vm.mobileNo.length < 10 && vm.getCompDet == "CO00001"||
                vm.mobileNo.length > 10 && vm.vendorType._id == '57c0596e20a1d133e4eaf886'  || vm.mobileNo.length < 10 && vm.vendorType._id == '57c0596e20a1d133e4eaf886' ) {
                if ($('.alertify-log-error').length == 0) {
                    alertify.error("Please enter valid Mobile No");
                }
                flag = false;
            }
             if(vm.address == "" && vm.getCompDet == "CO00001" || vm.address == "" && vm.vendorType._id == '57c0596e20a1d133e4eaf886' )
            {
                if($('.alertify-log-error').length == 0) {
                    alertify.error("Please enter address");
                }
                flag = false;
            }
            if(vm.emailId == "" && vm.getCompDet == "CO00001" )
            {
                 if ($('.alertify-log-error').length == 0) {
                    alertify.error("Please enter email id");
                }
                flag = false;
            }
            if(vm.pan == "" && vm.vendorType._id == '57c0596e20a1d133e4eaf886' || vm.pan == "" && vm.vendorType == 'Standard')
            {
                 if ($('.alertify-log-error').length == 0) {
                    alertify.error("Please enter PAN number");
                }
                flag = false;
            }
            if(vm.tin == ""  && vm.vendorType._id == '57c0596e20a1d133e4eaf886' || vm.tin == ""  && vm.vendorType == 'Standard')
            {
                 if ($('.alertify-log-error').length == 0) {
                    alertify.error("Please enter TIN No");
                }
                flag = false;
            }
            if(vm.bank == ""  && vm.vendorType._id == '57c0596e20a1d133e4eaf886' || vm.bank == ""  && vm.vendorType == 'Standard')
            {
                 if ($('.alertify-log-error').length == 0) {
                    alertify.error("Please Select Bank");
                }
                flag = false;
            }
            if(vm.branchName == "" && vm.vendorType._id == '57c0596e20a1d133e4eaf886' || vm.branchName == "" && vm.vendorType == 'Standard')
            {
                 if ($('.alertify-log-error').length == 0) {
                    alertify.error("Please enter Branch");
                }
                flag = false;
            }
            if(vm.ifsc == "" && vm.vendorType._id == '57c0596e20a1d133e4eaf886' || vm.ifsc == "" && vm.vendorType == 'Standard')
            {
                 if ($('.alertify-log-error').length == 0) {
                    alertify.error("Please enter IFSC Code");
                }
                flag = false;
            }
            if(vm.ifsc.length > 11  && vm.vendorType._id == '57c0596e20a1d133e4eaf886' || vm.ifsc.length < 11 && vm.vendorType._id == '57c0596e20a1d133e4eaf886'
            || vm.ifsc.length >11  && vm.vendorType == 'Standard' || vm.ifsc.length < 11 && vm.vendorType == 'Standard' )
            {
                 if ($('.alertify-log-error').length == 0) {
                    alertify.error("IFSC code should be 11 digit");
                }
                flag = false;
            }
            if(vm.acc1 == "" && vm.vendorType._id == '57c0596e20a1d133e4eaf886' || vm.acc1 == "" && vm.vendorType == 'Standard')
            {
                 if ($('.alertify-log-error').length == 0) {
                    alertify.error("Please enter Acc No1");
                }
                flag = false;
            }
           
            if(vm.type == "" && vm.getCompDet == "CO00001"){
                if ($('.alertify-log-error').length == 0) {
                    alertify.error("Please select  type");
                }
                flag = false;
            }
            
            if (vm.categoryId == "") {
                if ($('.alertify-log-error').length == 0) {
                    alertify.error("Please Select Category");
                }
                flag = false;
            }
            return flag;
        }
        // Insert Vendor Details
        function insertVendorDet() {
            // var arr = _.find(vendorname, { "vendorname": vm.vendorName });
            // if (arr) {
            // alertify.log("already exists");
            // return;
            // 
        
            var vendor = vm.vendorValidation();
            if(vendor){
              //  if (vm.api.vendorAddedMaterials.length > 0) {
                vm.vendorMaterial = [];
                vm.getOrder = [];
               
               var category = _.uniq(vm.categoryId);

               var flag= true;
               var filtertedMat = [];
                var category = _.uniq(vm.categoryId);
                angular.forEach(category, function(a){
                     filtertedMat = $filter('filter')(vm.api.vendorAddedMaterials, {category : a}, true)
                     if(filtertedMat.length == 0){
                         var catNam = $filter('filter')(vm.categoryList, { _id : a}, true)[0];
                          if($('.alertify-log-error').length == 0)
                          {
                         alertify.error("Please choose material for "+catNam.name+" category");
                          }
                           flag = false;
                     }
                })
                if(!flag)
                {
                    return ;
                }


                if(vm.getCompDet == "CH0001")
                {
                var vendorList = {
                   // "id": vm.vendorId,
                    "name": vm.vendorName,
                    "contact_no": vm.mobileNo,
                    "address": vm.address,
                    "email": vm.emailId,
                    "type": "CST",
                    "merchant_type" : vm.vendorType._id,
                    "merchant_type_name" : vm.vendorType.name,
                    "created_by": vm.api.profile._id ,
                    "materials": vm.api.vendorAddedMaterials,
                    "categories": category,
                    "status": "Active",
                    "pan" : vm.pan,
                    "tin" : vm.tin,
                    "cst" : vm.cst,
                    "acc1" :vm.acc1,
                    "acc2" :vm.acc2,
                    "isfc" : vm.ifsc,
                    "bank" : vm.bank,
                    "serviceTax" : vm.serviceTax,
                    "branch" : vm.branchName,
                    "landline_no" :vm.landlineNo

                }
            }
            else
            {
                var vendorList = {
                    "id": vm.vendorId,
                    "name": vm.vendorName,
                    "contact_no": vm.mobileNo,
                    "address": vm.address,
                    "email": vm.emailId,
                    "type": vm.type,
                    "created_by": {"_id" : vm.api.profile._id },
                    "materials": vm.api.vendorAddedMaterials,
                    "categories": category,
                    "status": "Active"
                }
            }
                vm.sendVendorDet(vendorList);

            // } else {
            //     if ($('.alertify-log-error').length == 0) {
            //         alertify.error("Please choose Materials");
            //     }
            // }
            }
        }

        function sendVendorDet(vendorList) {
            api.vendorDet(vendorList, function (err, data) {
                if (err) {
                    if($('.alertify-log').length == 0)
                    {
                      alertify.log(err.data);
                    }
                    return;
                } else {
                    // alert(JSON.stringify(data));
                    $('#addpopup').modal('toggle');
                    if ($('.alertify-log-success').length == 0) {
                        alertify.success(data);
                    }
                //    vm.vendorMasterSrh(false, begin, end);
                reload();
                    addClose();
                
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
        });

        // $scope.$on('vendorGetDetails', function (e, data) {

        // })


        $scope.$on('deleteVendor', function (e, data) {
            data.updated_by = {
                "_id": vm.api.profile._id,
                "name": vm.api.profile.name
            };
            data.status = "Inactive";
            // console.log(JSON.stringify(data));
            vm.api.deleteVendor(data, function (err, data) {
                if (!err) {
                    if($('.alertify-log-success').length == 0){
                    alertify.success("successfully deleted");
                    }
                    vm.vendorMasterSrh(false, vm.begin, vm.end);
                } else {
                    //alert(JSON.stringify(err));
                }
            });
        });

        $('.search-panel .dropdown-menu').find('a').click(function (e) {
            e.preventDefault();
            var param = $(this).attr("title").replace("#", "");
            var concept = $(this).text();
            $('.search-panel span#search_concept').text(concept);
            $('.input-group #search_param').val(param);
            vm.searchType = param;
            if (param === "vendorId") {
                $("#srhvendorId").show();
                $("#srhvendorName").hide();
            } else if (param === "vendorName") {
                $("#srhvendorName").show();
                $("#srhvendorId").hide();
            }
        });
        // search text clear

        function searchTxt()
        {
            vm.srhvendorId = '';
            vm.srhvendorName = '';
        }



        // vendor mandatory hide show
        function vendorIsMandatory(type)
        {
            if(type._id === "57c0596e20a1d133e4eaf886") {
                return true;
            }

            return false;
        }
        vm.vendorIsMandatory1 = vendorIsMandatory1;
        function vendorIsMandatory1(type)
        {
            if(type === "Standard") {
                return true;
            }

            return false;
        }
       
        $scope.$on('editvendor', function (e, data) {
            if(vm.getCompDet == "CH0001") {
            vm.api.getVendor({ id: data }, function (err, data) {
                if (!err) {
                    vm.vendorEditedDet = data.vendorsList[0];
                    vm.vendorId = data.vendorsList[0].id;
                    vm.vendorName = data.vendorsList[0].name;
                    vm.mobileNo = data.vendorsList[0].contact_no;
                    vm.address = data.vendorsList[0].address;
                    vm.emailId = data.vendorsList[0].email;
                    vm.type = data.vendorsList[0].type ? data.vendorsList[0].type : 'CST';
                    vm.pan = data.vendorsList[0].pan;
                    vm.tin = data.vendorsList[0].tin;
                    vm.cst = data.vendorsList[0].cst;
                    vm.acc1 = data.vendorsList[0].acc1;
                    vm.acc2 = data.vendorsList[0].acc2;
                    vm.ifsc = data.vendorsList[0].ISFC_code;
                    vm.bank = data.vendorsList[0].bank;
                    vm.servicetax = data.vendorsList[0].serviceTax;
                    vm.branchName = data.vendorsList[0].branch;
                    vm.landline = data.vendorsList[0].landLineNo;
                    vm.merchantType = data.vendorsList[0].merchant_type;
                    if( vm.getCompDet == 'CH0001') {
                         vm.EditmerchantTypename =$filter('filter')(vm.api.company.vendor_type, { _id :vm.EditmerchantType }, true)[0]; 
                         vm.vendorType  = vm.EditmerchantTypename.name;
                    }
                                                                                 
                    vm.api.vendorMaterialsDet = data.vendorsList[0].materials;
                    // vm.EditName  = vm.EditmerchantTypename.name;
                    angular.forEach(data.vendorsList[0].categories, function (a) {
                        vm.getMaterial(a);
                        vm.catdisabled[a] = true;
                    })
                    $('#editpopup').modal('toggle');
                }
            });
            }
            else
            {
                 vm.api.getVendor({ id: data }, function (err, data) {
                if (!err) {
                    vm.vendorEditedDet = data.vendorsList[0];
                    vm.vendorId = data.vendorsList[0].id;
                    vm.vendorName = data.vendorsList[0].name;
                    vm.mobileNo = data.vendorsList[0].contact_no;
                    vm.address = data.vendorsList[0].address;
                    vm.emailId = data.vendorsList[0].email;
                    vm.type = data.vendorsList[0].type ? data.vendorsList[0].type : 'CST';
                    vm.api.vendorMaterialsDet = data.vendorsList[0].materials;
                    angular.forEach(data.vendorsList[0].categories, function (a) {
                        vm.getMaterial(a);
                        vm.catdisabled[a] = true;
                    })
                    $('#editpopup').modal('toggle');
            }
        });
            }
        });
        vm.removeCat = removeCat;
        function removeCat() {

        }
        vm.updateVendorDet = updateVendorDet;
        function updateVendorDet() {
            var vendor = vm.vendorValidation();
     
            if(vendor){
            //    if(vm.api.vendorAddedMaterials.length > 0){
                    var category = _.uniq(vm.categoryId);
                   var flag= true;
              var filterven = [];
            // var category = _.uniq(vm.categoryId);
                 angular.forEach(category, function(a){
                     filterven = $filter('filter')(vm.api.vendorAddedMaterials, {category : a}, true)
                     if(filterven.length == 0){
                          var catedName = $filter('filter')(vm.categoryList, { _id : a}, true)[0];
                     if($('.alertify-log-error').length == 0)
                          {
                         alertify.error("Please choose materials for "+catedName.name+" category");
                          }
                           flag = false;
                     }
                })
                if(!flag)
                {
                    return ;
                }
            if(vm.getCompDet == "CH0001")
            { 
            var vendorList = {
                "_id": vm.vendorEditedDet._id,
                "id": vm.vendorId,
                "name": vm.vendorName,
                "contact_no": vm.mobileNo,
                "address": vm.address,
                "email": vm.emailId,
                "type": "CST",
                "updated_by": {"_id" : vm.api.profile._id},
                "materials": vm.api.vendorAddedMaterials,
                "categories": category,
                "status": "Active",
                "pan" : vm.pan,
                "tin" : vm.tin,
                "cst" : vm.cst,
                "acc1" :vm.acc1,
                "acc2" :vm.acc2, 
                "isfc" : vm.ifsc,
                "bank" : vm.bank,
                "serviceTax" : vm.servicetax,
                "branch" : vm.branchName,
                "landline_no" :vm.landline,
                "merchant_type" : vm.EditmerchantTypename._id,
                "merchant_type_name" : vm.vendorType
           };
            }
             
            else
            {
                 var vendorList = {
                "_id": vm.vendorEditedDet._id,
                "id": vm.vendorId,
                "name": vm.vendorName,
                "contact_no": vm.mobileNo,
                "address": vm.address,
                "email": vm.emailId,
                "type": "CST",
                "updated_by": {"_id" : vm.api.profile._id},
                "materials": vm.api.vendorAddedMaterials,
                "categories": category,
                "status": "Active",
                 };
            }
            vm.api.vendorDetUpdate(vendorList, function (err, data) {
                if (!err) {
                    if($('.alertify-log-success').length == 0){
                    alertify.success(data);
                    }
                    vm.vendorMasterSrh(false, vm.begin, vm.ddlRows);
                    // alert(JSON.stringify(data));
                    $('#editpopup').modal('toggle');
                    addClose();
                }
                else {
                  if ($('.alertify-log-error').length == 0) {
                    alertify.error(err.data);
            }
            // }else {
            //      if ($('.alertify-log-error').length == 0) {
            //         alertify.error("Please choose Materials");
            //     }
            // }
            }
        });
            }
        }
         function addClose(){
            vm.matList = [];
            vm.vendorEditedDet = {};
            vm.vendorId = "";
            vm.vendorName = "";
            vm.mobileNo = "";
            vm.address = "";
            vm.emailId = "";
            vm.type = "";
            vm.pan = "";
            vm.tin = "";
            vm.cst = "";
            vm.ifsc = "";
            vm.acc1 = "";
            vm.acc2 = "";
            vm.bank = "";
            vm.serviceTax = "";
            vm.branchName = "";
            vm.landlineNo = "";
            vm.catdisabled = {};
            vm.api.vendorMaterialsDet = [];
            vm.categoryId = [];
            vm.SelectedMaterial = "";
            vm.vendorType = '';
            vm.api.vendorAddedMaterials = [];
        }

        $scope.$on('removeCategory', function(e, data){
            var removedCategoryMaterials = [];
            removedCategoryMaterials = $filter('filter')(vm.api.vendorAddedMaterials, function(a){
                return a.category == data;
            }, true);
            if(removedCategoryMaterials.length > 0){
               if($('.alertify-log').length == 0){
                   alertify.log("Some materials checked in this list. So, You cannot remove this category");
               }
                return;
            }
            vm.api.vendorAddedMaterials = $filter('filter')(vm.api.vendorAddedMaterials, function(a){
                return a.category !== data;
            }, true);
            vm.catdisabled[data] = false;
            vm.categoryId = _.uniq(vm.categoryId)
            vm.categoryId = $filter('filter')(vm.categoryId, function(e){
                return e !== data;
            }, true);
           vm.matList = $filter('filter')(vm.matList, function(h){
                        return h.categorydet._id !== data;
                    }, true);
                    vm.SelectedMaterial = "";
        });

         $scope.$on('editremoveCategory', function(e, data){
             var validateMat = [];
            validateMat = $filter('filter')(vm.api.vendorAddedMaterials, function(a){
                return a.category == data;
            }, true);
            if(validateMat.length > 0){
                if($('.alertify-log').length == 0){
                alertify.log("Some materials checked in this list. So, You cannot remove this category");
                }
                return;
            }
            vm.api.vendorAddedMaterials = $filter('filter')(vm.api.vendorAddedMaterials, function(a){
                return a.category !== data;
            }, true);
            vm.catdisabled[data] = false;
            vm.categoryId = _.uniq(vm.categoryId)
            vm.categoryId = $filter('filter')(vm.categoryId, function(e){
                return e !== data;
            }, true);
           vm.matList = $filter('filter')(vm.matList, function(h){
                        return h.categorydet._id !== data;
                    }, true);
                    vm.SelectedMaterial = "";
        });
    }
})();