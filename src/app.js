import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from 'dotenv'
dotenv.config()
// import connectDB from "./config/db.config.js"
import { errorHandler } from './middleware/errorHandler.js';
import createHttpError from 'http-errors';
import blogRoutes from "./routes/blogRoutes.js"
// const DATABASE_URL = process.env.DATABASE_URL
import handler from "./handler.js"

const corsOptions = {
    origin: "http://localhost:3000",
};

const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors(corsOptions))


app.use(handler)
// blog routes
app.use('/api/v1.0/blogsite/blogs', blogRoutes)

// connectDB(DATABASE_URL)

/** Error Handler */
app.use((req, res, next) => {
    next(createHttpError(404, 'Request URL not found'));
});

app.use(errorHandler)

export default app

