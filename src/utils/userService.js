import axios from 'axios';


export const getUserDetails = async (author_id, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        const response = await axios.get(`http://localhost:3003/api/v1.0/blogsite/user/${author_id}`, config);
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};