const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Models
const Item = require('./Models/Item');


const app = express();
app.use(bodyParser.json());

// should move this to a .env file eventually, but its fine since local. move to mlab when ready and .env the url. 
// good library to get .env files required in is https://www.npmjs.com/package/dotenv
const url = `mongodb://localhost:27017/TodoDB`;  //db url

app.use(cors());

mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: false }, function(err, db) {
  if (err) { console.log(err) }
  else {
    console.log('connected to database...')
  }
})

// Delete an item
app.delete('/', async (req, res) => {
  Item.findByIdAndDelete(req.body._id, (err, doc) => {
    if(err){
      return res.status(500).json({err});
    } else {
      return res.status(200).json({doc});
    }
  })
});

// Get all items
app.get('/', async (req, res) => {
  Item.find()
    .then(item => {return res.json(item)})
    .catch(err => {res.status(400).json({err})})
});

// Edit an item
app.put('/', async (req, res) => {
  Item.findById({ _id: req.body._id }, (err, doc) =>{
    if (err) {
      console.log(err);
    } else {
      doc.completed = !doc.completed;
      doc.save((err, doc) => {
        if(err){
          return res.status(400).json({err})
        }
        return res.json({doc})
      })
    }
  })
});

// Post a new item
app.post('/', async (req, res) => {
  let { content } = req.body;
  if(content && content !== ''){
    item = new Item({
      content: content
    })
    await item.save()
    .then(savedItem => {
      return res.json(savedItem);
    })
    .catch(err => {
      console.log(err)
      return res.status(500).json({ error: err });
    })
  };
});

// Server
PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
