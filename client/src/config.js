const dev = {
    graphqlEndpoint: 'https://el7sduencbf7lpifnne3u5cwfy.appsync-api.eu-west-1.amazonaws.com/graphql',
    graphqlRegion: 'eu-west-1',
    apiKey: 'XXX',
    callbackUrl: 'https://f629acac.ngrok.io',
    apiGInstallUrl: 'https://ukyfzep3h3.execute-api.eu-west-1.amazonaws.com/Stage/auth?shop=',
    apiGCallbackUrl: 'https://ukyfzep3h3.execute-api.eu-west-1.amazonaws.com/Stage/callback'
}
const prod = {}

const config = process.env.REACT_APP_STAGE === 'production' ? prod : dev

export default { ...config }