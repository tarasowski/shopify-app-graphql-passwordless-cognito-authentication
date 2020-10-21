module.exports.badRequest = (message) => {
    return {
        body: JSON.stringify({
            error: 400,
            message,
        }),
        headers: {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
        },
        statusCode: 400,
    };
}

module.exports.internalError = () => {
    return {
        body: JSON.stringify({
            error: 500,
            message: "Internal Error",
        }),
        headers: {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
        },
        statusCode: 500,
    };
}

module.exports.noContent = () => {
    return {
        body: "",
        headers: {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
        },
        statusCode: 204,
    };
}

module.exports.ok = (body) => {
    
    return {
        body: JSON.stringify(body),
        headers: {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
        },
        statusCode: 200,
    };
}