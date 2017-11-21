const functions = require('firebase-functions')
const https = require('https')
const { DialogflowApp } = require('actions-on-google')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.randomCatFacts = functions.https.onRequest((request, response) => {
    const app = new DialogflowApp({
        request: request,
        response: response
    })

    let action = app.getIntent();

    console.log(action)

    const Actions = {
        WELCOME: 'input.welcome',
        RANDOM_CAT_FACT: 'random.fact',
        BASIC_CARD_INTENT: 'basic.card.intent'
    }

    switch (action) {
        case Actions.WELCOME:
            welcomeIntent(app)
            break;
        case Actions.RANDOM_CAT_FACT:
        randomCatFactIntent(app)
            break;
        case Actions.BASIC_CARD_INTENT:
            basicCardIntent(app)
            break;
    
        default:
            break;
    }

    function welcomeIntent(app) {
        app.ask('Hello! I`m your Funny Random Cat Fact Assistant. Ask me for a random cat fact.')
    }

    function randomCatFactIntent(app) {
        let data = ''
        https.get({
            hostname: 'catfact.ninja',
            path: '/fact'
        }, (res) => {
            res.on('data', (chunk) => {
                data += chunk
            })
            res.on('error', (err) => {
                console.log(err)
            })
            res.on('end', () => {
                console.log(data)
                let result = JSON.parse(data)
                app.ask(`Here is a random cat fact: ${result.fact}`)
            })
        })
    }

    function basicCardIntent(app) {
        app.askWithCarousel('Which of these looks good?',
        app.buildCarousel()
         .addItems([
           app.buildOptionItem('SELECTION_ONE',
             ['synonym of KEY_ONE 1', 'synonym of KEY_ONE 2'])
             .setTitle('Number one')
             .setDescription('Description one'),
           app.buildOptionItem('SELECTION_TWO',
             ['synonym of KEY_TWO 1', 'synonym of KEY_TWO 2'])
             .setTitle('Number two')
             .setDescription('Description 2'),
         ]))
    }
});
