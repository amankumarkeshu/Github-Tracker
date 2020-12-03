var express = require("express"),
    app = express(),
    bodyParser = require("body-parser");
const fetch = require('node-fetch');
const convertor = require('json-2-csv');
const fs = require('fs');
var path = require('path');
const {exec} = require('child_process');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
var port = process.env.port || 3000;
  
app.get("/",  (req, res)=> {
    res.render("home.ejs");
});

app.get("/index", function(req, res){
    res.sendFile(path.join(__dirname, 'views/viewPage.html')); 

});

function commits(username,repo){
    const commitUrl = 'https://api.github.com/repos/'+username+'/'+repo+'/stats/commit_activity';
    (async () => {
        const response = await fetch(commitUrl);
        const json = await response.json();
        console.log(json);
        let commits=[];
        for( let obj = 0; obj <json.length;obj++){
            let object= {
                number:obj+1,
                total:json[obj].total,
                week:json[obj].week,
                days:json[obj].days
            }
            commits.push(object);
        }
        console.log("yes",commits);
        convertor.json2csv(commits, (err,csv) =>{
            if(err){
                console.log(err);
            }
            else{
                fs.writeFileSync('activity.csv',csv);
            }
        });
    })();
}

function additions(username,repo){
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
}


function deletions(username,repo){
    const url = 'https://api.github.com/repos/'+username+'/'+repo+'/stats/code_frequency';
    (async () => {
        const response = await fetch(url);
        const json = await response.json();
        let add=[];
        for( let obj = 0; obj <json.length;obj++){
            let object= {
                number:obj+1,
                week:json[obj][0],
                addition:json[obj][1]
            }
            add.push(object);
        }

        convertor.json2csv(add, (err,csv) =>{
            if(err){
                console.log(err);
            }
            else{
                fs.writeFileSync('additions.csv',csv);
            }
        });
    })();
}

app.post("/",  (req, res)=> {
    let username = req.body.username;
    let repo = req.body.repo;
    if(username==='' || repo==='') 
        res.render("home.ejs");

    commits(username,repo);
    additions(username,repo);
    deletions(username,repo);

    var yourscript = exec('Rscript myscript.r',(error,stdout,stderr) =>{
        console.log(stdout);
        console.log(stderr);
        if(error!==null){
            console.log(`exec error :${error}`);
        }
    });
    
    res.sendFile(path.join(__dirname, 'views/viewPage.html')); 
});


app.listen(port, ()=> {
    console.log("Server running at" ,port);
});
