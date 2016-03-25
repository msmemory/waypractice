

var app = angular.module('MyApp',['ngRoute', 'ngResource']).run(function($rootScope, $http){
  $rootScope.authenticated = false;
  $rootScope.current_user = "";

  $rootScope.logout = function(){
    $http.get('/auth/signout');

    $rootScope.authenticated = false;
    $rootScope.current_user = "";
  }

  $rootScope.signout = function() {
    console.log('logging out');
    $http.get('/auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
  };



});

app.config(function($routeProvider){
  $routeProvider

    .when('/', {
      templateUrl: 'main.html',
      controller: 'mainController'
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