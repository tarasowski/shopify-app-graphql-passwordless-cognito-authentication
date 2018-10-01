module.exports.handler = async(event, context, callback) => {
    if (!event.request.session || event.request.session.length === 0) {
         event.response.publicChallengeParameters = {
                distraction: "Yes",
            };
            event.response.privateChallengeParameters = {
                distraction: "Yes",
            };
        event.response.challengeMetadata = 'JWT';
    }

    console.log("Response", event.response);

    return event
}