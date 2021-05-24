if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo')
const flash = require('connect-flash');
const ExpressError = require('./helpers/expressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

//Route Imports
const userRoutes = require('./routes/users')
const hobbiesRoutes = require('./routes/hobbies')
const reviewsRoutes = require('./routes/reviews');

const dbUrl = 'mongodb://localhost:27017/hobbyfinder';

//#region Engine Related
// Local Host: 'mongodb://localhost:27017/hobbyfinder'

//Initialize mongoose
mongoose.connect(dbUrl, {
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
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({replaceWith: '_'}))

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: 'chocolateber'
  },
  touchAfter: 24 * 60 * 60,
})

store.on("error", function(e) {
  console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
  store,
  name: 'instance',
  secret: 'chocolateber',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));

//#region Helmet config
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com",
  "https://api.tiles.mapbox.com",
  "https://api.mapbox.com",
  "https://kit.fontawesome.com",
  "https://cdnjs.cloudflare.com",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com",
  "https://stackpath.bootstrapcdn.com",
  "https://api.mapbox.com",
  "https://api.tiles.mapbox.com",
  "https://fonts.googleapis.com",
  "https://use.fontawesome.com",
  "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
  "https://api.mapbox.com",
  "https://*.tiles.mapbox.com",
  "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          childSrc: ["blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`, 
              "https://images.unsplash.com",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);
//#endregion Helmet Config

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());     //How to store user
passport.deserializeUser(User.deserializeUser()); //How to unstore user
app.use(flash());
app.use(helmet({contentSecurityPolicy: false}));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

//#endregion Engine Related

//Routes
app.use('/', userRoutes)
app.use('/hobbies', hobbiesRoutes)
app.use('/hobbies/:id/reviews', reviewsRoutes)

app.get('/', (req, res) => {
  res.render('home');
})

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
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`)
})