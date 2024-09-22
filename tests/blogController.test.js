import 'dotenv/config';
import request from 'supertest';
import app from '../src/app.js';
import Blog from '../src/models/blog.js';
import { combineUserAndBlogData } from '../src/utils/combineUserAndBlogData.js';


jest.mock('../src/models/blog.js');
jest.mock('../src/utils/combineUserAndBlogData.js');
jest.mock('../src/middleware/verifyToken.js', () => (req, res, next) => {
    req.userId = 'user123'; // Mock user data
    req.userType = 'admin';
    next();
});

// describe('GET /', () => {
//     afterEach(() => {
//         jest.clearAllMocks();
//     });
//     it('should return blogs for admin user', async () => {
//         const blogs = [{
//             name: "Costly Car Maintenance Mistakes That Are Killing Your Bank Account",
//             category: "Constantly Resting Your Hand on the Gear Shift",
//             article: "Changing gears involves the selector fork and rotating collar briefly touching each other before moving the car into the new gear. When you rest your hand on the gear shift, it can cause these two components to make contact, even though you aren’t changing gears. This can lead to damage due to wear and tear, ultimately requiring you to replace your transmission.Engine oil, coolant, power steering fluid, brake fluid, transmission fluid and windshield washer fluid are things you need to be mindful of to take good care of your car. The most important of those are engine oil and coolant, but that doesn’t mean you can ignore the others.But they don’t need excessive monitoring, either. Once or twice a year is usually enough, depending on how much you drive. Just to be safe, check before and after long road trips. If you see an indicator for a fluid light up on your dash, tend to it immediately.If you’re trying to avoid an accident, you slam on the brakes to avoid the collision. But when you’re just driving around, try to avoid hitting the brakes too hard. You can do this by paying attention to fast-changing traffic lights and being aware of your surroundings."
//         }];
//         const combinedData = [{
//             name: "Costly Car Maintenance Mistakes That Are Killing Your Bank Account",
//             category: "Constantly Resting Your Hand on the Gear Shift",
//             article: "Changing gears involves the selector fork and rotating collar briefly touching each other before moving the car into the new gear. When you rest your hand on the gear shift, it can cause these two components to make contact, even though you aren’t changing gears. This can lead to damage due to wear and tear, ultimately requiring you to replace your transmission.Engine oil, coolant, power steering fluid, brake fluid, transmission fluid and windshield washer fluid are things you need to be mindful of to take good care of your car. The most important of those are engine oil and coolant, but that doesn’t mean you can ignore the others.But they don’t need excessive monitoring, either. Once or twice a year is usually enough, depending on how much you drive. Just to be safe, check before and after long road trips. If you see an indicator for a fluid light up on your dash, tend to it immediately.If you’re trying to avoid an accident, you slam on the brakes to avoid the collision. But when you’re just driving around, try to avoid hitting the brakes too hard. You can do this by paying attention to fast-changing traffic lights and being aware of your surroundings.",
//             user_name: "admin "
//         }];

//         Blog.find.mockResolvedValue(blogs);
//         combineUserAndBlogData.mockResolvedValue(combinedData);

//         await request(app)
//             .get('/api/v1.0/blogsite/blogs/')
//             .set('Authorization', 'Bearer token123')
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body).toEqual(combinedData);
//             });

//         expect(Blog.find).toHaveBeenCalledWith({}, { __v: 0, updatedAt: 0 });
//         expect(combineUserAndBlogData).toHaveBeenCalledWith(blogs, req.token);
//     });

