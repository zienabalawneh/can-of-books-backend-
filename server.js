'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// const jwt = require('jsonwebtoken');
// const jwksClient = require('jwks-rsa');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

mongoose.connect('mongodb://localhost:27017/books',
  { useNewUrlParser: true, useUnifiedTopology: true }); //deprecation warnings




//  create collections
//  create schema and model
// Schema: determines how the shape of our data will look like (blueprint)
const bookSchema = new mongoose.Schema({
  bookName: String,
  description: String,
  urlImg: String
});

const ownerSchema = new mongoose.Schema({
  ownerEmail: String,
  books: [bookSchema]
})

// build a model from our schema
// schema: drawing phase
// model: creation phase
const bookModel = mongoose.model('book', bookSchema);
const myOwnerModel = mongoose.model('owner', ownerSchema);



function seedOwnerCollection() {
  const zienab = new myOwnerModel({
    ownerEmail: 'yahyazainab204@gmail.com',
    books: [
      {
        bookName: 'Light',
        description: 'One of the most underrated prose writers demonstrates the literary firepower of science fiction at its best. Three narrative strands – spanning far-future space opera, contemporary unease and virtual-reality pastiche – are braided together for a breathtaking metaphysical voyage in pursuit of the mystery at the heart of reality.',
        urlImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJwwPWh_fnncXcnbYePfsLUTXEPpcVH8i0_A&usqp=CAU'
      },
      {
        bookName: 'Light1',
        description: '1One of the most underrated prose writers demonstrates the literary firepower of science fiction at its best. Three narrative strands – spanning far-future space opera, contemporary unease and virtual-reality pastiche – are braided together for a breathtaking metaphysical voyage in pursuit of the mystery at the heart of reality.',
        urlImg: '2https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJwwPWh_fnncXcnbYePfsLUTXEPpcVH8i0_A&usqp=CAU'
      }
    ]
  })

  zienab.save();
}


//  seedOwnerCollection();

//http://localhost:3050/books?email=yahyazainab204@gmail.com
app.get('/books', getBooksHandler);
app.post('/addBooks', addBooksHandler);
app.delete('/deleteBooks/:index', deleteBooksHandler);

function getBooksHandler(req, res) {
  let { email } = req.query;
  // let {name} = req.query
  myOwnerModel.find({ ownerEmail: email }, function (err, ownerData) {
    if (err) {
      console.log('did not work')
    } else {
      console.log(ownerData)
      // console.log(ownerData[0])
      // console.log(ownerData[0].books)
      res.send(ownerData[0].books)
    }
  })
}



// app.get('/test', (request, response) => {



// })


function addBooksHandler(req, res) {
  console.log(req.body);
  const { bookName, description, urlImg, ownerEmail } = req.body;
  // console.log(bookName);
  // console.log(bookDescription);
  // console.log(bookUrlImg);

  myOwnerModel.find({ ownerEmail: ownerEmail }, (error, ownerData) => {
    if (error) { res.send('not working') }
    else {
      console.log('before pushing', ownerData[0])
      ownerData[0].books.push({
        bookName: bookName,
        description: description,
        urlImg: urlImg,

      })
      console.log('after pushing', ownerData[0])
      ownerData[0].save();

      res.send(ownerData[0].books);

    }

  })
}


//localhost:3001/deletebook/:2?name=razan
function deleteBooksHandler(req, res) {
  console.log(req.params);
  let { email } = req.query;
  const index = Number(req.params.index);

  myOwnerModel.find({ ownerName: email }, (error, ownerData) => {
    // filter the books for the owner and remove the one that matches the index
    const newBooksArr = ownerData[0].books.filter((book, idx) => {
      if (idx !== index) return book;
      // return idx !==index
    })
    ownerData[0].books = newBooksArr;
    ownerData[0].save();
    res.send(ownerData[0].books)
  })

}


app.listen(PORT, () => console.log(`listening on ${PORT}`));
