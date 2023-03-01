require('dotenv').config()

const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const morgan = require('morgan');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

//swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//routes req
const v1Route = require('./routes/v1Route')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//App proxy
app.set('trust proxy', 1);

//App security
app.use(
 rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
 })
 )
 app.use(helmet());
 app.use(xss());
 app.use(mongoSanitize());
 app.use(morgan('tiny'))
 app.use(express.json());

//Whitelist
var whiteList = ['http://localhost:3000']

//App header & origins
app.use(function(req, res, next) {
  const origin = req.headers.origin;
  if (whiteList.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers', 'Access-Control-Allow-Origin',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next()
})

//Route
app.use('/api/v1', v1Route)

//Server informations
const port = process.env.PORT
const start = async () => {
    try {
     await connectDB(process.env.MONGO_URI)
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error)
    }
  }; 
start()