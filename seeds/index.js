const mongoose = require('mongoose')
const cities = require('./cities')
const {places, hobbies, descriptors, images, authors} = require('./seedHelpers')
const Hobby = require('../models/hobby');
const faker = require('faker');

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
  await Hobby.deleteMany({});
  for(let i=0; i < 50; i++){
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 5) + 1;
    const randomDesc = faker.commerce.productDescription()
    const hobby = new Hobby({
      author: `${sample(authors)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample([
        `${sample(hobbies)} ${sample(places)}`,
        `${sample(descriptors)} ${sample(hobbies)}s`,
        `${cities[random1000].city} ${sample(hobbies)}s`,
      ])}`,
      geometry: {
        type: "Point",
        coordinates: [
            cities[random1000].longitude,
            cities[random1000].latitude,
        ]
    },
      images: [
        sample(images)
      ],
      description: randomDesc,
      price
    })
    await hobby.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});