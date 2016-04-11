# kidsapp-student
Proof of concept quiz game completion web application. 

This mobile-first web application demonstrates the completion of a game of quiz modules and questions built using the teacher web application.

Students log in to the application with the username and password created by their teacher, and can complete the modules set by their teacher as part of their game.

The purpose of this web application is simply to allow a student to complete quizzes set up by their teacher and have their results recorded. In the future web application, these modules/quizzes can serve as checkpoints. 

## Class Game List

Once logged in, the student is shown a list of the quiz modules that the teacher has set up for their class. Selecting "Start" will let the student begin the quiz.

## Completing a Quiz
After selecting a quiz to begin, the first question of the quiz is shown. Students must select an answer to each question before they can continue to the next one by pressing the "Next" buttom.
Their selected answer will be circled, and they are free to change their mind any time before they submit.

The application records the amount of time spent answering each question, and will determine whether their answer was correct when the student presses the next button.

Students may leave the quiz, but their progress will not be saved.

## Finishing a Quiz/Submitting Results
After the last question has been answered, the application will show a dialog with a "Submit Results" button. Selecting this button will send the results, which will be available in the teacher web app.

## Extending/Improving this application
This component was developed as a lightweight proof of concept. It demonstrates the functionality provided by the server-side REST API and teacher web application, and is intended to be replaced by a more fully-functional mobile game that uses the quiz modules as checkpoints for students to progress through the game.
Since this is a standalone web app dependent only on the API, which can be deployed separately from the other components, it can easily be replaced or repurposed as the project evolves.

## Install Notes
The application requires a connection to the KidsApp API to authenticate students, retrieve class quizzes, questions and answers, and send results.

To support different production or development environments, `angular-environment` is used to determine the correct endpoint for API requests. When deploying the application on a new server or making modifications to the API, the configuration for angular-environment must be updated in `app.js` for the particular environment the application will be deployed in. Visit https://github.com/juanpablob/angular-environment for more information.
All of the application's dependencies are managed with NPM. 

To install the application. ensure that the API is running and accessible, and the API endpoints in `app.js` have been configured correctly.

Next, from the project root, run:

`npm install`

During the project's early development, we served the app using Nginx, but a node web server is also included. To use the built-in node http server, update the configuration in the `package.json` file if required then run:

`npm start` 

Once the dependencies have been installed, the application can access the API, and the web server is running, the application is set up. Classes may then be created using the teacher web app.