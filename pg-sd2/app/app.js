// Import dependencies
const express = require("express");
const path = require("path");
const db = require("./services/db"); // Import MySQL connection

// Import routes from controllers
const indexRoutes = require("./routes/index");
const usersRoutes = require("./routes/users");
const recipesRoutes = require("./routes/recipes");

const app = express();

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Get the functions in the db.js file to use
const db = require('./services/db');

// Create a route for root - /
app.get("/", function(req, res) {
    res.render("index");
});


// Task 1 JSON formatted listing of students
app.get("/all-students", function(req, res) {
    var sql = 'select * from Students';
    // As we are not inside an async function we cannot use await
    // So we use .then syntax to ensure that we wait until the 
    // promise returned by the async function is resolved before we proceed
    db.query(sql).then(results => {
        console.log(results);
        res.json(results);
    });

});

// Task 2 display a formatted list of students
app.get("/all-students-formatted", function(req, res) {
    var sql = 'select * from Students';
    db.query(sql).then(results => {
    	    // Send the results rows to the all-students template
    	    // The rows will be in a variable called data
        res.render('all-students', {data: results});
    });
});

// Single student page.  Show the students name, course and modules
app.get("/student-single/:id", async function (req, res) {
    var stId = req.params.id;
    console.log(stId);
    // Query to get the required results from the students table.  
    // We need this to get the programme code for this student.
    var stSql = "SELECT s.name as student, ps.name as programme, \
    ps.id as pcode from Students s \
    JOIN Student_Programme sp on sp.id = s.id \
    JOIN Programmes ps on ps.id = sp.programme \
    WHERE s.id = ?";

    var stResult = await db.query(stSql, [stId]);
    console.log(stResult);
    var pCode = stResult[0]['pcode'];
    
    // Get the modules for this student using the programme code from 
    // the query above
    var modSql = "SELECT * FROM Programme_Modules pm \
    JOIN Modules m on m.code = pm.module \
    WHERE programme = ?";

    var modResult = await db.query(modSql, [pCode]);
    console.log(modResult);

    // Send directly to the browser for now as a simple concatenation of strings
    res.send(JSON.stringify(stResult) + JSON.stringify(modResult));
    });



// JSON output of all programmes
app.get("/all-programmes", function(req, res) {
    var sql = 'select * from Programmes';
    // As we are not inside an async function we cannot use await
    // So we use .then syntax to ensure that we wait until the 
    // promise returned by the async function is resolved before we proceed
    db.query(sql).then(results => {
        console.log(results);
        res.json(results);
    });

});


app.get('/programmes', async (req, res) => {
    const programmes = await db.query("SELECT * FROM Programmes");
    res.json(programmes);
});

app.get('/programmes-table', async (req, res) => {
    const programmes = await db.query("SELECT * FROM Programmes");
    let html = `<h1>Programme List</h1><table border='1'><tr><th>ID</th><th>Name</th></tr>`;
    programmes.forEach(programme => {
        html += `<tr><td>${programme.id}</td><td><a href='/programme/${programme.id}'>${programme.name}</a></td></tr>`;
    });
    html += "</table>";
    res.send(html);
});











// Create a route for testing the db
app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
    var sql = 'select * from test_table';
    // As we are not inside an async function we cannot use await
    // So we use .then syntax to ensure that we wait until the 
    // promise returned by the async function is resolved before we proceed
    db.query(sql).then(results => {
        console.log(results);
        res.json(results)
    });
});

// Import routes from modules
app.use("/", indexRoutes);
app.use("/users", usersRoutes);
app.use("/recipes", recipesRoutes);
app.use("/static", express.static("static"));



// Middleware to handle not found routes
app.use((req, res) => {
    res.status(404).send("❌ Page not found.");
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://127.0.0.1:${PORT}/`);
});
