angular.module('app.quiz', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/quiz/:quizId', {
      templateUrl: 'views/quiz/quiz.html',
      controller: 'QuizController'
    });
  }])

  .controller('QuizController', [
    '$routeParams',
    '$scope',
    '$http',
    '$location',
    'authService',
    'envService',
    function ($routeParams, $scope, $http, $location, authService, envService) {

      $scope.currentQuestionNum = -1;

      var loggedInUser = authService.getTokenUser();
      var quizId = $routeParams.quizId;

      (function getQuiz() {


        $http
          .get(envService.read('apiUrl') + '/quizzes/' + quizId, {
            headers: authService.getAPITokenHeader()
          })
          .then(success, fail);

        function success(response) {
          $scope.quiz = response.data;
          console.log($scope.quiz);
          getQuestions();
        }

        function fail(response) {
          console.log(response.data);
          console.log('retrieved fail');
          $location.path('/game-list');
        }
      })();

      function getQuestions() {
        $http
          .get(envService.read('apiUrl') + '/quizzes/' + quizId + '/questions', {
            headers: authService.getAPITokenHeader()
          })
          .then(success, fail);

        function success(response) {
          $scope.quiz.questions = response.data;
          console.log($scope.quiz);
        }

        function fail(response) {
          console.log(response.data);
          console.log('retrieved fail');
          $location.path('/game-list');
        }
      }


      startQuiz();
      function startQuiz() {
        $scope.currentQuestionNum++;
      }

      /**
       * Handler for Next button clicks.
       */
      $scope.nextBtnClick = function () {
        console.log("response recorded:");
        //console.log($scope.response.questionResponses[$scope.currentQuestionNum]);
        // TODO store response

        // advance to next question
        $scope.currentQuestionNum++;

        if ($scope.isEndOfQuizReached()) {
          console.log("End of survey");
          // if completed
          $("#questionTextPanel").hide();
          $("#evalCompleteModal").modal("show");
        }

      };

      /**
       * Checks if it is the end of the survey
       * @returns true if there are no more questions, false otherwise
       */
      $scope.isEndOfQuizReached = function () {
        console.log($scope.currentQuestionNum);
        return $scope.currentQuestionNum + 1 > $scope.quiz.questions.length;
      };

      /**
       * Handler for finish button. Finalizes responses and sends them to the server.
       */
      $scope.finishEvaluationBtnClick = function () {

        console.log($scope.response);
        $http.post(endpointConfig.apiEndpoint + '/responses', $scope.response)
          .then(success, fail);

        function success(response) {
          console.log(response);
          console.log('sent successfully');
          $("#evalCompleteModal").modal("hide");
          $("#responseSentMessage").show();
        }

        function fail(response) {
          console.log(response.data);
          console.log('sending failed');
          alert("Sorry, an error occured. Please inform the evaluation facilitator.");
        }

      };

      function setUpQuestionResponses() {
// TODO
        $scope.response = {
          evaluationId: $scope.evaluation.id,
          questionResponses: [$scope.evaluation.questions.length]
        };

        $scope.response.questionResponses.forEach(function (element, i, responses) {
          responses[i] = undefined;
        });
      }


    }]);