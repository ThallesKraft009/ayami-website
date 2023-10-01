module.exports = async(client) => {

const fs = require("fs");
const marked = require('marked');
const config = require("./config.js");
const path = require('path');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const express = require("express");
const { join } = require("path");
const app = express();
const { request } = require('undici');
const { URLSearchParams } = require("url");
const ejs = require('ejs');
const { blue, green } = require("colors")
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const DisocrdStrategy = require("passport-discord").Strategy
const passport = require("passport");
const fetch = require("node-fetch");
const bodyParser = require('body-parser')
require('dotenv').config()
const morgan = require('morgan')


passport.use(

  new DisocrdStrategy({
    clientID: config.id,
    clientSecret: config.secret,
    callbackURL: 'https://testes-website.thalleskraft.repl.co/callback',
    scope: ['identify']
  },
                     
                     
          
 function (acessToken, refreshToken, profile, done){
  process.nextTick(function() {
    return done(null, profile);
     });
 } )
  )

app.use(session({
  store: new MemoryStore({checkPeriod:86400000}),
  secret: `thalleskraft`,
  resave: false,
  saveUninotialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(obj, done){
  done(null, obj);
});


app.use(express.static(path.join(__dirname, 'views')));
app.set('views', path.join(__dirname, "views"));
app.set('view engine','ejs');
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/login', async(req, res, next) => {

  next();
}, passport.authenticate("discord")
       
)

app.get("/deslogar", (req, res) => {
  req.session.destrory(() => {
    
  })
})
  
app.get("/callback", passport.authenticate("discord", {failureRedirect: "/"}), function(req, res){

  res.redirect("/");
  
})


app.get("/", async function(req, res){
 // if (!req.user) return res.redirect("/login")

  res.render("pages/menu")
})
  

app.get("/api/comandos/economia", function(req, res){

  let data = require("./json/commands/economia.json")

  res.json(data)
})
  app.get("/inventario", async function(req, res){

    if (!req.user) return res.redirect("/login")

    res.render("pages/inventario", {
     client: client,
     req,
      user: client.users.cache.get(`${req.user.id}`)
    })

      })
  app.listen(process.env.PORT, async() => {
    console.log("Website logado.")
  })

  }