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
    function ($scope, $http, $location, authService) {

      console.log('test');


      var user = authService.getTokenUser();
      console.log(user.classId);
      console.log(user.username);

      // TODO get class id for student

      // TODO get quizzes for the class here
      /**
       * Retrieve all published quizzes
       */
      // $http
      //   .get(endpointConfig.apiEndpoint + '/quizzes') // TODO change request endpoint
      //   .then(quizzesRetrieveSuccess, quizzesRetrieveFail);

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
        $location.path("/questions/" + id); // TODO change request endpoint get quiz
      };

      $scope.logoutBtnClick = function () {
        authService.logout();
        $location.path("/login");
      };

    }]);