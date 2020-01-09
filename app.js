var express=require('express');
const app=express();
var MongoClient=require('mongodb').MongoClient;
var cors=require('cors');
const bodyParser = require('body-parser');
const PORT=process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const url ='mongodb+srv://Kunal:mongodb123@clustertutorialspoint-o34i7.mongodb.net/test?retryWrites=true&w=majority';
const dbName='ToDoAppDatbase';
const toDoTableName='ToDoList';

var addToDoHelper=require('./addToDoModules');


/// TO ADD THE todolist
app.post('/addtodo',(req,res)=>{
    console.log("Inside /addtodo api");
            let channel_id=req.body['channel_id'];
            let todo=req.body['text'];
            if(todo.length<3){
                res.send("TODO length should be atleast 3");
            }
            console.log("    ",channel_id,"   ",todo);
            let promise=addToDoHelper.getAddToDoResponse(channel_id,todo).then(function(data){
                return res.send(data);
            }).catch(err=>{
                res.send(err);
            });
            console.log("The value is " ,promise);    
        });
  
 
    






app.post('/marktodo',(req,res)=>{
    console.log("inside /marktodo api");
    let channelId=req.body['channel_id'];
    let todo=req.body['text'];
    console.log("  ",channelId,"   ",todo);
    MongoClient.connect(url,function(err,db){
        if(err){
            console.log('Database connection error');
            return res.send("Database side error");

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
                    res.send(notFound);
                }
                else{
                    db.close();
                    let toDeleteItem="Removed TODO for "+ '"'+todo+'"';
                    res.send(toDeleteItem);
                }
               
            }).catch(err=>{
                db.close();
                res.send("Error while deleting");
            });
        }

    });

    
})

app.post('/listtodos',(req,res)=>{
    console.log("inside /listtodos api");

    let channelId=req.body['channel_id'];
    // let todo=req.body['text'];
    console.log("  ",channelId);
    MongoClient.connect(url,function(err,db){
        if(err){
            console.log('Database connection error');
            return res.send("Database side error");

        }

        else{
            console.log("connected");
            var dbo=db.db(dbName);
            let k = dbo.collection(toDoTableName)
                    .find({'channel_id':channelId})
                    .toArray();
            // console.log('K value is', k);

            db.close();
            k.then(data => {
                ToDoItems=[];
               // console.log("Dataq is ",data);
                for(let value of data){
                    ToDoItems.push(value.toDoItem);
                    //value.toDoItem);
                }
                let len=ToDoItems.length;
                if(len==0){
                    return res.send("NO TODOs");
                }
                else{
                    let returnList="";
                    for(let i of ToDoItems){
                        returnList+='"'+i+'"   ';
                    }
                    return res.send(returnList);
                }
                
                })
            .catch(err => {
                    return res.send();
             });
            // res.send("all todoList");
            }
});
});


app.post('/edittodo',(req,res)=>{
    let channelId=req.body['channel_id'];
    let toDoItem=req.body['text'];
    PrevNewValue=toDoItem.split("/");
    let currentItem=PrevNewValue[0].trim();
    let newValue=PrevNewValue[1].trim();
    console.log("the currentItem is:",currentItem,":  new item is:",newValue,":::" );
    MongoClient.connect(url,function(err,db){
        if(err){
            console.log('Database connection error');
            return res.send("Database side error");

        }

        else{
            console.log("connected");
            var dbo=db.db(dbName);
            let k = dbo.collection(toDoTableName)
                    .updateOne({'channel_id':channelId,toDoItem:currentItem},
                    {$set:{toDoItem:newValue}});
                   
            // console.log('K value is', k);

            db.close();
            k.then(data => {
                if(data.result.nModified==1){
                    let editResponse="TODO changed to "+'"'+newValue+'"';
                    res.send(editResponse);
                }
                else{
                    let responseString="No TODO named "+'"'+currentItem+'"'+" exists.";
                    res.send(responseString);
                }
                // console.log(data);
            });

        }
});
});

app.get('/',(req,res)=>{
    res.send("hellow defula");
})


app.listen(PORT,()=>{
    console.log("Server Conected");
})
