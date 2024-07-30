const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];


const url = `mongodb+srv://fullstack:${password}@fullstack.2eh01wr.mongodb.net/?retryWrites=true&w=majority&appName=fullstack`;

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // 确保程序在连接失败时退出
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person.find({})
    .then(result => {
      console.log('phonebook:');
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    })
    .catch(err => {
      console.error('Error fetching persons:', err.message);
      mongoose.connection.close(); // 确保在发生错误时关闭连接
    });
} else if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name,
    number,
  });

  person.save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`);
      mongoose.connection.close();
    })
    .catch(err => {
      console.error('Error saving person:', err.message);
      mongoose.connection.close(); // 确保在发生错误时关闭连接
    });
} else {
  console.log('Please provide the name and number as arguments: node mongo.js <password> <name> <number>');
  process.exit(1);
}
