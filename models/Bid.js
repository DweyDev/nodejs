const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bidSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  bidAmount: {
    type: Number,
    required: true
  },
  charity: {
    type: Schema.Types.ObjectId,
    ref: 'Charity',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  // Status of bid : 1 = open bid   0 = closed bid
  status: {
    type: Boolean,
    default: 1
  }
});
module.exports = mongoose.model('Bid', bidSchema);
