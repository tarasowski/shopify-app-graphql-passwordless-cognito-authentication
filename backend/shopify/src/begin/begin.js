const {ok, badRequest, internalError } = require('./lib/http')
const { getRandomString } = require('./lib/string')
const { createJWT } = require('./lib/jwt')
const querystring = require('querystring')

exports.handler = async (event) => {
  console.log(JSON.stringify(event))
    try {
        const shopifyApiKey = process.env.SHOPIFY_API_KEY
        const shopifyScope = process.env.SHOPIFY_SCOPE
        
        if (!shopifyApiKey) throw new Error('SHOPIFY_API_KEY env variable not set!')
        if (!shopifyScope) throw new Error('SHOPIFY_SCOPE env variable not set!')
        if (!event.queryStringParameters) badRequest('No query string parameters found!')
        
        const {'callback-url': callbackUrl, shop } = event.queryStringParameters
        console.log('this is my shop value:', shop)
        if (!callbackUrl) {
            return badRequest('Callback url parameter missing!')   
        }
        if (!shop) {
            return badRequest('Shop parameter missing!')   
        }
        if (!shop.match(/[a-z0-9][a-z0-9\-]*\.myshopify\.com/i)) {
            return badRequest('shop parameter must end with .myshopify.com and may only contain a-z, 0-9, - and .')
            
        }
        
        const now = new Date()
        const nonce = getRandomString()
        
        // Build the AuthUrl
        const eNonce = querystring.escape(nonce)
        const eClientId = querystring.escape(shopifyApiKey)
        const eScope = querystring.escape(shopifyScope.replace(':', ','))
        const eCallbackUrl = querystring.escape(callbackUrl)
        
        const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${eClientId}&scope=${eScope}&redirect_uri=${eCallbackUrl}&state=${eNonce}`
        
        // Return the AuthUrl
        return ok({
            authUrl,
            token: createJWT(shop, nonce, now, 600)
        })
        
    } catch (err) {
        console.log('Error', err)
        return internalError()
        
    }
    
}
