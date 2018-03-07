(function () {
    'use strict';

    angular
        .module('todo.purchase.directives')
        .directive('purchaseIndentGrid', purchaseIndentGrid);

    // materialRequestGrid.$inject = ['api'];
    function purchaseIndentGrid() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: piGridController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/purchase/views/purchaseIndentGrid.purchase.html',
            scope: {
                item: '=item',
                index: '@',
                // mredit: '=method',
                mrdelete: '=method'
            }
        };
        return directive;

        function link(scope, element, attrs, vm) {
            vm.edititem = function (data) {
                scope.$emit('piEdit',data);
            }
            
            vm.deleteitem = function (data){
                alertify.confirm("Are you sure to delete this draft ?", function(e){
                    if (e) {
                      scope.$emit('piDelete',data);
                    } else {
                    }
                });
            }
            
            vm.openTrackSheet = function (data){
                scope.$emit('piTrackSheet',data);
            }
        }
    }

    function piGridController(api,$filter) {
        var vm = this;
        vm.api = api;
        vm.item.sno = parseInt(vm.index);
        vm.projectList = vm.api.projectListGrid;
        vm.fromProject = fromProject;
        // console.log(JSON.stringify(vm.projectList));
        vm.getCompDet = vm.api.profile.company;

        function fromProject(fromProject) {
            if(fromProject) {
                  var filterCat = $filter('filter')(vm.projectList, { _id: fromProject }, true)[0];
                  if(filterCat) {
                       return filterCat.name;
                  }
                //   vm.fromProject = filterCat;
                //   return filterCat.name;
            }
  }

        // editapp 

    }

})();
