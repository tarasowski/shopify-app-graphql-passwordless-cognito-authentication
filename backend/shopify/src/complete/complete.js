const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const identityProvider = new AWS.CognitoIdentityServiceProvider()
const {ok, badRequest, internalError } = require('./lib/http')
const { createUser } = require('./lib/create-user')
const { writeShop } = require('./lib/dynamodb')
const { createJWT } = require('./lib/jwt')
const { getRandomString } = require('./lib/string')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const fetch = require('node-fetch')


exports.handler = async (event) => {
    console.log(JSON.stringify(event))
    try {
        if (!event.body) {
            return badRequest('body is missing!')
        }
        const body = JSON.parse(event.body)
        const { params, token } = body
        
        
        if (!token) {
            return badRequest('token is missing!')
        }
        
        if (!params) {
            return badRequest('params are missing')
        }
        
        const {code, shop: shopDomain } = params
        
        if (!validateNonce(token, params)
            || !validateShopDomain(shopDomain)
            || !validateHMAC(params)) {
            return badRequest('Invalid token')
        }
        console.log('validation was done successfully')
        const resp = await exchangeToken(shopDomain, code, fetch)
        const accessToken = resp.access_token
        if (accessToken === undefined) {
            console.log("resp[\"access_token\"] is undefined")
            throw new Error("resp[\"access_token\"] is undefined")
        }
        
        const shop = await getShop(shopDomain, accessToken, fetch)
        const userId = await createUser(identityProvider, shopDomain)
        const date = new Date()
        
        const data = {
            accessToken,
            country: shop.country,
            domain: shop.domain,
            email: shop.email,
            id: shop.myshopify_domain,
            installedAt: date.toISOString(),
            name: shop.name,
            platform: 'Shopify',
            platformPlan: shop.plan_name,
            timezone: shop.iana_timezone,
            userId
        }
        console.log('this is my userId', userId)
        const shopsTable = process.env.SHOPS_TABLE
        if (shopsTable && shopsTable !== '') {
            await writeShop(dynamodb, data)
        }
        
        const now = new Date()
        const nonce = getRandomString()
        
        return ok({
            chargeAuthorizationUrl: null,
            token: createJWT(userId, nonce, now, 600),
        });
        
    } catch (err) {
        console.log("Error", err)
        return internalError()
    }
 
    
    
}

const validateNonce = (token, params) => {
    const JWT_SECRET = process.env.JWT_SECRET
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set')
    }
    
    try {
        jwt.verify(token, JWT_SECRET, {
            clockTolerance: 600,
            issuer: process.env.JWT_ISS || "tarasowski",
            jwtid: params.state,
            subject: params.shop
        })
        return true
        
    } catch (err) {
        console.log('Error verifying nonce:', err)
        return false
    }
}

const validateShopDomain = (shopDomain) => {
    if (shopDomain.match(/^[a-z][a-z0-9\-]*\.myshopify\.com$/i) === null) {
        console.log("Shop validation failed", shopDomain);
        return false;
    }

    return true;
}

const validateHMAC = (params) => {
    const shopifyApiSecret = process.env.SHOPIFY_API_SECRET;
    if (!shopifyApiSecret) {
        throw new Error("SHOPIFY_API_SECRET environment variable not set");
    }

    const p = [];
    for (const k in params) {
        if (k !== "hmac") {
            k.replace("%", "%25");
            p.push(encodeURIComponent(k) + "=" + encodeURIComponent(params[k].toString()));
        }
    }
    const message = p.sort().join("&");

    const digest = crypto.createHmac("SHA256", shopifyApiSecret).update(message).digest("hex");

    return (digest === params.hmac);
}

const exchangeToken = async (shop, code, fetchFn) => {
    const body = JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
    });

    const url = `https://${shop}/admin/oauth/access_token`;

    const res = await fetchFn(url, {
        body,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        method: "POST",
    });

    const json = await res.json();
    console.log("Shopify Token Exchange Response", json);
    if ("error_description" in json || "error" in json || "errors" in json) {
        throw new Error(json.error_description || json.error || json.errors);
    }
    return json;
}

const getShop = async(shopDomain, accessToken, fetchFn) => {

    const resp = await fetchFn(`https://${shopDomain}/admin/shop.json`, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": accessToken,
        },
        method: "GET",
    });
    console.log("Response", resp)
    const json = await resp.json()
    console.log("JSON", json)
    return json.shop
}
