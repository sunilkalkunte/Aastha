// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('aastha', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    Parse.initialize("QBV7sEoIudXui7MltZNc0kH8S0UQizJ1QRNcQeLf", "PAj8p84BMS8yk83Dzx03B0F35ONOJtWBlS8OTkgV");
  });
})

.config(function($stateProvider, $urlRouterProvider) {
 
  $stateProvider
  .state('login', {
    url: '/',
    templateUrl: 'templates/landing.html',
    controller: 'LoginCtrl'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'LoginCtrl'
  })
  .state('signin', {
    url: '/signin',
    templateUrl: 'templates/signin.html',
    controller: 'LoginCtrl'
  })
    .state('ngolanding', {
    url: '/ngolanding',
    templateUrl: 'templates/ngo/ngolanding.html',
    controller: 'LoginCtrl'
  });
 
  $urlRouterProvider.otherwise("/");
 
})

.controller('LoginCtrl', function($scope, $state) {
 
  $scope.data = {};
 
  $scope.signupEmail = function(){
 
  //Create a new user on Parse
  var user = new Parse.User();
  user.set("username", $scope.data.username);
  user.set("password", $scope.data.password);
  user.set("email", $scope.data.email);
 
  // other fields can be set just like with Parse.Object
  user.set("somethingelse", "like this!");
 
  user.signUp(null, {
    success: function(user) {
      // Hooray! Let them use the app now.
      //alert("success!");
      $state.go('signin');
      
    },
    error: function(user, error) {
      // Show the error message somewhere and let the user try again.
      alert("Error: " + error.code + " " + error.message);
    }
  });
 
};
 
 $scope.loginEmail = function(){
  Parse.User.logIn($scope.data.username, $scope.data.password, {
    success: function(user) {
      // Do stuff after successful login.
      console.log(user);
      //alert("success!");
      $state.go('ngolanding');
    },
    error: function(user, error) {
      // The login failed. Check error to see why.
      alert("error!");
    }
  });
};
 
});