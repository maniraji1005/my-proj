'use strict';
angular.module('todo.settings.controllers')
    .controller('sizecontroller', sizecontroller);
sizecontroller.$inject = ['$scope', '$state', 'api', '$timeout', 'storage'];
function sizecontroller($scope, $state, api, $timeout, storage) {
    var vm = this;
    vm.api = api;
    $scope.step = 1;
    vm.ddlRowsChange = ddlRowsChange;
    vm.rowCnt = 0;
    var status = "";
    vm.ddlRows = "10";
    vm.ddlRowsApp = "10";
    vm.filterTxt = '';
    var begin = "0";
    var end = "10";
    vm.begin = "0";
    vm.end = "10";
    vm.count = 1;
    var initializing = true;
    vm.reload = reload;
    vm.searchTxt = searchTxt;
    vm.sizeMasfil = sizeMasfil;
    vm.addRow = addRow;
     // Default DDL Select
    vm.ddlRows = "10";
    vm.ddlRowsApp = "10";
    vm.status = "";
    vm.searchType = 'cateName';
    vm.srhsize = '';
    vm.srhuom = '';
    vm.srhCateName ='';
    vm.srhsubCate = '';
    vm.getSubCategory = getSubCategory;

    //get subCategory
    function getSubCategory(data)
    { 
         if(data == null)
        {
            vm.subCategoryList = "";
            vm.uomList = "";
        }
        else {
        var category = {
            "catID" : data
        }
        vm.api.getSubCategory(category, function (err, data) {
            if(err) {
                //laert("No Data");
            } else {
                vm.subCategoryList = data.subcatgoriesList;
              //  alert(JSON.stringify(data.))
            }
        });
        vm.api.getUom(category,function (err, data) {
            if (!err) {
                vm.uomList = data.uomList;
                vm.api.uomList = data.uomList;
            }
        });
        }
    }
    
    //get uom
    vm.api.getUom({},function (err, data) {
            if (!err) {
                vm.uomList1 = data.uomList;
                vm.api.uomList = data.uomList;
            }
        });
     vm.api.getSubCategory({}, function (err, data) {
        if (!err) {
            //laert("No Data");
            vm.subCategoryList1 = data.subcatgoriesList;
        }
    });
    //get category
    vm.api.categoryGrid.categoryGrid({}, function (err, data)
    {
        if(!err) {
            vm.categoryList = data.categoryList;
        }
    })
    function sizeMasfil(isSrh, begin, end) {
        var access = storage.get("access");
        access = JSON.parse(access);
        var filterSearch = {
            "limit": end,
            "skip": begin,
            "role_id": vm.api.profile.roles,
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
                "catID": vm.searchType == 'cateName' ? (vm.srhCateName ? vm.srhCateName : undefined) : undefined,
                "name": vm.searchType == 'sizeMat' ? (vm.srhsize ? vm.srhsize : undefined) : undefined,
                "subCatID" : vm.searchType == 'subcateName' ? (vm.srhsubCate ? vm.srhsubCate : undefined) : undefined,
                "uom" : vm.searchType == 'srhuom' ? (vm.srhuom ? vm.srhuom : undefined) : undefined
            };
        }
        vm.api.sizeGrid(filterSearch, function (err, data) {
            if(err)
            {
                //alert("No Data");
            } else {
                 if( 'catID' != vm.srhCateName || 'name' != vm.srhsize || 'subCatName' != vm.srhsubCate  || 'uom' != vm.srhuom)
          {
              vm.rowCnt = 0;
            }
                  vm.paginationNumber = parseInt(vm.begin) == 0 ? 1 : parseInt(vm.begin) + 1;
                  vm.sizeList = data.materialSizeList;
                  vm.rowCnt = data.count;
                  vm.ddlRowsApp = "10";
            }
        });
       
    }
    vm.sizeMasfil(false, begin, end);          
    function ddlRowsChange(data) {
        vm.begin = "0";
        $scope.currentPage = 1;
        vm.sizeMasfil(false, vm.begin, vm.ddlRows);
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
            vm.sizeMasfil(true, begin, end);
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

    //reload grid
    function reload() {
        $scope.currentPage = 1;
        vm.cateName = "";
        vm.size = "";
        vm.srhsize = "";
        vm.srhCateName = "";
        vm.ddlRows = "10";
        vm.subcateName = "";
        vm.srhsubCate = "";
        vm.srhuom ="";
        vm.sizeMasfil(false, begin, vm.ddlRows);
    }

    // add newsize
    function addRow() {
        if( vm.cateName == undefined || vm.cateName == "" ) {
            if($('.alertify-log').length == 0) {
            alertify.log("please Select category");
            }
            return ;
        }
        if( vm.subcateName == undefined || vm.subcateName == "" ) {
            if($('.alertify-log').length == 0) {
            alertify.log("please Select subCategory");
            }
            return ;
        }
        if( vm.uom == undefined || vm.uom == "") {
            if($('.alertify-log').length == 0) {
                alertify.log("please Select Uom");
            }
            return ;
        }
        if( vm.size == undefined || vm.size == "") {
            if($('.alertify-log').length == 0) {
                alertify.log("please Enter size");
            }
            return ;
        }
        var ObjSize = new Object();
        ObjSize.catID = vm.cateName._id;
        ObjSize.name = vm.size;
        ObjSize.catName = vm.cateName.name;
        ObjSize.subCatID = vm.subcateName._id;
        ObjSize.subCatName = vm.subcateName.name;
        ObjSize.status = "Active";
        ObjSize.updated_by = vm.api.profile._id;
        ObjSize.uom = vm.uom._id;
        ObjSize.uomName = vm.uom.name;
        vm.api.sizeAdd(ObjSize, function (err, data) {
            if (err) {
                if($('.alertify-log').length == 0) {
                alertify.error(err.data);
                //alet("no data");
            }}
            else {
                vm.cateName = "";
                vm.size = "";
                vm.subcateName = "";
                vm.uom = "";
                vm.uomName = "";
                vm.subCategoryList = "";
                vm.uomList = "";
                vm.sizeMasfil(false, vm.begin, vm.end);
                if ($('.alertify-log-success').length == 0) {
                    alertify.success(data);
                }
            }
    });
    }

    // edit size
    $scope.$on('sizeupdate', function (e, data) {
        data.updated_by = vm.api.profile._id;
        data.status = "Active";
        data.catID = data.category;
        data.subCatID = data.sub_category;
        data.uom = data.uom;
        vm.api.sizeUpdate(data, function (err, data) {
            if (!err) {
                if ($('.alertify-log-success').length == 0) {
                    alertify.success("successfully updated");
        }
            }else{
               if($('alertify-log').length == 0) {
                    alertify.error(err.data);
                }
                 vm.sizeMasfil(false, vm.begin, vm.end);
            }
        });
    });
    //    Search 
    $('.search-panel .dropdown-menu').find('a').click(function (e) {
        e.preventDefault();
        var param = $(this).attr("title").replace("#", "");
        var concept = $(this).text();
        $('.search-panel span#search_concept').text(concept);
        $('.input-group #search_param').val(param);
        vm.searchType = param;
        if (param === "cateName") {
            $("#srhCateName").show();
            $("#srhsize").hide();
            $("#srhsubCate").hide();
            $("#srhuom").hide();
        } else if (param === "sizeMat") {
            $("#srhCateName").hide();
            $("#srhsize").show();
            $("#srhsubCate").hide();
            $("#srhuom").hide();
        } else if (param === "subcateName") {
            $("#srhsubCate").show();
            $("#srhCateName").hide();
            $("#srhsize").hide();
            $("#srhuom").hide();
        }
        else  {
            $("#srhsubCate").hide();
            $("#srhCateName").hide();
            $("#srhsize").hide();
            $("#srhuom").show();
        }
    });
    
    //clear searchtext
    function searchTxt() {
        vm.srhCateName = "";
        vm.srhsize = "";
        vm.srhsubCate = "";
        vm.srhuom ="";
    }

}
