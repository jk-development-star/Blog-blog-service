'use strict'
const model = require('../model/schema');
const Constant = require('../constant/Constants')

module.exports.handler = async event => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'DELETE,OPTIONS',
        'Access-Control-Allow-Credentials': true,
    }
    try {
        console.info('App Start - Invoking Service...')
        let blog_name
        if ('blog_name' in event.queryStringParameters) {
            blog_name = event.queryStringParameters.blog_name
        } else {
            blog_name = await model.find({ _id: { $eq: event.queryStringParameters.id } });
            blog_name = blog_name[0].blog_name
        }
        const deletedPO = await model.findOneAndDelete({ _id: { $eq: event.queryStringParameters.id } });
        if (deletedPO) {
            return {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify({ message: `${blog_name} - deleted successfully!` })
            }
        } else {
            return {
                statusCode: 404,
                headers: headers,
                body: JSON.stringify({ message: `${blog_name} - Not Found in the Database` })
            }
        }
    } catch (err) {
        console.error('EXCEPTION :: ' + err.stack)
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({ message: err })
        }
    }
}