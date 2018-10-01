const jwt = require('jsonwebtoken')
const trace = label => value => console.log(`${label}: ${JSON.stringify(value, null, 4)}`)

module.exports.handler = async(event, context, callback) => {
    trace('username: ?')(event.userName)
    const jwtSecret = process.env.JWT_SECRET
    const challengeAnswer = event.request.challengeAnswer;
    if (!jwtSecret || !challengeAnswer) {
        console.log("No JWT_SECRET or challengeAnswer");
        event.response.answerCorrect = false;
    } else {
        try {
            jwt.verify(challengeAnswer, jwtSecret, {
                    clockTolerance: 600,
                    issuer: process.env.JWT_ISS || 'tarasowski',
                    //subject: event.userName
                });
            event.response.answerCorrect = true;
        } catch (err) {
            console.log("Error verifying nonce", err);
            event.response.answerCorrect = false;
        }
    }
    console.log('verfiy custom challenge', event)
    return event
}