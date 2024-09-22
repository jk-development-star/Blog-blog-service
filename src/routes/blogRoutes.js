
import express from "express";
import { addBlog, deleteBlog, getBlogById, getBlogs, searchBlog } from "../controllers/blogController.js";
import { verifyToken } from "../middleware/verifyToken.js";



const router = express.Router();

router.get("/info/:category", verifyToken, searchBlog)
router.post('/', verifyToken, addBlog)
router.delete('/:id', verifyToken, deleteBlog)
router.get('/:id', verifyToken, getBlogById)
router.get('/', verifyToken, getBlogs)


export default router;
