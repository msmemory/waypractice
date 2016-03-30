

var app = angular.module('MyApp',['ngRoute', 'ngResource']).run(function($rootScope, $http){
  $rootScope.authenticated = false;
  $rootScope.current_user = "";

  $rootScope.wayian = "";
  $rootScope.skinSv = [];

  $rootScope.signout = function() {
    $http.get('/auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
  };



});

app.config(function($routeProvider){
  $routeProvider

    // .when('/', {
    //   templateUrl: 'main.html',
    //   controller: 'mainController'
    // })

    .when('/', {
      templateUrl: 'wayian.html',
      controller: 'diagController'
    })

    .when('/diagnose', {
      templateUrl: 'diagnose.html',
      controller: 'diagController'
    })

    .when('/login', {
      templateUrl: 'login.html',
      controller: 'authController'
    })

    .when('/register', {
      templateUrl: 'register.html',
      controller: 'authController'
    })

})


app.factory('postService', function($resource){
  return $resource('/api/posts/:id');

  // var factory = {};
  // factory.getAll = function(){
  //   return $http.get('/api/posts');
  // }
  //   return factory;
})



app.factory('diagWayianService', function($resource){
  return $resource('/diag/wayian/:id');

})



app.controller('mainController', function($scope, $rootScope, postService) {

  $scope.posts = postService.query();
  $scope.newPost = {  created_by:'',
              text:'',
              created_at:''
           };

  // postService.getAll().success(function(data){
  //   $scope.posts = data;
  // });

    $scope.post = function() {

      $scope.newPost.created_by = $rootScope.current_user;
      $scope.newPost.created_at = Date.now();
      postService.save($scope.newPost, function(){
        $scope.posts = postService.query();
        $scope.newPost = {  created_by:'',
              text:'',
              created_at:''
           };
      });
    };
});



app.controller('diagController', function($scope, $rootScope, $location, diagWayianService) {

  $scope.wayians = diagWayianService.query();

  $scope.oneWayian = function(sWayian) {

    diagWayianService.query({id:sWayian.email}).$promise.then(function(skinSv){

console.log(skinSv);

        var sKinSvData = [];
        for (var i = 0; i < skinSv.length; i++) {

            // let xDate = result.skin_results[i].diagnosis_date.substr(0,16).replace('-','').replace('-','').replace(':','').replace('T','');
            let xDate = new Date(skinSv[i].diagnosis_date).getTime();
            let ySkin = skinSv[i].condition;

            // console.log(xDate);
            // console.log(ySkin);

            sKinSvData[i] = [new Date(xDate), parseFloat(ySkin)];
        }

        sKinSvData.sort(function(a, b){  
            return ((a[0] < b[0]) ? -1 : ((a[0] > b[0]) ? 1 : 0));
        });

// console.log(sKinSvData.toString());

        $rootScope.wayian = sWayian;
        $rootScope.skinSv = sKinSvData;
        console.log(skinSv);
        $location.path('/diagnose');
    });

  };


  $scope.$watch('$viewContentLoaded', function() {

    // alert('load :: ' + $location.path());
    if($location.path() == '/diagnose'){

        new Dygraph($('#skin_survey_chart')[0], $rootScope.skinSv||[[0,0]], {
            labels: ["DateTime", "Conditions"],
            // customBars: true,
            title: $rootScope.wayian.name + '\'s Skin Survey',
            // ylabel: 'Temperature (F)',
            legend: 'always',
            labelsDivStyles: {
                'textAlign': 'right'
            },
            showRangeSelector: true
        });
      
    }

  });




  $scope.post = function() {

    $scope.newPost.created_by = $rootScope.current_user;
    $scope.newPost.created_at = Date.now();
    postService.save($scope.newPost, function(){
      $scope.posts = postService.query();
      $scope.newPost = {  created_by:'',
            text:'',
            created_at:''
         };
    });
  };

  
});



app.controller('authController', function($scope, $rootScope, $http, $location) {
	$scope.user = {username:'',
                   password:''}
    $scope.error_message = '';

    $scope.login = function() {
      $http.post('/auth/login', $scope.user).success(function(data){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;  

        $location.path('/');
      });

    	// $scope.error_message = 'login request for ' + $scope.user.username;
    };

    $scope.register = function() {
        $http.post('/auth/signup', $scope.user).success(function(data){
          if(data.state == 'success'){
            $rootScope.authenticated = true;
            $rootScope.current_user = data.user.username;
            $location.path('/');
          }
          else{
            $scope.error_message = data.message;
          }
      });

      $scope.error_message = 'registeration request for ' + $scope.user.username;
    };

});