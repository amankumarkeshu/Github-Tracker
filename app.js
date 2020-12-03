var express = require("express"),
    app = express(),
    bodyParser = require("body-parser");
const fetch = require('node-fetch');
const convertor = require('json-2-csv');
const fs = require('fs');
const {exec} = require('child_process');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
var port = process.env.port || 3000;

app.get("/",  (req, res)=> {
    res.render("home");
});

let globalUsername='';
let globalRepo='';

app.get("/commits",(req,res)=>{
    let username = globalUsername;
    let repo = globalRepo;
    if(username==='' || repo==='') 
        res.render("home");
    const url = 'https://api.github.com/repos/'+username+'/'+repo+'/stats/commit_activity';
    (async () => {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json);
        let arr=[];
        for( let obj = 0; obj <json.length;obj++){
            let object= {
                number:obj+1,
                total:json[obj].total,
                week:json[obj].week,
                days:json[obj].days
            }
            arr.push(object);
        }
        console.log("yes",arr);
        convertor.json2csv(arr, (err,csv) =>{
            if(err){
                console.log(err);
            }
            else{
                fs.writeFileSync('activity.csv',csv);
            }
        });
        var yourscript = exec('Rscript myscript.r',(error,stdout,stderr) =>{
            console.log(stdout);
            console.log(stderr);
            if(error!==null){
                console.log(`exec error :${error}`);
            }
        });

    })();
    res.render("viewPage");
});


app.get("/addition",(req,res)=>{
    let username = globalUsername;
    let repo = globalRepo;
    if(username==='' || repo==='') 
        res.render("home");
    const url = 'https://api.github.com/repos/'+username+'/'+repo+'/stats/code_frequency';
    (async () => {
        const response = await fetch(url);
        const json = await response.json();
        let arr=[];
        for( let obj = 0; obj <json.length;obj++){
            let object= {
                number:obj+1,
                week:json[obj][0],
                addition:json[obj][1]
            }
            arr.push(object);
        }
        console.log("yes",arr);
        convertor.json2csv(arr, (err,csv) =>{
            if(err){
                console.log(err);
            }
            else{
                fs.writeFileSync('additions.csv',csv);
            }
        })

    })();
    res.render("viewPage");
});


app.get("/deletion",(req,res)=>{
    let username = globalUsername;
    let repo = globalRepo;
    if(username==='' || repo==='') 
        res.render("home");
    const url = 'https://api.github.com/repos/'+username+'/'+repo+'/stats/code_frequency';
    (async () => {
        const response = await fetch(url);
        const json = await response.json();
        let arr=[];
        for( let obj = 0; obj <json.length;obj++){
            let object= {
                number:obj+1,
                week:json[obj][0],
                deletion:json[obj][2]
            }
            arr.push(object);
        }

        convertor.json2csv(arr, (err,csv) =>{
            if(err){
                console.log(err);
            }
            else{
                fs.writeFileSync('deletions.csv',csv);
            }
        })

    })();
    res.render("viewPage");
});


app.post("/",  (req, res)=> {
    globalUsername = req.body.username;
    globalRepo = req.body.repo;
    if(globalUsername==='' || globalRepo==='') 
        res.render("home");
    res.render("viewPage");
});



app.listen(port, ()=> {
    console.log("Server running at" ,port);
});
