require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')
// const port = 5002;

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

const data = {
  content: "Hi there! I'm Walid Al-Eisawi, a 20-year-old junior at NYU Abu Dhabi currently studying computer engineering. I'm taking a year to study away in New York, which has been an incredible experience so far. Born in Texas, I've spent most of my life in Abu Dhabi, embracing the diverse cultural influences around me. Interestingly, I'm the only ginger in my family – a little fun fact that always sparks conversations! \n\nBeyond my academic pursuits, I'm passionate about fitness. Whether it's hitting the gym for some strength training, going for a walk, or playing soccer, staying active is a vital part of my routine. I find joy in the camaraderie of team sports and the discipline of individual workouts. \n\nAlthough my roots lie in Texas and Abu Dhabi, I hold a deep connection to my Palestinian heritage. I'm in love with Palestinian culture, especially the rich tapestry of food that holds a special place in my heart. Exploring the diverse flavors and dishes has become a delightful journey for me. \n\nWhen I'm not immersed in my studies or fitness routine, you can often find me delving into the outdoors. I have a genuine appreciation for nature, and spending time outside is my way of unwinding. Alongside my love for the outdoors, I enjoy learning new things. Whether it's diving into the complexities of computer engineering or watching random YouTube videos about how things work, I'm always eager to expand my knowledge and understanding of the world around me.",
image: "https://i.ibb.co/PrghQkn/IMG-7906.jpg",
};

// a route to handle getting about-us data
app.get('/about_us', (req, res) => {
  res.json(data);
});

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
