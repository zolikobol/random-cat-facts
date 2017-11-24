const functions = require('firebase-functions')
const https = require('https');
const { DialogflowApp } = require('actions-on-google')

exports.catFacts = functions.https.onRequest((request, response) => {

  console.log('beginning')
  let app = new DialogflowApp({
    request: request,
    response: response
  })

  console.log('after dialogflow')

  let action = app.getIntent()

  console.log('intent ' + action)
  const Actions = {
    WELCOME: 'input.welcome',
    RANDOM_FACT: 'random.fact'
  }

  if(action == Actions.WELCOME) {
    welcomeIntent(app)
  } else if(action == Actions.RANDOM_FACT) {
    rendomCatFact(app)
  }

  function welcomeIntent(agent) {
    console.log('welcome')
    agent.ask('Hello, I`m your cat fact Agent. I can tell you random facts about cats. How can I help you?')
  }

  function rendomCatFact(agent) {
    console.log('random fact')
    let data = '';
    https.get({
      hostname: 'catfact.ninja',
      path: '/fact'
    }, (res) => {
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        let result = JSON.parse(data)
        agent.tell(result.fact)
      })
      res.on('error', (err) => {
        console.log(err)
      })
    })
  }
});
