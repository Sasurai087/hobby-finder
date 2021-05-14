const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const Hobby = require('./models/hobby')

//Initialize mongoose
mongoose.connect('mongodb://localhost:27017/hobbyfinder', {
  useNewUrlParser: true, 
  useCreateIndex: true, 
  useUnifiedTopology: true
});

//Establish connection with MongoDB
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected!")
});

//Initialize Express
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//Routes
app.get('/', (req, res) => {
  res.render('home');
})

app.get('/posthobby', async (req, res) => {
  const hobby = new Hobby({title: 'FLGS'})
  await hobby.save();
  res.send(hobby);
})

app.listen(3000, () => {
  console.log('Serving on port 3000')
})