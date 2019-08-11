const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Models
const Item = require('./Models/Item');


const app = express();
app.use(bodyParser.json());
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
  Item.findByIdAndDelete(req.body._id, (err) => {
    if(err){
      return res.status(500).json({err});
    } else {
      return res.status(200).json({ msg: 'Item deleted' });
    }
  })
  console.log(req.body);
});

// Get all items
app.get('/', async (req, res) => {
  console.log('A request was made')
  let itemList = await Item.find();
  return res.json(itemList);
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
          console.log(err);
        }
      })
    }
    return res.json({ msg: "Item updated" });
  })
  
});

// Post a new item
app.post('/', async (req, res) => {
  let content = req.body;
  if(content && content !== ''){
    item = new Item({
      content: content.content
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