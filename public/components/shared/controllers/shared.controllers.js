(function () {
  'use strict';

  angular
    .module('todo.shared.controllers', ['infinite-scroll'])
    .controller('SharedController', SharedController);

  SharedController.$inject = ['$state', '$scope', 'api', 'storage', '$filter', 'material', '$http'];
  function SharedController($state, $scope, api, storage, $filter, material, $http) {
    var vm = this;

    vm.popup = ct_pop_up;
    vm.popupcls = popupcls;
    vm.api = api;
    vm.logoutSubmit = logoutSubmit;


    vm.profile = profile;
    vm.getCompany = getCompany;
    vm.profileDet = [];
    vm.stockavailability = [];
    vm.getallmat = getallmat;
    vm.materialFactory = material;
    vm.UomName = UomName;
    var uomList = [];

    vm.roleDet = [];
    vm.getmore = getmore;
    vm.getCompDet = vm.api.profile.company;
    // vm.mainAvtive = 0;
    function profile() {
      var profl = storage.get('user_profile');
      vm.profileDet = JSON.parse(profl);
      vm.api.profile = vm.profileDet;
    }

    vm.profile();


    //Check & Set Main Menu Active
    $scope.isMenuActive = function (index, item) {

      if (!storage.get("mainMenuSelected")) {
        storage.put("mainMenuSelected", 0);
      }


      if (parseInt(storage.get("mainMenuSelected")) === parseInt(index)) {
        return true;
      }
      else {
        return false;
      }

    }

    $scope.setMainMenuActive = function (index) {
      storage.put("subMenuSelected", 0);
      storage.put("mainMenuSelected", index);
    }


    // Check & Set Sub Menu Active

    $scope.isSubMenuActive = function (index) {
      if (!storage.get("subMenuSelected")) {
        storage.put("subMenuSelected", 0);
      }


      if (parseInt(storage.get("subMenuSelected")) === parseInt(index)) {
        return true;
      }
      else {
        return false;
      }
    }

    $scope.setSubMenuActive = function (index) {
      storage.put("subMenuSelected", index);
    }

    //Menu Page Redirect
    $scope.goToPage = function (item, ele) {
      if (ele === "c") {
        storage.put("access", JSON.stringify(item.s_access));
        $state.go(item.s_go);
      }
      else {
        if (item.m_sub_modules.length === 0) {
          storage.put("access", JSON.stringify(item.m_access));
          $state.go(item.m_go);
        }
        else {
          storage.put("access", JSON.stringify(item.m_sub_modules[0].s_access));
          $state.go(item.m_sub_modules[0].s_go);
        }
      }
    }




    function getCompany() {
      var token = storage.get('user_token');
      if (token)
        vm.api.companyDet(function (err, data) {
          if (err) {
          } else {
            // console.log('company', data);
            var roleDet = data.modules;
            var profile = storage.get('user_profile');
            var role = JSON.parse(profile);
            var resObj = $filter('filter')(roleDet, { _id: role.roles[0] }, true);
            roleDet = resObj[0];
            vm.roleDet = roleDet;
          }
        });
    }
    getCompany();


    var cont_flag = false;

    function ct_pop_up() {
      $("body").css("overflow", "hidden");
    }

    function popupcls() {
      $("body").css("overflow", "scroll");
      $scope.stocks = "";
    }

    //Logout
    function logoutSubmit() {
      api.User.token = "";
      storage.clear();
      alertify.success('Successfully Logged Out');
      $state.go('login');
    }

    function getallmat() {
      var data = {
        'status': 'Active'
      }
      vm.api.materialLists(data, function (err, data) {
        if (!err) {
          vm.stockavailability = data.materialsList;
        }
      });
      vm.api.getUom({}, function (err, data) {
        if (!err) {
          uomList = data.uomList;
        }
      });
    }

    function getmore() {
    }

    function UomName(data) {
      var uomname = $filter('filter')(uomList, { _id: data }, true)[0];
      if (uomname)
        return uomname.name;
    }
  }
})();