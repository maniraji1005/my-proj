(function () {
    'use strict';

    angular
        .module('todo.login.controllers')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', 'api', 'storage', '$timeout', '$filter'];
    function LoginController($state, api, storage, $timeout, $filter) {
        var vm = this;
        vm.getCompany = getCompany;
        vm.loginSubmit = loginSubmit;
        vm.forget = forget;
        vm.backlogin = backlogin;
        vm.submitPassword = submitPassword;
        // vm.username = "";
        // vm.pass = "";
        vm.loginUser = [];
        vm.api = api;
        var flag = 0;
        vm.curpass = '';
        vm.newPass = '';
        vm.rePass = '';
        // vm.getCompDet = vm.api.profile.company;
        // console.log(JSON.stringify(vm.getCompDet));
        function submitPassword() {
            var changePass = {
                "_id": vm.api.profile._id,
                "password": vm.curpass,
                "newpassword": vm.newPass
            }
            if (vm.newPass !== vm.rePass) {
                if ($('.alertify-log-error').length == 0) {
                    alertify.error("Password not match");
                }
                return;
            }
            alertify.confirm("Are you sure you want to change your Password?", function (e) {
                if (e) {
                    vm.api.changePass(changePass, function (err, data) {
                        if (err) {
                            if ($('.alertify-log-error').length == 0) {
                                alertify.error('Employee ID or Password is Incorrect.Please try again');
                            }
                        }
                        else {
                            // alert(JSON.stringify(data));
                            if ($('.alertify-log-success').length == 0) {
                                alertify.success(data);
                            }
                        }
                    });
                }
                else {
                    alertify.error('Cancel');
                }
                // alertify.confirm("Click OK to send the random generated Password to your mail id", function (e) {
                //     if (e) {
                //         alertify.success('The Password will be sent to your mail id');
                //     } else {
                //         alertify.error('Cancel');
                //     }
                // });
            });
        }


        function loginSubmit() {
            storage.clear();
            var loginUser = {
                "_id": vm.username,
                "password": vm.pass
            };
            vm.api.User.login(loginUser, function (err, data) {
                if (err) {
                    if ($('.alertify-log-error').length == 0) {
                        alertify.error('Employee ID or Password is Incorrect.Please try again');
                    }
                }
                else {
                    // alert(JSON.stringify(data));
                    storage.put("user_token", data.token);
                    api.User.token = data.token;
                    console.log("Token",data.token);

                    if ($('.alertify-log-success').length == 0) {
                        alertify.success('Logged In Successfully');
                    }

                    // $state.go('master.matrerialrequisition');
                    flag = 1;


                    getCompany();


                }
            });
            // if(flag == 1){
            // vm.getCompany();
            // }
        }




        function getCompany() {
            var token = storage.get('user_token');
            if (token)
                vm.api.companyDet(function (err, data) {
                    if (err) {
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
                });
        }





        // function getCompany() {



        // vm.api.companyDet(function (err, data) {
        //     if (err) {
        //         alert("Could not get company details");
        //     } else {
        //         storage.put('company_det', JSON.stringify(data));
        //     }
        // });
        // }



        vm.login = true;
        function forget() {
            vm.login = false;
        }
        function backlogin() {
            vm.login = true;
        }
    }
})();