const POOL_ID = process.env.USER_POOL_ID

module.exports.createUser = async (identityProvider, shopDomain) => {
       const email = shopDomain.replace('.myshopify.com', '@myshopify.com')
       const userParams = {
           MessageAction: 'SUPPRESS',
           UserAttributes: [
               { Name: 'email', Value: email },
               { Name: 'name', Value: shopDomain },
               { Name: 'website', Value: shopDomain }
               ],
            UserPoolId: POOL_ID,
            Username: email
       }
       console.log('Admin create user', userParams)
       
       try {
        const result = await identityProvider.adminCreateUser(userParams).promise()
        
        if (result.User && result.User.Username) {
            return result.User.Username
        }
            throw Error('No username!!')
       } catch (err) {
           if (err.code === "UsernameExistsException") {
               const user = await identityProvider.adminGetUser({
                   UserPoolId: POOL_ID,
                   Username: email
               }).promise()
               return user.Username
           }
           
           throw err
       }
       
       
}