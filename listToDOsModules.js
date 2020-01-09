const url =
  'mongodb+srv://Kunal:mongodb123@clustertutorialspoint-o34i7.mongodb.net/test?retryWrites=true&w=majority';
var MongoClient = require('mongodb').MongoClient;
const dbName = 'ToDoAppDatbase';
const toDoTableName = 'ToDoList';

module.exports.listToDoResponse = function(channelId) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(url, function(err, db) {
      if (err) {
        console.log('Database connection error');
        reject('Database side error');
      } else {
        console.log('connected');
        var dbo = db.db(dbName);
        let k = dbo
          .collection(toDoTableName)
          .find({ channel_id: channelId })
          .toArray();
        // console.log('K value is', k);

        db.close();
        k.then(data => {
          ToDoItems = [];
          // console.log("Dataq is ",data);
          for (let value of data) {
            ToDoItems.push(value.toDoItem);
            //value.toDoItem);
          }
          let len = ToDoItems.length;
          if (len == 0) {
            resolve('NO TODOs');
          } else {
            let returnList = '';
            for (let i of ToDoItems) {
              returnList += '"' + i + '"   ';
            }
            resolve(returnList);
          }
        }).catch(err => {
          reject('Error in Server side ');
        });
      }
    });
  });
};
