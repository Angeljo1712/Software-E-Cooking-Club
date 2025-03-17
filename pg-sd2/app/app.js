// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

//Create Port
const PORT = 3000;

// Get the functions in the db.js file to use
const db = require('./services/db');

app.set('view engine', 'pug');
app.set('views', './app/views');



// Create a route for root - /
app.get("/", function(req, res) {
    var test_data = ['one', 'two', 'three', 'four'];
    res.render("mypage", {'title': 'My index page', 'heading': 'My heading', 'data': test_data});
});

// Create a route for root - /
app.get("/", function(req, res) {
    var test_data = ['one', 'two', 'three', 'four'];
    res.render("index", {'title': 'My index page', 'heading': 'My heading', 'data': test_data});
});

// Create a route for /roehampton
app.get("/roehampton", function(req, res) {
    console.log(req.url);
    let path = req.url;
    res.send(path.substring(0,3)); // Devuelve "/ro"
});



// Create a route for Estudents no table
app.get('/students-table', async (req, res) => {
    try {
        const students = await db.query("SELECT * FROM Students");
        res.render('students-table', { students }); // Renderiza correctamente la vista
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Error fetching students" });
    }
});


//Show students in an HTML table
/*/app.get('/students-table', async (req, res) => {
    try {
        const students = await db.query("SELECT * FROM Students");
        console.log(students);
        let html = `<h1>Student List</h1><table border='1'><tr><th>ID</th><th>Name</th></tr>`;
        students.forEach(student => {
            html += `<tr><td>${student.id}</td><td><a href='/student/${student.id}'>${student.name}</a></td></tr>`;
        });
        html += "</table>";
        res.send(html);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).send("Error fetching students");
    }
});


app.get('/student/:id', async (req, res) => {
    try {
        const student = await db.query("SELECT * FROM Students WHERE id = ?", [req.params.id]);
        if (student.length === 0) {
            return res.status(404).send("Student not found");
        }

        let html = `<h1>${student[0].name}</h1>`;
        html += "<h2>Programme</h2>";

        const programme = await db.query(`
            SELECT Programmes.name 
            FROM Student_Programme 
            JOIN Programmes ON Student_Programme.programme = Programmes.id 
            WHERE Student_Programme.id = ?`, [req.params.id]);

        if (programme.length > 0) {
            html += `<p>${programme[0].name}</p>`;
        }

        res.send(html);
    } catch (error) {
        res.status(500).send("Error fetching student details");
    }
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
app.get("/sd2-db", function(req, res) {
    // Assumes a table called test_table exists in your database
    sql = 'select * from test_table';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});


/*/app.get("/db_test/:id", function(req, res) {
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



app.listen(PORT,  () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});



// Start server on port 3000
/**app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000`);
});**/