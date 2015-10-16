// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('aastha', ['ionic'])

.run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            Parse.initialize("QBV7sEoIudXui7MltZNc0kH8S0UQizJ1QRNcQeLf", "PAj8p84BMS8yk83Dzx03B0F35ONOJtWBlS8OTkgV");
        });
    })
    .config(['$ionicConfigProvider', function($ionicConfigProvider) {

        $ionicConfigProvider.tabs.position('bottom'); // other values: top

    }])
    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('login', {
                url: '/',
                templateUrl: 'templates/signin.html',
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
                abstract: true,
                templateUrl: 'templates/ngo/hometabs.html'
            })
            .state('ngolanding.home', {
                url: "/home",
                views: {
                    'tab-list': {
                        templateUrl: "templates/ngo/home.html",
                        controller: 'ListingCtrl'
                    }
                }
            })
            .state('ngolanding.ngo', {
                url: "/listing",
                views: {
                    'tab-ngo': {
                        templateUrl: "templates/ngo/ngolisting.html"
                    }
                }
            })
            .state('ngolanding.profile', {
                url: "/profile",
                views: {
                    'tab-profile': {
                        templateUrl: "templates/ngo/profile.html",
                        controller: 'ProfileCtrl'
                    }
                }
            })
            .state('ngolanding.addItem', {
                url: "/addItem",
                views: {
                    'tab-profile': {
                        templateUrl: "templates/ngo/addItem.html",
                        controller: 'ContribCtrl'
                    }
                }
            });

        $urlRouterProvider.otherwise("/");

    })
    .controller('ListingCtrl', function($scope, $state) {
        $scope.items = [{
            id: 1,
            item: 'Engineering Maths- 1 sem',
            type: 'Books',
            count: 2
        }, {
            id: 2,
            item: 'chemistry 1st PU',
            type: 'Books',
            count: 2
        }];
    })
    .controller('LoginCtrl', function($scope, $state, $ionicLoading) {

        $scope.data = {};

        $scope.signupEmail = function() {

            //Create a new user on Parse
            var user = new Parse.User();
            user.set("username", $scope.data.username);
            user.set("password", $scope.data.password);
            user.set("email", $scope.data.email);

            // other fields can be set just like with Parse.Object
            user.set("somethingelse", "like this!");
            $ionicLoading.show({
                template: 'Completing Signup...'
            });
            user.signUp(null, {
                success: function(user) {
                    // Hooray! Let them use the app now.
                    //alert("success!");
                    $ionicLoading.hide();
                    $state.go('signin');

                },
                error: function(user, error) {
                    $ionicLoading.hide();
                    // Show the error message somewhere and let the user try again.
                    alert("Error: " + error.code + " " + error.message);

                }
            });

        };

        $scope.loginEmail = function() {
            $ionicLoading.show({
                template: 'Signing in...'
            });
            Parse.User.logIn($scope.data.username, $scope.data.password, {
                success: function(user) {
                    // Do stuff after successful login.
                    console.log(user);
                    //alert("success!");
                    $ionicLoading.hide();
                    $state.go('ngolanding.home');
                },
                error: function(user, error) {
                    $ionicLoading.hide();
                    // The login failed. Check error to see why.
                    alert("error!");
                }
            });
        };

    })

.controller('ContribCtrl', function($scope, Camera, $ionicLoading, $state) {
        $scope.contribution = {};
        $scope.getPhoto = function() {
                console.log('Getting camera');
                Camera.getPicture({
                    quality: 75,
                    targetWidth: 320,
                    targetHeight: 320,
                    saveToPhotoAlbum: false
                }).then(function(imageURI) {
                    console.log(imageURI);
                    $scope.lastPhoto = imageURI;
                }, function(err) {
                    console.err(err);
                });
            } // end getPhoto

        $scope.submitContrib = function() {

                var Contribution = Parse.Object.extend("Contribution");
                var contrib = new Contribution();

                contrib.set("category", $scope.contribution.category);
                contrib.set("amount", $scope.contribution.amount);
                contrib.set("count", $scope.contribution.count);
                contrib.set("comments", $scope.contribution.comments);
                var relation = contrib.relation("username");
                var currentUser = Parse.User.current();
                if (currentUser) {
                    relation.add(currentUser);
                    // do stuff with the user
                } else {
                    // show the signup or login page
                }
                $ionicLoading.show({
                    template: 'Saving Data...'
                });
                contrib.save(null, {
                    success: function(object) {
                        $ionicLoading.hide();
                        // Execute any logic that should take place after the object is saved.
                        alert('New object created with objectId: ' + object.id);
                    },
                    error: function(object, error) {
                        $ionicLoading.hide();
                        // Execute any logic that should take place if the save fails.
                        // error is a Parse.Error with an error code and message.
                        alert('Failed to create new object, with error code: ' + error.message);
                    }
                });

                // contribObject.save(temp).then(function(object) {
                //     $ionicLoading.hide();
                //     alert("yay! it worked");
                //     $state.go('ngolanding.home');
                // }, function(err) {
                //     console.log(err);
                //     $ionicLoading.hide();

                // });
            } // end submitContrib
    })
    .factory('Camera', ['$q', function($q) {

        return {
            getPicture: function(options) {
                var q = $q.defer();

                navigator.camera.getPicture(function(result) {
                    // Do any magic you need
                    q.resolve(result);
                }, function(err) {
                    q.reject(err);
                }, options);

                return q.promise;
            }
        }
    }]);
