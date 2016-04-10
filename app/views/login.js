angular.module('app.login', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
      templateUrl: 'views/login/login.html',
      controller: 'LoginController'
    });
  }])

  .controller('LoginCOntroller', [
    '$scope',
    '$http',
    '$location',
    function ($scope, $http, $location) {

      // TODO login controller goes here


    }]);