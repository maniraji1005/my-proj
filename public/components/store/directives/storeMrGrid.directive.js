(function () {
    'use strict';

    angular
        .module('todo.store.directives')
        .directive('materialRequestGrid', materialRequestGrid);

    materialRequestGrid.$inject = ['api', '$stateParams',];
    function materialRequestGrid(api, $stateParams) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: mrGridController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/store/views/materialRequestGrid.store.html',
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
                scope.$emit('mredit',data);
            }
            
            vm.deleteitem = function (data){
                alertify.confirm("Are you sure to delete this draft ?", function(e){
                    if (e) {
                      scope.$emit('mrdelete',data);
                    } else {
                    }
                });
            }

            vm.openTrackSheet = function (data){
                scope.$emit('mrtracksheet',data);
            }
        }



    }

    function mrGridController(api,$filter) {
        var vm = this;
        vm.api = api;
        vm.item.sno = parseInt(vm.index);
        vm.getCompDet = '';
        vm.fromProject = fromProject;
        vm.toProject = toProject;
        
        vm.getCompDet = vm.api.profile.company;
        vm.projectList = vm.api.projectList ;
        vm.toprojectList = vm.api.toProjectList;
        // vm.projectList = [];
        

       

        // For Getting Project based on Emp ID for CH
  var EmpId = {
    "empID": vm.api.profile._id
  }

        function fromProject(fromProject) {
            if(fromProject && vm.toprojectList) {
                  var filterCat = $filter('filter')(vm.toprojectList, { _id: fromProject }, true)[0];
                  if(filterCat) {
                       return filterCat.name;
                  }
                //   vm.fromProject = filterCat;
                //   return filterCat.name;
            }
  }

  function toProject(toProject) {
      if(toProject && vm.toprojectList) {
             var filterCat1 = $filter('filter')(vm.toprojectList, { _id: toProject }, true)[0];
             if(filterCat1) {
                     return filterCat1.name;
             }
             
      }   
  }

        // editapp 

    }

})();
