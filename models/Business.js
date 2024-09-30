const mongoose = require('mongoose');
const { Schema } = mongoose;

const businessSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  employees: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  pendingRequests: [{
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
