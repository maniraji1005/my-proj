'use strict';
angular.module('todo.trackSheetController', [])
    .controller('trackSheetController', trackSheetController);
trackSheetController.$inject = ['$scope', '$state', '$stateParams', 'api', 'storage', 'SETTINGS', '$filter', 'material']
function trackSheetController($scope, $state, $stateParams, api, storage, CONSTANTS, $filter, material) {
    var vm = this;
    var index = $stateParams.index;
    var mrid = $stateParams.mrid;
    vm.api = api;
    vm.deliverQty = deliverQty;
    vm.miInsert = miInsert;
    vm.checkqty = checkqty;
    vm.changestatus = changestatus;
    vm.TrackMrRemarks = "";
    vm.insertnewMi = insertnewMi;
    vm.updatematreq = updatematreq;
    var flag = 0;
    vm.getMiDetails = getMiDetails;
    vm.miapprRemarks = "";
    vm.missueInsert = missueInsert;
    vm.updateMR = updateMR;
    vm.disabled = false;
    vm.disabled1 = true;
    vm.mialldetails = [];
    vm.mIssuedQty = mIssuedQty;
    vm.mistatuschange = mistatuschange;
    // vm.step2mrchange  = step2mrchange;
    vm.updatemi = updatemi;
    vm.deliverydisable = false;
    vm.deliverydisable1 = true;
    vm.step3PendingResult = step3PendingResult;
    vm.stage = stage;
    var rejected = false;
    vm.getmrid = getmrid;
    vm.getMrStatus = getMrStatus;
    vm.getMiStatus = getMiStatus;
    var profileName = {
        'id': vm.api.profile._id,
        'name': vm.api.profile.names
    }
    vm.InputDisabled = false;
    vm.MIInputDisabled = false;
    vm.TrackSheetIndex = '';
    var miRejected = false;
    // vm.StatusCheck = StatusCheck;
    vm.allmaterials = [];
    vm.materialFactory = material;
    vm.miClose = miClose;
    vm.getCompDet = '';

    vm.getCompDet = vm.api.profile.company;

    vm.updatematreqCH = updatematreqCH;
     vm.updatemiTest = updatemiTest;
     vm.updateMIColorhomesTest = updateMIColorhomesTest;
     vm.outwardRemarks  = '';

    // Default load after page refreshing
    function getmrid() {
        if (mrid !== null) {
            storage.put('mrid', mrid);
        }
        mrid = storage.get('mrid');
    }
    vm.getmrid();

    // Intiall Load function
    var access = storage.get('access');
    var access = JSON.parse(access);
    if (access !== undefined)
        vm.TrackSheetAccess = access.t;

    function getAccess() {
        if (vm.api.company.modules) {
            var modules = $filter('filter')(vm.api.company.modules, { _id: vm.api.profile.roles[0] }, true)[0];
            // 57651b60818d3b1cd808c40d  Store Module ID
            var storeModule = $filter('filter')(modules.module, { m_name: "Stock Management" }, true)[0];
            // 57651b60818d3b1cd808c40f MI sub module ID
            var misubmodule = $filter('filter')(storeModule.m_sub_modules, { s_name: "Material Issue Note" }, true)[0];
            vm.miaccess = misubmodule.s_access;
            //   console.log('miaccess', vm.miaccess);
            // 57651b60818d3b1cd808c40e MR sub module ID
            var mrsubmodule = $filter('filter')(storeModule.m_sub_modules, { s_name: "Material Requisition" }, true)[0];
            vm.mraccess = mrsubmodule.s_access;
            //   console.log('mraccess', vm.mraccess);
        }
    }
    getAccess();


    vm.api.getMr(mrid, function (err, data) {
        if (err) {

        } else {
            vm.MrTrackData = data;
            vm.reqDetails = vm.MrTrackData.material;
            vm.TrackSheetIndex = 1;
            // alert(JSON.stringify(data));
            // Initial loading Checking MR is approved or not.
            if (vm.MrTrackData.status.name == "Approved" || vm.MrTrackData.status.name == "Closed" || vm.MrTrackData.status.name == "Accepted") {
                //   If approved navigating to step 2 by this function
                vm.getMiDetails();
            } else if (vm.MrTrackData.status.name == "Rejected") {
                // if rejected disabled all.
                vm.disabled = true;
                vm.disabled1 = false;
                vm.TrackSheetIndex = 1;
            }
        }
    })

    // Second step get details

    function getMiDetails() {
        vm.api.getMri(mrid, function (err, data) {
            if (err) {
                //alert(JSON.stringify(err));
            } else {
                vm.MrTrackData = data.mrList;
                vm.reqDetails = vm.MrTrackData.material;
                vm.mialldetails = data.miList[0];
                vm.deliveredDetails = data.miList[0].material;
                $scope.step2();
                vm.TrackSheetIndex = 2;
                vm.disabled = true;
                vm.disabled1 = false;
                if (data.miList[0].status.name == "Issued" || data.miList[0].status.name == "Partially Issued" || data.miList[0].status.name == "Closed" || data.miList[0].status.name == "Manual Closed" || data.miList[0].status.name == "Approved") {
                    vm.step3PendingResult(vm.MrTrackData,vm.mialldetails,vm.deliveredDetails);
                    $scope.step3();
                } else if (data.miList[0].status.name == "Rejected") {
                    vm.deliverydisable = true;
                    vm.deliverydisable1 = false;
                }
            }
        })
    }

    // Step navigation function
    $scope.step1 = function () {
        $scope.step = 1;
        angular.element('#new_crumbs_menu2').addClass("list_active");
        angular.element('#new_crumbs_menu3').removeClass("list_active");
        angular.element('#new_crumbs_menu4').removeClass("list_active");
    }



    $scope.step2 = function () {
        $scope.step = 2;
        angular.element('#new_crumbs_menu3').addClass("list_active");
        angular.element('#new_crumbs_menu2').addClass("list_active");
        angular.element('#new_crumbs_menu4').removeClass("list_active");
    }

    $scope.step3 = function () {
        $scope.step = 3;
        angular.element('#new_crumbs_menu4').addClass("list_active");
        angular.element('#new_crumbs_menu2').addClass("list_active");
        angular.element('#new_crumbs_menu3').addClass("list_active");
    }

    if (index === 1) {
        $scope.step1();
    }
    else if (index === 2) {
        $scope.step2();
    }
    else {
        $scope.step3();
    }

    //validations in MR
    function deliverQty(item) {
        var comp1 = parseInt(item.quantity);
        var comp2 = parseInt(item.appQty);
        var reg = new RegExp('^[0-9]+$');
        if (!reg.test(item.appQty) && item.appQty !== '') {
            if ($('.alertify-log').length == 0) {
                alertify.log('Only numbers are allowed');
            }
            item.appQty = "";
        }
        if (parseInt(item.quantity) < parseInt(item.appQty)) {
            if ($('.alertify-log').length == 0) {
                alertify.log("You cannot enter quantity more than requested quantity");
            }
            item.appQty = "";
        }
        if (item.appQty !== "") {
            if (item.appQty == "0" || item.appQty == 0) {
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
    // Validations in MI
    function mIssuedQty(item) {
        var comp1 = parseInt(item.approved_quantity);
        var comp2 = parseInt(item.appQty);
        var reg = new RegExp('^[0-9]+$');
        if (!reg.test(item.appQty) && item.appQty !== '') {
            if ($('.alertify-log').length == 0) {
                alertify.log('Only numbers are allowed');
            }
            item.appQty = "";
        }
        if (parseInt(item.approved_quantity) < parseInt(item.appQty)) {
            if ($('.alertify-log').length == 0) {
                alertify.log("You cannot enter quantity more than requested quantity");
            }
            item.appQty = "";
        }
        if (item.appQty !== "") {
            if (item.appQty == "0" || item.appQty == 0) {
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

    $scope.pageRedirect = function (index) {
        if (index === 1) {
            storage.put("subMenuSelected", 0);
            storage.put("mainMenuSelected", 1);
            $state.go("master.matrerialrequisition");
        }
        else if (index === 2) {
            storage.put("subMenuSelected", 1);
            storage.put("mainMenuSelected", 1);
            $state.go("master.materialIssue");
        }
    }
    // Create new MI and update MR
    function miInsert() {
        var flag = 0;
        angular.forEach(vm.reqDetails, function (values) {
            if (!values.appQty && values.appQty !== 0) {
                values.res = 1;
                flag = 1;
            }

            if (values.appQty !== "0") {
                if (parseInt(values.appQty) < parseInt(values.quantity)) {
                    values.status = vm.getMrStatus('Pending');
                } else {
                    values.status = vm.getMrStatus('Approved');
                }
            } else {
                values.status = vm.getMrStatus('Rejected');
            }
        });
        if (flag !== 0) {
            if ($('.alertify-log').length == 0) {
                alertify.log('Field is missing');
            }
            return;
        }
        if (vm.TrackMrRemarks == '' || vm.TrackMrRemarks == null) {
            if ($('.alertify-log-error').length == 0) {
                alertify.error("Remarks required");
            }
            return;
        }
        // console.log("1234",JSON.stringify(vm.reqDetails));
        var check = availableQuantityValidation(vm.reqDetails, function (check, data) {
            if (!check) {
                if ($('.alertify-log-error').length == 0) {
                    alertify.error('Quantity is more than available quantity');
                }
                angular.forEach(data, function (a) {
                    alertify.log(a.id + '-' + a.name + ' available quantity ' + a.quantity, 0);
                })
            } else {
                vm.material = [];
                vm.matIssue = [];
                // console.log("1234",JSON.stringify(vm.reqDetails));
                for (var z = 0; z < vm.reqDetails.length; z++) {
                    vm.material.push({
                        "id": vm.reqDetails[z].id,
                        "mat_code" : vm.reqDetails[z].mat_code,
                        "name": vm.reqDetails[z].name,
                        "uom": vm.reqDetails[z].uom,
                        "status": vm.reqDetails[z].status,
                        "quantity": vm.reqDetails[z].quantity,
                        "category": vm.reqDetails[z].category,
                        "approved_quantity": vm.reqDetails[z].appQty,
                        "size" : vm.reqDetails[z].size,
                        "specification" : vm.reqDetails[z].specification,
                        "mat_type" : vm.reqDetails[z].mat_type
                    });

                    if (vm.reqDetails[z].status.name == "Approved" || vm.reqDetails[z].status.name == "Pending") {
                        vm.matIssue.push({
                            "id": vm.reqDetails[z].id,
                            "mat_code" : vm.reqDetails[z].mat_code,
                            "name": vm.reqDetails[z].name,
                            "uom": vm.reqDetails[z].uom,
                            "issued_quantity": 0,
                            "approved_quantity": vm.reqDetails[z].appQty,
                            "category": vm.reqDetails[z].category,
                            "size" : vm.reqDetails[z].size,
                            "specification" : vm.reqDetails[z].specification,
                            "quantity": vm.reqDetails[z].quantity,
                            "mat_type" : vm.reqDetails[z].mat_type
                        });
                    }
                }

                // Validations for setting overall status
                var approvedcnt = 0;
                var rejcnt = 0;
                var pendingcnt = 0;
                angular.forEach(vm.reqDetails, function (details) {
                    if (details.status.name == "Approved") {
                        approvedcnt += 1;
                    } else if (details.status.name == "Rejected") {
                        rejcnt += 1;
                    } else {
                        pendingcnt += 1;
                    }
                })
                if (rejcnt > 0 && approvedcnt == 0 && pendingcnt == 0) {
                    var status = vm.getMrStatus('Rejected');
                } else if (approvedcnt > 0 || pendingcnt > 0) {
                    var status = vm.getMrStatus('Approved');
                }

                if (vm.getCompDet == 'CH0001' && vm.getCompDet !== 'CO00001') {

                var project = vm.api.projectList;
            if(project) {
        var filterProj = $filter('filter')(project, { _id: vm.MrTrackData.from_project }, true)[0];
        vm.filterProjCode = filterProj.short_code;
                    // console.log("werwer",JSON.stringify(filterProj));
            }
            var category = vm.api.company.category;
        if(category) {
              var filterCat = $filter('filter')(category, { _id: vm.MrTrackData.category }, true)[0];
              vm.filterCatName = filterCat.name;
        }
                }
                //    console.log('track', vm.MrTrackData);
                var materialReq = {
                    '_id': vm.MrTrackData._id,
                    'id': mrid,
                    'store': vm.MrTrackData.store,
                    'material': vm.material,
                    'remarks': vm.TrackMrRemarks,
                    'status': status,
                    'approved_by': profileName,
                    'updated_by': profileName,
                    'branch': vm.MrTrackData.branch,
                    'store_type': vm.MrTrackData.store_type,
                    'category_id': vm.MrTrackData.category_id,
                    'from_project': vm.MrTrackData.from_project,
                    'project_code' : vm.filterProjCode,
                    'to_project': vm.MrTrackData.to_project,
                    'sub_category_id': vm.MrTrackData.sub_category_id,
                    'category_name' : vm.filterCatName
                }
                // console.log('mrstatus', JSON.stringify(materialReq));
                vm.updatematreq(materialReq);

                if (status.name !== "Rejected") {
                    var status = vm.getMiStatus('Not Issued');
                    var materialIssue = {
                        'issued_by': {},
                        'store': vm.MrTrackData.store,
                        'remarks': null,
                        'status': status,
                        'material': vm.matIssue,
                        'mr_id': mrid,
                        'store_type': vm.MrTrackData.store_type,
                        'branch': vm.MrTrackData.branch,
                        'category_id': vm.MrTrackData.category_id,
                        'from_project': vm.MrTrackData.from_project,
                        'project_code' : vm.filterProjCode,
                        'to_project': vm.MrTrackData.to_project,
                        'sub_category_id': vm.MrTrackData.sub_category_id,
                        'category_name' : vm.filterCatName
                    }
                    //    console.log('MISTATUS', JSON.stringify(materialIssue));
                    vm.insertnewMi(materialIssue);
                } else {
                    rejected = true;
                }
            }
        });
        if (flag == 2) {
            return;
        }
        // Material Request materials
    }

    function updatematreq(data) {
        vm.api.updateMr(data, function (err, data) {
            if (err) {
                //alert(JSON.stringify(err));
            } else {
                if (rejected) {
                    vm.disabled = true;
                    vm.disabled1 = false;
                }
            }
        })
    }

    function insertnewMi(data) {
        vm.api.insertMi(data, function (err, data) {
            if (err) {

            } else {
                vm.getMiDetails();

            }
        })
    }
    // Step 2, Material issue update.
    function missueInsert() {
        var flag = 0;
        angular.forEach(vm.deliveredDetails, function (values) {
            if (!values.appQty && values.appQty !== 0) {
                values.res = 1;
                flag = 1;
            }
            if (values.appQty !== "0") {
                if (parseInt(values.appQty) < parseInt(values.approved_quantity)) {
                    values.status = vm.getMiStatus('Partially Issued');
                } else {
                    values.status = vm.getMiStatus('Issued');
                }
            } else {
                values.status = vm.getMiStatus('Not Issued');
            }
        });
        if (flag !== 0) {
            if ($('.alertify-log').length == 0) {
                alertify.log('Field is missing');
            }
            return;
        }
        if (vm.miapprRemarks == '' || vm.miapprRemarks == null) {
            if ($('.alertify-log-error').length == 0) {
                alertify.error('Remarks required');
            }
            return;
        }
        var check = availableQuantityValidation(vm.deliveredDetails, function (check, data) {
            if (!check) {
                if ($('.alertify-log-error').length == 0) {
                    alertify.error('Quantity is more than available quantity');
                }
                alertify.log(data.id + '-' + data.name + ' available quantity ' + data.quantity, 0);
                flag = 2
            } else {
                vm.material = [];
                // console.log("DEL DETAILS",JSON.stringify(vm.deliveredDetails));
                angular.forEach(vm.deliveredDetails, function (material) {
                    vm.material.push({
                        "id": material.id,
                        "mat_code" : material.mat_code,
                        "name": material.name,
                        "category": material.category_id,
                        'sub_category': material.sub_category_id,
                        "uom": material.uom,
                        'size': material.size,
                        'specification': material.specification,
                        "status": material.status,
                        "issued_quantity": material.appQty,
                        "approved_quantity": material.approved_quantity,
                        "quantity" : material.quantity,
                        "mat_type" : material.mat_type
                    });
                })
                // console.log("STER1212",JSON.stringify(vm.material));
                // overall status
                var approvedcnt = 0;
                var rejcnt = 0;
                var pendingcnt = 0;
                angular.forEach(vm.deliveredDetails, function (details) {
                    if (details.status.name == "Issued") {
                        approvedcnt += 1;
                    } else if (details.status.name == "Not Issued") {
                        rejcnt += 1;
                    } else {
                        pendingcnt += 1;
                    }
                })
                if (rejcnt > 0 && approvedcnt == 0 && pendingcnt == 0) {
                    var status1 = vm.getMiStatus('Rejected');
                } else if (approvedcnt > 0 || pendingcnt > 0) {
                    var status1 = vm.getMiStatus('Issued');
                }

                var project = vm.api.projectList;
            if(project) {
        var filterProj = $filter('filter')(project, { _id: vm.mialldetails.to_project }, true)[0];
        vm.filterProjCode = filterProj.short_code;
                    // console.log("werwer",JSON.stringify(filterProj));
            }

            var category = vm.api.company.category;
        if(category) {
              var filterCat = $filter('filter')(category, { _id: vm.mialldetails.category }, true)[0];
              vm.filterCatName = filterCat.name;
              // return filterCat.name;
        }

                var materialIssue = {
                    'id': vm.mialldetails.id,
                    'issued_by': profileName,
                    'store': vm.mialldetails.store,
                    'remarks': vm.miapprRemarks,
                    'status': status1,
                    'material': vm.material,
                    'mr_id': mrid,
                    'branch': vm.mialldetails.branch,
                    'store_type': vm.mialldetails.store_type,
                    'from_project': vm.mialldetails.from_project,
                    'project_code' : vm.filterProjCode,
                    'to_project': vm.mialldetails.to_project,
                    'category_id': vm.mialldetails.category_id,
                    'sub_category_id': vm.mialldetails.sub_category_id,
                    'category_name' : vm.filterCatName
                }
                //    console.log('step2', JSON.stringify(materialIssue));
                vm.updatemi(materialIssue);
                if (status.name == 'Rejected') {
                    miRejected = true;
                }
            }
        });
        // Forming material array

    }
    // update mi api call
    function updatemi(data) {
        vm.api.UpdateMi(data, function (err, data) {
            if (err) {

            } else {
                if (miRejected) {
                    vm.deliverydisable = true;
                    vm.deliverydisable1 = false;
                } else {
                    vm.deliverydisable = true;
                    vm.deliverydisable1 = false;
                    
                    if(vm.getCompDet !== 'CH0001' && vm.getCompDet == 'CO00001') {
                     vm.step3PendingResult();
                    closeStatus(mrid);
                    }
                    else {
                        vm.step3PendingResult();
                    }
                }
            }
        });
    }

    function updateMR() {

        var status = vm.getMrStatus('Accepted');

        var project = vm.api.projectList;
            if(project) {
        var filterProj = $filter('filter')(project, { _id: vm.mialldetails.to_project }, true)[0];
        vm.filterProjCode = filterProj.short_code;
                    // console.log("werwer",JSON.stringify(filterProj));
            }

            var category = vm.api.company.category;
        if(category) {
              var filterCat = $filter('filter')(category, { _id: vm.mialldetails.category }, true)[0];
              vm.filterCatName = filterCat.name;
              // return filterCat.name;
        }

        if (vm.outwardRemarks == '' || vm.outwardRemarks == null) {
            if ($('.alertify-log-error').length == 0) {
                alertify.error("Please enter Remarks");
            }
            return;
        }

        var materialIssue = {
            'id': vm.mialldetails.mr_id,
            'store': vm.mialldetails.store,
            'remarks': vm.MrTrackData.remarks,
            'status': status,
            'material': vm.mialldetails.material,
            'approved_by': profileName,
            'updated_by': profileName,
            'branch': vm.mialldetails.branch,
            'store_type': vm.mialldetails.store_type,
            'from_project': vm.mialldetails.from_project,
            'project_code' : vm.filterProjCode,
            'to_project': vm.mialldetails.to_project,
            'category_id': vm.mialldetails.category_id,
            'sub_category_id': vm.mialldetails.sub_category_id,
            'accepted_remarks' : vm.outwardRemarks,
            'accepted_by' : profileName,
            'category_name' : vm.filterCatName
        }
        //  console.log('step3 OUTWARD', JSON.stringify(materialIssue));
        vm.updatematreqCH(materialIssue);

    }


    function updatematreqCH(data) {
        vm.api.updateMr(data, function (err, data) {
            if (err) {
                //alert(JSON.stringify(err));
            } else {
                alertify.success("Successfully Updated");
                document.getElementById("hideApprove").style.display = "none";
                document.getElementById("hideApproveRemarks").style.display = "none";
                vm.updateMIColorhomesTest();
                
                
            }
            
        })
        

    }

    
    function updateMIColorhomesTest() {

        var status = vm.getMiStatus('Closed');

        // console.log("MI ALL DWETAILS",JSON.stringify(vm.mialldetails));;
        var project = vm.api.projectList;
            if(project) {
        var filterProj = $filter('filter')(project, { _id: vm.mialldetails.to_project }, true)[0];
        vm.filterProjCode = filterProj.short_code;
                    // console.log("werwer",JSON.stringify(filterProj));
            }

            var category = vm.api.company.category;
        if(category) {
              var filterCat = $filter('filter')(category, { _id: vm.mialldetails.category }, true)[0];
              vm.filterCatName = filterCat.name;
              // return filterCat.name;
        }

        var materialIssue = {
            'id': vm.mialldetails.id,
            'issued_by': profileName,
            'store': vm.mialldetails.store,
            'remarks': vm.mialldetails.remarks,
            'status': status,
            'material': vm.mialldetails.material,
            'mr_id': mrid,
            'branch': vm.mialldetails.branch,
            'store_type': vm.mialldetails.store_type,
            'from_project': vm.mialldetails.from_project,
            // 'project_code' : vm.filterProjCode,
            'to_project': vm.mialldetails.to_project,
            'category_id': vm.mialldetails.category_id,
            'sub_category_id': vm.mialldetails.sub_category_id,
            'category_name' : vm.filterCatName
        }
        // console.log('step3 OUTWARD UPDATE', JSON.stringify(materialIssue));
        vm.updatemiTest(materialIssue);

    }
    
   
    function updatemiTest(data) {
        vm.api.UpdateMi(data, function (err, data) {
            if (err) {
            } else {

                // alertify.success(data);
                document.getElementById("hideApprove").style.display = "none";
                document.getElementById("hideApproveRemarks").style.display = "none";
                vm.stage(3);
               
            }
        });
    }

    vm.fromProject = fromProject;
    vm.toProject = toProject;
    // vm.projectList = vm.api.projectList ;

     api.ProjectDDL({}, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        vm.toprojectList = data.projectList;
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

        function fromProject(fromProject) {
            if(fromProject) {
                  var filterCat = $filter('filter')(vm.projectList, { _id: fromProject }, true);
                  if(filterCat) {
                       return filterCat[0].name;
                  }
                  
            }
    
    
  }

  function toProject(toProject) {
      if(toProject) {
                    var filterCat1 = $filter('filter')(vm.toprojectList, { _id: toProject }, true);
                    if(filterCat1) {
                         return filterCat1[0].name;
                    }
                    
  }
      }
    
    

    //  Validation for Quantity text box to make it red if it's empty.
    function checkqty(data) {
        if (data == '1') {
            return 'highlit';
        }
    }

    // Status button in MR Approve or Reject
    function changestatus(status, index) {
        if (status == 'Approved') {
            vm.reqDetails[index].appQty = vm.reqDetails[index].quantity;
            // vm.reqDetails[index].mractive = 'btn-primary';
            // vm.reqDetails[index].mrrejactive = '';
        } else {
            vm.reqDetails[index].appQty = "0";
            // vm.reqDetails[index].mractive = '';
            // vm.reqDetails[index].mrrejactive = 'btn-primary';
            // }
            // vm.reqDetails[index].status = vm.getMrStatus(status);
        }
        // Status button in MI Approve or Reject
    }
    function mistatuschange(status, index) {
        if (status == 'Issued') {
            vm.deliveredDetails[index].appQty = vm.deliveredDetails[index].approved_quantity;
            // vm.deliveredDetails[index].miactive = 'btn-primary';
            // vm.deliveredDetails[index].mirejactive = '';
        } else {
            vm.deliveredDetails[index].appQty = "0";
            // vm.deliveredDetails[index].miactive = '';
            // vm.deliveredDetails[index].mirejactive = 'btn-primary';
        }
        // vm.deliveredDetails[index].status = vm.getMiStatus(status); btn-primary
    }



    vm.miResList = [];
    vm.mrResList = [];
    vm.miResListCH = [];

    // Getting detail for step 3
    function step3PendingResult(mrTrack,miallDetails,delDetails) {

        if(mrTrack == undefined) {
                vm.api.getMri(mrid, function (err, data) {
            if (err) {
                //alert(JSON.stringify(err));
            } else {
                vm.MrTrackData = data.mrList;
                vm.deliveredDetails = data.miList[0].material;
                
                vm.mialldetails = data.miList[0];

                vm.deliverydisable = true;
                vm.deliverydisable1 = false;
                // Pendings in MR Grid data 
                angular.forEach(data.mrList.material, function (stat) {
                    if (stat.status.name == 'Pending' || stat.status.name == 'Rejected') {
                        vm.mrResList.push({
                            'id': stat.id,
                            'category': stat.category,
                            'name': stat.name,
                            'quantity': stat.quantity,
                            'approved_quantity': stat.approved_quantity ? stat.approved_quantity : 0,
                            'status': stat.status
                        });
                    }
                });


                // Pendings in MI Grid data 
                if(vm.getCompDet !== 'CH0001') {
                      angular.forEach(data.miList[0].material, function (stat) {
                    // alert(JSON.stringify(stat));
                    if (stat.status.name == 'Rejected' || stat.status.name == 'Partially Issued') {
                        vm.miResList.push({
                            'id': stat.id,
                            'category': stat.category,
                            'name': stat.name,
                            'approved_quantity': stat.approved_quantity,
                            'issued_quantity': stat.issued_quantity,
                            'status': stat.status
                        });
                    }

                });
                vm.TrackSheetIndex = 3;
                $scope.step3();
                }
                else {
                    // alert("Called2");
                            angular.forEach(data.miList[0].material, function (stat) {
                    if (stat.status.name == 'Rejected' || stat.status.name == 'Partially Issued' || stat.status.name == 'Issued') {
                        vm.miResListCH.push({
                            'id': stat.id,
                            'mat_code' : stat.mat_code,
                            'category': stat.category,
                            'name': stat.name,
                            'approved_quantity': stat.approved_quantity,
                            'issued_quantity': stat.issued_quantity,
                            'status': stat.status,
                            'uom': stat.uom,
                            'size': stat.size,
                            'specification': stat.specification
                        });
                    }

                });
                console.log(JSON.stringify("Called"));
                vm.TrackSheetIndex = 3;
                $scope.step3();
                // return;
                }
                
                
            }
        })
        }
        else {
                vm.MrTrackData = mrTrack;
                vm.deliveredDetails = delDetails;
                
                vm.mialldetails = miallDetails;

                vm.deliverydisable = true;
                vm.deliverydisable1 = false;
                // Pendings in MR Grid data 
                angular.forEach(mrTrack.material, function (stat) {
                    if (stat.status.name == 'Pending' || stat.status.name == 'Rejected') {
                        vm.mrResList.push({
                            'id': stat.id,
                            'category': stat.category,
                            'name': stat.name,
                            'quantity': stat.quantity,
                            'approved_quantity': stat.approved_quantity ? stat.approved_quantity : 0,
                            'status': stat.status
                        });
                    }
                });


                // Pendings in MI Grid data 
                if(vm.getCompDet !== 'CH0001') {
                      angular.forEach(delDetails, function (stat) {
                    // alert(JSON.stringify(stat));
                    if (stat.status.name == 'Rejected' || stat.status.name == 'Partially Issued') {
                        vm.miResList.push({
                            'id': stat.id,
                            'category': stat.category,
                            'name': stat.name,
                            'approved_quantity': stat.approved_quantity,
                            'issued_quantity': stat.issued_quantity,
                            'status': stat.status
                        });
                    }

                });
                vm.TrackSheetIndex = 3;
                $scope.step3();
                }
                else {
                    // alert("Called2");
                            angular.forEach(delDetails, function (stat) {
                    if (stat.status.name == 'Rejected' || stat.status.name == 'Partially Issued' || stat.status.name == 'Issued') {
                        vm.miResListCH.push({
                            'id': stat.id,
                            'mat_code' : stat.mat_code,
                            'category': stat.category,
                            'name': stat.name,
                            'approved_quantity': stat.approved_quantity,
                            'issued_quantity': stat.issued_quantity,
                            'status': stat.status,
                            'uom': stat.uom,
                            'size': stat.size,
                            'specification': stat.specification
                        });
                    }

                });
                // console.log(JSON.stringify("Called"));
                vm.TrackSheetIndex = 3;
                $scope.step3();
                // return;
                }
        }
                
                
                
            
    

    }

    function stage(stage) {
        if (stage == 1) {
            if (vm.TrackSheetIndex == 1 || vm.TrackSheetIndex == 2 || vm.TrackSheetIndex == 3)
                $scope.step1();
        } else if (stage == 2) {
            if (vm.TrackSheetIndex == 1) {
                return;
            }
            $scope.step2();
        } else if (stage == 3) {
            if (vm.TrackSheetIndex == 1 || vm.TrackSheetIndex == 2) {
                return;
            }
            $scope.step3();
        }
    }
    function getMrStatus(stat) {
        for (var i in CONSTANTS.mr_status) {
            if (stat == CONSTANTS.mr_status[i].name) {
                var status = {
                    '_id': CONSTANTS.mr_status[i]._id,
                    'name': CONSTANTS.mr_status[i].name
                }
            }
        }
        return status;
    }

    function getMiStatus(stat) {
        var status = $filter('filter')(CONSTANTS.mi_status, { name: stat }, true)[0];
        return status;
        // for (var i in CONSTANTS.mi_status) {
        //     if (stat == CONSTANTS.mi_status[i].name) {
        //         var status = {
        //             '_id': CONSTANTS.mi_status[i]._id,
        //             'name': CONSTANTS.mi_status[i].name
        //         }
        //     }
        // }
        // return status;
    }


    // function StatusCheck(status) {
    //     if (status == 'Issued' || status == 'Not Issued' || status == 'Approved' || status == 'Rejected') {
    //         return true;
    //     }
    // }

    function availableQuantityValidation(matdata, callback) {
        var check = true;
        var responseMaterials = [];
        if(vm.getCompDet !== 'CH0001' && vm.getCompDet == 'CO00001') {
        vm.materialFactory.getmaterial(function (err, data) {
            if (!err) {
                angular.forEach(matdata, function (datas) {
                    vm.materials = $filter('filter')(data, { id: datas.id }, true)[0];
                    // if (parseInt(datas.appQty) > parseInt(vm.materials.quantity)) {
                    //     datas.morequantity = 1;
                    //     check = false;
                    //     responseMaterials.push(vm.materials);
                    // }
                });
                callback(check, responseMaterials);
            }
        });
        }
        else {
            vm.materialFactory.getmaterial(function (err, data) {
            if (!err) {
                angular.forEach(matdata, function (datas) {
                    vm.materials = $filter('filter')(data, { _id: datas.id }, true)[0];
                    // if (parseInt(datas.appQty) > parseInt(vm.materials.quantity)) {
                    //     datas.morequantity = 1;
                    //     check = false;
                    //     responseMaterials.push(vm.materials);
                    // }
                });
                callback(check, responseMaterials);
            }
        });
        }

        // var getStockDet = { "project": vm.toProject, "mat_id": vm.reqDetails._id };
    }

    function closeStatus(data) {
        vm.api.getMri(data, function (err, data) {
            if (!err) {
                vm.mrdet = data.mrList;
                vm.midet = data.miList[0];
                if (vm.midet.status.name !== 'Rejected') {
                    var miPending = $filter('filter')(vm.midet.material, { status: { name: "Partially Issued" } });
                    var miRejected = $filter('filter')(vm.midet.material, { status: { name: "Not Issued" } });
                    if(vm.getCompDet == 'CH0001' && vm.getCompDet !== 'CO00001') {
                            if (miPending.length == 0 && miRejected.length == 0) {
                        vm.midet.status = vm.getMiStatus('Issued');
                        // console.log(JSON.stringify(vm.midet));
                        vm.api.UpdateMi(vm.midet, function (err, data) {
                            if (!err) {
                                //   console.log(data);
                            } else {
                                // console.log(err);
                            }
                        });
                    }
                    }
                    else {
                        if (miPending.length == 0 && miRejected.length == 0) {
                        vm.midet.status = vm.getMiStatus('Closed');
                        // console.log(JSON.stringify(vm.midet));
                        vm.api.UpdateMi(vm.midet, function (err, data) {
                            if (!err) {
                                //   console.log(data);
                            } else {
                                // console.log(err);
                            }
                        });
                    }
                    }
                    

                    // 
                }
            }
        });
    }

    function miClose(id) {
        vm.api.getMri(id, function (err, data) {
            if (!err) {
                vm.midet = data.miList[0];
                vm.midet.status = vm.getMiStatus('Manual Closed');
                vm.api.UpdateMi(vm.midet, function (err, data) {
                    if (!err) {
                        if ($('.alertify-log-success').length == 0) {
                            alertify.success("Successfully closed");
                        }
                        vm.closebtn = true;
                    } else {
                        if ($('.alertify-log-error').length == 0) {
                            alertify.error("Something went wrong!");
                        }
                    }
                });
            }
        })
    }
    vm.getBranchName = getBranchName;

    function getBranchName(id) {
        if (vm.api.company.branches) {
            var branchname = $filter('filter')(vm.api.company.branches, { _id: id }, true)[0];
            if (branchname)
                return branchname.name;
        }
    }
    vm.categoryName = categoryName;
    vm.filterCatName = '';

    function categoryName(data) {
        // alert(JSON.stringify(data));
        var category = vm.api.company.category;
        if (category) {
            var filterCat = $filter('filter')(category, { _id: data }, true)[0];
            return filterCat.name;
        }
        
        // if(filterCat) {
        //      vm.filterCatName = filterCat.sub_category[0].name;
        //      return filterCat.name;
        // }
        
    }


    vm.exportExcel = exportExcel;

    function exportExcel(data) {
        var exTable = $('#' + data).clone();
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
}
