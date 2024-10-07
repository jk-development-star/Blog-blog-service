'use strict'
const model = require('../model/schema');
const Constant = require('../constant/Constants')

module.exports.handler = async event => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Credentials': true,
}
  try {
    console.info('App Start - Invoking Service...')

    const data = event.queryStringParameters !== null ?
      await model.find({ _id: { $eq: event.queryStringParameters.id } }) : await model.find({});

    if (data.length > 0) {
      console.info('Successfully Fetched Data.')
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(data)
      }
    } else {
      return {
        statusCode: 404,
        headers: headers,
        body: JSON.stringify({ message: 'Blog Not Found in the Database' })
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

