const mongoose = require('mongoose');
const config = require('../config/DatabaseConfig');

const blog_details = new mongoose.Schema(
    {
        blog_name: {
            type: String,
            required: true,
            minlength: [20, 'Must have atleast 20 characters'],
            maxlength: [200, 'Not More than 200 characters'],
            validate: [/[a-zA-Z]/, "Don't put Special Characters"],
            trim: true
        },
        category: {
            type: String,
            required: true,
            minlength: [5, 'Must have atleast 5 characters'],
            maxlength: [100, 'Not More than 100 characters'],
            validate: [/[a-zA-Z]/, "Don't put Special Characters"],
            trim: true
        },
        article: {
            type: String,
            required: true,
            minlength: [1000, 'Must have atleast 20 characters'],
            trim: true
        },
        author: {
            type: String,
            required: true,
            minlength: [5, 'Minimun length 5 characters'],
            maxlength: [100, 'Not More than 100 characters'],
            trim: true
        }
    },
    {
        timestamps: {
            createdAt: 'created_on',
            updatedAt: 'updated_on'
        }
    }
);

module.exports = mongoose.model('blog_details', blog_details, 'blog_details');

//Database Connection
const connString = (config.getDbConnectionStringForBlog());
mongoose.connect(connString, { useNewUrlParser: true, useUnifiedTopology: true });

console.log("Connected to MongoDB!!");
