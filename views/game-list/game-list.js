angular.module('app.game-list', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/game-list', {
      templateUrl: 'views/game-list/game-list.html',
      controller: 'GameListController'
    });
  }])

  .controller('GameListController', [
    '$scope',
    '$http',
    '$location',
    'authService',
    'envService',
    function ($scope, $http, $location, authService, envService) {

      var loggedInUser = authService.getTokenUser();

      /**
       * Get student so name can be shown
       */
      $http.get(envService.read('apiUrl') + '/classes/' + loggedInUser.classId + '/students/' + loggedInUser.username, {
          headers: authService.getAPITokenHeader()
        })
        .then(function (response) {
          $scope.student = response.data;
        }, function (response) {
          console.error(response)
        });

      /**
       * Retrieve all published quizzes
       */
      $http
        .get(envService.read('apiUrl') + '/classes/' + loggedInUser.classId + '/quizzes', {
          headers: authService.getAPITokenHeader()
        })
        .then(quizzesRetrieveSuccess, quizzesRetrieveFail);

      function quizzesRetrieveSuccess(response) {
        $scope.quizzes = response.data;
      }

      function quizzesRetrieveFail(response) {
        console.log(response);
        if (response.status == 404) {
          console.log('no quizzes found');
        }
        else {
          console.log('failed')
        }
      }

      /**
       * Handler for start quiz button.
       * @param id id of quiz to begin
       */
      $scope.startQuiz = function (id) {
        $location.path("/quiz/" + id);
      };

    }]);