angular.module('app', [
    'ngRoute',
    'environment',
    'app.authService',
    'app.login',
    'app.game-list',
    'app.quiz',
    'app.nav'

  ])
  .config([
    '$routeProvider',
    'envServiceProvider',
    function ($routeProvider, envServiceProvider) {
      $routeProvider.otherwise({redirectTo: '/game-list'});

      envServiceProvider.config({
        domains: {
          development: ["localhost"],
          production: ["kidsapp.dufferin.sd73.bc.ca"]
        },
        vars: {
          development: {
            apiUrl: "//localhost:5000/api"
          },
          production: {
            apiUrl: "//kidsapp.dufferin.sd73.bc.ca:3000/api"
          }
        }
      });

      envServiceProvider.check();
    }])
  .run(function ($rootScope, $location, authService) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
      if (!authService.isUserAuthenticated()) {
        $location.path("/login");
      }

    });
  });
