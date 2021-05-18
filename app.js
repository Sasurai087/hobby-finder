const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {hobbiesSchema} = require('./schemas')
const catchAsync = require('./helpers/catchAsync');
const ExpressError = require('./helpers/expressError');
const methodOverride = require('method-override');
const Hobby = require('./models/hobby');
const Review = require('./models/review')

//#region Engine Related

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

//#endregion Engine Related

//Post Validation
const validateHobbies = (req, res, next) => {
  const {error} = hobbiesSchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
};

//Routes
app.get('/', (req, res) => {
  res.render('home');
})

app.get('/hobbies', catchAsync(async (req, res) => {
  const hobbies  = await Hobby.find({});
  res.render('hobbies/index', { hobbies });
}))

app.get('/hobbies/new', (req, res) => {
  res.render('hobbies/new')
})

app.post('/hobbies', validateHobbies, catchAsync(async (req, res, next) => {
    const hobbies = new Hobby(req.body.hobbies);
    await hobbies.save();
    res.redirect(`/hobbies/${hobbies._id}`)
}))

app.get('/hobbies/:id', catchAsync(async (req, res) => {
  const hobbies  = await Hobby.findById(req.params.id);
  res.render('hobbies/show', { hobbies })
}))

app.get('/hobbies/:id/edit', catchAsync(async (req, res) => {
  const hobbies  = await Hobby.findById(req.params.id);
  res.render('hobbies/edit', { hobbies })
}))

//DATA MANIPULATION ROUTES

app.put('/hobbies/:id', validateHobbies, catchAsync(async (req, res) => {
  const {id} = req.params;
  const hobbies = await Hobby.findByIdAndUpdate(id, {...req.body.hobbies});
  res.redirect(`/hobbies/${hobbies._id}`)
}))

app.delete('/hobbies/:id', catchAsync(async (req, res) => {
  const {id} = req.params;
  const hobbies = await Hobby.findByIdAndDelete(id, {...req.body.hobbies});
  res.redirect(`/hobbies`)
}))

app.post('/hobbies/:id/reviews', catchAsync(async (req, res) => {
  const hobby = await Hobby.findById(req.params.id);
  const review = new Review(req.body.review);
  hobby.reviews.push(review);
  await review.save();
  await hobby.save();
  res.redirect(`/hobbies/${hobby._id}`)
}))

//ERROR HANDLING
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
});

//Any errors passed via next() goes to the handler below 
app.use((err, req, res, next) => {
  const {statusCode = 500} = err;
  if(!err.message) err.message = "Oh no, something went wrong!"
  res.status(statusCode).render('error', {err})
})

//Server Port
app.listen(3000, () => {
  console.log('Serving on port 3000')
})