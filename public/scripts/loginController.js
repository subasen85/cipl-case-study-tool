var myApplogin = angular.module('myApp.login', []);

myApplogin.controller('LoginCtrl', ['$scope', '$http','$location','$window', function($scope, $http,$location,$window) {    

 $scope.loginCredentials = function() {
      $http.post('/login', $scope.login).success(function(response) {
      	$location.path('/dashboard');
      });
    };

}]);
