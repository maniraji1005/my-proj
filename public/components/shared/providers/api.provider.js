(function () {
    angular.module('todo.shared.providers').provider('api', function ApiProvider() {
        var http = null,
            _apiHeaders = {};
        var _constants = null;

        this.$get = ['$http', 'storage', 'SETTINGS', '$rootScope', function ($http, storage, CONSTANTS, $rootScope) {

            function loadHeaders() {
                if (apiClass.User.token && apiClass) {
                    // _apiHeaders['Authorization'] = 'SM-AUTH token="' + apiClass.User.token + '"';

                    _apiHeaders['Authorization'] = apiClass.User.token;
                }
            }

            var httpRequest = function (method, path, data, callback) {
                if (http === null)
                    callback({
                        error: true,
                        errorCode: "HTTP_NULL"
                    }, null);
                //load dynamic header
                loadHeaders();
                _apiHeaders['Content-Type'] = "application/json";
                 if(path==="autoLogout")
                {
                 var api_url=_constants.ERP_API_URL;
                }
                else{
                var api_url=_constants.API_URL + path;
                }
                // console.log("header", _apiHeaders);
                http({
                    method: method,
                    url: _constants.API_URL + path,
                    headers: _apiHeaders,
                    data: data
                }).success(function (data, status, headers, config) {

                    if (data.error) {

                        callback(data, null);
                    } else {
                        callback(null, data, status, headers);
                    }
                }).error(function (data, status, headers, config) {
                    // console.log(data, status, headers);
                    callback({
                        error: true,
                        errorCode: "UNKNOWN_ERROR",
                        data: data ? data : "",
                        status:status
                    }, null);
                });
            };

            http = $http;
            _constants = CONSTANTS;
            var apiClass = {};

            apiClass.User = {
                login: login
            };
            apiClass.User.token = apiClass.User.token || "";
            // MR grid Data
            apiClass.storeMR = {
                mrGrid: mrGrid
            }

            apiClass.storeMRApp = {
                mrApp: mrApp
            }

            apiClass.branch = {
                branchDDL: branchDDL
            }

            apiClass.storeType = {
                storeType: storeType
            }

            apiClass.storeName = {
                storeName: storeName
            }


            apiClass.search = {
                searchFilter: searchFilter
            }

            apiClass.filter = {
                filter: filter
            }

            apiClass.storeMI = {
                miGrid: miGrid
            }

            apiClass.filterMI = {
                filterMI: filterMI
            }

            apiClass.storePI = {
                piGrid: piGrid
            }

            apiClass.categoryGrid = {
                categoryGrid: categoryGrid
            }

           
            // Api Class for Row Count
            apiClass.mrGridCount = {
                mrGridCount: mrGridCount
            }
            apiClass.vendorDDL = function (data, callback) {
                data.status = "Active";
                httpRequest("POST", "master/vendors/get", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        apiClass.vendorListDet = data;
                        callback(err, data);
                    }
                });
            }

            apiClass.vendorList = function (vendor, callback) {
                // console.log(JSON.stringify(vendor));
                httpRequest("POST", "purchase/pi/po", vendor, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.dashboard = function (created_by, callback) {
                httpRequest("POST", "dashboard/dashboard", created_by, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }


            apiClass.vendorMRNList = function (vendor, callback) {
                // console.log(JSON.stringify(vendor));
                httpRequest("POST", "purchase/po/mrn", vendor, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }
            apiClass.deleteVendor = function (data, callback) {
                httpRequest("PUT", "master/vendor", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }
            apiClass.changePassword = function (data, callback) {
                httpRequest("PUT", "employee/changepwd", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.poGrid = function (poGrid, callback) {
                // console.log(JSON.stringify(poGrid));
                httpRequest("POST", "purchase/po/search", poGrid, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }


            apiClass.mrnGrid = function (mrnGrid, callback) {
                // console.log(JSON.stringify(mrnGrid));
                httpRequest("POST", "purchase/mrn/search", mrnGrid, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            // Change Password
            apiClass.changePass = function (changePass, callback) {
                httpRequest("PUT", "employee/changepwd", changePass, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            //for Getting category Master Data in Grid
            function categoryGrid(categoryMasterfilterSearch, callback) {
                $('mainloading').show();
                httpRequest("POST", "company/categories", categoryMasterfilterSearch, function (err, data) {
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        callback(err, data);
                    }
                });
            }

            apiClass.poList = function (piList, callback) {
                httpRequest("POST", "purchase/po", piList, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.poListUpdate = function (piList, callback) {
                httpRequest("PUT", "purchase/po", piList, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.mrnList = function (poList, callback) {
                httpRequest("POST", "purchase/mrn", poList, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.mrnListUpdate = function (poList, callback) {
                httpRequest("PUT", "purchase/mrn", poList, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.vendorDet = function (vendorList, callback) {
                httpRequest("POST", "master/vendor", vendorList, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }




            function storeType(branch, callback) {
                httpRequest("GET", "company/storetype/" + branch, null, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            function storeName(store, callback) {
                httpRequest("GET", "company/store/" + store, null, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            function searchFilter(filter, callback) {
                httpRequest("GET", "master/" + filter, null, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            function filter(filterSearch, callback) {
                // console.log(JSON.stringify(filterSearch));
                httpRequest("POST", "materials/mr/search", filterSearch, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            function filterMI(filterSearch, callback) {
                // console.log(JSON.stringify(filterSearch));
                httpRequest("POST", "materials/mi/search", filterSearch, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            function piGrid(filterSearch, callback) {
                httpRequest("POST", "purchase/indent/search", filterSearch, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            function branchDDL(callback) {
                httpRequest("GET", "company/company", null, function (err, data) {

                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }
                apiClass.getSubCategory = function(category, callback) {
                httpRequest("POST", "company/subcategories", category, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.ProjectDDL = function (project, callback) {
                httpRequest("POST", "company/projects", project, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            // Getting Row Count
            function mrGridCount(begin, end, callback) {
                httpRequest("GET", "materials/mr/" + begin + "/" + end, null, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            //For Getting MR Data in Grid
            function mrGrid(callback) {
                $('#mainLoading').show();
                // alert(data);
                httpRequest("GET", "materials/mr/0/10", null, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            // For Getting MI Data in Grid
            function miGrid(callback) {
                $('#mainLoading').show();
                // alert(data);
                httpRequest("GET", "materials/mi/0/10", null, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            function mrApp(callback) {
                httpRequest("GET", "materials/mr/0/10", null, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        // alert(JSON.stringify(data));
                        callback(err, data);
                    }
                });
            }

            // For getting Profile
            apiClass.profile = [];
            apiClass.roleDetails = [];
            apiClass.company = [];
            apiClass.vendorListDet = [];
            apiClass.company_master = [];
            apiClass.MaterialCategory = [];
            apiClass.PIList = [];
            apiClass.categoryName = [];
            apiClass.menuList = 0;
            apiClass.piMaterial = [];
            apiClass.piUOM = [];
            apiClass.mrEditMaterial = [];
            apiClass.mrUOM = [];
            apiClass.mrMatEdit = [];
            apiClass.piEditMaterial = [];
            apiClass.getSize = [];
            apiClass.editCat = '';
            apiClass.projectList = [];
            apiClass.projectListGrid = [];
            apiClass.toProjectList = [];
            apiClass.toProjectId = '';
            apiClass.editMR = [];
            apiClass.piProject = '';

            // Employee Login and Get Token
            function login(data, callback) {
                // console.log(JSON.stringify(data));
                httpRequest("PUT", "auth/employee", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                        apiClass.profile = data.profile;
                        // console.log("test",JSON.stringify(apiClass.profile));
                        // console.log(JSON.stringify(apiClass.profile));
                        apiClass.roleDetails = data.roleDetails;
                        storage.put('user_profile', JSON.stringify(apiClass.profile));

                        // storage.put('user_roleDetail', JSON.stringify(apiClass.roleDetails));                        

                        // storage.put('user_roleDetail', JSON.stringify(apiClass.roleDetails));     

                    }
                });
            }

            apiClass.companyDet = function (callback) {
                httpRequest("GET", "company/company", null, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        $rootScope.$evalAsync(function () {
                            apiClass.company = data;
                            callback(err, data);
                        });
                    }
                });
            }

            apiClass.getMr = function (data, callback) {
                // alert(JSON.stringify(data));
                httpRequest("GET", "materials/mr/" + data, null, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.insertMr = function (data, callback) {
                httpRequest("POST", "materials/mr", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.updateMr = function (data, callback) {


                // console.log("CAlled");
                httpRequest("PUT", "materials/mr", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.deleteMr = function (data, callback) {
                httpRequest("DELETE", "materials/mr", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.exeDDL = function (data, callback) {
              httpRequest("POST", "employee/employee", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }


            apiClass.materialList = [];
            apiClass.MaterialMaster = [];
            apiClass.getSize =[];
            apiClass.materialLists = function (category, callback) {
                category.status = "Active";
                httpRequest("POST", "master/materials/search", category, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        apiClass.MaterialMaster = data;
                        callback(err, data);

                    }
                });
            }

            apiClass.insertMi = function (data, callback) {
                httpRequest("POST", "materials/mi", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.getMri = function (data, callback) {
               httpRequest("GET", "materials/mri/" + data, data, function (err, data) {
               
                    if (err) {
                        // console.log("error",JSON.stringify(err));
                        callback(err, null);
                    } else {
                        // console.log("error",JSON.stringify(data));
                        callback(err, data);
                    }
                });
            }
            apiClass.UpdateMi = function (data, callback) {
                httpRequest("PUT", "materials/mi", data, function (err, data) {


                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });

            }

            // apiClass.materialLists = function (category, callback) {
            //     category.status = "Active";
            //     httpRequest("POST", "master/materials/search", category, function (err, data) {
            //         if (err) {
            //             callback(err, null);
            //         } else {
            //             apiClass.MaterialMaster = data;
            //             callback(err, data);

            //         }
            //     });
            // }

            apiClass.InsertPI = function (data, callback) {
                httpRequest("POST", "purchase/indent", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);

                    }
                });
            }

            apiClass.getPI = function (data, callback) {
                httpRequest("POST", "purchase/indent/ids", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }
            apiClass.UpdatePI = function (data, callback) {
                httpRequest("PUT", "purchase/indent/", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.piUpdate = function (data, callback) {
                httpRequest("PUT", "purchase/indent/po", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.getallmaterials = function (callback) {

                httpRequest("GET", "master/materials", null, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                        apiClass.MaterialMaster = data;
                    }
                });
            }

            apiClass.GetPObyPI = function (data, callback) {
                httpRequest("GET", "purchase/po/" + data, null, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.getPObyIds = function (data, callback) {
                httpRequest("POST", "purchase/po/ids", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.getMrnById = function (data, callback) {
                httpRequest("POST", "purchase/mrn/ids", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.vendorallList = [];
            apiClass.vendor = '';
            apiClass.mmGrid = {
                mmGrid: mmGrid
            }
        
            apiClass.uomGrid = {
                uomGrid: uomGrid
            }

            function mmGrid(materialMasterfilterSearch, callback) {
                materialMasterfilterSearch.status = "Active";
                httpRequest("POST", "master/materials/search", materialMasterfilterSearch, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                        apiClass.getId = data;
                    }
                });
            }

            //for Getting uomMaster Data in Grid
            function uomGrid(uomfilterSearch, callback) {
                $('mainLoading').show();
                httpRequest("POST", "master/uom/get", uomfilterSearch, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.getUom = function (data, callback) {
                httpRequest("POST", "master/uom/get", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.insertMaterial = function (data, callback) {
                data.status = "Active";
                httpRequest("POST", "master/materials", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }
            apiClass.uomAdd = function (data, callback) {
                httpRequest("POST", "master/uom", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        //   alert(JSON.stringify(data));
                        callback(err, data);
                    }
                });

            }
            apiClass.editMaterial = function (data, callback) {
                httpRequest("PUT", "master/materials", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            // delete for uom master
            apiClass.deleteUom = function (data, callback) {
                httpRequest("PUT", "master/uom", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        callback(err, data);
                    }
                });
            }
            apiClass.vendorDet = function (vendorList, callback) {
                httpRequest("POST", "master/vendor", vendorList, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.categoryMasterAdd = function (data, callback) {
                httpRequest("PUT", "company/categories", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }
            //color homes categoryEdit
            apiClass.categoryEdit = function (data, callback) {
                httpRequest("PUT", "company/categories", data, function (err, data) {
                    if(err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }
            apiClass.getVendor = function (data, callback) {
                httpRequest("POST", "master/vendors/get", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.getsizeList = function (data, callback) {
                httpRequest("POST", "company/materialsize", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        apiClass.getSize = data;
                        callback(err, data);
                    }
                });
            }

            apiClass.vendorAddedMaterials = [];

            apiClass.vendorDetUpdate = function (data, callback) {
                httpRequest("PUT", "master/vendor", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }

            apiClass.piDelete = function (data, callback) {
                httpRequest("DELETE", "purchase/indent", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }
            // for colorHomes
          apiClass.proGrid = function (data, callback) {
                $('mainloading').show();
                httpRequest("POST", "company/projects", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        callback(err, data);
                    }
                });
            }
             apiClass.projectAdd = function(data, callback){
                httpRequest("PUT", "company/projects", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }
            apiClass.projectEdit = function(data, callback){
                httpRequest("PUT", "company/projects", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }
            apiClass.subCategoryGrid = function (data, callback) {
                httpRequest("POST", "company/subcategories" , data, function (err, data) {
                    if(err)
                    {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }
            apiClass.subCategoryEdit = function (data, callback) {
                httpRequest("PUT", "company/subcategories" , data, function (err, data) {
                    if(err)
                    {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }
            apiClass.sizeGrid = function (data, callback) {
                $('mainloading').show();
                httpRequest("POST", "company/materialsize", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        callback(err, data);
                    }
                });
            }

             apiClass.sizeAdd = function(data, callback){
                httpRequest("PUT", "company/materialsize", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }
            apiClass.subCategoryAdd = function(data, callback){
                httpRequest("PUT", "company/subcategories", data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }
            apiClass.contractorGrid = function(data, callback) {
                httpRequest("POST", "company/contractors", data, function (err, data) {
                    if(err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                    
                });
            }
            apiClass.contractAdd = function (data, callback) {
                httpRequest("PUT", "company/contractors", data, function (err, data) {
                    if(err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }
             apiClass.updateContract = function (data, callback) {
                httpRequest("PUT", "company/contractors", data, function (err, data) {
                    if(err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }
            apiClass.getsizeList = function (data, callback) { 
                httpRequest("POST", "company/materialsize", data, function(err, data) {
                    if(err) {
                        callback(err, null);
                    } else {
                        apiClass.getSize = data;
                        callback(err, data);
                    }
                });
            }

            // Employee Login and Get Token
           apiClass.autoLogin=function(data, callback) {
             
             httpRequest("POST","auth/employee/autolog",data,function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        
                        callback(err, data);
                        
                       
                        
                        
                        apiClass.profile = data.profile;
                        apiClass.roleDetails = data.roleDetails;
                        
                        
                        
                        storage.put('user_profile', JSON.stringify(apiClass.profile));

                        // storage.put('user_roleDetail', JSON.stringify(apiClass.roleDetails));                        

                        // storage.put('user_roleDetail', JSON.stringify(apiClass.roleDetails));     
                    }
                });
            }

            
            apiClass.sizeUpdate = function (data, callback) { 
                httpRequest("PUT", "company/materialsize", data, function(err, data) {
                    if(err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }
            
            apiClass.getStockDet = function (data, callback) { 
                httpRequest("POST", "materials/mu/search", data, function(err, data) {
                    if(err) {
                        callback(err, null);
                    } else {
                        callback(err, data);
                    }
                });
            }
            apiClass.insertStock = function (data, callback) {
               httpRequest("POST", "materials/mu", data, function(err, data) {
                   if(err) {
                       callback(err, null);
                   } else {
                       callback(err, data);
                   }
               });
            }
            apiClass.stockAvailable = function (data, callback) {
                // console.log("API PRO",JSON.stringify(data));
                // alert("stokc calll");
               httpRequest("POST", "master/stockdetails", data, function(err, data) {
                   if(err) {
                       callback(err, null);
                   } else {
                       callback(err, data);
                   }
               });
            }
            apiClass.bankDetails = function (data, callback) {
               httpRequest("GET", "company/bank", data, function(err, data) {
                   if(err) {
                       callback(err, null);
                   } else {
                       callback(err, data);
                      // alert(JSON.stringify(data));
                   }
               });
            }
            //end colorHomes
            return apiClass;
        }];
    });


})();

//Loading Directive
angular.module('todo').directive('loading', ['$http', function ($http) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };
            scope.$watch(scope.isLoading, function (value) {
                if (value) {
                    element.removeClass('ng-hide');
                } else {
                    element.addClass('ng-hide', { duration: 500 });
                }
            });
        }
    };
}]);

// Filter
angular.module('todo').filter('range', function () {
    return function (n) {
        var res = [];
        for (var i = 0; i < n; i++) {
            res.push(i);
        }
        return res;
    };
});


