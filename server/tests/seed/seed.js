const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const USER_ONE_ID = new ObjectID();
const USER_TWO_ID = new ObjectID();

const users = [{
  _id: USER_ONE_ID,
  email: 'flavio@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: USER_ONE_ID, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: USER_TWO_ID,
  email: 'johndoe@example.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: USER_TWO_ID, access: 'auth'}, 'abc123').toString()
  }]
}]

const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: USER_ONE_ID
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 123,
    _creator: USER_TWO_ID
  }
];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
}
