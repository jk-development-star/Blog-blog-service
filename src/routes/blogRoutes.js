
import express from "express";
import { addBlog, deleteBlog, getBlogById, getBlogs, searchBlog } from "../controllers/blogController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/info/:category",  searchBlog)
router.post('/',  addBlog)
router.delete('/:id',  deleteBlog)
router.get('/:id',  getBlogById)
router.get('/:userId',  getBlogs)


export default router;
