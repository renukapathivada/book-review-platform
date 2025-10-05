const jwt = require('jsonwebtoken');

// Middleware to verify JWT token and attach user ID to request
module.exports = (req, res, next) => {
  // Get token from header (usually sent as 'Bearer token')
  const token = req.header('x-auth-token'); 
  
  if (!token) {
    // 401 Unauthorized: Access without token
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user information to the request object
    req.user = decoded.user;
    next();
  } catch (err) {
    // 401 Unauthorized: Token is invalid or expired
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
