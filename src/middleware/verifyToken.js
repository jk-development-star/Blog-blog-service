import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decodedToken.user_id;
        req.userType = decodedToken.user_type;
        req.token = token;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token provided!",
            error: err,
        });
    }
}