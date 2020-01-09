const url =
  'mongodb+srv://Kunal:mongodb123@clustertutorialspoint-o34i7.mongodb.net/test?retryWrites=true&w=majority';
var MongoClient = require('mongodb').MongoClient;
const dbName = 'ToDoAppDatbase';
const toDoTableName = 'ToDoList';

module.exports.editToDoResponse = function(channelId, currentItem, newValue) {
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
          .updateOne(
            { channel_id: channelId, toDoItem: currentItem },
            { $set: { toDoItem: newValue } }
          );

        db.close();
        k.then(data => {
          console.log(data);
          if (data.result.nModified == 1) {
            let editResponse = 'TODO changed to ' + '"' + newValue + '"';
            console.log('Inside deleted section');
            resolve(editResponse);
          } else {
            let responseString =
              'No TODO named ' + '"' + currentItem + '"' + ' exists.';
            resolve(responseString);
          }
        }).catch(err => {
          console.log(err);
          console.log('SERVER SIDE ERRORO');
          reject('Server Side error');
        });
      }
    });
  });
};
