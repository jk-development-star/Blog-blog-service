const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const handler = require('./handler')
const corsOptions = {
     "origin": "http://fse-bucket.s3-website-us-east-1.amazonaws.com"
};
// const DATABASE_URL = process.env.DATABASE_URL;
const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(handler)