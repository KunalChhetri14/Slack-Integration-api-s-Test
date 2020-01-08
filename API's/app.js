var express=require('express');
const app=express();

app.post('/addtodo',(req,res)=>{
    console.log("Inside /addtodo api");
    res.send("This is cool")
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
