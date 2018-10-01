const jwt = require('jsonwebtoken')

module.exports.createJWT = (sub, jti, now, expireIn) => {
    const iat = Math.floor(now.getTime() / 1000)
    const exp = iat + expireIn
    const payload = {
        exp,
        iat,
        iss: process.env.JWT_ISS || 'tarasowski',
        jti,
        sub,
    };
    console.log('payload custom token', payload)
    return jwt.sign(payload, process.env.JWT_SECRET || '')
}