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
  // this is fine, but eventually we should see what it returns when done. does it return the deleted document? might be useful down the road.
  // you can find out what it returns by doing (err, doc) in the callback function and console logging what doc is. 
  // my bet is it returns the deleted doc.
  Item.findByIdAndDelete(req.body._id, (err) => {
    if(err){
      return res.status(500).json({err});
    } else {
      return res.status(200).json({ msg: 'Item deleted' });
    }
  })
  
  // remove console logs after development.
  console.log(req.body);
});

// Get all items
app.get('/', async (req, res) => {
  // remove console logs after development
  console.log('A request was made')
  
  // these next two lines should be in a try catch and return an error response is an error is caught
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
          // should return an error response here if err exists.
          console.log(err);
        }
        // the return for the item updated should be here. might want to send back the returned item as well (not needed)
      })
    }
    return res.json({ msg: "Item updated" });
  })
  
});

// Post a new item
app.post('/', async (req, res) => {
  
  // this variable name is confusing a bit
  // you should either name it more semantically like 'data' or 'task', or destructure like 
  // let { content } = req.body
  let content = req.body;
  if(content && content !== ''){
    item = new Item({
      // if using destructure, it would just be content here, instead of content.content
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
