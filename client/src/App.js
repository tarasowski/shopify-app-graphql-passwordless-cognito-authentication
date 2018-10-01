import React, { Component } from 'react';
import AWSAppsyncClient, { AUTH_TYPE } from "aws-appsync";
import { Auth } from 'aws-amplify'
import { ApolloProvider } from 'react-apollo'
import Login from './components/Login';
import Callback from './components/Callback'
import Authenticate from './components/Auth'
import { AppProvider } from '@shopify/polaris';
import Amplify from 'aws-amplify'
import awsConfig from './aws-config'
import config from './config'

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

Amplify.configure(awsConfig)

const GRAPHQL_ENDPOINT = config.graphqlEndpoint
const GRAPHQL_REGION = config.graphqlRegion
const API_KEY = config.apiKey
const SHOP_ORIGIN = window.location.ancestorOrigins[0]

const client = new AWSAppsyncClient({
  url: GRAPHQL_ENDPOINT,
  region: GRAPHQL_REGION,
  auth: {
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    jwtToken: async () => {
      let session = await Auth.currentSession()
      return session.accessToken.jwtToken
    }
  }
})


class App extends Component {
  render() {
    return (
      <AppProvider
        apiKey={API_KEY}
        shopOrigin={SHOP_ORIGIN}
      >
        <Router>
          <Switch>
            <ApolloProvider client={client}>
              <Route path="/" exact={true} component={Login} />
              <Route path="/callback" component={Callback} />
              <Route path="/auth" component={Authenticate} />
            </ApolloProvider>
          </Switch>
        </Router>
      </AppProvider>
    )
  }
}

export default App;