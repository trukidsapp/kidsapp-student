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

      function getQuestionAnswers() {
        var retrieved = 0;
        $scope.quiz.questions.forEach(function (question, i, questions) {
          $http
            .get(envService.read('apiUrl') + '/questions/' + question.id + '/answers', {
              headers: authService.getAPITokenHeader()
            })
            .then(function (response) {
              question.answers = response.data;
              retrieved++;
              if (retrieved == questions.length) {
                startQuiz();
              }
            }, onRequestFailure);
          question.questionResult = {};
        });
      }

      function onRequestFailure(response) {
        console.log(response.data);
        console.log('retrieved fail');
        $location.path('/game-list');
      }


      function startQuiz() {
        $scope.currentQuestionNum++;
        //start time for first question
        $scope.quiz.questions[$scope.currentQuestionNum].questionResult.startTime = new Date();
      }

      /**
       * Handler for Next button clicks.
       * Records end and start times, checks whether answers are correct.
       */
      $scope.nextBtnClick = function () {
        console.log("response recorded:");

        var questionResult = $scope.quiz.questions[$scope.currentQuestionNum].questionResult;
        questionResult.endTime = new Date();

        questionResult.isCorrect = isAnswerCorrect();

        console.log(questionResult);

        // advance to next question
        $scope.currentQuestionNum++;

        if ($scope.isEndOfQuizReached()) {
          onSurveyFinish()
        }
        else {
          $scope.quiz.questions[$scope.currentQuestionNum].questionResult.startTime = new Date();
        }

      };

      function onSurveyFinish() {
        console.log("End of survey");
        // if completed
        $("#questionTextPanel").hide();
        $("#quizCompleteModal").modal("show");
      }

      /**
       * Checks whether answer is in the set of correct answers for the question
       * @returns true if the answer is a correct one, false otherwise
       */
      function isAnswerCorrect() {
        var correctAnswers = $scope.quiz.questions[$scope.currentQuestionNum].answers.filter(function (answer) {
          return answer.isCorrect
        });

        var correctFound = correctAnswers.filter(function (answer) {
          return answer.answerText == $scope.quiz.questions[$scope.currentQuestionNum].questionResult.response;
        });

        return correctFound.length > 0;
      }

      /**
       * Checks if it is the end of the quiz
       * @returns true if there are no more questions, false otherwise
       */
      $scope.isEndOfQuizReached = function () {
        return $scope.currentQuestionNum + 1 > $scope.quiz.questions.length;
      };

      /**
       * Handler for submit button.
       * Collects student's results for each question and sends them to the server.
       */
      $scope.submitResultsBtnClick = function () {
        var student = authService.getTokenUser().username;
        var questionResultsSent = 0;

        $scope.quiz.questions.forEach(function (question) {
          $http
            .post(envService.read('apiUrl') + '/questions/' + question.id + "/students/"
              + student + "/results",
              question.questionResult,
              {
                headers: authService.getAPITokenHeader()
              })
            .then(function (response) {
              questionResultsSent++;
              if (questionResultsSent == $scope.quiz.questions.length) {
                onResultsSentSuccess();
                console.log(response)
              }
            }, onResultsSentFailure);
        });

        function onResultsSentSuccess(response) {
          console.log(response);
          console.log(' all results sent successfully');
          $("#quizCompleteModal").modal("hide");
          $("#sentSuccessMessage").show();
        }

        function onResultsSentFailure(response) {
          console.error(response.data);
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


    }]);