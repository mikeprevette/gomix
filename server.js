// server.js
// where your node app starts

// init project
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
var iftttId;
var baseURL = "https://maker.ifttt.com/trigger/";
var withKey = "/with/key/";
var moment = require('moment');
var day = moment().dayOfYear();
var year = moment().year();
var conditionsOutcome;

// setup a new database
var Datastore = require('nedb'), 
    // Security note: the database is saved to the file `datafile` on the local filesystem. It's deliberately placed in the `.data` directory
    // which doesn't get copied if someone remixes the project.
    db = new Datastore({ filename: '.data/datafile', autoload: true });

// parse application/json
app.use(bodyParser.json());

// Show the homepage
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('views'));

// Get the Id from IFTTT Maker URL
if(!process.env.IFTTT_MAKER_URL)
  console.log("You need to set your IFTTT Maker URL - copy the URL from https://ifttt.com/services/maker/settings into the .env file against 'IFTTT_MAKER_URL'");
else
  iftttId = process.env.IFTTT_MAKER_URL.split('https://maker.ifttt.com/use/')[1];

// Handle location requests from IFTTT
app.post("/home", function (request, response) {
  console.log("Request received from IFTTT: " + JSON.stringify(request.body));
  
  // Run the request against our conditions
  checkConditions()
    .then(function(){
      // Act on whether all conditions are met
      if(conditionsOutcome){ // CONDITIONS MET
        console.log("Conditions met");
        console.log("Triggering IFTTT services");
        for(var i=0; i<10; i++){
          checkForTrigger(i);
        }
        console.log("Done triggering.");
      } else { // CONDITIONS NOT MET
        console.log("Conditions not met");
      }
      response.end();
    });
});

// Handle sunset requests from IFTTT
app.post("/sunset", function (request, response) {
  console.log("Request received from IFTTT: " + JSON.stringify(request.body));
  
  // Store the request
  db.insert({ requestType: "sunset", requestBody: request.body, requestDay: day, requestYear: year }, function (err, requestAdded) {
    if(err) console.log("There's a problem with the database: ", err);
    else if(requestAdded) console.log("New request inserted to the database");
    response.end();
  });  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// Some logic to test the received request against. In this case - are we home after sunset?
function checkConditions(){
  return new Promise(function(resolving){
    var condition1=false; // Is it after sunset? Defaults to false, we will check to see if we've been told the sun has set today
    var condition2=true; // Are we near home? Defaults to true, if we're running this function then we've been told we are
    
    // Get all sunset requests stored today
    db.find({ requestType: "sunset", requestDay: day, requestYear: year }, function (err, todaysRequests) {
      if(todaysRequests && todaysRequests.length>0) // We've received at least one request today about sunset, so set true
        condition1=true;
 
      if(condition1 && condition2){ // Only if we're home AND it's past sunset do we set true
        conditionsOutcome=true;
        resolving();
      } else {
        conditionsOutcome=false;
        resolving();
      }
    });
  });
}

// Loops through each event and where it finds a value for it in .env it will make a request to IFTTT using it
function checkForTrigger(trigger){
  var triggerEvent;
  
  if(trigger===0)
    triggerEvent=process.env.IFTTT_EVENT_1;
  if(trigger===1)
    triggerEvent=process.env.IFTTT_EVENT_2;
  if(trigger===2)
    triggerEvent=process.env.IFTTT_EVENT_3;
  if(trigger===3)
    triggerEvent=process.env.IFTTT_EVENT_4;
  if(trigger===4)
    triggerEvent=process.env.IFTTT_EVENT_5;
  if(trigger===5)
    triggerEvent=process.env.IFTTT_EVENT_6;
  if(trigger===6)
    triggerEvent=process.env.IFTTT_EVENT_7;
  if(trigger===7)
    triggerEvent=process.env.IFTTT_EVENT_8;
  if(trigger===8)
    triggerEvent=process.env.IFTTT_EVENT_9;
  if(trigger===9)
    triggerEvent=process.env.IFTTT_EVENT_10;    

  if(triggerEvent){
    // Make a request to baseURL + triggerEvent + withKey + iftttId, which is the complete IFTTT Maker Request URL
    request(baseURL + triggerEvent + withKey + iftttId, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body); // Show the response from IFTTT
      }
    });
  }
}