const mongoose = require('mongoose');
const password = 'Zl937261067'
const url = `mongodb+srv://fullstack:${password}@fullstack.2eh01wr.mongodb.net/?retryWrites=true&w=majority&appName=fullstack`;

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);
