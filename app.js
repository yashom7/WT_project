var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
// var popup = require('popups');
const LocalStrategy = require('passport-local').Strategy;
const pg = require('pg');

const pool = new pg.Pool({
    user: 'Yashom',
    host: 'localhost',
    database: 'wtproject',
    password: 'yashom123',
    port: 5432,
})
pool.on('error', function (err) {
    console.log('idle client error', err.message, err.stack);
})

const postgresLocal = require('passport-local-postgres')(pool);
passport.use(new LocalStrategy(postgresLocal.localStrategy));
passport.serializeUser(postgresLocal.serializeUser);
passport.deserializeUser(postgresLocal.deserializeUser);
  
var app = express();

app.use(express.static("Public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: 'I hate this world',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());


// =============================================================================================================
// ROUTES
// =============================================================================================================


app.get("/", function (req, res) {
    res.render("landing");
});
// Show signup form
app.get("/join", function (req, res) {
    res.render("join")
})

// Handling signup
app.post("/join", function (req, res) {
    
    console.log(req.body);
    var type = req.body.type.toLowerCase();
    console.log(type)
    if (type === 'volunteer') {
        var currentDate = new Date();
        var query = {
            text: 'INSERT INTO volunteer (name, address, city, pincode, email, phone, doj, password, tc) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            values: [req.body.name, req.body.addr, req.body.city, Number(req.body.pincode), req.body.email, Number(req.body.phone), currentDate, req.body.passwd, 0 ]  
        }
        pool.query(query, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {

                console.log(res.rows[0])
            }
            pool.query('SELECT * FROM volunteer', (err, res) => {
                console.log(err, res)
            })
            res.redirect("/");
        });
        
        // var query = {
        //     text: 'SELECT email FROM volunteer WHERE email=$1',
        //     values: [req.body.email]
            
        // }
        // client.query(query, function (err, result) {
        //     if (result.rows[0]) {
        //         // popup.alert({
        //         //     content: "This email address is already registered!"
        //         // });
        //         res.redirect("/join");
        //     }
        //     else {
              
        //     }
        // })
    }
    else if (type === 'donor') {
        var query = {
            text: 'INSERT INTO donor (name, address, city, pincode, demail, phone, password, nod) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            values: [req.body.name, req.body.addr, req.body.city, Number(req.body.pincode), req.body.email, Number(req.body.phone), req.body.passwd, 0 ]  
        }
        pool.query(query, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {

                console.log(res.rows[0])
            }
            pool.query('SELECT * FROM volunteer', (err, res) => {
                console.log(err, res)
            })
            res.redirect("/");
        });
    }


})
  
//Handling Login

app.get("/user/donor", function (req, res) {
    res.render("User_donor")
})

app.listen(3000, function () {
    console.log("Agnel Angels' server started on port 3000");
});
