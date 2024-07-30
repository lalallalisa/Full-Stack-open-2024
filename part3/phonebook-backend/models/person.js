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


  const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const validatePhoneNumber = (number) => {
  const regex = /^[0-9]{2,3}-[0-9]{5,}$/;
  return regex.test(number);
};

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be at least 3 characters long'],
    required: true,
    unique: true
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: validatePhoneNumber,
      message: props => `${props.value} is not a valid phone number!`
    }
  }
});

personSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Person', personSchema);
