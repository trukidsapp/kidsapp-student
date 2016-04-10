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
    'endpointConfig',
    function ($scope, $http, $location, endpointConfig) {

      // TODO get class id for student

      // TODO get quizzes for the class here
      /**
       * Retrieve all published quizzes
       */
      $http
        .get(endpointConfig.apiEndpoint + '/quizzes') // TODO change request endpoint
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
      $scope.startEvaluation = function (id) {
        $location.path("/questions/" + id); // TODO change request encpoint. get quiz
      }

    }]);