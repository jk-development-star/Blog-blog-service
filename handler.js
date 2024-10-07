'use strict'
const AWS = require('aws-sdk');
const model = require('./src/model/schema');
const { ADD_BLOG } = require('./src/constant/MailContent')

module.exports.addBlog = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Credentials': true,
    }
    try {
        console.info('App Start - Invoking Service...')
        const payload = JSON.parse(event.body)
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
                    body: JSON.stringify({ message: createdModel })
                }
            }
        }
    } catch (err) {
        console.error('EXCEPTION :: ' + err.stack)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: err })
        }
    }
}

module.exports.getAllBlogs = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
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
                body: JSON.stringify({ message: 'Blog Not Found in the Database' })
            }
        }
    } catch (err) {
        console.error('EXCEPTION :: ' + err.stack)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: err })
        }
    }
}

module.exports.deleteBlog = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
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
                body: JSON.stringify({ message: `${blog_name} - Not Found in the Database` })
            }
        }
    } catch (err) {
        console.error('EXCEPTION :: ' + err.stack)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: err })
        }
    }
}