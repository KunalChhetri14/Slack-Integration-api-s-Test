var express=require('express');
const app=express();
var MongoClient=require('mongodb').MongoClient;
var cors=require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const url ='mongodb+srv://Kunal:mongodb123@clustertutorialspoint-o34i7.mongodb.net/test?retryWrites=true&w=majority';
const dbName='ToDoAppDatbase';
const toDoTableName='ToDoList';

function checkDuplicate(channelId,todoText){
    return new Promise(function(resolve,reject){
        MongoClient.connect(url,function(err,db){
            if (err){
                console.log("MongoDB not connected");
                reject(err);
            }
            else{
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
                    }
                });
               
            }
        })
    })
}


/// TO ADD THE todolist
app.post('/addtodo',(req,res)=>{
    console.log("Inside /addtodo api");
    //console.log(req.body)
    console.log(req.body['text']);
    
    MongoClient.connect(url,function(err,db){
        if(err){
            console.log('Database connection error');
            return res.send("Database side error");

        }
        else{
            console.log("connected");
            var dbo=db.db(dbName);
            let channel_id=req.body['channel_id'];
            let todo=req.body['text'];
            console.log("    ",channel_id,"   ",todo);
            checkDuplicate(channel_id,todo)
            .then(function(data){
                //console.log("data is ",data);
                if(data.length>0){
                    console.log(" THERE IS DUPLICATE");
                    return res.send("THE CURRENT todolist ALREADY EXISTS");
                }
                else{
                    MongoClient.connect(url,function(err,db){
                        if (err){
                            console.log("MongoDB not connected");
                           return res.send("Error while connecting to app")
                        }
                        else{
                            var dbo=db.db(dbName);
                            dbo.collection(toDoTableName).insertOne({channel_id:channel_id,toDoItem:todo});
                            db.close();
                            console.log("Record inserted");
                            return res.send("todolist added");
                        }
                    })
                }
            }).catch(err=>{
                return res.send("Database side error");
            });

           

            
        }
    })
    
        // res.send(k);

    
})


app.post('/marktodo',(req,res)=>{
    console.log("inside /marktodo api");
    res.send("todoDeleted");
})

app.post('/listtodos',(req,res)=>{
    console.log("inside /listtodos api");
    res.send("all todoList");
})

app.get('/',(req,res)=>{
    res.send("hellow defula");
})


app.listen(3000,()=>{
    console.log("Server Conected");
})
