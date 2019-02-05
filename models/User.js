const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  bids: [
    {
      bidId: {
        type: Schema.Types.ObjectId,
        ref: 'Bid',
        required: true
      }
    }
  ],
  role: {
    type: String,
    required: false,
    default: 'user'
  }
});

module.exports = mongoose.model('User', userSchema);
