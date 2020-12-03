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

/* 
    Function to get user's commit history of the last year and 
    convert json data to csv format and save it in a file
*/
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

/* 
    Function to get user's number of lines added per week to the repository and
    convert json data to csv format and save it in a file
*/
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

/* 
    Function to get user's number of lines deleted per week to the repository and
    convert json data to csv format and save it
*/
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

    /* 
        Functions to fetch User Data and store them in a csv File
    */
    commits(username,repo);
    additions(username,repo);
    deletions(username,repo);

    /*
        Runs the Rscript command to fetch the csv data and plot the data in a bargraph and 
        save it in the PDF file Rplots.pdf
    */

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
