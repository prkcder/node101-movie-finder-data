const express = require("express");
const morgan = require("morgan");
const axios = require("axios");
const app = express();

var cache = {};
app.use(morgan("dev"));
app.get("/", (req, res) => {
  //TAKES A QUERY
  let movieId = req.query.i;
  let movieT = req.query.t;
  let movie = {};

  //EVALUTES THE QUERY
  if(movieId) {
    movie = movieId;
  } else if (movieT) {
  	movie = movieT;   
  } else {
    return res.json("Error");
  }

  //SENDS THE QUERY TO OMDB
  if (cache[movie]) {
    res.json(cache[movie]);
  } else { 
    axios.get("http://www.omdbapi.com" + movie + "&apikey=8730e0e")
      .then(response => {
        console.log(response.data);
        res.json(response.data);
        cache[movie] = response.data;
    })
      .catch(error => {
        console.log(error);
        res.json("Error");
      });  
  }
});


// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter

module.exports = app;

// server module
// 1) GET /?i=tt3896198 responds with movie data
// 2) Second GET /?i=tt3896198 responds with movie data, without hitting OMDb
// 3) GET /?t=baby%20driver responds with movie data
// 4) Second GET /?t=baby%20driver responds with movie data, without hitting OMDb
// 5) Third GET /?t=baby%20driver responds with movie data, without hitting OMDb

// Server should log each request using morgan's dev format.
// Server should indicate when it is listening, and on which port.
// Server should respond to GET requests to /?i=tt3896198 with movie data.
// Server should respond to GET requests to /?i=tt3896198 with movie data without fetching from the OMDb api.
// Server should also respond to GET requests to /?t=baby%20driver with movie data.
// Server should also respond to GET requests to /?t=baby%20driver with movie data without fetching from the OMDb api.
// All tests should pass