require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser'); // enable response with json
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

const PORT = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get('/todos', (req, res) => {

  Todo.find().then((todos) => {
    res.send({ todos });
  }, (e) => {
    res.status(400).send(e);
  });

});

app.get('/todos/:id', (req, res) => {
  var { id } = req.params;
  console.log(id);
  // Valid id using isValid
  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  } else {
    Todo.findById(id).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      } else {
        return res.send({ todo });
      }

    }, (e) => {
      return res.status(400).send();
    })
  }
});

app.delete('/todos/:id', (req, res) => {
  var { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  } else {
    Todo.findByIdAndRemove(id).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });

    }).catch((e) => {
      res.status(400).send();
    });
  }
});

app.patch('/todos/:id', (req, res) => {
  let { id } = req.params;
  let body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({ todo });
  }).catch((e) => {
    res.status(400).send();
  });

});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = {
  app
};
