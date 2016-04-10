angular.module('app', [
    'ngRoute',
    //  'environment',
    'app.authService' //,
    // 'app.login'

  ])
  .config([
    '$routeProvider',
    // 'envServiceProvider',
    function ($routeProvider, envServiceProvider) {
      $routeProvider.otherwise({redirectTo: '/login'});
      //
      // envServiceProvider.config({
      //   domains: {
      //     development: ["localhost"],
      //     production: ["24.70.42.226"]
      //   },
      //   vars: {
      //     development: {
      //       apiUrl: "//localhost:5000/api"
      //     },
      //     production: {
      //       apiUrl: "//kidsapp-api.herokuapp.com/api"
      //     }
      //   }
      // });

    }])
  .run(function ($rootScope, $location, authService) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
      if (!authService.isUserAuthenticated()) {
        $location.path("/login");
      }


    });
  });
