const express=require("express");
const app=express();
const bodyparser=require("body-parser");
const mongoclient=require("mongodb").MongoClient;


var db,s;

mongoclient.connect("mongodb://localhost:27017/Footwear",(err,database)=>{
    if(err) return console.log(error);
    db=database.db("Footwear");
    app.listen(3000,()=>{
        console.log("Listening at port number 3000");
    });
});

app.set("view-engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(express.static("public"));

app.get("/",(req,res)=>{
    db.collection("ladies").find().toArray((err,result)=>{
        if(err) return console.log(err);
        res.render("homepage.ejs",{data:result});
    });
});

app.get("/updatedata",(req,res)=>{
    res.render("update.ejs");
});

app.get("/adddata",(req,res)=>{
    res.render("add.ejs");
});

app.get("/deletedata",(req,res)=>{
    res.render("delete.ejs");
});

app.post('/add',(req,res)=>{
    db.collection("ladies").save(req.body,(err,result)=>{
        if(err) return console.log(err);
        res.redirect("/");
    });
});

app.post('/update',(req,res)=>{
    db.collection("ladies").find().toArray((err,result)=>{
        if(err) return console.log(err);
        for(var i=0;i<result.length;++i){
            if(parseInt(result[i].pid)==req.body.id){
                s=result[i].stock;
                break;
            }
        }
        var updated=parseInt(s)+parseInt(req.body.stock);
        db.collection("ladies").findOneAndUpdate({pid:req.body.id},{
            $set:{stock: updated.toString()}},{sort: {_id:-1}},
            (err,result)=>{
                if(err) return console.log(error);
                console.log(req.body.id+" stock updated");
                res.redirect("/");
        });
    });
});

app.post('/delete',(req,res)=>{
    db.collection("ladies").findOneAndDelete({pid:req.body.id},(err,result)=>{
        if(err) return console.log(error);
        res.redirect("/");
    });
});