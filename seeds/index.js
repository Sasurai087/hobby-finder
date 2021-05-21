const mongoose = require('mongoose')
const cities = require('./cities')
const {places, hobbies, descriptors} = require('./seedHelpers')
const Hobby = require('../models/hobby');

// Unsplash Hobby Collection = 'https://source.unsplash.com/collection/4959235/'

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
    const price = Math.floor(Math.random() * 20) + 10;
    const hobby = new Hobby({
      author: '60a4aa9e1f871149383ce3f8',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample([
        `${sample(hobbies)} ${sample(places)}`,
        `${sample(descriptors)} ${sample(hobbies)}s`,
        `${cities[random1000].city} ${sample(hobbies)}s`,
      ])}`,
      images: [
        {
          url: 'https://res.cloudinary.com/sasurai/image/upload/v1621622719/HobbyFinder/iqb6gx0oifgonhv8zj7t.jpg',
          filename: 'HobbyFinder/iqb6gx0oifgonhv8zj7t'
        },
        {
          url: 'https://res.cloudinary.com/sasurai/image/upload/v1621622718/HobbyFinder/vka881erekf3av750dzh.jpg',
          filename: 'HobbyFinder/vka881erekf3av750dzh'
        },
      ],
      description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga reprehenderit modi consectetur quidem alias tempora repudiandae natus mollitia quo vitae, sit rem perferendis ea dolore similique sunt iure tempore quibusdam!",
      price
    })
    await hobby.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});