(function () {
    'use strict';

    angular
        .module('todo.login.controllers')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', 'api', 'storage'];
    function LoginController($state, api, storage) {
        var vm = this;
        vm.api = api;
        vm.loginSubmit = loginSubmit;
        vm.forget = forget;
        vm.backlogin = backlogin;
        vm.submitPassword = submitPassword;
        // vm.username = "";
        // vm.pass = "";
        vm.loginUser = [];

        function loginSubmit() {        
            
            // $state.go('master.matrerialrequisition');
            var loginUser = {
                "_id": vm.username,
                "password": vm.pass
            };
            api.User.login(loginUser, function (err, data) {
                 if (err) {
                     if ($('.alertify-log-error').length == 0) {
                    alertify.error('User name or Password is Incorrect.Please try again');
                     }
                }
                else {
                    storage.put("user_token", data.token);
                    vm.api.User.token = data.token;
                    if ($('.alertify-log-success').length == 0) {
                    alertify.success('Successfully Logged In');
                    }
                    //  alertify.warning('Successfully Logged In'); 
                    $state.go('master.matrerialrequisition');
                }
            });
        }


        vm.login = true;
        function forget() {
            vm.login = false;
        }
        function backlogin() {
            vm.login = true;
        }
    }

    function submitPassword() {
        alertify.confirm("Click OK to send the random generated Password to your mail id", function (e) {
            if (e) {
                alertify.success('The Password will be sent to your mail id');
            } else {
                alertify.error('Cancel');
            }
        });
    }
})();