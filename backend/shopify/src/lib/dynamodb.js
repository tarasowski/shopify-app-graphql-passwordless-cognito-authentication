module.exports.writeShop = (dynamodb, shop) => {
    const expressionAttributeValues = {}
    const expressionAttributeNames = {}
    
    const updateFields = []
    let p = 0
    
    for (const field in shop) {
        if (field !== 'id') {
            const key = `P${p++}`
            let val = shop[field]
            expressionAttributeValues[`:${key}`] = val
            updateFields.push(`#${key} = :${key}`);
            expressionAttributeNames["#" + key] = field
        }
    }
    
    const updateExpression = "SET " + updateFields.join(", ")
    
    const updateParams = {
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        Key: {
            id: shop.id,
        },
        TableName: process.env.SHOPS_TABLE || "",
        UpdateExpression: updateExpression,
    };
    console.log("Update Item", updateParams)
    
    
    return dynamodb.update(updateParams).promise()
}