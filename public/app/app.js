'use strict';

angular.module('app', [])
    .controller('mainCtrl', ['$scope', '$http', function($scope, $http) {

        // Create serealized version of each property in object
        function serialize(obj) {
            var result = [];
            for(var prop in obj)
                result.push(encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop]));
            return result.join('&');
        }

        // Default to empty string if invalid value
        function checkIfValid(val) {
            return val ? val : '';
        }

        var success = function(res) {
            console.log('Action complete: ', res.data);

            // Clear form scope vars
            $scope.first = $scope.last = $scope.address = $scope.zip = $scope.email = $scope.phone = '';

            // Refresh our table
            $scope.getUsers();
        };

        var error = function (err) {
            console.log('err:', err.status);
        };

        // Get users from database
        $scope.getUsers = function() {
            $http.get('/users').then(function(res) {
                $scope.users = res.data;
                console.log('$scope.users: ', $scope.users);
            });
        };

        $scope.handleSubmit = function() {

            var data = serialize({
              first: checkIfValid($scope.first),
              last: checkIfValid($scope.last),
              address: checkIfValid($scope.address),
              zip: checkIfValid($scope.zip),
              email: checkIfValid($scope.email),
              phone: checkIfValid($scope.phone)
            });

            $http({
                method: "POST",
                url: "/newuser",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data
            }).then(success, error);
        };

        $scope.delete = function(id) {

            console.log('Deleted User ID: ', id);

            $http({
                method: "DELETE",
                url: "/deleteuser",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'id=' + id
            }).then(success, error);
        };

        // Get users from DB
        $scope.getUsers();
    }]);
