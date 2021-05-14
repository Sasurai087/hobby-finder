const mongoose = require('mongoose')
const cities = require('./cities')
const Hobby = require('../models/hobby');
const hobby = require('../models/hobby');

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

const seedDB = async() => {
  await Hobby.deleteMany({});
  // const h = new Hobby({ title: 'Brookhurst Hobbies'});
  // await h.save();

  for(let i=0; i < 50; i++){
    const random1000 = Math.floor(Math.random() * 1000);
    const hobby = new Hobby({
      location: `${cities[random1000].city}, ${cities[random1000].state}`
    })
    await hobby.save();
  }
}

seedDB();