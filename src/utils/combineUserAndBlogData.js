import { getUserDetails } from "./userService.js";


export const combineUserAndBlogData = async (blogsData) => {
    const blogsWithUserDetails = [];
    const blogs = Array.isArray(blogsData) ? blogsData : [blogsData];
    for (const blog of blogs) {
        if (blog.author_details) {
            const { _id: userId, ...userWithoutId } = await getUserDetails(blog.author_details);
            const combinedData = {
                ...blog._doc,
                ...userWithoutId,
            };
            delete combinedData.author_details;
            blogsWithUserDetails.push(combinedData);
        } else {
            blogsWithUserDetails.push(blog._doc);
        }
    }
    return Array.isArray(blogsData) ? blogsWithUserDetails : blogsWithUserDetails[0];
};
