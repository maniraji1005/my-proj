
(function() {
    'use strict';
    angular.module('todo')
    .config(['$stateProvider', '$urlRouterProvider','$httpProvider',
    function ($stateProvider, $urlRouterProvider,$httpProvider) {  

     $httpProvider.interceptors.push(function($injector){
       return {
      request: function(config) {
      return config;
      },

    requestError: function(config) {
      return config;
    },

    response: function(res) {
    return res;
    },

    responseError: function(res) {
      var $state = $injector.get("$state");
      if(res.data.error==="Invalid Authorization Token"){
      if ($('.alertify-log-error').length === 0) {
      alertify.error('Your session has been expired. Please login again.');   
      $state.go("login"); 
       }   
       }       
        
    return res;
    }
  }
         });
          
          
    

        $stateProvider
                .state("login", {
                    url: "/login",
                    templateUrl: 'components/user/login/views/login.html',
                    controller: 'LoginController as vm'
                })
                // .state("forget", {
                //     url: "/forget",
                //     templateUrl: 'components/user/login/views/forgot.html',
                //    // controller: 'LoginController as vm'
                // })
                .state("master.changePassword", {
                    url: "/changePassword",
                    templateUrl: 'components/user/login/views/forgot.html',
                   controller: 'LoginController as vm'
                })
                .state("master", {
                    url: "/master",
                    templateUrl: 'master.html',
                    controller  : "SharedController as vm"
                })
                .state("master.materialIssue", {
                    url: "/materialIssue",
                    templateUrl: '/components/store/views/listMaterialIssue.html',
                    controller:"storeMiController as vm",
                    params : {index:null, status:null, access:null, branch:null, storeType:null, store:null, vendor:null, executive:null}
                })
                .state("master.purchase", {
                    url: "/purchaseIndent",
                    templateUrl: '/components/purchase/views/purchaseIndent.html',
                    controller  : 'purchaseIndentController as vm',
                    params : {index:null, status:null, access:null, branch:null, storeType:null, store:null, vendor:null, executive:null}
                })
                .state("master.purchaseOrder", {
                    url: "/purchaseOrder",
                    templateUrl: '/components/purchase/views/purchaseOrder.html',
                    controller  : 'purchaseOrderController as vm',
                    params : {index:null, status:null, access:null, branch:null, storeType:null, store:null, vendor:null, executive:null}
                })
                .state("master.dashboard", {
                    url: "/dashboard",
                    templateUrl: '/components/dashboard/views/dashboard.html',
                    controller : 'DashboardController as vm'
                })
                .state("master.matrerialrequisition", {
                    url: "/store/matrerialrequisition",
                    templateUrl: '/components/store/views/materialRequest.store.html',
                    controller  : 'storeMrController as vm',
                    params : {index:null, status:null, access:null, branch:null, storeType:null, store:null, vendor:null, executive:null}
                })
                //for colorHomes
                .state("master.stockupdate", {
                    url:"/store/stockupdate",
                    templateUrl:'components/store/views/stockUpdate.view.html',
                    controller : 'storeStockController as vm'
                })
                //
                .state("master.mrn", {
                    url: "/store/mrn",
                    templateUrl: '/components/store/views/materialReceiptNote.html',
                     controller  : 'storeMrnController as vm',
                     params : {index:null, status:null, access:null, branch:null, storeType:null, store:null, vendor:null, executive:null}
                })
                .state("master.stockavailability" , {
                    url: "/store/stockAvailability",
                    templateUrl: '/components/store/views/stockAvailable.html',
                    controller: 'stockAvlController as vm' 
                })
                .state("master.trackstatus", {
                    url: "/trackstatus",
                    templateUrl: '/components/trackstatus/views/trackstatus.html',
                    // controller  : 'StoreController as vm'
                })
                .state("master.approvalmr", {
                    url: "/store/approve/mr",
                    templateUrl: '/components/store/views/mrApproval.store.html',
                    controller  : 'storeMrController as vm'
                })
                .state("master.approvalMrn", {
                    url: "/store/approve/mrn",
                    templateUrl: '/components/store/views/mrnApproval.store.html',
                    controller  : 'storeMrnController'
                })
                
                //Track Sheet
                   .state("master.trackSheet", {
                    url: "/trackSheet",
                    templateUrl: '/components/store/views/trackSheet.html',
                    controller  : 'trackSheetController as vm',
                    params: {index: null, mrid: null}
                })
                  
                   .state("master.purchaseTrackSheet", {
                    url: "/purchaseTrackSheet",
                    templateUrl: '/components/purchase/views/purchaseTrackSheet.html',
                    controller  : 'purchaseTrackSheetController as vm',
                     params: {index: null, piNo: null, poNo: null, mrnNo: null}
                })
                .state("master.materialMaster", {
                    url: "master/material",
                    templateUrl: '/components/settings/views/materialMaster.view.html',
                    controller  : 'materialMasterController as vm',
                     params: {index: null}
                })
                   .state("master.vendormaster", {
                    url: "master/vendor",
                    templateUrl: '/components/settings/views/vendorMaster.view.html',
                    controller  : 'vendorMasterController as vm',
                     params: {index: null}
                })
                 .state("master.uom", {
                    url: "/uom",
                    templateUrl: '/components/settings/views/uom.view.html',
                    controller  : 'uomController as vm',
                     params: {index: null}
                })
                .state("master.category", {
                    url: "/category",
                    templateUrl: '/components/settings/views/categoryMaster.view.html',
                    controller  : 'categoryMasterController as vm',
                     params: {index: null}
                })
                .state("master.project", {
                    url: "/project",
                    templateUrl: '/components/settings/views/projectMaster.view.html',
                    controller  : 'projectMasterController as vm',
                     params: {index: null}
                })
                .state("master.size", {
                    url: "/size",
                    templateUrl: '/components/settings/views/sizeMasterView.html',
                    controller  : 'sizecontroller as vm',
                     params: {index: null}
                })
                .state("master.subcategory", {
                    url : "/subcategory",
                    templateUrl:'components/settings/views/subCategory.master.html',
                    controller : 'subcategoryController as vm',
                    params : {index : null}
                })
                .state("master.contractor", {
                    url : "/contractor",
                    templateUrl:'components/settings/views/contractor.Master.html',
                    controller : 'contractorcontroller as vm',
                    params : {index : null}
                })
    }]).run(['$rootScope','$state','$location','$window','$filter','storage', 'SETTINGS','api', function ($rootScope,$state,$location,$window,$filter,storage, SETTINGS, api) {
       
  
       
      var str = window.location.search;     
            
            
      if(str!==""){
          
      api.User.token = "";
      storage.clear();
          
          
       var objURL = {};
       str.replace(
        new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
        function( $0, $1, $2, $3 ){
            objURL[ $1 ] = $3;
        }
        );
        
       
       var url_auth_token=objURL['mm_opt'];    
       
       
    //    console.log("actToken",url_auth_token);  
    //    console.log("dec URI token",decodeURIComponent(url_auth_token));
       
       var decodeStr=decodeURIComponent(url_auth_token);
       var base64DecodeStr=decode_base64(decodeStr);
       
       
    //    console.log("final decode token",decode_base64(decodeStr));
       
          
    //    var dec_auth_token=$base64.decode(url_auth_token);  //decodeBase64(decodeURI(url_auth_token));
    //    console.log("base64-Dec",dec_auth_token);
         
        var loginUser = {
                "authcode": base64DecodeStr
                  };
                  
                  
              
                  
             api.autoLogin(loginUser, function (err, data) {
                 
                 
             
                 
               if (err) {
                    if ($('.alertify-log-error').length == 0) {
                    alertify.error('Employee ID or Password is Incorrect.Please try again');
                     $location.path('/login');
                     }
                }
                else {
                  storage.put("user_token", data.token);
                 storage.put('user_profile', data.profile);
                  
                    $window.location.search = '';
                  
                    api.User.token = data.token;
                  //Get Company Details
                    // getCompany();   

                     var token = storage.get('user_token');
            if (token)
               api.companyDet(function (err, data) {
                    if (err) {
                    } else {
                    var roleDet = data.modules;

                       $("#favicon").attr("href",data.favIcon);
                       $window.document.title = data.name;


                        var profile = storage.get('user_profile');
                        var role = JSON.parse(profile);
                        var resObj = $filter('filter')(roleDet, { _id: role.roles[0] }, true);

                        roleDet = resObj[0];

                        if (roleDet.module[0].m_sub_modules.length === 0) {
                            $state.go('master.dashboard');
                       }
                        else {
                            storage.put("access", JSON.stringify(roleDet.module[0].m_sub_modules[0].s_access));
                            $state.go(roleDet.module[0].m_sub_modules[0].s_go);
                        }
                    }
                });

                 } 
            });       
               
     }
        else{
            
            
        var token = storage.get('user_token');        
       api.User.token = token;
       if(token){
          api.companyDet(function(err, data){   
                if(!err){
                   api.company = data;    
                   
                  $("#favicon").attr("href",data.favIcon);
                  $window.document.title = data.name;


                  if($state.current.name==="" || $state.current.name==="login")
                   {
                   //Already Logged In                   
                    // $state.go('master.dashboard');
                  if (err) {                  
                   if(err.data.error==="Invalid Authorization Token"){
                    alertify.alert('Your session has been expired. Please login again.');
                   }
                   $location.path('/login');
                   } else {
                        var roleDet = data.modules;

                     
                        var profile = storage.get('user_profile');
                       
                        
                        
                        var role = JSON.parse(profile);
                        var resObj = $filter('filter')(roleDet, { _id: role.roles[0] }, true);

                        roleDet = resObj[0];

                     
                        if (roleDet.module[0].m_sub_modules.length === 0) {
                            $state.go('master.dashboard');
                        }
                        else {
                            storage.put("access", JSON.stringify(roleDet.module[0].m_sub_modules[0].s_access));
                            $state.go(roleDet.module[0].m_sub_modules[0].s_go);
                        }
                        
                        
                        
                    }
                   }
                   else{              
                    $state.go($state.current.name, {}, {reload: true});
                    $rootScope.$on('$locationChangeStart', function (event, next, current) {
                   });
                   }
                }
               else{           
                 console.log("Issue",err);
                if(err.data.error==="Invalid Authorization Token"){
                    alertify.alert('Your session has been expired. Please login again.');
                   }
             $location.path('/login');
            }
          })
        }else{          
        //  if(err.data.error==="Invalid Authorization Token"){
        //             alertify.alert('Your session has been expired. Please login again.');
        //            }
           $location.path('/login');
        }
        }
        
        
    // //Decode Base64 string    
    // function decodeBase64(s) {
    //  var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length;
    // var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    // for(i=0;i<64;i++){e[A.charAt(i)]=i;}
    // for(x=0;x<L;x++){
    //     c=e[s.charAt(x)];b=(b<<6)+c;l+=6;
    //     while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}
    // }
    // return r;
    // };
    
    
    function decode_base64 (s)
{
    var e = {}, i, k, v = [], r = '', w = String.fromCharCode;
    var n = [[65, 91], [97, 123], [48, 58], [43, 44], [47, 48]];

    for (var z in n)
    {
        for (i = n[z][0]; i < n[z][1]; i++)
        {
            v.push(w(i));
        }
    }
    for (var i = 0; i < 64; i++)
    {
        e[v[i]] = i;
    }

    for (var i = 0; i < s.length; i+=72)
    {
        var b = 0, c, x, l = 0, o = s.substring(i, i+72);
        for (x = 0; x < o.length; x++)
        {
            c = e[o.charAt(x)];
            b = (b << 6) + c;
            l += 6;
            while (l >= 8)
            {
                r += w((b >>> (l -= 8)) % 256);
            }
         }
    }
    return r;
}
    
       function getCompany() {
            // var token = storage.get('user_token');
            // if (token)
            //    api.companyDet(function (err, data) {
            //         if (err) {
            //         } else {

                    

            //             var roleDet = data.modules;




            //             var profile = storage.get('user_profile');
            //             var role = JSON.parse(profile);
            //             var resObj = $filter('filter')(roleDet, { _id: role.roles[0] }, true);

            //             roleDet = resObj[0];

            //             if (roleDet.module[0].m_sub_modules.length === 0) {
            //                 $state.go('master.dashboard');
            //            }
            //             else {
            //                 storage.put("access", JSON.stringify(roleDet.module[0].m_sub_modules[0].s_access));
            //                 $state.go(roleDet.module[0].m_sub_modules[0].s_go);
            //             }
            //         }
            //     });
        }
    
 
  
        
   }]);
})();

