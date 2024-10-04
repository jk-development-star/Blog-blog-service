import dotenv from 'dotenv'
dotenv.config()
import connectDB from "./src/config/db.config.js"
const DATABASE_URL = process.env.DATABASE_URL
connectDB(DATABASE_URL)
import Blog from "./src/models/blog.js";
import { validationError } from "./src/middleware/errorHandler.js";
import { combineUserAndBlogData } from "./src/utils/combineUserAndBlogData.js";


// get all blogs
export const getBlogs = async (event) => {
    console.log('event', event)
    const params = event.pathParameters
    const userId = params.split('-')[0]
    const userType = params.split('-')[1]
    try {
        const query = userType === 'admin' ? {} : { author_details: userId }
        const blogs = await Blog.find(query, { __v: 0, updatedAt: 0 }).sort({ createdAt: -1 })
        if (blogs) {
            const data = await combineUserAndBlogData(blogs)
            if (data) {
                return formatResponse(200, { data });
            } else {
                return formatResponse(404, { message: error.message });
            }
        } else {
            return formatResponse(404, { message: error.message });
        }
    } catch (error) {
        return formatResponse(500, { message: "Internal server error", error: error.message });
    }
};



// add new blog
export const addBlog = async (event) => {
    const input = JSON.parse(event.body);
    try {
        const blogInput = {
            name: input.name,
            category: input.category,
            article: input.article,
            author_details: input.userId,
        }
        const blog = await Blog.create(blogInput)
        if (blog) {
            return formatResponse(201, { message: "Blog created successfully!" });
        } else {
            return formatResponse(400, { message: validationError(error) });
        }
    } catch (error) {
        return formatResponse(500, { message: "internal server error", error: error.message });
    }
};

// get blog by id
export const getBlogById = async (event) => {
    const params = event.pathParameters
    const id = params.split('-')[0]
    const userId = params.split('-')[1]
    const userType = params.split('-')[1]
    try {
        if (userType === 'admin') {
            const blog = await Blog.findOne({ _id: id }, { __v: 0, updatedAt: 0 })
            if (blog) {
                const data = await combineUserAndBlogData(blog)
                if (data) {
                    return formatResponse(200, { data });
                } else {
                    return formatResponse(404, { message: error.message });
                }
            } else {
                return formatResponse(404, { message: error.message });
            }
        } else {
            await Blog.findOne({ _id: id, author_details: userId }, { __v: 0, updatedAt: 0 })
            const blog = await Blog.findOne({ _id: id }, { __v: 0, updatedAt: 0 })
            if (blog) {
                const data = await combineUserAndBlogData(blog)
                if (data) {
                    return formatResponse(200, { data });
                } else {
                    return formatResponse(404, { message: error.message });
                }
            } else {
                return formatResponse(404, { message: error.message });
            }
        }
    } catch (error) {
        return formatResponse(500, { message: "internal server error", error: error.message });
    }
};

// delete blog
export const deleteBlog = async (event) => {
    const params = event.pathParameters
    const id = params.split('-')[0]
    const userType = params.split('-')[1]
    const userId = params.split('-')[2]
    try {
        const blog = await Blog.findById({ _id: id })
        if (blog) {
            if (blog.author_details.toString() !== userId && userType !== 'admin') {
                return formatResponse(403, { message: "You are not authorized to delete this blog." })
            }
            return Blog.findOneAndDelete({ _id: id })
        } else (deletedBlog) => {
            if (!deletedBlog) {
                return formatResponse(403, { message: "Blog not found or you are not author of this blog." })
            }
            return formatResponse(200, { message: "Blog deleted successfully." })
        }
    } catch (error) {
        return formatResponse(500, { message: "internal server error", error: error.message });
    }
};

// search blog using categorry param
export const searchBlog = async (event) => {
    try {
        const { category } = event.pathParameters
        const blogs = await Blog.find({ category: { $regex: category, $options: 'i' } }, { __v: 0 }).sort({ createdAt: -1 })
        if (blogs) {
            const data = await combineUserAndBlogData(blogs)
            if (data) {
                return formatResponse(200, { data });
            } else {
                return formatResponse(404, { message: error.message });
            }
        } else {
            return formatResponse(404, { message: error.message });
        }
    } catch (error) {
        return formatResponse(500, { message: "internal server error", error: error.message });
    }
};

function formatResponse(statusCode, body) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
}
