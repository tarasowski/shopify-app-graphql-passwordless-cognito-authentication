# Shopify App Basic Auth Flow
Authentication Flow for a Shopify App with GraphQL and Passwordless Cognito authentication.

The app consists of 3 Cloudformation templates that you need to run in the specific order:

1. Create the `cognito` stack
2. Create the `appsync` stack
3. Create the `shopify` stack
4. Open `client` and change `config.js` and `aws-config.js`
5. Run `npm start`
