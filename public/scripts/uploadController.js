var myAppUpload = angular.module('myApp.upload', []);


myAppUpload.controller('UploadCtrl', ['$scope', '$http','$location', function($scope, $http,$location) {  



  var technologyView=function(){
         $http.get('/technology').success(function(response) {     
                $scope.technologies = response;
    }) 
 }; 

  var domainView=function(){
         $http.get('/domain').success(function(response) {     
                $scope.domain = response;
                console.log("domain: "+$scope.domain)
           }) 
 };
 technologyView(); 
 domainView();

 /* $scope.getUpload = function() {
      $http.post('/upload', $scope.upload).success(function(response) {
        console.log("name ::: "+$scope.upload.title);
        $scope.upload="";
        console.log("response:::"+response);

      });
    };
*/
 	/*$scope.caseUpload = function() {
      $http.post('/upload').success(function(response) {
      	$location.path('/dashboard');
      });
    };

   
*/
     $scope.goToDashboard = function() {     
      	$location.path('/dashboard');     
    }; 
        

}]);




