'use strict'
const model = require('../model/schema');
const Constant = require('../constant/Constants')

module.exports.handler = async event => {
    try {
        console.info('App Start - Invoking Service...')
        const data = event.queryStringParameters !== null ?
            await model.find({ category: { $eq: event.queryStringParameters.category } }) : await model.find({});

        if (data.length > 0) {
            console.info('Successfully Fetched Data.')
            return {
                statusCode: 200,
                headers: Constant.HEADERS,
                body: JSON.stringify(data)
            }
        } else {
            return {
                statusCode: 404,
                headers: Constant.HEADERS,
                body: JSON.stringify({ message: 'Blog Not Found in the Database' })
            }
        }
    } catch (err) {
        console.error('EXCEPTION :: ' + err.stack)
        return {
            statusCode: 400,
            headers: Constant.HEADERS,
            body: JSON.stringify({ message: err })
        }
    }
}