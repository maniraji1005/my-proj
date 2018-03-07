(function () {
    'use strict';

    angular
        .module('todo.purchase.controllers',['ui.select','ngSanitize'])
        .controller('PurchaseController', PurchaseController);

    PurchaseController.$inject = ['$state', '$scope'];
    function PurchaseController($state, $scope) {
        
        
        
        $('#mySelect').selectpicker();
        $('.SeeMore2').click(function(){
		var $this = $(this);
		$this.toggleClass('SeeMore2');
		if($this.hasClass('SeeMore2')){
			$this.text('Read More');			
		} else {
			$this.text('Read Less');
		}
	});
    
     $('.POSeeMore2').click(function(){
		var $this = $(this);
		$this.toggleClass('POSeeMore2');
		if($this.hasClass('POSeeMore2')){
			$this.text('Read More');			
		} else {
			$this.text('Read Less');
		}
	});
    
    $('.MRNSeeMore2').click(function(){
		var $this = $(this);
		$this.toggleClass('MRNSeeMore2');
		if($this.hasClass('MRNSeeMore2')){
			$this.text('Read More');			
		} else {
			$this.text('Read Less');
		}
	});
        
        
        
        var vm = this;
        vm.displayList = [];
       vm.check = check;
       function check (id){
        //   angular.forEach(vm.materials, function(value, index){
        //     console.log(value.id)
        //     if(id.no == value.id){
        //     vm.displayList.push(value);
        //     }
        // });
          for(var i=0; i<vm.materials.length; i++){
              var v = vm.materials
              if(id.no == v[i]['id'] ){
                  vm.displayList.push(v[i]);
              }
          }
       }
       vm.remove = remove;
       function remove(id){
           angular.forEach(vm.displayList,function(value,index){
               if(id.no == value.id){
            vm.displayList.splice(index, 1);
            }
           });
           
       }
        vm.purchaseIndent = [
            {id:1,no:'PI001',mat_name:'50 * 50 Sliding material',quantity:30},
            {id:2,no:'PI002',mat_name:'50 * 50 Casement material',quantity:30},
            {id:3,no:'PI003',mat_name:'50 * 50 Tilt and Turn material',quantity:30},
            {id:4,no:'PI004',mat_name:'50 * 50 Ventilator(Fixed) material',quantity:30},
            {id:5,no:'PI005',mat_name:'50 * 50 Ventilator(Adjustable) material',quantity:30},
            {id:6,no:'PI006',mat_name:'50 * 50 Top Hung material',quantity:30},
            {id:7,no:'PI007',mat_name:'50 * 50 Sliding Fold material',quantity:30},
            {id:8,no:'PI008',mat_name:'50 * 50 Combined Windows',quantity:30}
        ]
        
        vm.materials = [
             {
                id:'PI001',   
                mat_code:'MAT001',
                mat_name:'50 * 50 Sliding material',
                uom:'Sq ft',
                PI_qty:12,
                PI_created_by:'Vignesh',
                PI_approved_by:'Narendran',
                mat_det : [{
                    mat_code:'SM001',
                    mat_name:'50 * 50 Sliding material',
                    uom:'Sq ft',
                    PI_qty:12,
                }]
            },
            {
                id:'PI002',   
                mat_code:'SM001',
                mat_name:'50 * 50 Casement material',
                uom:'Sq ft',
                PI_qty:25,
                PI_created_by:'Vignesh',
                PI_approved_by:'Narendran'
            },
            {
                id:'PI003',   
                mat_code:'SM001',
                mat_name:'50 * 50 Tilt and Turn material',
                uom:'Sq ft',
                PI_qty:300,
                PI_created_by:'Vignesh',
                PI_approved_by:'Narendran'
            },
            
        ]
        
        vm.materialDet = [
            {
                mat_code:'MAT001',
                mat_name:'50 * 50 Sliding material',
                uom:'Sq ft',
                PI_qty:12,
                PI_created_by:'E001',
                PI_approved_by:'D001'
            },
        ]
        
        
    }
})();