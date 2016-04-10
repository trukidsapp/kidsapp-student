angular.module('app', [
  'ngRoute',
  'app.authService',
  'app.login'

]).config(['$routeProvider', function ($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/login'});
}]);
