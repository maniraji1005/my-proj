'use strict';
angular.module('todo.trackController', [])
.controller('trackController', function($scope) {
 
 
    
function ct_pop_up() {
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
   
   
   
})