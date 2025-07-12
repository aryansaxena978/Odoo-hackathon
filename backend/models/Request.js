const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'From user is required']
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'To user is required']
  },
  offeredSkill: {
    type: String,
    required: [true, 'Offered skill is required'],
    trim: true
  },
  wantedSkill: {
    type: String,
    required: [true, 'Wanted skill is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  preferredTime: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  sessionType: {
    type: String,
    enum: ['video_call', 'in_person', 'chat', 'flexible'],
    default: 'flexible'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    trim: true
  },
  // Response from the recipient
  responseMessage: {
    type: String,
    maxlength: [500, 'Response message cannot exceed 500 characters'],
    trim: true
  },
  respondedAt: {
    type: Date
  },
  // Session completion
  completedAt: {
    type: Date
  },
  rating: {
    fromUserRating: {
      type: Number,
      min: 1,
      max: 5
    },
    toUserRating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  feedback: {
    fromUserFeedback: {
      type: String,
      maxlength: [500, 'Feedback cannot exceed 500 characters']
    },
    toUserFeedback: {
      type: String,
      maxlength: [500, 'Feedback cannot exceed 500 characters']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
requestSchema.index({ fromUser: 1, createdAt: -1 });
requestSchema.index({ toUser: 1, createdAt: -1 });
requestSchema.index({ status: 1 });
requestSchema.index({ offeredSkill: 1 });
requestSchema.index({ wantedSkill: 1 });

// Compound index for user's requests
requestSchema.index({ 
  $or: [{ fromUser: 1 }, { toUser: 1 }], 
  status: 1, 
  createdAt: -1 
});

// Virtual to determine if request is incoming for a specific user
requestSchema.virtual('isIncoming').get(function() {
  // This will be set dynamically in the API based on current user
  return this._isIncoming || false;
});

// Static method to get user's requests
requestSchema.statics.getUserRequests = function(userId) {
  return this.find({
    $or: [
      { fromUser: userId },
      { toUser: userId }
    ]
  })
  .populate('fromUser', 'name email avatar skillsOffered skillsWanted rating')
  .populate('toUser', 'name email avatar skillsOffered skillsWanted rating')
  .sort({ createdAt: -1 });
};

// Static method to get pending requests for a user
requestSchema.statics.getPendingRequests = function(userId) {
  return this.find({
    toUser: userId,
    status: 'pending'
  })
  .populate('fromUser', 'name email avatar skillsOffered skillsWanted rating')
  .populate('toUser', 'name email avatar skillsOffered skillsWanted rating')
  .sort({ createdAt: -1 });
};

// Method to accept request
requestSchema.methods.accept = function(responseMessage = '') {
  this.status = 'accepted';
  this.responseMessage = responseMessage;
  this.respondedAt = new Date();
  return this.save();
};

// Method to reject request
requestSchema.methods.reject = function(responseMessage = '') {
  this.status = 'rejected';
  this.responseMessage = responseMessage;
  this.respondedAt = new Date();
  return this.save();
};

// Method to complete request
requestSchema.methods.complete = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

// Pre-save validation
requestSchema.pre('save', function(next) {
  // Ensure user can't send request to themselves
  if (this.fromUser.toString() === this.toUser.toString()) {
    const error = new Error('Cannot send request to yourself');
    error.status = 400;
    return next(error);
  }
  next();
});

module.exports = mongoose.model('Request', requestSchema);