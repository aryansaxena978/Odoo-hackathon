const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Skill = require('../models/Skill');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/skills
// @desc    Get all skills with optional search and category filter
// @access  Public
router.get('/', [
  query('search').optional().trim(),
  query('category').optional().trim(),
  query('limit').optional().isInt({ min: 1, max: 100 })
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

    const { search, category, limit = 50 } = req.query;

    let skills;
    if (search || category) {
      skills = await Skill.searchSkills(search, category).limit(parseInt(limit));
    } else {
      skills = await Skill.find({ isActive: true })
        .sort({ popularity: -1, name: 1 })
        .limit(parseInt(limit));
    }

    res.json({
      success: true,
      data: {
        skills,
        count: skills.length
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

// @route   GET /api/skills/categories
// @desc    Get skills grouped by category
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Skill.getSkillsByCategory();

    res.json({
      success: true,
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Get skills by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching skills by category'
    });
  }
});

// @route   GET /api/skills/popular
// @desc    Get popular skills
// @access  Public
router.get('/popular', [
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const skills = await Skill.getPopularSkills(limit);

    res.json({
      success: true,
      data: {
        skills
      }
    });
  } catch (error) {
    console.error('Get popular skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching popular skills'
    });
  }
});

// @route   POST /api/skills
// @desc    Create new skill
// @access  Private
router.post('/', protect, [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Skill name is required')
    .isLength({ max: 50 })
    .withMessage('Skill name cannot exceed 50 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'Programming', 'Web Development', 'Mobile Development', 'Data Science',
      'Machine Learning', 'Design', 'DevOps', 'Database', 'Marketing',
      'Business', 'Language', 'Music', 'Art', 'Photography', 'Writing', 'Other'
    ])
    .withMessage('Invalid category'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
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

    const { name, category, description, tags } = req.body;

    // Check if skill already exists
    const existingSkill = await Skill.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingSkill) {
      // If skill exists, just increment popularity
      await existingSkill.incrementPopularity();
      return res.json({
        success: true,
        message: 'Skill already exists, popularity updated',
        data: {
          skill: existingSkill
        }
      });
    }

    // Create new skill
    const skill = new Skill({
      name,
      category,
      description,
      tags: tags || [],
      createdBy: req.user._id,
      popularity: 1
    });

    await skill.save();

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: {
        skill
      }
    });
  } catch (error) {
    console.error('Create skill error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Skill with this name already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error creating skill'
    });
  }
});

// @route   PUT /api/skills/:id
// @desc    Update skill
// @access  Private (Admin only - for now, allow skill creator)
router.put('/:id', protect, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Skill name must be between 1 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
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

    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Check if user created this skill (basic authorization)
    if (skill.createdBy && skill.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update skills you created'
      });
    }

    const allowedFields = ['name', 'description', 'tags'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key) && req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    });

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Skill updated successfully',
      data: {
        skill: updatedSkill
      }
    });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating skill'
    });
  }
});

// @route   DELETE /api/skills/:id
// @desc    Deactivate skill
// @access  Private (Admin only - for now, allow skill creator)
router.delete('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Check if user created this skill (basic authorization)
    if (skill.createdBy && skill.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete skills you created'
      });
    }

    // Deactivate instead of deleting
    skill.isActive = false;
    await skill.save();

    res.json({
      success: true,
      message: 'Skill deactivated successfully'
    });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting skill'
    });
  }
});

module.exports = router;