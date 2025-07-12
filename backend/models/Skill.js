const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Skill name cannot exceed 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: [
      'Programming',
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'Design',
      'DevOps',
      'Database',
      'Marketing',
      'Business',
      'Language',
      'Music',
      'Art',
      'Photography',
      'Writing',
      'Other'
    ]
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  popularity: {
    type: Number,
    default: 0,
    min: 0
  },
  // Track how many users offer/want this skill
  offeredByCount: {
    type: Number,
    default: 0,
    min: 0
  },
  wantedByCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
skillSchema.index({ name: 1 });
skillSchema.index({ category: 1 });
skillSchema.index({ popularity: -1 });
skillSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for total engagement
skillSchema.virtual('totalEngagement').get(function() {
  return this.offeredByCount + this.wantedByCount;
});

// Static method to search skills
skillSchema.statics.searchSkills = function(query, category = null) {
  const searchQuery = { isActive: true };
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  if (category && category !== 'all') {
    searchQuery.category = category;
  }
  
  return this.find(searchQuery).sort({ popularity: -1, name: 1 });
};

// Static method to get popular skills
skillSchema.statics.getPopularSkills = function(limit = 20) {
  return this.find({ isActive: true })
    .sort({ popularity: -1, totalEngagement: -1 })
    .limit(limit);
};

// Static method to get skills by category
skillSchema.statics.getSkillsByCategory = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    { 
      $group: {
        _id: '$category',
        skills: { 
          $push: {
            _id: '$_id',
            name: '$name',
            popularity: '$popularity',
            offeredByCount: '$offeredByCount',
            wantedByCount: '$wantedByCount'
          }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Method to increment popularity
skillSchema.methods.incrementPopularity = function() {
  this.popularity += 1;
  return this.save();
};

// Method to update engagement counts
skillSchema.methods.updateEngagement = function(offered = 0, wanted = 0) {
  this.offeredByCount += offered;
  this.wantedByCount += wanted;
  return this.save();
};

// Pre-save middleware to format name
skillSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    // Capitalize first letter of each word
    this.name = this.name.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
  next();
});

module.exports = mongoose.model('Skill', skillSchema);