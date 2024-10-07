const mongoose = require('mongoose');
const config = require('../config/DatabaseConfig');

const user = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: false,
            minlength: [5, 'Must have atleast 5 characters'],
            maxlength: [25, 'Not More than 25 characters'],
            validate: [/[a-zA-Z]/, "Don't put Special Characters"],
            trim: true
        },
        user_name: {
            type: String,
            required: true,
            minlength: [5, 'Must have atleast 5 characters'],
            maxlength: [25, 'Not More than 25 characters'],
            validate: [/[a-zA-Z]/, "Don't put Special Characters"],
            trim: true
        },
        email: {
            type: String,
            required: true,
            minlength: [8, 'Minimun length 8 characters'],
            maxlength: [100, 'Not More than 100 characters'],
            validate: [/[a-zA-Z]/, "Don't put Special Characters"],
            trim: true
        },
        user_type: {
            type: String,
            required: true,
            minlength: [2, 'Must have atleast 5 characters'],
            maxlength: [25, 'Not More than 25 characters'],
            validate: [/[a-zA-Z]/, "Don't put Special Characters"],
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: [8, 'Minimun length 8 characters'],
            maxlength: [15, 'Not More than 15 characters'],
            validate: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/, "At least 1 uppercase & 1 lowercase letter, 1 number & 1 special character"],
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

module.exports = mongoose.model('auths', user, 'auths');

//Database Connection
const connString = (config.getDbConnectionStringForUser());
mongoose.connect(connString, { useNewUrlParser: true, useUnifiedTopology: true });

console.log("Connected to MongoDB!!");
