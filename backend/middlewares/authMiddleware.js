import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';

export const authenticateUser = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token, access denied'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Based on role, get user from appropriate collection
    let user;
    
    if (decoded.role === 'patient') {
      user = await userModel.findById(decoded.id).select('-password');
    } else if (decoded.role === 'doctor') {
      user = await doctorModel.findById(decoded.id).select('-password');
    } else if (decoded.role === 'admin') {
      // For admin, we'll just use the decoded data
      user = {
        id: 'admin',
        email: decoded.email,
        role: 'admin'
      };
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Add user info to request
    req.user = {
      id: user._id || user.id,
      email: user.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.log(error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired, please login again'
      });
    }
    
    res.status(401).json({
      success: false,
      message: 'Invalid authentication token'
    });
  }
};

// Role-based access control middleware
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed to access this resource`
      });
    }
    next();
  };
};

// Optional auth middleware that doesn't return an error if no token is present
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // If no token, just continue without setting user
      return next();
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Based on role, get user from appropriate collection
    let user;
    
    if (decoded.role === 'patient') {
      user = await userModel.findById(decoded.id).select('-password');
    } else if (decoded.role === 'doctor') {
      user = await doctorModel.findById(decoded.id).select('-password');
    } else if (decoded.role === 'admin') {
      user = {
        id: 'admin',
        email: decoded.email,
        role: 'admin'
      };
    }
    
    if (user) {
      // Add user info to request
      req.user = {
        id: user._id || user.id,
        email: user.email,
        role: decoded.role
      };
    }
    
    next();
  } catch (error) {
    // If error in auth, just continue without setting user
    console.log('Optional auth error:', error.message);
    next();
  }
};