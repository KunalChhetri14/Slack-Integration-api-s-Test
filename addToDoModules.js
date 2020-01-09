// var urlGlobal=require('./globalVariables');
// var MongoClientGlobal=require('./globalVariables');

const url ='mongodb+srv://Kunal:mongodb123@clustertutorialspoint-o34i7.mongodb.net/test?retryWrites=true&w=majority';
var MongoClient=require('mongodb').MongoClient;
const dbName='ToDoAppDatbase';
const toDoTableName='ToDoList';
// const toDoTableName='ToDoList';

    function insertTODO(channel_id,todo){
        return new Promise(function(resolve,reject){
            MongoClient.connect(url,function(err,db){
                if (err){
                    console.log("MongoDB not connected");
                    reject(err);
                }
                else{
                    var dbo=db.db(dbName);
                    dbo.collection(toDoTableName).insertOne({channel_id:channel_id,toDoItem:todo});
                    db.close();
                    console.log("Record inserted");
                    let addedTodo='Added TODO for '+'"'+todo+'"';
                    resolve(addedTodo);
                }
            })
        })
}

module.exports.getAddToDoResponse=function(channel_id,todo){
    return new Promise(function(resolve,reject){
        console.log("THE DETAILS ARE:  ",channel_id, "  ",todo);
        checkDuplicate(channel_id,todo)
                .then(function(data){
                    //console.log("data is ",data);
                    if(data.length>0){
                        console.log(" THERE IS DUPLICATE");
                        resolve("THE todolist with the same name already exist");
                    }
                    else{
                        console.log("No duplicates ..........");
                        insertTODO(channel_id,todo).then(function(data){
                            resolve(data);
                        }).catch(err=>{
                            reject("Server side Error");
                        })
                        
                        // let responsestr=await MongoClient.connect(url,function(err,db){
                        //     if (err){
                        //         console.log("MongoDB not connected");
                        //        return "Error while connecting to app";
                        //     }
                        //     else{
                        //         var dbo=db.db(dbName);
                        //         dbo.collection(toDoTableName).insertOne({channel_id:channel_id,toDoItem:todo});
                        //         db.close();
                        //         console.log("Record inserted");
                        //         let addedTodo='Added TODO for '+'"'+todo+'"';
                        //         return addedTodo;
                        //     }
                        // })
                    }
                }).catch(err=>{
                    reject("Database side error");
                });
    })



}


function checkDuplicate(channelId,todoText){
    return new Promise(function(resolve,reject){
        console.log("isnide check duplicate promise ur is ", url);
        MongoClient.connect(url,function(err,db){
            if (err){
                console.log("MongoDB not connected ");
                reject(err);
            }
            else{
                console.log("connected with : ")
                var dbo=db.db(dbName);
                dbo.collection(toDoTableName)
                .find({$and:[{channel_id:channelId},{toDoItem:todoText}]})
                .toArray(function(err,data){
                    if(data){
                        console.log(data);
                        resolve(data);
                        db.close();
                    }

                    else{
                        reject(err);
                        db.close();
                    }
                });
               
            }
            console.log("outse if else");
        })
    })
}


