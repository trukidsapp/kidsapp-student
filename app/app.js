angular.module('app', [
  'ngRoute',
  'app.login'

]).config(['$routeProvider', function ($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/login'});
}]);
