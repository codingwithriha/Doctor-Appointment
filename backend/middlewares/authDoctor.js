import jwt from 'jsonwebtoken'

// authDoctor middleware
const authDoctor = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const token = req.headers.authorization?.split(' ')[1]; // Extract token after "Bearer "
        
        if (!token) {
            return res.json({ success: false, message: 'Not authorized, login again' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Set user in request object
        req.user = { id: decoded.id };
        next();
        
    } catch (error) {
        console.log('Auth error:', error.message);
        return res.json({ success: false, message: 'Not authorized, login again' });
    }
};

export default authDoctor