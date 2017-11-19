const functions = require('firebase-functions')
const request = require('request')
const { DialogflowApp } = require('actions-on-google')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {

  let app = new DialogflowApp({
    request: request,
    response: response
  })

  let actions = app.getIntent();

  const Actions = {
    WELCOME: 'input.welcome',
    RANDOM_FACT: 'random.fact'
  }

  function welcomeIntent() {
    app.ask('Hello, I`m your cat fact Agent. I can tell you random facts about cats. How can I help you?')
  }

  function rendomCatFact() {
    request.get('https://catfact.ninja/fact', (error, response, body) => {
      let result = JSON.parse(body);
      app.tell(`Here is a random fact: ${result.fact}`);
    })
  }

});
