import Blog from "../models/blog.js";
import createHttpError from "http-errors";
import { validationError } from "../middleware/errorHandler.js";
import { combineUserAndBlogData } from "../utils/combineUserAndBlogData.js";


  

// get all blogs
export const getBlogs = async (req, res) => {
    try {
        const query = req.userType === 'admin' ? {} : { author_details: req.userId }
        await Blog.find(query, { __v: 0, updatedAt: 0 }).sort({ createdAt: -1 })
            .then(async (blogs) => {
                await combineUserAndBlogData(blogs, req.token)
                    .then(data => res.status(200).json(data))
                    .catch(error => res.status(404).json(createHttpError(error.message)));
            })
            .catch(error => res.status(404).json(createHttpError(error.message)));
    } catch (error) {
        next(error);
    }
};



// add new blog
export const addBlog = async (req, res) => {
    try {
        req.body.author_details = req.userId;
        await Blog.create(req.body)
            .then(() => {
                producer.send({
                    topic: 'blog-created',
                    messages: [{ value: JSON.stringify(req.body) }],
                });
            },
            res.json({ message: "Blog created successfully." }))
            .catch((error) => {
                if (error.name === 'ValidationError') {
                    res.status(400).json(validationError(error));
                }
            });
    } catch (error) {
        next(error)
    }
};

// get blog by id
export const getBlogById = async (req, res) => {
    const { id } = req.params
    try {
        if (req.userType === 'admin') {
            await Blog.findOne({ _id: id }, { __v: 0, updatedAt: 0 })
                .then(async (blogs) => {
                    await combineUserAndBlogData(blogs, req.token)
                        .then(data => res.status(200).json(data))
                        .catch(error => res.status(404).json(createHttpError(error.message)));
                })
                .catch(error => res.status(404).json(createHttpError(error.message)));
        } else {
            await Blog.findOne({ _id: id, author_details: req.userId }, { __v: 0, updatedAt: 0 })
                .then(async (blogs) => {
                    await combineUserAndBlogData(blogs, req.token)
                        .then(data => res.status(200).json(data))
                        .catch(error => res.status(404).json(createHttpError(error.message)));
                })
                .catch(error => res.status(404).json(createHttpError(error.message)));
        }
    } catch (error) {
        next(error)
    }
};

// delete blog
export const deleteBlog = async (req, res) => {
    const { id } = req.params;
    try {
        await Blog.findById({ _id: id }).then((blog) => {
            if (blog.author_details.toString() !== req.userId && req.userType !== 'admin') {
                return res.status(403).json({ message: "You are not authorized to delete this blog." });
            }
            return Blog.findOneAndDelete({ _id: id })
        }).then((deletedBlog) => {
            if (!deletedBlog) {
                return res.status(404).json({ message: 'Blog not found or you are not author of this blog' });
            }
            res.status(200).json({ message: "Blog deleted successfully." });
        }).catch((error) => {
            res.status(400).josn(createHttpError(error.message));
        });
    } catch (error) {
        next(error)
    }
};

// search blog using categorry param
export const searchBlog = async (req, res) => {
    try {
        const { category } = req.params
        await Blog.find({ category: { $regex: category, $options: 'i' } }, { __v: 0 }).sort({ createdAt: -1 })
            .then(async (blogs) => {
                await combineUserAndBlogData(blogs, req.token)
                    .then(data => res.status(200).json(data))
                    .catch(error => res.status(404).json(createHttpError(error.message)));
            })
            .catch((error) => {
                res.status(404).json(createHttpError(error.message));
            });
    } catch (error) {
        next(error)
    }
};
