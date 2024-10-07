const model = require('../model/schema');

/**
 * Method to add user to blod site
 * @param input req, res, next
 * @returns json(data)
 */
exports.addBlog = async (req, res, next) => {
    try {
        const blogObj = new model();
        blogObj.blog_name = req.body.blog_name;
        blogObj.category = req.body.category;
        blogObj.article = req.body.article;
        blogObj.author = req.body.author;
        const ifExists = await model.find({ blog_name: { $eq: req.body.blog_name } });
        if (ifExists.length > 0) {
            res.status(200).send({ message: `blog name - '${req.body.blog_name}' already exists! Please give another name to your blog.` });
        } else {
            const createdModel = await model.create(blogObj);
            if (createdModel) {
                res.status(200).send({ message: 'Blog posted successfully!' });
            } else {
                res.status(400).json(createdModel)
            }
        }
    } catch (error) {
        res.status(400).json({
            status: 'Failed to add new user to blog site',
            message: error,
        });
        next(error);
    }
};

/**
 * Method to Retrieve all
 * @param input req, res, next
 * @returns json(data)
 */
exports.getAll = async (req, res, next) => {
    try {
        const data = await model.find({});
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).send({ Error: 404, message: 'Blog Not Found in the Database' });
        }
    } catch (err) {
        next(err);
    }
};

/**
 * Method for Deleting blog
 * @param input req, res, next
 * @returns json(data)
 */
exports.deletePost = async (req, res, next) => {
    try {
        const deletedPO = await model.findOneAndDelete({ blog_name: { $eq: req.params.blog_name } });

        if (deletedPO) {
            res.status(200).json(deletedPO);
        } else {
            res.status(404).send({ Error: 404, message: `${req.params.blog_name} - Not Found in the Database` });
        }
    } catch (err) {
        next(err);
    }
};

/**
 * Method to retrieve one blog
 * @param input req, res, next
 * @returns json(data)
 */
exports.getBlogByCategory = async (req, res, next) => {
    try {
        const data = await model.find({ category: { $eq: req.params.category } });
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).send({ Error: 404, message: `${req.params.category} - does not exists` });
        }
    } catch (err) {
        next(err);
    }
};