//     it('should return blogs for non-admin user', async () => {
//         req.userType = 'user';
//         const blogs = [{
//             "name": "Costly Car Maintenance Mistakes That Are Killing Your Bank Account",
//             "category": "Constantly Resting Your Hand on the Gear Shift",
//             "article": "Changing gears involves the selector fork and rotating collar briefly touching each other before moving the car into the new gear. When you rest your hand on the gear shift, it can cause these two components to make contact, even though you aren’t changing gears. This can lead to damage due to wear and tear, ultimately requiring you to replace your transmission.Engine oil, coolant, power steering fluid, brake fluid, transmission fluid and windshield washer fluid are things you need to be mindful of to take good care of your car. The most important of those are engine oil and coolant, but that doesn’t mean you can ignore the others.But they don’t need excessive monitoring, either. Once or twice a year is usually enough, depending on how much you drive. Just to be safe, check before and after long road trips. If you see an indicator for a fluid light up on your dash, tend to it immediately.If you’re trying to avoid an accident, you slam on the brakes to avoid the collision. But when you’re just driving around, try to avoid hitting the brakes too hard. You can do this by paying attention to fast-changing traffic lights and being aware of your surroundings."
//         }];
//         const combinedData = [{
//             "name": "Costly Car Maintenance Mistakes That Are Killing Your Bank Account",
//             "category": "Constantly Resting Your Hand on the Gear Shift",
//             "article": "Changing gears involves the selector fork and rotating collar briefly touching each other before moving the car into the new gear. When you rest your hand on the gear shift, it can cause these two components to make contact, even though you aren’t changing gears. This can lead to damage due to wear and tear, ultimately requiring you to replace your transmission.Engine oil, coolant, power steering fluid, brake fluid, transmission fluid and windshield washer fluid are things you need to be mindful of to take good care of your car. The most important of those are engine oil and coolant, but that doesn’t mean you can ignore the others.But they don’t need excessive monitoring, either. Once or twice a year is usually enough, depending on how much you drive. Just to be safe, check before and after long road trips. If you see an indicator for a fluid light up on your dash, tend to it immediately.If you’re trying to avoid an accident, you slam on the brakes to avoid the collision. But when you’re just driving around, try to avoid hitting the brakes too hard. You can do this by paying attention to fast-changing traffic lights and being aware of your surroundings.",
//             "user_name": "user "
//         }];

//         Blog.find.mockResolvedValue(blogs);
//         combineUserAndBlogData.mockResolvedValue(combinedData);

//         await request(app)
//             .get('/api/v1.0/blogsite/blogs/')
//             .set('Authorization', 'Bearer token123')
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body).toEqual(combinedData);
//             });

//         expect(Blog.find).toHaveBeenCalledWith({ author_details: req.userId }, { __v: 0, updatedAt: 0 });
//         expect(combineUserAndBlogData).toHaveBeenCalledWith(blogs, req.token);
//     });

//     it('should handle errors', async () => {
//         const errorMessage = 'Error occurred';
//         Blog.find.mockRejectedValue(new Error(errorMessage));

//         await request(app)
//             .get('/api/v1.0/blogsite/blogs/')
//             .set('Authorization', 'Bearer token123')
//             .expect(404)
//             .expect((res) => {
//                 expect(res.body.message).toBe(errorMessage);
//             });

//         expect(next).toHaveBeenCalledWith(expect.any(Error));
//     });
// });


