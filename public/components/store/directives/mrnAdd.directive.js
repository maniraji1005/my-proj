(function () {
    'use strict';

    angular
        .module('todo.store.directives')
        .directive('materialReceiptAdd', materialReceiptAdd);

    // materialRequestGrid.$inject = ['api'];
    function materialReceiptAdd() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: mrnAddController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/store/views/mrnAdd.store.html',
            scope: {
                item: '=item',
                index: '@',
                // mredit: '=method',
                mrdelete: '=method'
            }
        };
        return directive;

        function link(scope, element, attrs, vm) {
            // vm.edititem = function (data) {
            //     scope.$emit('mredit',data);
            // }

            // vm.deleteitem = function (data){
            //     scope.$emit('mrdelete',data);
            // }

            // vm.openTrackSheet = function (data){
            //     scope.$emit('mrtracksheet',data);
            // }
        }



    }


    function mrnAddController($scope, api, $filter) {
        var vm = this;
        vm.api = api;
        vm.mrngetDet = [];
        vm.addPODet = addPODet;
        vm.deletePODet = deletePODet;
        vm.button = true;
        var mrnGetDetails = [];
         vm.getCompDet = '';
        vm.getCompDet = vm.api.profile.company;
        // vm.vendorPIList = vm.api.PIList;
        // alert("CAlled");
        // alert(JSON.stringify(vm.api.PIList));
        vm.item.sno = parseInt(vm.index);
        vm.categoryName = categoryName;
        vm.addSign = addSign;
        vm.getProject = getProject;
        // vm.item.row = false;
        function getProject(proj) {
            var project = vm.api.projectList;
            if(project) {
                    var filterCat = $filter('filter')(project, { _id: proj }, true)[0];
                    vm.proj = proj;
            return filterCat.name;
            }
            
        }
        function addPODet(poDet, poNo,project, index) {
            $("#notificationMRN").animate({
        top: '65px',
    });
    $("#notificationMRN").fadeTo(2000, 500).slideUp(500, function(){
               $("#notificationMRN").alert('close');
                });  
    document.getElementById("notificationMRN").innerText="Your MRN has been added in cart";
            var chPODet = poDet[index];
            // console.log(JSON.stringify(chPODet));
            var hideBtn, showBtn, menuToggle;
            vm.mrngetDet.push({
                "id": chPODet['id'],
                "mat_code": chPODet['mat_code'],
                "pi_list": chPODet['indent'],
                "category": chPODet['category'],
                "project" : project.project,
                "sub_cateogry" : chPODet['sub_category_id'],
                "material": chPODet['name'],
                "UOM": chPODet['uom'],
                "size" : chPODet['size'],
                "specification" : chPODet['specification'],
                "order_type" : project.order_type,
                "qty": chPODet['quantity'],
                "po_unit_rate": chPODet['rate'],
                "po_total": chPODet['total'],
             //   "rate" : chPODet['rate'],
                "quantity" : chPODet['quantity'],
                "pi_no": poNo,
                "tax" : chPODet['tax'],
                "discount" : chPODet['discount'],
                "ctrlIndex": index
            })


            var mrnGetDetails = [];
            mrnGetDetails = vm.mrngetDet;
           // console.log(JSON.stringify(mrnGetDetails));

            $scope.$emit('mrngetDetails', mrnGetDetails);
            // $scope.$emit('count', count);
        }

        function deletePODet(poDet, poNo, index) {
            mrnGetDetails.splice(index, 1);

            // $scope.$emit('mrngetDetails', mrnGetDetails);
        }


        function categoryName(data) {
            var category = vm.api.company.category;

            var filterCat = $filter('filter')(category, { _id: data }, true)[0];
            return filterCat.name;
        }

        function addSign(item) {
            if(item.pending_quantity == '0'){
                return false;
            }
            if(vm.getCompDet !== 'CH0001' && vm.getCompDet == 'CO00001') {

            var vendor = $filter('filter')(vm.api.vendorallList, { _id: vm.api.vendor }, true)[0];
            
                     var arr = _.find(vendor.materials, { "id": item.id });
         
            }
            else {
                if(vendor.materials)
            {
                     var vendor = $filter('filter')(vm.api.vendorallList, { _id: vm.api.vendor }, true)[0];
                     var arr = _.find(vendor.materials, { "mat_code": item.mat_code });
            }
            }
            // console.log(JSON.stringify(vendor));
            if (arr) {
                return true;
            } else {
                return false;
            }
         //   }
        }
        // editapp 

    }

})();
