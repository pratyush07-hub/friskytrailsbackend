import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET|| 'your-super-secret-jwt-key';

/**
 * @desc    Protect routes - verify JWT token from cookie
 * @usage   Add to any route that requires authentication
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in cookies (primary method)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Fallback: Check Authorization header
    else if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token || token === 'none') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user to request
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

