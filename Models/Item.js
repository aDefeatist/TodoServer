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

// totally preference here, but i like to make the 'name' of the model capitalized.
module.exports = Item = mongoose.model('Item', ItemSchema);