describe('getBlogs', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return blogs for admin user', async () => {
        const blogs = [{
            "name": "Costly Car Maintenance Mistakes That Are Killing Your Bank Account",
            "category": "Constantly Resting Your Hand on the Gear Shift",
            "article": "Changing gears involves the selector fork and rotating collar briefly touching each other before moving the car into the new gear. When you rest your hand on the gear shift, it can cause these two components to make contact, even though you aren’t changing gears. This can lead to damage due to wear and tear, ultimately requiring you to replace your transmission.Engine oil, coolant, power steering fluid, brake fluid, transmission fluid and windshield washer fluid are things you need to be mindful of to take good care of your car. The most important of those are engine oil and coolant, but that doesn’t mean you can ignore the others.But they don’t need excessive monitoring, either. Once or twice a year is usually enough, depending on how much you drive. Just to be safe, check before and after long road trips. If you see an indicator for a fluid light up on your dash, tend to it immediately.If you’re trying to avoid an accident, you slam on the brakes to avoid the collision. But when you’re just driving around, try to avoid hitting the brakes too hard. You can do this by paying attention to fast-changing traffic lights and being aware of your surroundings."
        }];
        const combinedData = [{
            "name": "Costly Car Maintenance Mistakes That Are Killing Your Bank Account",
            "category": "Constantly Resting Your Hand on the Gear Shift",
            "article": "Changing gears involves the selector fork and rotating collar briefly touching each other before moving the car into the new gear. When you rest your hand on the gear shift, it can cause these two components to make contact, even though you aren’t changing gears. This can lead to damage due to wear and tear, ultimately requiring you to replace your transmission.Engine oil, coolant, power steering fluid, brake fluid, transmission fluid and windshield washer fluid are things you need to be mindful of to take good care of your car. The most important of those are engine oil and coolant, but that doesn’t mean you can ignore the others.But they don’t need excessive monitoring, either. Once or twice a year is usually enough, depending on how much you drive. Just to be safe, check before and after long road trips. If you see an indicator for a fluid light up on your dash, tend to it immediately.If you’re trying to avoid an accident, you slam on the brakes to avoid the collision. But when you’re just driving around, try to avoid hitting the brakes too hard. You can do this by paying attention to fast-changing traffic lights and being aware of your surroundings.",
            "user_name": "admin"
        }];
        Blog.find.mockResolvedValue(blogs);
        combineUserAndBlogData.mockResolvedValue(combinedData);

        await request(app)
            .get('/api/v1.0/blogsite/blogs/')
            .set('Authorization', 'Bearer token123')
            .expect(200)
            .expect((res) => {
                expect(res.body).toEqual(combinedData);
            });

        expect(Blog.find).toHaveBeenCalledWith({ author_details: req.userId }, { __v: 0, updatedAt: 0 });
        expect(combineUserAndBlogData).toHaveBeenCalledWith(blogs, req.token);
    });

    it('should return blogs for non-admin user', async () => {
        req.userType = 'user';
        const blogs = [{
            "name": "Costly Car Maintenance Mistakes That Are Killing Your Bank Account",
            "category": "Constantly Resting Your Hand on the Gear Shift",
            "article": "Changing gears involves the selector fork and rotating collar briefly touching each other before moving the car into the new gear. When you rest your hand on the gear shift, it can cause these two components to make contact, even though you aren’t changing gears. This can lead to damage due to wear and tear, ultimately requiring you to replace your transmission.Engine oil, coolant, power steering fluid, brake fluid, transmission fluid and windshield washer fluid are things you need to be mindful of to take good care of your car. The most important of those are engine oil and coolant, but that doesn’t mean you can ignore the others.But they don’t need excessive monitoring, either. Once or twice a year is usually enough, depending on how much you drive. Just to be safe, check before and after long road trips. If you see an indicator for a fluid light up on your dash, tend to it immediately.If you’re trying to avoid an accident, you slam on the brakes to avoid the collision. But when you’re just driving around, try to avoid hitting the brakes too hard. You can do this by paying attention to fast-changing traffic lights and being aware of your surroundings."
        }];
        const combinedData = [{
            "name": "Costly Car Maintenance Mistakes That Are Killing Your Bank Account",
            "category": "Constantly Resting Your Hand on the Gear Shift",
            "article": "Changing gears involves the selector fork and rotating collar briefly touching each other before moving the car into the new gear. When you rest your hand on the gear shift, it can cause these two components to make contact, even though you aren’t changing gears. This can lead to damage due to wear and tear, ultimately requiring you to replace your transmission.Engine oil, coolant, power steering fluid, brake fluid, transmission fluid and windshield washer fluid are things you need to be mindful of to take good care of your car. The most important of those are engine oil and coolant, but that doesn’t mean you can ignore the others.But they don’t need excessive monitoring, either. Once or twice a year is usually enough, depending on how much you drive. Just to be safe, check before and after long road trips. If you see an indicator for a fluid light up on your dash, tend to it immediately.If you’re trying to avoid an accident, you slam on the brakes to avoid the collision. But when you’re just driving around, try to avoid hitting the brakes too hard. You can do this by paying attention to fast-changing traffic lights and being aware of your surroundings.",
            "user_name": "user"
        }];
        Blog.find.mockResolvedValue(blogs);
        combineUserAndBlogData.mockResolvedValue(combinedData);

        await request(app)
            .get('/api/v1.0/blogsite/blogs/')
            .set('Authorization', 'Bearer token123')
            .expect(200)
            .expect((res) => {
                expect(res.body).toEqual(combinedData);
            });

        expect(Blog.find).toHaveBeenCalledWith({ author_details: req.userId }, { __v: 0, updatedAt: 0 });
        expect(combineUserAndBlogData).toHaveBeenCalledWith(blogs, req.token);
    });

    it('should handle errors from Blog.find', async () => {
        const error = new Error('Database error');
        Blog.find.mockRejectedValue(error);

        await request(app)
            .get('/api/v1.0/blogsite/blogs/')
            .set('Authorization', 'Bearer token123')
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toBe(error.message);
            });
    });

    it('should handle errors from combineUserAndBlogData', async () => {
        const blogs = [{ title: 'Blog1' }];
        const error = new Error('Combine error');
        Blog.find.mockResolvedValue(blogs);
        combineUserAndBlogData.mockRejectedValue(error);

        await request(app)
            .get('/api/v1.0/blogsite/blogs/')
            .set('Authorization', 'Bearer token123')
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toBe(error.message);
            });
    });

    it('should handle unexpected errors', async () => {
        const error = new Error('Unexpected error');
        Blog.find.mockImplementation(() => { throw error; });

        await request(app)
            .get('/api/v1.0/blogsite/blogs/')
            .set('Authorization', 'Bearer token123')
            .expect(500)
            .expect((res) => {
                expect(res.body.message).toBe(error.message);
            });
    });
});
