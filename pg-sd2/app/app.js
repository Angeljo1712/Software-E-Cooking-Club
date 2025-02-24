// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

// Create a route for root - /
app.get("/", function(req, res) {
    res.send("Hello Angel!");
});


app.get("/roehampton", function(req, res) {
    console.log(req.url);
    let path = req.url;
    res.send(path.substring(0,3)); // Devuelve "/ro"
});



// Create a route for testing the db
/**app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
    sql = 'select * from test_table';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});**/


app.get("/db_test/:id", function(req, res) {
    let id = req.params.id;
    let sql = `SELECT name FROM users WHERE id = ?`; // Filtra por ID
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.send(`<h1>User: ${result[0].name}</h1>`);
    });
});








// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

app.get("/user/:id", function(req, res) {
    res.send("User ID: " + req.params.id);
});

/**app.get("/student/:name/:id", function(req, res) {
    res.send("Student: " + req.params.name + ", ID: " + req.params.id);
});**/


app.get("/student/:name/:id", function(req, res) {
    res.send(`
        <table border="1">
            <tr><th>Name</th><th>ID</th></tr>
            <tr><td>${req.params.name}</td><td>${req.params.id}</td></tr>
        </table>
    `);
});




// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/student/angel/5678`);
});

