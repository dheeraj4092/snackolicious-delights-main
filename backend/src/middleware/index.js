import { supabase, supabaseAdmin, TABLES } from '../config/supabase.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Verify JWT token and attach user to request
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Verify JWT token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error('JWT verification error:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user profile with role information
    const { data: profile, error: profileError } = await supabaseAdmin
      .from(TABLES.PROFILES)
      .select('*')
      .eq('id', decodedToken.userId)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return res.status(500).json({ error: 'Error fetching user profile' });
    }

    // Get user from Supabase using admin client
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(decodedToken.userId);
    
    if (userError || !user) {
      console.error('User fetch error:', userError);
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user and profile to request
    req.user = user;
    req.profile = profile;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error in auth middleware' });
  }
};

// Check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.profile) {
      return res.status(401).json({ error: 'No user profile found' });
    }

    if (req.profile.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ error: 'Internal server error in admin check' });
  }
};

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      error: 'File upload error',
      message: err.message
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: err.message
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      message: 'Please log in again'
    });
  }

  // Handle Supabase errors
  if (err.code && err.code.startsWith('PGRST')) {
    return res.status(400).json({
      error: 'Database error',
      message: err.message
    });
  }

  // Handle Stripe errors
  if (err.type && err.type.startsWith('Stripe')) {
    return res.status(400).json({
      error: 'Payment error',
      message: err.message
    });
  }

  // Default error
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
}; 