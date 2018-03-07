(function () {
    'use strict';

    angular
        .module('todo.shared')
        .factory('material', materialFactory);

    materialFactory.$inject = ['api', '$filter'];
    function materialFactory(api, $filter) {
        materialFactory = {}

        materialFactory = {
            getmaterial: getmaterial
        }
        function getmaterial(callback) {
            api.materialLists({}, function (err, data) {
                if (!err) {
                    callback(null, data.materialsList);
                } else {
                    callback(err, null);
                }
            })
        }

        function getCategoryName(data) {
            var category = vm.api.company.category;
            if (category) {
                category = $filter('filter')(category, { _id: data }, true);
                return category.name;
            } else {
                return "Something went wrong!";
            }
        }

        function getUomName(data) {
            vm.api.getUom({}, function (err, data) {
                if (!err) {
                    var uom = data.uomList;
                    if (uom) {
                        uom = $filter('filter')(uom, { _id: data }, true);
                        return category.name;
                    } else {
                        return "Something went wrong!";
                    }
                }
            })
        }

        return materialFactory;
    }
})();