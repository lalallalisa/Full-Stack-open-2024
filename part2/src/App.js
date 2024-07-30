import React, { useState, useEffect } from 'react';
import phonebookService from './services/phonebook';
import './index.css';

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={type}>
      {message}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState('notification');

  useEffect(() => {
    phonebookService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = event => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        phonebookService
          .update(existingPerson.id, personObject)
          .then(updatedPerson => {
            setPersons(persons.map(person => (person.id !== existingPerson.id ? person : updatedPerson)));
            setNewName('');
            setNewNumber('');
            setNotification(`Updated ${newName}'s number`);
            setNotificationType('notification');
            setTimeout(() => {
              setNotification(null);
            }, 5000);
          })
          .catch(error => {
            setNotification(`Information of ${newName} has already been removed from server`);
            setNotificationType('error');
            setTimeout(() => {
              setNotification(null);
            }, 5000);
            setPersons(persons.filter(p => p.id !== existingPerson.id));
          });
      }
    } else {
      phonebookService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setNotification(`Added ${newName}`);
          setNotificationType('notification');
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch(error => {
          setNotification(`Failed to add ${newName}`);
          setNotificationType('error');
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        });
    }
  };

  const deletePerson = id => {
    const person = persons.find(p => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      phonebookService.remove(id).then(() => {
        setPersons(persons.filter(p => p.id !== id));
        setNotification(`Deleted ${person.name}`);
        setNotificationType('notification');
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      })
      .catch(error => {
        setNotification(`Failed to delete ${person.name}`);
        setNotificationType('error');
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType} />
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
        </div>
        <button type="submit">add</button>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map(person =>
          <li key={person.id}>
            {person.name} {person.number} 
            <button onClick={() => deletePerson(person.id)}>delete</button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default App;
