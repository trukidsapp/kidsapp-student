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
          .then(success, onRequestFailure);

        function success(response) {
          $scope.quiz = response.data;
          console.log($scope.quiz);
          getQuestions();
        }

      })();

      function getQuestionAnswers() {
        $scope.quiz.questions.forEach(function (question, i, questions) {
          $http
            .get(envService.read('apiUrl') + '/questions/' + question.id + '/answers', {
              headers: authService.getAPITokenHeader()
            })
            .then(function (response) {
              question.answers = response.data;
              startQuiz();
            }, onRequestFailure);

          question.questionResult = {};
        })
      }

      function getQuestions() {
        $http
          .get(envService.read('apiUrl') + '/quizzes/' + quizId + '/questions', {
            headers: authService.getAPITokenHeader()
          })
          .then(success, onRequestFailure);

        function success(response) {
          $scope.quiz.questions = response.data;
          console.log($scope.quiz);
          getQuestionAnswers();
        }


      }

      function onRequestFailure(response) {
        console.log(response.data);
        console.log('retrieved fail');
        $location.path('/game-list');
      }


      function startQuiz() {
        $scope.currentQuestionNum++;
        $scope.quiz.questions[$scope.currentQuestionNum].questionResult.startTime = new Date();
      }

      /**
       * Handler for Next button clicks.
       */
      $scope.nextBtnClick = function () {
        console.log("response recorded:");

        var questionResult = $scope.quiz.questions[$scope.currentQuestionNum].questionResult;
        questionResult.endTime = new Date();
        var correctAnswers = $scope.quiz.questions[$scope.currentQuestionNum].answers.filter(function (answer) {
          return answer.isCorrect
        });

        var correctFound = correctAnswers.filter(function (answer) {
          return answer.answerText == questionResult.response;
        });

        questionResult.isCorrect = correctFound.length > 0;

        console.log($scope.quiz.questions[$scope.currentQuestionNum].questionResult);

        // advance to next question
        $scope.currentQuestionNum++;

        if ($scope.isEndOfQuizReached()) {
          console.log("End of survey");
          // if completed
          $("#questionTextPanel").hide();
          $("#quizCompleteModal").modal("show");
        }
        else {
          $scope.quiz.questions[$scope.currentQuestionNum].questionResult.startTime = new Date();

        }

      };

      /**
       * Checks if it is the end of the survey
       * @returns true if there are no more questions, false otherwise
       */
      $scope.isEndOfQuizReached = function () {
        return $scope.currentQuestionNum + 1 > $scope.quiz.questions.length;
      };

      /**
       * Handler for submit button. Collects answers a sends them to the server.
       */
      $scope.submitResultsBtnClick = function () {

        console.log($scope.response);
        // $http.post(endpointConfig.apiEndpoint + '/responses', $scope.response)
        //   .then(success, fail);
        // TODO send answers
        success();


        function success(response) {
          console.log(response);
          console.log('sent successfully');
          $("#quizCompleteModal").modal("hide");
          $("#sentSuccessMessage").show();
        }

        function fail(response) {
          console.log(response.data);
          console.log('sending failed');
          alert("Sorry, an error occured. Please inform the evaluation facilitator.");
        }

      };

      /**
       * Handler for back button clicks in the quiz completed alert. Returns to the quiz list
       */
      $scope.backQuizListBtnClick = function () {
        $location.path("/game-list")

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