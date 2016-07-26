 var myAppEmp = angular.module('myApp.dashboard', []);

  myAppEmp.controller('DashboardCtrl', ['$scope', '$http','$location','$rootScope', function($scope, $http,$location,$rootScope) {   
  
  

  $scope.getDownload = function(url){
    alert(url) ;  
  //  var downloadPath = "/files/instructions.pdf";
  //$scope.downloadFile(downloadPath);
  };

  var technologyView=function(){
         $http.get('/technology').success(function(response) {
                $scope.technologies = response;                         
            }) 
 		}; 

  var domainView=function(){
         $http.get('/domain').success(function(response) {   
                $scope.domains = response;
                          })
 		};

  technologyView(); 
  domainView();

    var dashboardView=function(){ 
         $http.get('/dashboard').success(function(response) {
         	$scope.dashboards = response;
            });
  		};

  	dashboardView();  
  	
	


    $scope.DropDownDomainChanged = function () {
		   var getDomain =  $scope.selectedDomain;
       var getTech =  $scope.selectedTechnology;

        console.log("$scope.selectedTechnology:: "+$scope.selectedTechnology);
        console.log(" $scope.selectedDomain:: "+ $scope.selectedDomain);    



			 if($scope.selectedDomain != undefined && $scope.selectedTechnology == undefined)
			{
          $http.get('/getDashboardParamDomainId/'+getDomain.domain).success(function(response) {
         	$scope.dashboards = response; 
            });
        }

         else if($scope.selectedTechnology != undefined && $scope.selectedDomain != undefined)
        {
          var getDomain =  $scope.selectedDomain;
          $http.get('/getDashboardParamTechAndDomainTest/'+getTech.technology+'/'+getDomain.domain).success(function(response) {
          $scope.dashboards = response;
            });
              }

        else if($scope.selectedDomain == null){
          $http.get('/getDashboardParamTechId/'+getTech.technology).success(function(response) {
          $scope.dashboards = response;
            });
        }  
        else if($scope.selectedDomain == null && $scope.selectedTechnology == null){
         dashboardView();            
        }      
        else{dashboardView(); }
        };

    $scope.DropDownTechnologyChanged = function () {
      var getDomain =  $scope.selectedDomain;
		  var getTech =  $scope.selectedTechnology;

        console.log("$scope.selectedTechnology:: "+$scope.selectedTechnology);
        console.log(" $scope.selectedDomain:: "+ $scope.selectedDomain);

        if($scope.selectedTechnology != undefined && $scope.selectedDomain == undefined )
        {
          $http.get('/getDashboardParamTechId/'+getTech.technology).success(function(response) {
          $scope.dashboards = response;
            });
              }

		    else if($scope.selectedTechnology != undefined && $scope.selectedDomain != undefined)
				{
          var getDomain =  $scope.selectedDomain;
          $http.get('/getDashboardParamTechAndDomain/'+getDomain.domain+'/'+getTech.technology).success(function(response) {
         	$scope.dashboards = response;
            });
             	}

        else if($scope.selectedTechnology == null){
          $http.get('/getDashboardParamDomainId/'+getDomain.domain).success(function(response) {
          $scope.dashboards = response; 
            });
        }

      
        else if( $scope.selectedDomain == null && $scope.selectedTechnology == null ){
         dashboardView();            
        }   

        else{dashboardView(); }
        };
  
	  $scope.logout = function() {
        $location.path('/login');
        };

    $scope.upload = function() {     
      	$location.path('/upload');     
    };
}]);


