const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require("mysql"); 
const { application } = require('express');
const cookies = require("cookie-parser");

const server = express();
server.set('view engine', 'ejs');
server.use(express.static('public'));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookies());

var con = mysql.createConnection({
  host: "localhost",
  port: '3306',
  user: "root",
  password: "YearSome61"
});

let sessions = [];

server.get("/", function(req, res){
  if (req.cookies.user !== undefined){
    res.redirect("/products")
  } else {
    res.render('login', {message: ''});
  };
});
// Query 1: 
server.post("/", function(req, res){
  if (req.cookies["user"] == undefined){
    con.connect(function(err) {
      if (err) console.log(err);
      con.query("select * from onlineshopping.customer where username='"+req.body.email+"'", function (err, result, fields) {
        if (err) console.log(err);
        if (result.length == 1){
          if (result[0].userpassword == req.body.password){
            res.cookie("user", sessions.length);
            sessions.push({name: result[0].customername, address: result[0].address, phone: result[0].userphone, username: result[0].username});
            res.redirect("/products")
          } else {
            res.render("login", {message: "Password doesn't match!"});
          };
        } else {
          res.render("login", {message: 'User not found!'});
        };
      });
    });
  } else {
    res.redirect("/products");
  };
});
// Query 2: 
server.get("/products", function(req, res){
  if (req.cookies["user"] === undefined){
    res.redirect("/");
  } else {
    con.connect(function(err) {
      if (err) console.log(err);
      con.query("select * from onlineshopping.products", function (err, result, fields) {
        if (err) console.log(err);
        res.render("product", {products: result});
      });
    });
  };
});

// Query 4: 
server.get("/payments", function(req, res){
  con.connect(function(err){
    if (err) console.log(err);
    con.query("select * from onlineshopping.payments", function (err, result, fields) {
      if (err) console.log(err);
      res.send(result[0]);
    });
  });
});

server.get("/register", function(req, res){
  res.render('register');
});

server.get("/employees", function(req, res){
  if (req.cookies.user !== undefined){
    res.redirect("/products");
  } else {
    if (req.cookies.employee === undefined){
      res.render('employees', {message: ''});
    } else {
      res.send("Welcome Employee");
    };
  };
});
//Query 3: 
server.post("/employees", function(req, res){
  if (req.cookies.user !== undefined){
    res.redirect("/products");
  } else {
    if (req.cookies.employee === undefined){
      con.connect(function(err) {
        if (err) console.log(err);
        con.query("select * from onlineshopping.employees where username='"+req.body.email+"'", function (err, result, fields) {
          if (err) console.log(err);
          if (result.length == 1){
            if (result[0].password == req.body.password){
              res.cookie("employee", sessions.length);
              sessions.push({username: result[0].username, name: result[0].name});
              res.send("Welcome Employee!")
            } else {
              res.render("employees", {message: "Password doesn't match!"});
            };
          } else {
            res.render("employees", {message: 'User not found!'});
          };
        });
      });
    } else {
      res.send("Welcome Employee");
    };
  };
});

server.get("/employees/dashboard", function(req, res){
  res.send("Hello fellow employee!");
});

let port = 3000;

server.listen(port, () => {
  console.log('Server started at port ' + port);
});