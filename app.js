const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Hobby = require('./models/hobby');

//Initialize mongoose
mongoose.connect('mongodb://localhost:27017/hobbyfinder', {
  useNewUrlParser: true, 
  useFindAndModify: false,
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
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//Routes
app.get('/', (req, res) => {
  res.render('home');
})

app.get('/hobbies', async (req, res) => {
  const hobbies  = await Hobby.find({});
  res.render('hobbies/index', { hobbies });
})

app.get('/hobbies/new', async (req, res) => {
  res.render('hobbies/new')
})

app.post('/hobbies', async (req, res) => {
  const hobbies = new Hobby(req.body.hobbies);
  await hobbies.save();
  res.redirect(`/hobbies/${hobbies._id}`)
})

app.get('/hobbies/:id', async (req, res) => {
  const hobbies  = await Hobby.findById(req.params.id);
  res.render('hobbies/show', { hobbies })
})

app.get('/hobbies/:id/edit', async (req, res) => {
  const hobbies  = await Hobby.findById(req.params.id);
  res.render('hobbies/edit', { hobbies })
})

app.put('/hobbies/:id', async (req, res) => {
  const {id} = req.params;
  const hobbies = await Hobby.findByIdAndUpdate(id, {...req.body.hobbies});
  res.redirect(`/hobbies/${hobbies._id}`)
})

app.delete('/hobbies/:id', async (req, res) => {
  const {id} = req.params;
  const hobbies = await Hobby.findByIdAndDelete(id, {...req.body.hobbies});
  res.redirect(`/hobbies`)
})

//Server Port
app.listen(3000, () => {
  console.log('Serving on port 3000')
})