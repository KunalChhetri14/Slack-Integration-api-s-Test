var express = require('express');
const app = express();
var MongoClient = require('mongodb').MongoClient;
var cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const url =
  'mongodb+srv://Kunal:mongodb123@clustertutorialspoint-o34i7.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'ToDoAppDatbase';
const toDoTableName = 'ToDoList';

var addToDoHelper = require('./addToDoModules');
var deleteToDoHelper = require('./markToDoModules');
var listToDoHelper = require('./listToDOsModules');
var editToDoHelper = require('./editToDoModules');

/// TO ADD THE todolist
app.post('/addtodo', (req, res) => {
  console.log('Inside /addtodo api');
  let channel_id = req.body['channel_id'];
  let todo = req.body['text'];
  if (todo.length < 3) {
    return res.send('TODO length should be atleast 3');
  }
  console.log('    ', channel_id, '   ', todo);
  let promise = addToDoHelper
    .getAddToDoResponse(channel_id, todo)
    .then(function(data) {
      return res.send(data);
    })
    .catch(err => {
      res.send(err);
    });
});

//For Deletion of TODO
app.post('/marktodo', (req, res) => {
  console.log('inside /marktodo api');
  let channelId = req.body['channel_id'];
  let todo = req.body['text'];
  console.log('  ', channelId, '   ', todo);
  deleteToDoHelper
    .deleteToDoResponse(channelId, todo)
    .then(function(data) {
      return res.send(data);
    })
    .catch(err => {
      return res.send(err);
    });
});

//For Listing all TODO
app.post('/listtodos', (req, res) => {
  console.log('inside /listtodos api');

  let channelId = req.body['channel_id'];
  // let todo=req.body['text'];
  console.log('  ', channelId);
  listToDoHelper
    .listToDoResponse(channelId)
    .then(function(data) {
      return res.send(data);
    })
    .catch(err => {
      return res.send(err);
    });
});

//For editing TODO's
app.post('/edittodo', (req, res) => {
  let channelId = req.body['channel_id'];
  let toDoItem = req.body['text'];
  PrevNewValue = toDoItem.split('/');
  if (PrevNewValue.length != 2) {
    return res.send("Command format isn't valid");
  }
  let currentItem = PrevNewValue[0].trim();
  let newValue = PrevNewValue[1].trim();
  editToDoHelper
    .editToDoResponse(channelId, currentItem, newValue)
    .then(function(data) {
      return res.send(data);
    })
    .catch(err => {
      return res.send(err);
    });
});

app.get('/', (req, res) => {
  res.send('hellow defula');
});

app.listen(PORT, () => {
  console.log('Server Conected');
});
