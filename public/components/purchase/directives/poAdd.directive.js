(function () {
    'use strict';

    angular
        .module('todo.purchase.directives')
        .directive('purchaseOrderAdd', purchaseOrderAdd);

    // materialRequestGrid.$inject = ['api'];
    function purchaseOrderAdd() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: poAddController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/purchase/views/purchaseOrderAdd.purchase.html',
            scope: {
                item: '=item',
                index: '@',
                // mredit: '=method',
                mrdelete: '=method'
            }
        };
        return directive;

        function link(scope, element, attrs, vm) {

        }
    }


    function poAddController($scope, api, $filter) {
        var vm = this;
        vm.api = api;
        vm.pigetDet = [];
        vm.button = true;
        vm.addPIDet = addPIDet;
        vm.deletePIDet = deletePIDet;
        vm.getUnitRate = getUnitRate;
        vm.getCategory = getCategory;
        vm.getProject = getProject;
        vm.addSign = addSign;
        vm.item.row = false;
        vm.getCompDet = '';
  // vm.filterCatName = '';
  vm.getCompDet = vm.api.profile.company;



        function addPIDet(piDet, piNo, orderType, proj , index) {

            
            $("#notification").animate({
        top: '65px',
    });
    $("#notification").fadeTo(2000, 500).slideUp(500, function(){
               $("#notification").alert('close');
                });  
    document.getElementById("notification").innerText="Your Order has been added in cart";
            var chPIDet = piDet[index];


            var hideBtn, showBtn, menuToggle;

            vm.pigetDet.push({
                "id": chPIDet['id'],
                "mat_code" : chPIDet['mat_code'],
                "category": chPIDet['category_id'],
                "material": chPIDet['name'],
                "size" : chPIDet['size'],
                "specification" : chPIDet['specification'],
                "UOM": chPIDet['uom'],
                "qty": chPIDet['approved_quantity'],
                "po_unit_rate": chPIDet['rate'],
                "po_total": chPIDet['approved_quantity'] * chPIDet['rate'],
                "pi_no": piNo,
                "ctrlIndex": index,
                "order_type" : orderType,
                "project" : proj.project,
                "sub_category" : proj.sub_category,
                "tax" : "0",
                "discount" : "0",
                "mat_type" : chPIDet['mat_type'],
                "mat_date" : chPIDet['expected_date']
            });




            var pogetDetails = [];
            pogetDetails = vm.pigetDet;

            $scope.$emit('pogetDetails', pogetDetails);
            // $scope.$emit('count', count);
        }


        function deletePIDet(piDet, piNo, index) {
            vm.pigetDet.splice(vm.pigetDet.indexOf(vm.pigetDet), 1);
        }



        // editapp 

        function getUnitRate(item) {
            vm.api.materialLists({ 'id': item.id }, function (err, data) {
                if (!err) {
                    if(data.materialsList) {
                        item.rate = data.materialsList[0].rate;
                    }
                    else{
                        item.rate = "0";
                    }
                    
                }
            })
        }

        function getCategory(cat) {
            var category = vm.api.company.category;
            if(category) {
                    var filterCat = $filter('filter')(category, { _id: cat }, true)[0];
            return filterCat.name;
            }
            
        }

        function getProject(proj) {
            var project = vm.api.projectList;
            if(project) {
                    var filterCat = $filter('filter')(project, { _id: proj }, true)[0];
                    vm.proj = proj;
            return filterCat.name;
            }
            
        }

        //Search DDL Select
  $('.search-panel .dropdown-menu').find('a').click(function (e) {
    e.preventDefault();
    var param = $(this).attr("title").replace("#", "");
    var concept = $(this).text();
    $('.search-panel span#search_concept').text(concept);
    $('.input-group #search_param').val(param);

    vm.searchType = param;
    if (param === "PODate") {
      $("#srhDt").show();
      $("#srhTxt").hide();
      $("#srhBranch").hide();
    } else if (param === "Branch") {
      $("#srhBranch").show();
      $("#srhTxt").hide();
      $("#srhDt").hide();
    }
    else {
      $("#srhBranch").hide();
      $("#srhDt").hide();
      $("#srhTxt").show();
    }
  });

  $('.input-group1.date').datepicker({
    calendarWeeks: true,
    todayHighlight: true,
    autoclose: true,
    endDate: '+0d',
    closeText: 'Clear',
    clearBtn: true
  });

        function addSign(item) {
            // console.log(JSON.stringify(item.status.name));
            if(item.status.name == 'Ordered' || item.status.name == 'Rejected'){
                return false;
            }
            if(vm.getCompDet !== 'CH0001' && vm.getCompDet == 'CO00001') {
                        var vendor = $filter('filter')(vm.api.vendorallList, { _id: vm.api.vendor }, true)[0];
                        var arr = _.find(vendor.materials, { "id": item.id });
            }
            else {
                var vendor = $filter('filter')(vm.api.vendorallList, { _id: vm.api.vendor }, true)[0];
                var arr = _.find(vendor.materials, { "mat_code": item.mat_code });
            }
            
            // console.log(JSON.stringify(vendor));
            if (arr) {
                return true;
            } else {
                return false;
            }
        }
    }

})();
