import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1) Extract token from Bearer header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You are not logged in. Please provide an authentication token.', 401)
      );
    }

    // 2) Verify token signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Confirm user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    // 4) Attach user to request
    req.user = currentUser;
    next();
  } catch (error) {
    next(error); // Caught by centralized errorHandler (JsonWebTokenError / TokenExpiredError)
  }
};