(function () {
    'use strict';

    angular
        .module('todo.store.directives')
        .directive('materialIssueGrid', materialIssueGrid);

    materialIssueGrid.$inject = ['api','$stateParams'];
    function materialIssueGrid(api, $stateParams) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: miGridController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            templateUrl: 'components/store/views/miGrid.store.html',
            scope: {
                item: '=item',
                index: '@',
                // mredit: '=method',
                mrdelete: '=method'
            }
        };
        return directive;

        function link(scope, element, attrs, vm) {

            // For TrackSheet
            vm.openTrackSheet = function (data){
                scope.$emit('mitracksheet', {'mrid':data});
            }
        }



    }

    function miGridController(api,$filter) {
        var vm = this;
        vm.api = api;
        vm.item.sno = parseInt(vm.index);
        vm.fromProject = fromProject;
        vm.toProject = toProject;
        vm.getCompDet = vm.api.profile.company;
        // vm.projectList = vm.api.projectList ;

          api.ProjectDDL({}, function (err, data) {
      if (err) {
        //alert("No Data");
      }
      else {
        vm.toprojectList = data.projectList;
        vm.api.toProjectList = vm.toprojectList;
      }
    });

        // For Getting Project based on Emp ID for CH
  var EmpId = {
    "empID": vm.api.profile._id
  }

  api.ProjectDDL(EmpId, function (err, data) {
    if (err) {
      //alert("No Data");
    }
    else {
      vm.projectList = data.projectList;
    //   vm.api.projectList = vm.projectList;
    }
  });

        function fromProject(fromProject) {
            if(fromProject && vm.toprojectList) {
                    var filterCat = $filter('filter')(vm.toprojectList, { _id: fromProject }, true)[0];
                    return filterCat.name;
            }
    
  }

  function toProject(toProject) {
      if(toProject && vm.toprojectList) {
            var filterCat1 = $filter('filter')(vm.toprojectList, { _id: toProject }, true)[0];
            return filterCat1.name;
      } 
  }

        // editapp 

    }

})();
