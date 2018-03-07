'use strict';
angular.module('todo.purchaseTrackSheetController', [])
.controller('purchaseTrackSheetController', function($scope,$state,$stateParams) {




 var index = $stateParams.index;
//STEP 1 - JSON    
$scope.reqDetails=[
{"matCode":"MAT001","matName":"Woods","uom":"Nos.","reqQty":"50","status":"I","appQty":"50"},
{"matCode":"MAT002","matName":"Steel","uom":"Nos.","reqQty":"30","status":"I","appQty":"30"},
{"matCode":"MAT003","matName":"Fiberglass","uom":"Nos.","reqQty":"25","status":"I","appQty":"25"},
{"matCode":"MAT004","matName":"Vinyl","uom":"Nos.","reqQty":"55","status":"I","appQty":"55"},
{"matCode":"MAT005","matName":"Sliding","uom":"Nos.","reqQty":"42","status":"I","appQty":"42"},
{"matCode":"MAT006","matName":"Stave-core","uom":"Nos.","reqQty":"33","status":"I","appQty":"33"}
// {"matCode":"MAT007","matName":"Head Jamb","uom":"Nos.","reqQty":"13"},
// {"matCode":"MAT008","matName":"Window Frame Post","uom":"Nos.","reqQty":"3"},
// {"matCode":"MAT009","matName":"Wooden sill","uom":"Nos.","reqQty":"15"},
// {"matCode":"MAT010","matName":"Hinges","uom":"Nos.","reqQty":"26"}
];

// STEP 2 - JSON
$scope.deliveredDetails=[
{"piNo":"PI001,PI007,PI009","matCode":"MAT001","matName":"Woods","uom":"Nos.","reqQty":"50","stat":"A","appQty":"50","bg":"color:green;","amt":"1,67,000"},
{"piNo":"PI002","matCode":"MAT002","matName":"Steel","uom":"Nos.","reqQty":"30","stat":"A","appQty":"30","bg":"","amt":"50,000"},
{"piNo":"PI003,PI005","matCode":"MAT003","matName":"Fiberglass","uom":"Nos.","reqQty":"25","stat":"A","appQty":"25","bg":"color:green;","amt":"62,000"},
{"piNo":"PI004","matCode":"MAT004","matName":"Vinyl","uom":"Nos.","reqQty":"55","stat":"A","appQty":"55","bg":"","amt":"35,000"},
// {"matCode":"MAT005","matName":"Sliding","uom":"Nos.","reqQty":"42","status":"I"},
// {"matCode":"MAT006","matName":"Stave-core","uom":"Nos.","reqQty":"33","status":"I"}
// {"matCode":"MAT007","matName":"Head Jamb","uom":"Nos.","reqQty":"13"},
// {"matCode":"MAT008","matName":"Window Frame Post","uom":"Nos.","reqQty":"3"},
// {"matCode":"MAT009","matName":"Wooden sill","uom":"Nos.","reqQty":"15"},
// {"matCode":"MAT010","matName":"Hinges","uom":"Nos.","reqQty":"26"}
];

// STEP 3 -JSON
$scope.mrnDetails=[
{"piNo":"PO001","matCode":"MAT001","matName":"Woods","uom":"Nos.","reqQty":"50","status":"P","appQty":"40","bg":"","amt":"2,00,000"},
{"piNo":"PO002","matCode":"MAT002","matName":"Steel","uom":"Nos.","reqQty":"30","status":"A","appQty":"30","bg":"","amt":"60,000"},
{"piNo":"PO003","matCode":"MAT003","matName":"Fiberglass","uom":"Nos.","reqQty":"25","status":"P","appQty":"20","bg":"","amt":"42,000"},
{"piNo":"PO004","matCode":"MAT004","matName":"Vinyl","uom":"Nos.","reqQty":"55","status":"A","appQty":"55","bg":"","amt":"36,000"},
// {"matCode":"MAT005","matName":"Sliding","uom":"Nos.","reqQty":"42","status":"I"},
// {"matCode":"MAT006","matName":"Stave-core","uom":"Nos.","reqQty":"33","status":"I"}
// {"matCode":"MAT007","matName":"Head Jamb","uom":"Nos.","reqQty":"13"},
// {"matCode":"MAT008","matName":"Window Frame Post","uom":"Nos.","reqQty":"3"},
// {"matCode":"MAT009","matName":"Wooden sill","uom":"Nos.","reqQty":"15"},
// {"matCode":"MAT010","matName":"Hinges","uom":"Nos.","reqQty":"26"}
];


$scope.step1=function(flg)
{
    $scope.step=1;
    angular.element('#new_crumbs_menu2').addClass("list_active");
    angular.element('#new_crumbs_menu3').removeClass("list_active");
    angular.element('#new_crumbs_menu4').removeClass("list_active");
    angular.element('#new_crumbs_menu5').removeClass("list_active");
}


$scope.step2=function(flg)
{
  
    if(flg==="")
    {
      $scope.step2Flg='1';
    }
    else{
      $scope.step2Flg='2';
    }
    
    $scope.step=2;
    angular.element('#new_crumbs_menu3').addClass("list_active");
    angular.element('#new_crumbs_menu2').addClass("list_active");
    angular.element('#new_crumbs_menu4').removeClass("list_active");
    angular.element('#new_crumbs_menu5').removeClass("list_active");
    
}

$scope.step3=function(flg)
{
    
      if(flg==="")
    {
      $scope.step3Flg='1';
    }
    else{
      $scope.step3Flg='2';
    }
    
    $scope.step=3;
    angular.element('#new_crumbs_menu4').addClass("list_active");
     angular.element('#new_crumbs_menu2').addClass("list_active");
    angular.element('#new_crumbs_menu3').addClass("list_active");
    angular.element('#new_crumbs_menu5').removeClass("list_active");
}

$scope.step4=function(flg)
{
    $scope.step=4;
    angular.element('#new_crumbs_menu5').addClass("list_active");
    angular.element('#new_crumbs_menu2').addClass("list_active");
    angular.element('#new_crumbs_menu3').addClass("list_active");
    angular.element('#new_crumbs_menu4').addClass("list_active");
}


//  $scope.deliverQty=function(item)
// {
//     var comp1=item.reqQty;
//     var comp2=item.appQty;
    
//   if(comp2 < comp1)
//      {
//        item.status="P";
//      }
//      else{
//          item.status="A";       
//      }          
// }

// stockavailability
// $scope.deliverQty=function(item)
// {
  
//    console.log("called");
  
//     var comp1=item.reqQty;
//     var comp2=item.appQty;
    
    
//   if(comp2 < comp1)
//      {
//        item.status="P";
//      }
//      else{
//          item.status="A";
       
//      }
    
   
     
// }

// stockavailability
$scope.deliverQty=function(item)
{
  
  
  
    var comp1=item.reqQty;
    var comp2=item.appQty;
    
  if(comp2 < comp1)
     {
       item.status="P";
     }
     else{
        item.status="A";
       
     }
     
     
}



if(index===1)
{
   $scope.step1("");
}
else if(index===2)
{
   $scope.step2("");
}
else{
   $scope.step4("");
}

$scope.pageRedirect=function()
{
  
if(index===1)
{
  $state.go("master.approvalpurchaseView");
}
else if(index===2){
     $state.go("master.approvalPurchaseOrder");
}
else{
    $state.go("master.mrn");  
}
}

var cont_flag = false;
$scope.popup = function() {
    if (cont_flag == false) {
                $("#pop_stock").animate({ marginRight: 0 },"slow");
                cont_flag = true;
                $('#spin').addClass('fa-spin');
                $('body').css({'overflow': 'hidden'});
                // $('#pop_stock').css({'overflow': 'scroll'});

                
            }
            else {
                $("#pop_stock").animate({ marginRight: -400 },"slow");
                cont_flag = false;
                $('#spin').removeClass('fa-spin');
                 $('body').css({'overflow': ''});
                //  $('#pop_stock').css({'overflow': ''});

            }
}

$scope.stockavailability = [
            {
            'sno':'1',
            'item':'Wooden Sill',
            'available':'350'
         },
          {
            'sno':'2',
            'item':'Wooden Sill',
            'available':'350'
         },
          {
            'sno':'3',
            'item':'Wooden Sill',
            'available':'350'
         },
          {
            'sno':'4',
            'item':'Wooden Sill',
            'available':'350'
         },
          {
            'sno':'5',
            'item':'Wooden Sill',
            'available':'350'
         },
         {
            'sno':'6',
            'item':'Wooden Sill',
            'available':'350'
         },
          {
            'sno':'7',
            'item':'Wooden Sill',
            'available':'350'
         },
          {
            'sno':'8',
            'item':'Wooden Sill',
            'available':'350'
         },
          {
            'sno':'9',
            'item':'Wooden Sill',
            'available':'350'
         },
          {
            'sno':'10',
            'item':'Wooden Sill',
            'available':'350'
         },{
            'sno':'11',
            'item':'Wooden Sill',
            'available':'350'
         },
         {
            'sno':'12',
            'item':'Wooden Sill',
            'available':'350'
         },{
            'sno':'13',
            'item':'Wooden Sill',
            'available':'350'
         },
         {
            'sno':'14',
            'item':'Wooden Sill',
            'available':'350'
         },{
            'sno':'15',
            'item':'Wooden Sill',
            'available':'350'
         }
        ];
        
});