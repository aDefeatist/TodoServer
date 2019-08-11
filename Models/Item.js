const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  completed: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    required: true
  },

});

module.exports = Item = mongoose.model('item', ItemSchema);