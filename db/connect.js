const mongoose = require('mongoose');

const connectDB = (url) => {
    mongoose.set('strictQuery', true);
    return mongoose.connect(url, 
        { useNewUrlParser: true }, 
        { autoIndex: false },
        { useUnifiedTopology: true },
        { useFindAndModify: false},
        { useCreateIndex: true })
        .then(
        () => {
            console.log("DB connected");
        },
        (err) => {
            console.log(err);
        }
      );
}

module.exports = connectDB;