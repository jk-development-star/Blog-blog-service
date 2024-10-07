'use strict'
const AWS = require('aws-sdk');
const model = require('../model/schema');
const Constant = require('../constant/Constants')
const { ADD_BLOG } = require('../constant/MailContent')

module.exports.handler = async event => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Credentials': true,
    }
    try {
        console.info('App Start - Invoking Service...')
        // console.log('event Body-->', event.body)
        const payload = JSON.parse(event.body)
        // console.log('Parsed Body-->', payload)
        const blogObj = new model();
        blogObj.blog_name = payload.blog_name;
        blogObj.category = payload.category;
        blogObj.article = payload.article;
        blogObj.author = payload.author;
        const ifExists = await model.find({ blog_name: { $eq: payload.blog_name } });
        if (ifExists.length > 0) {
            return {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify({ message: `blog name - '${payload.blog_name}' already exists! Please give another name to your blog.` })
            }
        } else {
            const createdModel = await model.create(blogObj);
            if (createdModel) {
                const sns = new AWS.SNS();
                const params = {
                    Subject: ADD_BLOG.subject,
                    Message: ADD_BLOG.body.replace('{user_name}', payload.author).replace('{blog_name}', payload.blog_name).replace('{category}', payload.category),
                    TopicArn: process.env.SNS_TOPIC_ARN
                };
                const publishPromise = await sns.publish(params).promise();
                return {
                    statusCode: 200,
                    headers: headers,
                    body: JSON.stringify({ message: 'Blog posted successfully!' })
                }
            } else {
                return {
                    statusCode: 400,
                    headers: headers,
                    body: JSON.stringify({ message: createdModel })
                }
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