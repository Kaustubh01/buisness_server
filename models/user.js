const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['owner', 'employee'],
    required: true,
  },
  businessRequests: [
    {
      businessId: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
        required: true,
      },
      businessName: {
        type: String,
        required: true,
      }
    }
  ],
  businessAssociated: [
        {
          businessId: {
            type: Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
          }
        }
    ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
