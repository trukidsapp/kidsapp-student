angular.module('app', [
  'ngRoute',
  'app.authService',
  'app.login'

]).config(['$routeProvider', function ($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/login'});
}]).run(function ($rootScope, $location, authService) {
  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    if (!authService.isUserAuthenticated()) {
      // if not logged in, show login
      if (next.templateUrl === "views/login/login.html") {
      } else {
        $location.path("/home");
      }
    }
  });
});
