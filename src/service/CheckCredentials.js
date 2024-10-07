'use strict'
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Auth = require('../model/credentialSchema');
const Constant = require('../constant/Constants')

module.exports.handler = async event => {
    try {
        const payload = JSON.parse(event.body)
        console.log('payload', payload);
        if (!('email' in payload) || !('password' in payload) || payload.password === undefined || payload.password === null ||
            payload.email === undefined || payload.email === null) {
            return {
                statusCode: 400,
                headers: Constant.HEADERS,
                body: JSON.stringify({ message: 'Email and password are required' })
            }
        }
        const user = await Auth.findOne({ email: payload.email });
        console.log('User -->', user)
        if (!user) {
            return {
                statusCode: 401,
                headers: Constant.HEADERS,
                body: JSON.stringify({ message: 'Incorrect email address!' })
            }
        }
        const isPasswordValid = await bcrypt.compare(payload.password, user.password);
        console.log('isPasswordValid -->', isPasswordValid)
        if (!isPasswordValid) {
            return {
                statusCode: 400,
                headers: Constant.HEADERS,
                body: JSON.stringify({ message: 'Invalid credentials!' })
            }
        }
        const response = {
            user_id: user.user_id,
            user_type: user.user_type,
            user_name: user.user_name,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour expiration
        };
        const token = jwt.sign(response, 'secret');
        // return formatResponse(200, {
        //     message: 'Authentication successful!',
        //     result: payload,
        //     token: token,
        //     headers: {
        //         'Access-Control-Allow-Origin': 'http://fse-bucket.s3-website-us-east-1.amazonaws.com/',
        //         'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Access-Control-Max-Age',
        //         'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        //         'Access-Control-Allow-Credentials': true
        //     },
        // });
        return {
            statusCode: 200,
            headers: Constant.HEADERS,
            body: JSON.stringify({ message: `Authenticated successfully!`, result: response, token: token })
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