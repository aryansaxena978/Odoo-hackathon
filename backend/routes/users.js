const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const { protect, checkOwnership, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users with optional search and filters
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim(),
  query('availability').optional().isIn(['weekends', 'weekdays', 'flexible', 'busy', 'all']),
  query('minRating').optional().isFloat({ min: 0, max: 5 }),
  query('skills').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    
    const filters = {
      availability: req.query.availability,
      minRating: req.query.minRating,
      skills: req.query.skills ? req.query.skills.split(',') : []
    };

    // Build search query
    const searchQuery = { isActive: true, profileVisibility: 'public' };
    
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { skillsOffered: { $regex: search, $options: 'i' } },
        { skillsWanted: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (filters.availability && filters.availability !== 'all') {
      searchQuery.availability = filters.availability;
    }
    
    if (filters.minRating) {
      searchQuery.rating = { $gte: parseFloat(filters.minRating) };
    }
    
    if (filters.skills.length > 0) {
      searchQuery.$or = searchQuery.$or || [];
      searchQuery.$or.push(
        { skillsOffered: { $in: filters.skills } },
        { skillsWanted: { $in: filters.skills } }
      );
    }

    // Execute query with pagination
    const users = await User.find(searchQuery)
      .select('-password -email')
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await User.countDocuments(searchQuery);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        },
        filters: {
          search,
          ...filters
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
});

// @route   GET /api/users/skills
// @desc    Get all unique skills from users
// @access  Public
router.get('/skills', async (req, res) => {
  try {
    const skillsOffered = await User.distinct('skillsOffered', { 
      isActive: true, 
      profileVisibility: 'public' 
    });
    const skillsWanted = await User.distinct('skillsWanted', { 
      isActive: true, 
      profileVisibility: 'public' 
    });
    
    const allSkills = [...new Set([...skillsOffered, ...skillsWanted])].sort();

    res.json({
      success: true,
      data: {
        skills: allSkills,
        skillsOffered: skillsOffered.sort(),
        skillsWanted: skillsWanted.sort()
      }
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching skills'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive || user.profileVisibility === 'private') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error fetching user'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private (own profile only)
router.put('/:id', protect, checkOwnership, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('location').optional().trim().isLength({ max: 100 }),
  body('availability').optional().isIn(['weekends', 'weekdays', 'flexible', 'busy']),
  body('profileVisibility').optional().isIn(['public', 'private']),
  body('skillsOffered').optional().isArray(),
  body('skillsWanted').optional().isArray(),
  body('avatar').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const allowedFields = [
      'name', 'bio', 'location', 'availability', 
      'profileVisibility', 'skillsOffered', 'skillsWanted', 'avatar'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Deactivate user account
// @access  Private (own account only)
router.delete('/:id', protect, checkOwnership, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deactivating account'
    });
  }
});

// @route   GET /api/users/:id/stats
// @desc    Get user statistics
// @access  Public
router.get('/:id/stats', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name skillsOffered skillsWanted rating ratingCount createdAt');
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get request statistics (you'll need to import Request model)
    // const Request = require('../models/Request');
    // const requestStats = await Request.aggregate([...]);

    res.json({
      success: true,
      data: {
        user: {
          name: user.name,
          skillsOfferedCount: user.skillsOffered.length,
          skillsWantedCount: user.skillsWanted.length,
          rating: user.rating,
          ratingCount: user.ratingCount,
          memberSince: user.createdAt
        }
        // requestStats would go here
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user stats'
    });
  }
});

module.exports = router;