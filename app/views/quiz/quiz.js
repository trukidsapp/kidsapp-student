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

      // TODO get from local storage
      /**
       * Retrieves the questions in the quiz
       */
      (function getEvalQuestions() {
        var quizId = $routeParams.quizId;

        $scope.quiz = window.localStorage['kidsapp_quiz_' + quizId];
        console.log($scope.quiz);

        $http
          .get(endpointConfig.apiEndpoint + '/evaluations/' + evalId)
          .then(success, fail);

        function success(response) {
          $scope.evaluation = response.data[0];
          console.log(response);
          console.log('retrieved successfully');
          console.log($scope.evaluation);

          // prevent responses to unavailable evaluations
          if ($scope.evaluation.status != "Published") {
            $location.path("/select");
            return;
          }

          checkEvaluationNotEmpty();

          $scope.response = {
            evaluationId: $scope.evaluation.id,
            questionResponses: [$scope.evaluation.questions.length]
          };

          $scope.response.questionResponses.forEach(function (element, i, responses) {
            responses[i] = undefined;
          });

          if (!$scope.evaluation.isAnonymous) {
            console.log('need name');
            $("#enterNameModal").modal("show");

          }
          else {
            $scope.currentQuestionNum++;
          }

        }

        function checkEvaluationNotEmpty() {
          if ($scope.evaluation.questions.length < 1) {
            alert("There is a problem with this evaluation. Please inform the evaluation facilitator.")
          }
        }

        function fail(response) {
          console.log(response.data);
          console.log('retrieved fail');
          $location.path('/select');
        }
      })();

      /**
       * Handler for Next button clicks.
       */
      $scope.nextBtnClick = function () {
        console.log("response recorded:");
        console.log($scope.response.questionResponses[$scope.currentQuestionNum]);

        // advance to next question
        $scope.currentQuestionNum++;

        // check if end of survey reached
        if ($scope.isEndOfSurveyReached()) {
          console.log("End of survey");

          // if completed
          $("#questionTextPanel").hide();
          $("#evalCompleteModal").modal("show");
        }
      };

      /**
       * Plays a question's audio file
       */
      $scope.playQuestionAudio = function () {
        var url = $scope.evaluation.questions[$scope.currentQuestionNum].audioPath;
        console.log('playing ' + url);
        new Audio(url).play();
      };

      /**
       * Checks if it is the end of the survey
       * @returns true if there are no more questions, false otherwise
       */
      $scope.isEndOfSurveyReached = function () {
        return $scope.currentQuestionNum + 1 > $scope.evaluation.questions.length;
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

      /**
       * Handler for name submission button
       */
      $scope.enterNameSubmitBtnClick = function () {
        $("#enterNameModal").modal("hide");
        $scope.currentQuestionNum++;
      }

    }]);