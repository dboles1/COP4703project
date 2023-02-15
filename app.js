const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser')

const server = express();
server.set('view engine', 'ejs');
server.use(express.static('public'));
server.use(bodyParser.urlencoded({ extended: false }))

let products = [
  {name: 'Iphone', price: 1200},
  {name: 'Logitech Mouse', price: 50},
  {name: 'Asus Laptop', price: 1500}
]

let users = [
  {email: 'boles@gmail.com', password: 'qwerty'}
]

server.get("/", function(req, res){
  res.render('login');
})

server.post("/", function(req, res){
  let user = {email: req.body.email, password: req.body.password};
  for (i in users){
    if (JSON.stringify(users[i]) == JSON.stringify(user)){
      res.redirect("/products")
    } else {
      res.redirect('/')
    }
  }
});

server.get("/products", function(req, res){
  res.send(products);
})

server.get("/register", function(req, res){
  res.render('register')
})

server.listen(3000, () => {
  console.log('server started')
})