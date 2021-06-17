const axios=require('axios');
require("dotenv").config()
var MongoClient=require('mongodb').MongoClient;
const mongodburl="mongodb+srv://kaps_dictionary_user1:"+process.env.MONGODB_PASSWORD+"@cluster0.3uorz.mongodb.net/Users?retryWrites=true&w=majority"

const Cors=require('cors');
const { response, request } = require('express');
const express= require('express');
const app=express();
const port= process.env.PORT || 8001
app.use(Cors())
app.get('/',(req,res)=>{
  console.log("The password is "+process.env.MONGODB_PASSWORD)
  res.send(process.env.MONGODB_PASSWORD)

});


/*=================================================================================
Getting word meaning
=================================================================================*/
app.get("/getwordmeaning/:word/:useremail",function(req,res){
    var worderrorflag=parseInt(0);
    var word=req.params.word;
    var url="https://api.dictionaryapi.dev/api/v2/entries/en/"+word
    console.log(word)
    console.log(req.params.useremail)
        /*=====================
        Find for word in mongodb
        =======================*/
        MongoClient.connect(mongodburl, function(err, db1) {
            if (err) throw err;
            var dbo1 = db1.db("words");
            /*Return only the documents with the address "Park Lane 38":*/
            var query = { word: req.params.word };
            dbo1.collection("words").find(query).toArray(function(err, result) {
              if (err) throw err;
              if(result.length!=0){
                  res.send(result[0])
                  addwordshistory(req.params.useremail,req.params.word)
              }
              
              if(result.length==0){
                axios.get(url).then(response=>{
                    var responsedata=response.data
                    var wordsearched=responsedata[0].word
                    var wordtext=responsedata[0].phonetics[0].text
                    var audiolink=responsedata[0].phonetics[0].audio
                    var meanings=responsedata[0].meanings
                    res.send({"word":wordsearched,"wordtext":wordtext,"audiolink":audiolink, "meanings":meanings});
                    MongoClient.connect(mongodburl, function(err, db) {
                        if (err) throw err;
                        var dbo = db.db("words");
                        var mywordslist = { "word":wordsearched,"wordtext":wordtext,"audiolink":audiolink, "meanings":meanings};
                        dbo.collection("words").insertOne(mywordslist, function(err, mongores) {
                          if (err) throw err;
                          db.close();
                        });
                      });
                      addwordshistory(req.params.useremail,req.params.word)
                }).catch(error =>{
                if(error.response.data.title=="No Definitions Found"){
                    res.send("Word not found")
                    worderrorflag=parseInt(1);
                }
            })
          }
        });
        db1.close();
    });        
})

/*================================================================================================================
Adding  user to database
=====================================================================================*/
app.get("/createuser/:useremail",(req,res)=>{
    MongoClient.connect(mongodburl, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Users");
        dbo.listCollections().toArray(function(err, collectionlist) {
            var useremailflag=parseInt(0)
            for(var i=0;i<collectionlist.length;i++){
                
                if(collectionlist[i].name==req.params.useremail){
                    useremailflag=parseInt(1)
                    break;

            }
            }
            if(useremailflag==0){
                MongoClient.connect(mongodburl, function(err, db1) {
                    if (err) throw err;
                    var dbo1 = db1.db("Users");
                    //Create a collection name "customers":
                    dbo1.createCollection(req.params.useremail, function(err, res) {
                      if (err) throw err;
                      db1.close();
                    });
                  });
                  res.send("User created "+req.params.useremail)
            }
        else{
            res.send(req.params.useremail+" User already in database")
        }
      });
      db.close();
    });
});
/*=====================================================================================
Get users searched words history
========================================================================================*/
app.get("/getwordhistory/:useremail",(req,res)=>{
    MongoClient.connect(mongodburl, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Users");
        dbo.collection(req.params.useremail).find({}).toArray(function(err, result) {
          if (err) throw err;
          res.send(result)
          db.close();
        });
      });
      
})

app.listen(port, ()=>console.log('listning on localhost: '+port))
/*===========================================================================
Adding words history to database
============================================================================*/
function addwordshistory(useremail,word){
    MongoClient.connect(mongodburl, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Users");
        var query = { word: word };
        dbo.collection(useremail).find(query).toArray(function(err, result) {
          if (err) throw err;
          if (result.length==0){
            MongoClient.connect(mongodburl, function(err, db1) {
                if (err) throw err;
                var dbo1 = db1.db("Users");
                var wordhistoryobj = {word: word };
                dbo1.collection(useremail).insertOne(wordhistoryobj, function(err, res) {
                  if (err) throw err;
                  db1.close();
                });
              });
          }
          db.close();
        });
      });
}