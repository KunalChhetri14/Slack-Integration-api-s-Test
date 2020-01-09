const url ='mongodb+srv://Kunal:mongodb123@clustertutorialspoint-o34i7.mongodb.net/test?retryWrites=true&w=majority';
var MongoClient=require('mongodb').MongoClient;
const dbName='ToDoAppDatbase';
const toDoTableName='ToDoList';

module.exports.deleteToDoResponse=function(channelId,todo){
    return new Promise(function(resolve,reject){

        MongoClient.connect(url,function(err,db){
            if(err){
                console.log('Database connection error');
                resolve("Database side error");
    
            }
    
            else{
                console.log("connected");
                var dbo=db.db(dbName);
                let k=dbo.collection(toDoTableName).findOneAndDelete({$and:[{toDoItem:todo},{channel_id:channelId}]});
                k.then(data=>{
                    console.log(data.value);
                    if(data.lastErrorObject.n!=1){
                        let notFound="TODO "+'"'+todo+'"'+" not found";
                        db.close();
                       resolve(notFound);
                    }
                    else{
                        db.close();
                        let toDeleteItem="Removed TODO for "+ '"'+todo+'"';
                        resolve(toDeleteItem);
                    }
                   
                }).catch(err=>{
                    db.close();
                    reject("Error while deleting");
                });
            }
    
        });

    })
}