const express = require('express');
const { body, validationResult } = require('express-validator');
const Request = require('../models/Request');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/requests
// @desc    Get user's requests
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const requests = await Request.getUserRequests(req.user._id);
    
    // Add isIncoming property to each request
    const requestsWithDirection = requests.map(request => {
      const isIncoming = request.toUser._id.toString() === req.user._id.toString();
      return {
        ...request.toObject(),
        isIncoming
      };
    });

    res.json({
      success: true,
      data: {
        requests: requestsWithDirection
      }
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching requests'
    });
  }
});

// @route   GET /api/requests/pending
// @desc    Get pending requests for user
// @access  Private
router.get('/pending', protect, async (req, res) => {
  try {
    const requests = await Request.getPendingRequests(req.user._id);
    
    const requestsWithDirection = requests.map(request => ({
      ...request.toObject(),
      isIncoming: true
    }));

    res.json({
      success: true,
      data: {
        requests: requestsWithDirection
      }
    });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching pending requests'
    });
  }
});

// @route   POST /api/requests
// @desc    Create new skill swap request
// @access  Private
router.post('/', protect, [
  body('toUserId')
    .notEmpty()
    .withMessage('Recipient user ID is required')
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('offeredSkill')
    .trim()
    .notEmpty()
    .withMessage('Offered skill is required')
    .isLength({ max: 100 })
    .withMessage('Offered skill cannot exceed 100 characters'),
  body('wantedSkill')
    .trim()
    .notEmpty()
    .withMessage('Wanted skill is required')
    .isLength({ max: 100 })
    .withMessage('Wanted skill cannot exceed 100 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  body('preferredTime').optional().trim(),
  body('duration').optional().trim(),
  body('sessionType').optional().isIn(['video_call', 'in_person', 'chat', 'flexible'])
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

    const { toUserId, offeredSkill, wantedSkill, message, preferredTime, duration, sessionType } = req.body;

    // Check if recipient exists and is active
    const recipient = await User.findById(toUserId);
    if (!recipient || !recipient.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Recipient user not found'
      });
    }

    // Check if user is trying to send request to themselves
    if (req.user._id.toString() === toUserId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send request to yourself'
      });
    }

    // Check if there's already a pending request between these users for these skills
    const existingRequest = await Request.findOne({
      $or: [
        {
          fromUser: req.user._id,
          toUser: toUserId,
          offeredSkill,
          wantedSkill,
          status: 'pending'
        },
        {
          fromUser: toUserId,
          toUser: req.user._id,
          offeredSkill: wantedSkill,
          wantedSkill: offeredSkill,
          status: 'pending'
        }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'A similar request already exists between you and this user'
      });
    }

    // Create new request
    const newRequest = new Request({
      fromUser: req.user._id,
      toUser: toUserId,
      offeredSkill,
      wantedSkill,
      message,
      preferredTime,
      duration,
      sessionType: sessionType || 'flexible'
    });

    await newRequest.save();

    // Populate user data
    await newRequest.populate('fromUser', 'name email avatar skillsOffered skillsWanted rating');
    await newRequest.populate('toUser', 'name email avatar skillsOffered skillsWanted rating');

    res.status(201).json({
      success: true,
      message: 'Skill swap request sent successfully',
      data: {
        request: {
          ...newRequest.toObject(),
          isIncoming: false
        }
      }
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating request'
    });
  }
});

// @route   PUT /api/requests/:id/accept
// @desc    Accept a skill swap request
// @access  Private
router.put('/:id/accept', protect, [
  body('responseMessage').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('fromUser', 'name email avatar skillsOffered skillsWanted rating')
      .populate('toUser', 'name email avatar skillsOffered skillsWanted rating');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is the recipient
    if (request.toUser._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only accept requests sent to you'
      });
    }

    // Check if request is still pending
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been responded to'
      });
    }

    // Accept the request
    await request.accept(req.body.responseMessage);

    res.json({
      success: true,
      message: 'Request accepted successfully',
      data: {
        request: {
          ...request.toObject(),
          isIncoming: true
        }
      }
    });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error accepting request'
    });
  }
});

// @route   PUT /api/requests/:id/reject
// @desc    Reject a skill swap request
// @access  Private
router.put('/:id/reject', protect, [
  body('responseMessage').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('fromUser', 'name email avatar skillsOffered skillsWanted rating')
      .populate('toUser', 'name email avatar skillsOffered skillsWanted rating');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is the recipient
    if (request.toUser._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only reject requests sent to you'
      });
    }

    // Check if request is still pending
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been responded to'
      });
    }

    // Reject the request
    await request.reject(req.body.responseMessage);

    res.json({
      success: true,
      message: 'Request rejected successfully',
      data: {
        request: {
          ...request.toObject(),
          isIncoming: true
        }
      }
    });
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error rejecting request'
    });
  }
});

// @route   PUT /api/requests/:id/complete
// @desc    Mark request as completed
// @access  Private
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('fromUser', 'name email avatar skillsOffered skillsWanted rating')
      .populate('toUser', 'name email avatar skillsOffered skillsWanted rating');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is involved in this request
    const userId = req.user._id.toString();
    if (request.fromUser._id.toString() !== userId && request.toUser._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only complete your own requests'
      });
    }

    // Check if request is accepted
    if (request.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Request must be accepted before it can be completed'
      });
    }

    // Complete the request
    await request.complete();

    res.json({
      success: true,
      message: 'Request marked as completed',
      data: {
        request: {
          ...request.toObject(),
          isIncoming: request.toUser._id.toString() === userId
        }
      }
    });
  } catch (error) {
    console.error('Complete request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error completing request'
    });
  }
});

// @route   DELETE /api/requests/:id
// @desc    Cancel/delete a request
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is the sender
    if (request.fromUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel requests you sent'
      });
    }

    // Check if request can be cancelled
    if (request.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed requests'
      });
    }

    await Request.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Request cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error cancelling request'
    });
  }
});

module.exports = router;