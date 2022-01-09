/* issues:::

-implement currency
-implement transactions


*/

//consts//
const loginPage = "http://localhost:3000/login"

// base
const express = require("express");
const bodyParser = require("body-parser");

// database
const mysql = require("mysql");

// authentication and security
//sessions
const session = require('express-session');
const cookieParser = require("cookie-parser");
const cors = require("cors"); // i dont think I use this

const bcrypt = require('bcrypt-nodejs'); // not used
const env = require('dotenv');
const md5 = require("md5");
const { render } = require("ejs");
const { query } = require("express");

//express setup
const app = express();
app.use(express.json()); // I dont know if i use this
app.use(express.static('public')); // send css and other static files

app.set('view engine', 'ejs'); //use ejs

app.use(cors({
  origin: ["http://localhost:3000/login"],
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(cookieParser());

//bodyparser setup
app.use(bodyParser.urlencoded({extended: true}));

//creating connection
const db = mysql.createConnection({

  host     : 'localhost',
  user     : "root",
  password : "YOUR PASSWORD",
  database : "471dbtest"

});

//connecting to database
db.connect(function(err){
  if (err) throw err;
  console.log('MySql connected...');
});

app.use(session({
  key: "userId",
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  cookie:{
    expires: 1800 * 1000 // 30 minutes (s * ms/s) 
  }
}));

//============================================================================//
//                               HOME                                         //
//============================================================================//
app.get('/', function(req, res){  
  res.render('Register/home');  
});

//============================================================================//
//                               SIGN UP                                      //
//                                                                            //
// implement sessions here                                                    //
// implment the rest of the values                                            //
// implement login button                                                     // 
//                                                                            //
//============================================================================//
app.get("/signUp", function(req, res){
  //get dropdown message
  var sql = "SELECT * FROM country;"; 
  var query = db.query(sql, function(err, result){
    if (err) throw err;
    var str = '';
    for(var i = 0; i < result.length; i++){
      str += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
    }
    res.render("Register/signUp", {countryList : str, error : ''});
  });
  
});

//set this up in a minutes
app.post("/signUp", function(req, res){

  //check if valid username
  var sql = "SELECT * FROM account WHERE username=?;"; 
  var query = db.query(sql, [req.body.username, md5(req.body.password)], function(err, result){
    if (err) throw err;
    if(result.length){
        //get dropdown message
        var sql = "SELECT * FROM country;"; 
        var query = db.query(sql, function(err, result){
          if (err) throw err;
            var str = '';
            for(var i = 0; i < result.length; i++){
              str += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
            }
            res.render("Register/signUp", {countryList : str, error : 'Username Already Exists'});
        });
    }
    else if(req.body.fName == '' || req.body.lName == '' || req.body.DOB == '' || req.body.username == '' || req.body.email == '' || 
            req.body.phoneNumber == '' || req.body.password == '' || req.body.confirmPassword == ''){

      //get dropdown message
      var sql = "SELECT * FROM country;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
          var str = '';
          for(var i = 0; i < result.length; i++){
            str += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
          }
          res.render("Register/signUp", {countryList : str, error : 'Field Empty'});
      });  
    }
    else if(req.body.password != req.body.confirmPassword){
      //get dropdown message
      var sql = "SELECT * FROM country;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
          var str = '';
          for(var i = 0; i < result.length; i++){
            str += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
          }
          res.render("Register/signUp", {countryList : str, error : "Passwords Don't Match"});
      });
    }
    else if(req.body.countrySelect == undefined){
      //get dropdown message
      sql = "SELECT * FROM country;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
          var str = '';
          for(var i = 0; i < result.length; i++){
            str += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
          }
          res.render("Register/signUp", {countryList : str, error : "Please Select A Country"});
      });
    }
    else{
      // get currency
      console.log("signed up");
      sql = "select currencyId from country where countryId =" + req.body.countrySelect + ";"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
        //create account
        var sql = "INSERT INTO account(email, username, fname, lname, DOB, password, type, currencyId, balance) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);"; 
        var query = db.query(sql, [req.body.email, req.body.username, req.body.firstName, req.body.lastName, req.body.DOB, md5(req.body.password), req.body.accountSelect, result[0]['currencyId'], 0], function(err, result){
          if (err) throw err;
          // create connection
          sql = "SELECT * FROM account WHERE username=? AND password=?;"; 
          var query = db.query(sql, [req.body.username, md5(req.body.password)], function(err, result){
            if (err) throw err;
            console.log(result);
            res.redirect("/"+accountType(req.body.accountSelect)+"-home");
            //add to respective table
            if(req.body.accountSelect == 1){
              req.session.user = result;
              sql = "insert into user values(?, ?);"; 
              var query = db.query(sql, [req.session.user[0]['accountId'], req.body.phoneNumber], function(err, result){
                if (err) throw err;
              });
            }
            else if(req.body.accountSelect == 2){
              req.session.partner = result;
              sql = "insert into partner values(?, ?, ?);";
              var query = db.query(sql, [req.session.partner[0]['accountId'], null, null], function(err, result){
                if (err) throw err;
              });
            }
            // else if(req.body.accountSelect == 3){
            //   sql = "insert into user values(?);"; 
            //   var query = db.query(sql, req.session.user[0]['accountId'], function(err, result){
            //     if (err) throw err;
            //   });
            // }
          });
        });
      });
    }
  });
});

//============================================================================//
//                             LOGIN                                          //
//                                                                            //
// implement sign up button better                                            //
// make a landing page and move login to its own thing                        //
//                                                                            //        
//============================================================================//
app.get("/login", function(req, res){
  if(req.session.user){
    res.redirect("/"+accountType(req.session.user[0]['type'])+"-home");
  }
  else if(req.session.partner){
    res.redirect("/"+accountType(req.session.partner[0]['type'])+"-home");
  }
  else if(req.session.admin){
    res.redirect("/"+accountType(req.session.admin[0]['type'])+"-home");
  }
  else{
    res.render("Register/login", {error : ""});
  }
});

app.post("/login", function(req, res){
    
  if(req.body.username == null || req.body.password == null){
    return;
  }
  var sql = "SELECT * FROM account WHERE username=? AND password=?;"; 
  var query = db.query(sql, [req.body.username, md5(req.body.password)], function(err, result){
    if (err) throw err;
    if(!result.length){
      res.render("Register/logIn", {error : "Invalid Username or Password"});
    }
    else{
      if(result[0]['type'] == 1){
        req.session.user = result;
      }
      else if(result[0]['type'] == 2){
        req.session.partner = result;
      }
      else if(result[0]['type'] == 3){
        req.session.admin = result;
      }
      res.redirect("/"+accountType(result[0]['type'])+"-home");
    }
    //console.log("/"+accountType(result[0]['type'])+"-home");
    //res.send(result);
  });
});

//============================================================================//
//                               LOGOUT                                       //
//============================================================================//
app.get("/logout", function(req, res){
  req.session.destroy();
  res.redirect('/');
});
//============================================================================//
//                               HOME PAGE                                    //
//============================================================================//
app.get("/user-home", function(req, res){
  if(req.session.user){
    res.render('USER/index');
  }
  else{
    res.redirect(loginPage);
  }
});

app.get("/partner-home", function(req, res){
  if(req.session.partner){
    res.render('Partner/index');
  }
  else{
    res.redirect(loginPage);
  }
});

app.get("/admin-home", function(req, res){
  if(req.session.admin){
    res.render('Admin/index');
  }
  else{
    res.redirect(loginPage);
  }
});

//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//=================================USER CODE==================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//

//============================================================================//
//                          SEND MONEY                                        //
//============================================================================//
app.post("/sendMoney", function(req, res){ // button from user home
  if(req.session.user){
    //get dropdown message
    sql = "SELECT * FROM country;"; 
    var query = db.query(sql, function(err, result){
      if (err) throw err;
        var ctryStr = '';
        for(var i = 0; i < result.length; i++){
          ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
        }
        res.render("USER/sendMoney", {errorTag : '', countryOptions: ctryStr});
    });
  }
  else{
    res.redirect(loginPage);
  }
});

app.get("/sendMoney", function(req, res){ // button from user home
  if(req.session.user){
    //get dropdown message
    sql = "SELECT * FROM country;"; 
    var query = db.query(sql, function(err, result){
      if (err) throw err;
        var ctryStr = '';
        for(var i = 0; i < result.length; i++){
          ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
        }
        res.render("USER/sendMoney", {errorTag : '', countryOptions: ctryStr});
    });
  }
  else{
    res.redirect(loginPage);
  }
});

app.post('/continuePayment', function(req, res){

  if(req.session.user){
    // validate entries
    console.log(req.body.receiver);
    if(req.body.receiver == '' || req.body.value == ''){
      //get dropdown message
      sql = "SELECT * FROM country;"; 
      var query = db.query(sql, function(err, result){
      if (err) throw err;
        var ctryStr = '';
        for(var i = 0; i < result.length; i++){
          ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
        }
        res.render("USER/sendMoney", {errorTag : "<p class='error'>Some Inputs Were Left Empty</p>", countryOptions: ctryStr});
      }); 
    }
    else if(isNaN(parseFloat(req.body.value))){
      //get dropdown message
      sql = "SELECT * FROM country;"; 
      var query = db.query(sql, function(err, result){
      if (err) throw err;
        var ctryStr = '';
        for(var i = 0; i < result.length; i++){
          ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
        }
        res.render("USER/sendMoney", {errorTag : "<p class='error'>Value Not a Number</p>", countryOptions: ctryStr});
      });
    }
    else{
      // validate reciever
      var table;
      var sql = "SELECT account.accountId, account.currencyId, account.type, Fee.FeeId FROM account, Fee WHERE username=? AND transactionType=? AND countryId = ?;"; 
      var query = db.query(sql, [req.body.receiver, req.session.user[0]['type'] + '' + req.body.type, req.body.countrySelect], function(err, result){
        if (err) throw err;
        console.log(sql);
        if(result.length){
          var value = parseFloat(req.body.value);
          //process transaction
          if(req.session.user[0]['balance'] >= value){
            if (err) throw err;
            createTransaction(req.session.user[0]['accountId'], result[0]['accountId'], value, req.session.user[0]['currencyId'], result[0]['currencyId'], req.session.user[0]['type'], result[0]['type'], );
            // update database
            console.log(value);
            UpdateAccountsBalance(value, transaction.sendCurr, transaction.recCurr, transaction.sender, transaction.receiver, result[0]['FeeId']);
            updateTransactions();
            res.render("Register/resultPage", {message: 'Payment Completed', pageReturn : '/sendMoney'});
          }       
          else{
            //get dropdown message
            sql = "SELECT * FROM country;"; 
            var query = db.query(sql, function(err, result){
            if (err) throw err;
              var ctryStr = '';
              for(var i = 0; i < result.length; i++){
                ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
              }
              res.render("USER/sendMoney", {errorTag : "<p class='error'>Insufficient Funds</p>", countryOptions: ctryStr});
            }); 
          }
        }
        else{
          //get dropdown message
          sql = "SELECT * FROM country;"; 
          var query = db.query(sql, function(err, result){
          if (err) throw err;
            var ctryStr = '';
            for(var i = 0; i < result.length; i++){
              ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
            }
            res.render("USER/sendMoney", {errorTag : "<p CLASS='error'>USER DOES NOT EXIST<p>", countryOptions: ctryStr});
          }); 
        }
      });
    }
  }
  else{
    res.redirect(loginPage);
  }
});

// make the payment final


app.post("/sendMoney", function(req, res){ 
  if(req.session.user){
    res.render("USER/sendMoney", {errorTag : ''});
  }
  else{
    res.redirect(loginPage);
  }
});

//============================================================================//
//                               RECIEVE MONEY                                //
//============================================================================//
app.post('/ReceiveMoney', function(req, res){
  if(req.session.user){
    //get dropdown message
    sql = "SELECT * FROM paymentMethod where accountId = ?;"; 
    var query = db.query(sql, req.session.user[0]['accountId'], function(err, result){
      if (err) throw err;
      var str = '';
      for(var i = 0; i < result.length; i++){
        str += "<option value="+result[i]['PaymentMethodNumber']+">"+ result[i]['PaymentMethodNumber'] +"</option>\n";
      }
      res.render("USER/receive", {options: str});
    });
  //res.render('USER/receive');
  }
  else{
    res.redirect(loginPage);
  }
});

app.post("/payExisting", function(req, res){ 
  if(req.session.user){
    if(!isNaN(parseFloat(req.body.amount))){
      var u = req.session.user[0];
      console.log('account balance' + (u['balance'] + parseFloat(req.body.amount)));
      updateUser(u['accountId'], 'balance', u['balance'] + parseFloat(req.body.amount));
      u['balance'] = (u['balance'] + parseFloat(req.body.amount));
      console.log(u['currencyId']);
      createTransaction(u['accountId'], u['accountId'], parseFloat(req.body.amount), u['currencyId'], u['currencyId'], u['type'], u['type'], 1);
      updateTransactions();
      res.redirect("/"+accountType(req.session.user[0]['type'])+"-home");
    }
    else{
      //get dropdown message
      sql = "SELECT * FROM paymentMethod where accountId = ?;"; 
      var query = db.query(sql, req.session.user[0]['accountId'], function(err, result){
        if (err) throw err;
        var str = '';
        for(var i = 0; i < result.length; i++){
          str += "<option value="+result[i]['paymentMethodNumber']+">"+ result[i]['paymentMethodNumber'] +"</option>\n";
        }
        res.render("USER/receive", {options: str});
      });
    }
  }
  else{
    res.redirect(loginPage);
  }   
});

app.post("/payNew", function(req, res){ 
  if(req.session.user){
    sql = "SELECT * FROM paymentMethod where paymentMethodNumber = ?;"; 
    var query = db.query(sql, [req.body.cardNum], function(err, result){
      if (err) throw err;
      if(!result.length){
        var sql = "INSERT INTO paymentMethod VALUES(?, ?, ?);"; 
        var query = db.query(sql, [req.body.cardNum, req.body.cardType, req.session.user[0]['accountId']], function(err, result){
          if (err) throw err;
          var u = req.session.user[0];
          if(!isNaN(parseFloat(req.body.newAmount))){
            console.log("yeah we arre here");
            updateUser(u['accountId'], 'balance', u['balance'] + parseFloat(req.body.newAmount));
            u['balance'] = (u['balance'] + parseFloat(req.body.newAmount));
            createTransaction(u['accountId'], u['accountId'], parseFloat(req.body.newAmount), u['currencyId'], u['currencyId'], u['type'], u['type'], 1);
            updateTransactions();
            //get dropdown message and render page
            sql = "SELECT * FROM paymentMethod where accountId = ?;"; 
            var query = db.query(sql, req.session.user[0]['accountId'], function(err, result){
              if (err) throw err;
              var str = '';
              for(var i = 0; i < result.length; i++){
                str += "<option value="+result[i]['paymentMethodNumber']+">"+ result[i]['paymentMethodNumber'] +"</option>\n";
              }
              res.render("USER/receive", {options: str});
            });
          }
          
        });
      }
      else{
        //get dropdown message and render page
        sql = "SELECT * FROM paymentMethod where accountId = ?;"; 
        var query = db.query(sql, req.session.user[0]['accountId'], function(err, result){
          if (err) throw err;
          var str = '';
          for(var i = 0; i < result.length; i++){
            str += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
          }
          res.render("USER/receive", {options: str});
        });
      }
    });
  }
  else{
    res.redirect(loginPage);
  }   
});
//============================================================================//
//                               FRIENDS                                      //
//============================================================================//
app.post('/friends', function(req, res){
  if(req.session.user){
    res.redirect('/friends');
  }
  else{
    res.redirect(loginPage);
  }
});

app.get('/friends', function(req, res){
  if(req.session.user){
    var sql = "SELECT * FROM friend, account where friend.accountId = ? AND account.accountId = friend.friendAccountd;"; 
    var query = db.query(sql, req.session.user[0]['accountId'], function(err, result){
      if (err) throw err;
      var str = '';
      for(var i = 0; i < result.length; i++){
        str += "<li class='list-group-item colour'> <a href='./sendMoney'>" + 
                result[i]['username'] + "</a></li>";
      }
      res.render('USER/Friends', {friends: str});
    });
  }
  else{
    res.redirect(loginPage);
  }
});

app.post('/addFriend', function(req, res){
  if(req.session.user){
    var sql = "SELECT * FROM account where username = ? AND type = 1;"; 
    var query = db.query(sql, req.body.username, function(err, result){
      if (err) throw err;
      if(result.length){
        var friend = result[0]['accountId']
        var sql = "SELECT * FROM friend where friendAccountd = ? AND accountId = ?;"; 
        var query = db.query(sql, [result[0]['accountId'], req.session.user[0]['accountId']], function(err, result){
          if (err) throw err;
          if(!result.length){
            var sql = "INSERT INTO friend values(?, ?);"; 
            var query = db.query(sql, [req.session.user[0]['accountId'] , friend], function(err, result){
              if (err) throw err;
              res.redirect('/friends');
            });
          }
          else{
            console.log("user already friend");
            res.redirect('/friends');
          }
        });
      }
      else{
        console.log("user doesnt exist");
        res.redirect('/friends');
      }
    });
  }
  else{
    res.redirect(loginPage);
  }
});
//============================================================================//
//                            EXCHANGE & FEES                                 //
//============================================================================//
app.post('/exchangeAndFees', function(req, res){
  if(req.session.user){    
    var sql = "SELECT * FROM currency;"; 
    var query = db.query(sql, function(err, result){
      if (err) throw err;
      // format the results and display then on the page
      var str = '';
      for(var i = 0; i < result.length; i++){
        str+="<option value="+result[i]['CurrencyId']+">"+ result[i]['CurrencyName'] +"</option>\n"
      }
      //get dropdown message
      sql = "SELECT * FROM country;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
          var ctryStr = '';
          for(var i = 0; i < result.length; i++){
            ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
          }
          res.render("USER/ExchangeCalculator", {options : str, countryOptions: ctryStr, exchange: '', fee: ''});
      });
    });
  }
  else{
    res.redirect(loginPage);
  }
});
app.get('/exchangeAndFees', function(req, res){
  if(req.session.user){    
    var sql = "SELECT * FROM currency;"; 
    var query = db.query(sql, function(err, result){
      if (err) throw err;
      // format the results and display then on the page
      var str = '';
      for(var i = 0; i < result.length; i++){
        str+="<option value="+result[i]['CurrencyId']+">"+ result[i]['CurrencyName'] +"</option>\n"
      }
      //get dropdown message
      sql = "SELECT * FROM country;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
          var ctryStr = '';
          for(var i = 0; i < result.length; i++){
            ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
          }
          res.render("USER/ExchangeCalculator", {options : str, countryOptions: ctryStr, exchange: '', fee: ''});
      });
    });
  }
  else{
    res.redirect(loginPage);
  }
});

//calculate Exchange
app.post('/calcExchange', function(req, res){
  if(req.session.user){
    if(req.body.from != undefined && req.body.to != undefined && !isNaN(parseFloat(req.body.exValue))){
      value = parseFloat(req.body.exValue);
      var sql = "SELECT * FROM currency WHERE CurrencyId=? ;"; 
      var query = db.query(sql, [req.body.from], function(err, result){
        if (err) throw err;
        console.log(req.body.from);
        var currFrom_FromUSD = result[0]['FromUSD'];
        var sql = "SELECT * FROM currency WHERE CurrencyId=? ;"; 
        var query = db.query(sql, [req.body.to], function(err, result){
          if (err) throw err;
          var currTo_FromUSD = result[0]['FromUSD']; 
          //calculate conversion rate and fees
          var conversionRate = currFrom_FromUSD * 1/currTo_FromUSD;
          //calculate new value
          transactionValue = (value * conversionRate);
          // render site
          var sql = "SELECT * FROM currency;"; 
          var query = db.query(sql, function(err, result){
            if (err) throw err;
            // format the results and display then on the page
            var str = '';
            for(var i = 0; i < result.length; i++){
              str+="<option value="+result[i]['CurrencyId']+">"+ result[i]['CurrencyName'] +"</option>\n"
            }
            //get dropdown message
            sql = "SELECT * FROM country;"; 
            var query = db.query(sql, function(err, result){
              if (err) throw err;
              var ctryStr = '';
              for(var i = 0; i < result.length; i++){
                ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
              }
              res.render("USER/ExchangeCalculator", {options : str, countryOptions: ctryStr, exchange: "<p> New Value is "+transactionValue+"</p>", fee: ''});
            });
          });
        });
      });
    }
    else{
      res.redirect('/exchangeAndFees');
    }
  }
  else{
    res.redirect(loginPage);
  }
});

app.post('/calcFees', function(req, res){
  if(req.session.user){
    if(req.body.countrySelect != undefined && req.body.type != undefined && !isNaN(parseFloat(req.body.feeValue))){
      value = parseFloat(req.body.feeValue);
      sql = "SELECT * FROM Fee Where countryId = ? AND transactionType = ?;"; 
      var query = db.query(sql, [req.body.countrySelect, req.session.user[0]['type'] + '' + req.body.type],function(err, result){
        if (err) throw err;
        if(result.length){
          var feeValue = value * result[0]['FeeRate'];
        
          // render site
          var sql = "SELECT * FROM currency;"; 
          var query = db.query(sql, function(err, result){
            if (err) throw err;
            // format the results and display then on the page
            var str = '';
            for(var i = 0; i < result.length; i++){
              str+="<option value="+result[i]['CurrencyId']+">"+ result[i]['CurrencyName'] +"</option>\n"
            }
            //get dropdown message
            sql = "SELECT * FROM country;"; 
            var query = db.query(sql, function(err, result){
              if (err) throw err;
                var ctryStr = '';
                for(var i = 0; i < result.length; i++){
                  ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
                }
                res.render("USER/ExchangeCalculator", {options : str, countryOptions: ctryStr, exchange: '', fee: "<p> Fee Value is "+feeValue+"</p>"});
            });
          });
        }
        else{
          // render site
          var sql = "SELECT * FROM currency;"; 
          var query = db.query(sql, function(err, result){
            if (err) throw err;
            // format the results and display then on the page
            var str = '';
            for(var i = 0; i < result.length; i++){
              str+="<option value="+result[i]['CurrencyId']+">"+ result[i]['CurrencyName'] +"</option>\n"
            }
            //get dropdown message
            sql = "SELECT * FROM country;"; 
            var query = db.query(sql, function(err, result){
              if (err) throw err;
                var ctryStr = '';
                for(var i = 0; i < result.length; i++){
                  ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
                }
                res.render("USER/ExchangeCalculator", {options : str, countryOptions: ctryStr, exchange: '', fee: "<p> Fee Value doesn't exist </p>"});
            });
          });
        } 
      });
    }
    else{
      res.redirect('/exchangeAndFees');
    }
  }
  else{
    res.redirect(loginPage);
  }
  
});
//============================================================================//
//                                 HISTORY                                    //
//============================================================================//
app.post('/history', function(req, res){
  if(req.session.user){
    var str = '';
    var sql = "SELECT transId, value, a1.username as sender, a2.username as receiver, c1.CurrencyName as c1, c2.CurrencyName as c2 " +
    "FROM transactions, account As a1, currency As c1, account As a2, currency As c2 "+
    "WHERE (SenderId = ? OR ReceiverId = ?) AND a1.accountId = SenderId AND c1.CurrencyId = currencyFromSender AND "+
    "a2.accountId = ReceiverId AND c2.CurrencyId = currencyToReceiver;";
    
    var query = db.query(sql, [req.session.user[0]['accountId'],req.session.user[0]['accountId']], function(err, result){
      if (err) throw err;
      for(var i = 0; i < result.length; i++){
        str += "<tr><th scope='row'>" + result[i]['transId'] +"</th><td>" +
                result[i]['sender'] + "</td><td>" + result[i]['receiver'] +"</td><td>" 
                + result[i]['value'] + "</td><td>" + result[i]['c1'] + "</td><td>" + result[i]['c2'] +"</td></tr>"; 
      }
      res.render('User/history', {transactionList: str});
    });
  }
  else{
    res.redirect(loginPage);
  }
});
//============================================================================//
//                               PAYMENT METHOD                               //
//============================================================================//
app.post('/paymentMethods', function(req, res){
  if(req.session.user){
    //get dropdown message
    sql = "SELECT * FROM paymentMethod where accountId = ?;"; 
    var query = db.query(sql, req.session.user[0]['accountId'], function(err, result){
      if (err) throw err;
      var str = '';
      for(var i = 0; i < result.length; i++){
        str += "<option value="+result[i]['PaymentMethodNumber']+">"+ result[i]['PaymentMethodNumber'] +"</option>\n";
      }
      res.render("USER/PaymenMethod", {options: str});
    });
  }
  else{
    res.redirect(loginPage);
  }
});

app.post("/addCard", function(req, res){ 
  if(req.session.user){
    sql = "SELECT * FROM paymentMethod where PaymentMethodNumber = ?;"; 
    var query = db.query(sql, [req.body.cardNum], function(err, result){
      if (err) throw err;
        if(!result.length){
        var sql = "INSERT INTO PaymentMethod VALUES(?, ?, ?);"; 
        var query = db.query(sql, [req.body.cardNum, req.body.cardType, req.session.user[0]['accountId']], function(err, result){
          if (err) throw err;         
            res.render("Register/resultPage", {message : "Card number " + req.body.cardNum + " added", pageReturn: "/paymentMethods"});
        });
      }
      else{
        //get dropdown message and render page
        sql = "SELECT * FROM paymentMethod where accountId = ?;"; 
        var query = db.query(sql, req.session.user[0]['accountId'], function(err, result){
          if (err) throw err;
          var str = '';
          for(var i = 0; i < result.length; i++){
            str += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
          }
          res.render("USER/receive", {options: str});
        });
      }
    });
  }
  else{
    res.redirect(loginPage);
  }   
});

app.post('/deleteCard', function(req, res){
  if(req.session.user){
    if(req.session.user[0]['password'] == md5(req.body.password)){
      sql = "DELETE FROM paymentMethod where accountId = ? AND PaymentMethodNumber = ?;"; 
      var query = db.query(sql, [req.session.user[0]['accountId'], req.body.cardSelect], function(err, result){
        if (err) throw err;
        res.render("Register/resultPage", {message : "Card number " + req.body.cardSelect + " Removed", pageReturn: "/paymentMethods"});
      });
    }
  }
  else{
    res.redirect(loginPage);
  }
});
//============================================================================//
//                                REWARDS                                     //
//============================================================================//
app.post('/rewards', function(req, res){
  if(req.session.user){
    var str = '';
    var sql = "SELECT rewardName, rewardPoints " +
    "FROM userEarn, userReward " +
    "WHERE userId = ? AND userReward.rewardId = userEarn.rewardId ;";
    
    var query = db.query(sql, req.session.user[0]['accountId'], function(err, result){
      if (err) throw err;
      for(var i = 0; i < result.length; i++){
        str += "<tr><th scope='row'></th><td>" +
                result[i]['rewardName'] + "</td><td>" + result[i]['rewardPoints'] +"</td></tr>"; 
      }
      res.render('USER/reward', {rewardList: str});
    });
  }
  else{
    res.redirect(loginPage);
  }
});
//============================================================================//
//                                PARTNERS                                    //
//============================================================================//
app.post('/partners', function(req, res){
  if(req.session.user){
    //get dropdown message for countries
    sql = "SELECT * FROM country;"; 
    var query = db.query(sql, function(err, result){
      if (err) throw err;
      var ctryStr = '';
      for(var i = 0; i < result.length; i++){
        ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
      }
      res.render('USER/partnerShop', {shops : "<p>select a country</p>", countryOptions: ctryStr});
    });
  }
});

app.post('/partnersSearch', function(req, res){
  if(req.session.user){
    //get dropdown message for countries
    sql = "SELECT * FROM country;"; 
    var query = db.query(sql, function(err, result){
      if (err) throw err;
      var ctryStr = '';
      for(var i = 0; i < result.length; i++){
        ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
      }
      //get dropdown message for shops
      sql = "SELECT locationId, location.fname as name, city FROM Location, account WHERE countryId = ? AND location.accountId = account.accountId;"; 
      var query = db.query(sql, req.body.country, function(err, result){
        if (err) throw err;
        if(result.length){
          var str = '';
          for(var i = 0; i < result.length; i++){
            str += "<option value="+result[i]['locationId']+">"+ result[i]['name'] +" "+ result[i]['city'] +"</option>\n";
          }
          res.render('USER/partnerShop', {shops : str, countryOptions: ctryStr});
        }
        else{
          res.render('USER/partnerShop', {shops : "<p style='color: red'>there are no  shops in this country</p>", countryOptions: ctryStr});
        }
        
      });
    });
  }
  else{
    res.redirect(loginPage);
  }
});
//============================================================================//
//                               MY ACCOUNT                                   //
//============================================================================//

app.get('/account', function(req, res){
  if(req.session.user){
    updateSession(req, res, req.session.user[0]['username']);
    var user = req.session.user[0];
    var sql = "select CurrencyName from currency where CurrencyName =" + req.session.user[0]['currencyId'] + ";";
    var query = db.query(sql, function(err, result){
      if (err) throw err;
      res.render('USER/myAccount', {balance : user['balance'].toFixed(2), 
                                  currency : result[0]['CurrencyName'],
                                  username : user['username'],
                                  email : user['email']});
    });  
  }
  else{
    res.redirect(loginPage);
  }
});

app.post('/account', function(req, res){
  if(req.session.user){
    updateSession(req, res, req.session.user[0]['username']);
    console.log(req.session.user[0]['balance']);
    var user = req.session.user[0];
    var sql = "select CurrencyName from currency where CurrencyId =" + req.session.user[0]['currencyId'] + ";";
    var query = db.query(sql, function(err, result){
      if (err) throw err;
      res.render('USER/myAccount', {balance : user['balance'].toFixed(2), 
                                  currency : result[0]['CurrencyName'],
                                  username : user['username'],
                                  email : user['email']});
    });
  }
  else{
    res.redirect(loginPage);
  }
});

//==============change email=================//
app.post('/changeEmail', function(req, res){
  if(req.session.user){
    res.render('USER/changeEmail');
  }
  else{
    res.redirect(loginPage);
  }
});

app.post('/submitChangeEmail', function(req, res){
  if(req.session.user){
    if(req.body.email != ''){
      console.log(req.body.email);
      updateUser(req.session.user[0]['accountId'], 'email', req.body.email);
      res.render('Register/resultPage',  {message: 'Email Changed, this might take a minute to be changed on your account page', pageReturn: '/account'});
    }
    else{
      res.render('USER/changeEmail');
    }

  }
  else{
    res.redirect(loginPage);
  }
});

//==============change currency=================//
app.post('/changeCurrency', function(req, res){
  if(req.session.user){
    var sql = "SELECT * FROM currency;"; 
    var query = db.query(sql, function(err, result){
      if (err) throw err;
      // format the results and display then on the page
      var str = '';
      for(var i = 0; i < result.length; i++){
        str+="<option value="+result[i]['CurrencyId']+">"+ result[i]['CurrencyName'] +"</option>\n"
      }
      res.render('USER/changeCurrency', {currencyOptions: str});
    });
  }
  else{
    res.redirect(loginPage);
  }
});

app.post('/submitChangeCurrency', function(req, res){
  if(req.session.user){
    if(req.body.currency != undefined){
      var sql = "SELECT c1.FromUSD as c1Rate, c2.FromUSD as c2Rate FROM currency as c1, currency as c2 WHERE c1.CurrencyId = ? AND c2.CurrencyId = ?;"; 
      var query = db.query(sql, [req.session.user[0]['currencyId'], req.body.currency],function(err, result){
        if (err) throw err;
        var newBalance = req.session.user[0]['balance'] * (result[0]['c1Rate']/result[0]['c2Rate']); 
        updateUser(req.session.user[0]['accountId'], 'balance', newBalance);
        console.log(req.body.email);
        updateUser(req.session.user[0]['accountId'], 'currencyId', req.body.currency);
        res.render('Register/resultPage',  {message: 'Currency Changed, this might take a minute to be changed on your account page', pageReturn: '/account'});
      });
    }
    else{
      var sql = "SELECT * FROM currency;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
        // format the results and display then on the page
        var str = '';
        for(var i = 0; i < result.length; i++){
          str+="<option value="+result[i]['CurrencyId']+">"+ result[i]['CurrencyName'] +"</option>\n"
        }
        res.render('USER/changeCurrency', {currencyOptions: str});
      });
    }
  }
  else{
    res.redirect(loginPage);
  }
});

//==============Reset Password=================//
app.post('/resetPassword', function(req, res){
  if(req.session.user){
    res.render('USER/resetPassword');
  }
  else{
    res.redirect(loginPage);
  }
});

app.get('/resetPassword', function(req, res){
  if(req.session.user){
      res.render('user/resetPassword');
  }
  else{
      res.redirect(loginPage);
  }
  });  

app.post('/submitChangePassword', function(req, res){
  if(req.session.user){
    if(md5(req.session.oldPass) == req.session.user[0]['password']){
      updateUser(req.session.user[0]['accountId'], 'password', md5(req.body.newPass));
      res.render('Register/resultPage',  {message: 'Password Changed', pageReturn: '/account'});
    }
    else{
      res.redirect('/resetPassword');
    }
    
  }
  else{
    res.redirect(loginPage);
  }
});





//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//================================PARTNER CODE================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//


//============================================================================//
//                          SEND MONEY                                        //
//============================================================================//
app.post("/partnerSendMoney", function(req, res){ // button from user home
  if(req.session.partner){
    //get dropdown message
    sql = "SELECT * FROM country;"; 
    var query = db.query(sql, function(err, result){
      if (err) throw err;
        var ctryStr = '';
        for(var i = 0; i < result.length; i++){
          ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
        }
        res.render("Partner/sendMoney", {errorTag : '', countryOptions: ctryStr});
    });
  }
  else{
    res.redirect(loginPage);
  }
});

app.get("/partnerSendMoney", function(req, res){ // button from user home
  if(req.session.partner){
    //get dropdown message
    sql = "SELECT * FROM country;"; 
    var query = db.query(sql, function(err, result){
      if (err) throw err;
        var ctryStr = '';
        for(var i = 0; i < result.length; i++){
          ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
        }
        res.render("Partner/sendMoney", {errorTag : '', countryOptions: ctryStr});
    });
  }
  else{
    res.redirect(loginPage);
  }
});

app.post('/partnerContinuePayment', function(req, res){

  if(req.session.partner){
    // validate entries
    console.log(req.body.receiver);
    if(req.body.receiver == '' || req.body.value == ''){
      //get dropdown message
      sql = "SELECT * FROM country;"; 
      var query = db.query(sql, function(err, result){
      if (err) throw err;
        var ctryStr = '';
        for(var i = 0; i < result.length; i++){
          ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
        }
        res.render("Partner/sendMoney", {errorTag : "<p class='error'>Some Inputs Were Left Empty</p>", countryOptions: ctryStr});
      }); 
    }
    else if(isNaN(parseFloat(req.body.value))){
      //get dropdown message
      sql = "SELECT * FROM country;"; 
      var query = db.query(sql, function(err, result){
      if (err) throw err;
        var ctryStr = '';
        for(var i = 0; i < result.length; i++){
          ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
        }
        res.render("Partner/sendMoney", {errorTag : "<p class='error'>Value Not a Number</p>", countryOptions: ctryStr});
      });
    }
    else{
      // validate reciever
      var table;
      var sql = "SELECT account.accountId, account.currencyId, account.type, Fee.FeeId FROM account, Fee WHERE username=? AND transactionType=? AND countryId = ?;"; 
      var query = db.query(sql, [req.body.receiver, req.session.partner[0]['type'] + '' + req.body.type, req.body.countrySelect], function(err, result){
        console.log( req.session.partner[0]['type']);
        if (err) throw err;
        if(result.length){
          var value = parseFloat(req.body.value);
          //process transaction
          if(req.session.partner[0]['balance'] >= value){
            if (err) throw err;
            createTransaction(req.session.partner[0]['accountId'], result[0]['accountId'], value, req.session.partner[0]['currencyId'], result[0]['currencyId'], req.session.partner[0]['type'], result[0]['type'], );
            // update database
            console.log(value);
            UpdateAccountsBalance(value, transaction.sendCurr, transaction.recCurr, transaction.sender, transaction.receiver, result[0]['FeeId']);
            updateTransactions();
            res.render("Register/resultPage", {message: 'Payment Completed', pageReturn : '/partnerSendMoney'});
          }       
          else{
            //get dropdown message
            sql = "SELECT * FROM country;"; 
            var query = db.query(sql, function(err, result){
            if (err) throw err;
              var ctryStr = '';
              for(var i = 0; i < result.length; i++){
                ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
              }
              res.render("Partner/sendMoney", {errorTag : "<p class='error'>Insufficient Funds</p>", countryOptions: ctryStr});
            }); 
          }
        }
        else{
          //get dropdown message
          sql = "SELECT * FROM country;"; 
          var query = db.query(sql, function(err, result){
          if (err) throw err;
            var ctryStr = '';
            for(var i = 0; i < result.length; i++){
              ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
            }
            res.render("Partner/sendMoney", {errorTag : "<p CLASS='error'>Partner DOES NOT EXIST<p>", countryOptions: ctryStr});
          }); 
        }
      });
    }
  }
  else{
    res.redirect(loginPage);
  }
});

// make the payment final


app.post("/partnerSendMoney", function(req, res){ 
  if(req.session.partner){
    res.render("Partner/sendMoney", {errorTag : ''});
  }
  else{
    res.redirect(loginPage);
  }
});

//============================================================================//
//                               RECIEVE MONEY                                //
//============================================================================//
app.post('/partnerReceiveMoney', function(req, res){
  if(req.session.partner){
    //get dropdown message
    sql = "SELECT * FROM paymentMethod where accountId = ?;"; 
    var query = db.query(sql, req.session.partner[0]['accountId'], function(err, result){
      if (err) throw err;
      var str = '';
      for(var i = 0; i < result.length; i++){
        str += "<option value="+result[i]['PaymentMethodNumber']+">"+ result[i]['PaymentMethodNumber'] +"</option>\n";
      }
      res.render("Partner/receive", {options: str});
    });
  //res.render('Partner/receive');
  }
  else{
    res.redirect(loginPage);
  }
});

app.post("/partnerPayExisting", function(req, res){ 
  if(req.session.partner){
    if(!isNaN(parseFloat(req.body.amount))){
      var u = req.session.partner[0];
      console.log('account balance' + (u['balance'] + parseFloat(req.body.amount)));
      updateUser(u['accountId'], 'balance', u['balance'] + parseFloat(req.body.amount));
      u['balance'] = (u['balance'] + parseFloat(req.body.amount));
      console.log(u['currencyId']);
      createTransaction(u['accountId'], u['accountId'], parseFloat(req.body.amount), u['currencyId'], u['currencyId'], u['type'], u['type'], 1);
      updateTransactions();
      res.redirect("/"+accountType(req.session.partner[0]['type'])+"-home");
    }
    else{
      //get dropdown message
      sql = "SELECT * FROM PaymentMethod where accountId = ?;"; 
      var query = db.query(sql, req.session.partner[0]['accountId'], function(err, result){
        if (err) throw err;
        var str = '';
        for(var i = 0; i < result.length; i++){
          str += "<option value="+result[i]['paymentMethodNumber']+">"+ result[i]['PaymentMethodNumber'] +"</option>\n";
        }
        res.render("Partner/receive", {options: str});
      });
    }
  }
  else{
    res.redirect(loginPage);
  }   
});

app.post("/partnerPayNew", function(req, res){ 
  if(req.session.partner){
    sql = "SELECT * FROM PaymentMethod where PaymentMethodNumber = ?;"; 
    var query = db.query(sql, [req.body.cardNum], function(err, result){
      if (err) throw err;
      if(!result.length){
        var sql = "INSERT INTO paymentMethod VALUES(?, ?, ?);"; 
        var query = db.query(sql, [req.body.cardNum, req.body.cardType, req.session.partner[0]['accountId']], function(err, result){
          if (err) throw err;
          var u = req.session.partner[0];
          if(!isNaN(parseFloat(req.body.newAmount))){
            updateUser(u['accountId'], 'balance', u['balance'] + parseFloat(req.body.newAmount));
            u['balance'] = (u['balance'] + parseFloat(req.body.newAmount));
            createTransaction(u['accountId'], u['accountId'], parseFloat(req.body.newAmount), u['currencyId'], u['currencyId'], u['type'], u['type'], 1);
            updateTransactions();
            //get dropdown message and render page
            sql = "SELECT * FROM paymentMethod where accountId = ?;"; 
            var query = db.query(sql, req.session.partner[0]['accountId'], function(err, result){
              if (err) throw err;
              var str = '';
              for(var i = 0; i < result.length; i++){
                str += "<option value="+result[i]['PaymentMethodNumber']+">"+ result[i]['PaymentMethodNumber'] +"</option>\n";
              }
              res.render("Partner/receive", {options: str});
            });
          }
          
        });
      }
      else{
        //get dropdown message and render page
        sql = "SELECT * FROM paymentMethod where accountId = ?;"; 
        var query = db.query(sql, req.session.partner[0]['accountId'], function(err, result){
          if (err) throw err;
          var str = '';
          for(var i = 0; i < result.length; i++){
            str += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
          }
          res.render("Partner/receive", {options: str});
        });
      }
    });
  }
  else{
    res.redirect(loginPage);
  }   
});

//============================================================================//
//                            EXCHANGE & FEES                                 //
//============================================================================//
app.post('/partnerExchangeAndFees', function(req, res){
  if(req.session.partner){    
    var sql = "SELECT * FROM currency;"; 
    var query = db.query(sql, function(err, result){
      if (err) throw err;
      // format the results and display then on the page
      var str = '';
      for(var i = 0; i < result.length; i++){
        str+="<option value="+result[i]['CurrencyId']+">"+ result[i]['CurrencyName'] +"</option>\n"
      }
      //get dropdown message
      sql = "SELECT * FROM country;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
          var ctryStr = '';
          for(var i = 0; i < result.length; i++){
            ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
          }
          res.render("Partner/ExchangeCalculator", {options : str, countryOptions: ctryStr, exchange: '', fee: ''});
      });
    });
  }
  else{
    res.redirect(loginPage);
  }
});
app.get('/partnerExchangeAndFees', function(req, res){
  if(req.session.partner){    
    var sql = "SELECT * FROM currency;"; 
    var query = db.query(sql, function(err, result){
      if (err) throw err;
      // format the results and display then on the page
      var str = '';
      for(var i = 0; i < result.length; i++){
        str+="<option value="+result[i]['CurrencyId']+">"+ result[i]['CurrencyName'] +"</option>\n"
      }
      //get dropdown message
      sql = "SELECT * FROM country;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
          var ctryStr = '';
          for(var i = 0; i < result.length; i++){
            ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
          }
          res.render("Partner/ExchangeCalculator", {options : str, countryOptions: ctryStr, exchange: '', fee: ''});
      });
    });
  }
  else{
    res.redirect(loginPage);
  }
});

//calculate Exchange
app.post('/calcExchange', function(req, res){
  if(req.session.partner){
    if(req.body.from != undefined && req.body.to != undefined && !isNaN(parseFloat(req.body.exValue))){
      value = parseFloat(req.body.exValue);
      var sql = "SELECT * FROM currency WHERE CurrencyId=? ;"; 
      var query = db.query(sql, [req.body.from], function(err, result){
        if (err) throw err;
        console.log(req.body.from);
        var currFrom_FromUSD = result[0]['FromUSD'];
        var sql = "SELECT * FROM currency WHERE CurrencyId=? ;"; 
        var query = db.query(sql, [req.body.to], function(err, result){
          if (err) throw err;
          var currTo_FromUSD = result[0]['FromUSD']; 
          //calculate conversion rate and fees
          var conversionRate = currFrom_FromUSD * 1/currTo_FromUSD;
          //calculate new value
          transactionValue = (value * conversionRate);
          // render site
          var sql = "SELECT * FROM currency;"; 
          var query = db.query(sql, function(err, result){
            if (err) throw err;
            // format the results and display then on the page
            var str = '';
            for(var i = 0; i < result.length; i++){
              str+="<option value="+result[i]['CurrencyId']+">"+ result[i]['CurrencyName'] +"</option>\n"
            }
            //get dropdown message
            sql = "SELECT * FROM country;"; 
            var query = db.query(sql, function(err, result){
              if (err) throw err;
              var ctryStr = '';
              for(var i = 0; i < result.length; i++){
                ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
              }
              res.render("Partner/ExchangeCalculator", {options : str, countryOptions: ctryStr, exchange: "<p> New Value is "+transactionValue+"</p>", fee: ''});
            });
          });
        });
      });
    }
    else{
      res.redirect('/partnerExchangeAndFees');
    }
  }
  else{
    res.redirect(loginPage);
  }
});

app.post('/calcFees', function(req, res){
  if(req.session.partner){
    if(req.body.countrySelect != undefined && req.body.type != undefined && !isNaN(parseFloat(req.body.feeValue))){
      value = parseFloat(req.body.feeValue);
      sql = "SELECT * FROM Fee Where countryId = ? AND transactionType = ?;"; 
      var query = db.query(sql, [req.body.countrySelect, req.session.partner[0]['type'] + '' + req.body.type],function(err, result){
        if (err) throw err;
        if(result.length){
          var feeValue = value * result[0]['FeeRate'];
        
          // render site
          var sql = "SELECT * FROM currency;"; 
          var query = db.query(sql, function(err, result){
            if (err) throw err;
            // format the results and display then on the page
            var str = '';
            for(var i = 0; i < result.length; i++){
              str+="<option value="+result[i]['CurrencyId']+">"+ result[i]['CurrencyName'] +"</option>\n"
            }
            //get dropdown message
            sql = "SELECT * FROM country;"; 
            var query = db.query(sql, function(err, result){
              if (err) throw err;
                var ctryStr = '';
                for(var i = 0; i < result.length; i++){
                  ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
                }
                res.render("Partner/ExchangeCalculator", {options : str, countryOptions: ctryStr, exchange: '', fee: "<p> Fee Value is "+feeValue+"</p>"});
            });
          });
        }
        else{
          // render site
          var sql = "SELECT * FROM currency;"; 
          var query = db.query(sql, function(err, result){
            if (err) throw err;
            // format the results and display then on the page
            var str = '';
            for(var i = 0; i < result.length; i++){
              str+="<option value="+result[i]['CurrencyId']+">"+ result[i]['CurrencyName'] +"</option>\n"
            }
            //get dropdown message
            sql = "SELECT * FROM country;"; 
            var query = db.query(sql, function(err, result){
              if (err) throw err;
                var ctryStr = '';
                for(var i = 0; i < result.length; i++){
                  ctryStr += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
                }
                res.render("Partner/ExchangeCalculator", {options : str, countryOptions: ctryStr, exchange: '', fee: "<p> Fee Value doesn't exist </p>"});
            });
          });
        } 
      });
    }
    else{
      res.redirect('/partnerExchangeAndFees');
    }
  }
  else{
    res.redirect(loginPage);
  }
  
});
//============================================================================//
//                                 HISTORY                                    //
//============================================================================//
app.post('/partnerHistory', function(req, res){
  if(req.session.partner){
    var str = '';
    var sql = "SELECT transId, value, a1.username as sender, a2.username as receiver, c1.CurrencyName as c1, c2.CurrencyName as c2 " +
    "FROM transactions, account As a1, currency As c1, account As a2, currency As c2 "+
    "WHERE (SenderId = ? OR ReceiverId = ?) AND a1.accountId = SenderId AND c1.CurrencyId = currencyFromSender AND "+
    "a2.accountId = ReceiverId AND c2.CurrencyId = currencyToReceiver;";
    
    var query = db.query(sql, [req.session.partner[0]['accountId'],req.session.partner[0]['accountId']], function(err, result){
      if (err) throw err;
      for(var i = 0; i < result.length; i++){
        str += "<tr><th scope='row'>" + result[i]['transId'] +"</th><td>" +
                result[i]['sender'] + "</td><td>" + result[i]['receiver'] +"</td><td>" 
                + result[i]['value'] + "</td><td>" + result[i]['c1'] + "</td><td>" + result[i]['c2'] +"</td></tr>"; 
      }
      res.render('Partner/history', {transactionList: str});
    });
  }
  else{
    res.redirect(loginPage);
  }
});
//============================================================================//
//                               PAYMENT METHOD                               //
//============================================================================//
app.post('/partnerPaymentMethods', function(req, res){
  if(req.session.partner){
    //get dropdown message
    sql = "SELECT * FROM paymentMethod where accountId = ?;"; 
    var query = db.query(sql, req.session.partner[0]['accountId'], function(err, result){
      if (err) throw err;
      var str = '';
      for(var i = 0; i < result.length; i++){
        str += "<option value="+result[i]['PaymentMethodNumber']+">"+ result[i]['PaymentMethodNumber'] +"</option>\n";
      }
      res.render("Partner/PaymenMethod", {options: str});
    });
  }
  else{
    res.redirect(loginPage);
  }
});

app.post("/addCard", function(req, res){ 
  if(req.session.partner){
    sql = "SELECT * FROM paymentMethod where PaymentMethodNumber = ?;"; 
    var query = db.query(sql, [req.body.cardNum], function(err, result){
      if (err) throw err;
        if(!result.length){
        var sql = "INSERT INTO PaymentMethod VALUES(?, ?, ?);"; 
        var query = db.query(sql, [req.body.cardNum, req.body.cardType, req.session.partner[0]['accountId']], function(err, result){
          if (err) throw err;         
            res.render("Register/resultPage", {message : "Card number " + req.body.cardNum + " added", pageReturn: "/partnerPaymentMethods"});
        });
      }
      else{
        //get dropdown message and render page
        sql = "SELECT * FROM paymentMethod where accountId = ?;"; 
        var query = db.query(sql, req.session.partner[0]['accountId'], function(err, result){
          if (err) throw err;
          var str = '';
          for(var i = 0; i < result.length; i++){
            str += "<option value="+result[i]['countryId']+">"+ result[i]['countryName'] +"</option>\n";
          }
          res.render("Partner/receive", {options: str});
        });
      }
    });
  }
  else{
    res.redirect(loginPage);
  }   
});

app.post('/deleteCard', function(req, res){
  if(req.session.partner){
    if(req.session.partner[0]['password'] == md5(req.body.password)){
      sql = "DELETE FROM paymentMethod where accountId = ? AND PaymentMethodNumber = ?;"; 
      var query = db.query(sql, [req.session.partner[0]['accountId'], req.body.cardSelect], function(err, result){
        if (err) throw err;
        res.render("Register/resultPage", {message : "Card number " + req.body.cardSelect + " Removed", pageReturn: "/partnerPaymentMethods"});
      });
    }
  }
  else{
    res.redirect(loginPage);
  }
});
//============================================================================//
//                                REWARDS                                     //
//============================================================================//
app.post('/partnerRewards', function(req, res){
  if(req.session.partner){
    var str = '';
    var sql = "SELECT rewardName, rewardValue " +
    "FROM partner WHERE accountId = ? ;";

    var query = db.query(sql, req.session.partner[0]['accountId'], function(err, result){
      if (err) throw err;
      for(var i = 0; i < result.length; i++){
        str += "<tr><th scope='row'></th><td>" +
                result[i]['rewardName'] + "</td><td>" + result[i]['rewardValue'] +"</td></tr>"; 
      }
      res.render('Partner/reward', {rewardList: str});
    });
  }
  else{
    res.redirect(loginPage);
  }
});

//============================================================================//
//                                 LOCATIONS                                  //
//============================================================================//
app.post("/partnerLocations", function(req, res){
  
  var countryStr = "";
  var locationStr = "";
  
  if(req.session.partner){

    //get dropdown message
    sql = "SELECT * FROM country;"; 
    var query = db.query(sql, function(err, result){
    if (err) throw err;
    for(var i = 0; i < result.length; i++){
      countryStr += "<option value="+result[i]["countryId"]+">"+ result[i]["countryName"] +"</option>\n";
    }
    });

    //get dropdown message
    sql = "SELECT * FROM location WHERE accountId = ?;";
    var query = db.query(sql, req.session.partner[0]["accountId"], function(err, result){
    if (err) throw err;
      var str = "";
      for(var i = 0; i < result.length; i++){
        locationStr += "<option value="+result[i]["LocationId"]+">"+ result[i]["fName"] +"</option>\n";
      }
      res.render("Partner/locations", {countryList : countryStr, locationList : locationStr, error : "Error"});
    });
  
  } else{
    res.redirect(loginPage);
  }
});

app.get("/locations", function(req, res){
  
  var countryStr = "";
  var locationStr = "";
  
  if(req.session.partner){

    //get dropdown message
    sql = "SELECT * FROM country;"; 
    var query = db.query(sql, function(err, result){
    if (err) throw err;
    for(var i = 0; i < result.length; i++){
      countryStr += "<option value="+result[i]["countryId"]+">"+ result[i]["countryName"] +"</option>\n";
    }
    });

    //get dropdown message
    sql = "SELECT * FROM location WHERE accountId = ?;";
    var query = db.query(sql, req.session.partner[0]["accountId"], function(err, result){
    if (err) throw err;
      var str = '';
      for(var i = 0; i < result.length; i++){
        locationStr += "<option value="+result[i]['LocationId']+">"+ result[i]["fName"] +"</option>\n";
      }
      res.render("Partner/locations", {countryList : countryStr, locationList : locationStr, error : "Error"});
    });
  
  }
  else{
    res.redirect(loginPage);
  }
});

//============================================================================//
//                                CHANGE LOCATIONS                            //
//============================================================================//
app.post("/changeLocations", function(req, res){
  if(req.session.partner){
    if(req.body.phoneNo == '' || req.body.locationName == '' || req.body.citySelect == '' || req.body.locationName == undefined){
      //get dropdown message
      sql = "SELECT * FROM country;";
      var query = db.query(sql, req.session.partner[0]["accountId"], function(err, result){
      if (err) throw err;
        for(var i = 0; i < result.length; i++){
          countryStr += "<option value="+result[i]["countryId"]+">"+ result[i]["countryName"] +"</option>\n";
        }
      });
  
      //get dropdown message
      sql = "SELECT * FROM location WHERE accountId = ?;";
      var query = db.query(sql, req.session.partner[0]["accountId"], function(err, result){
      if (err) throw err;
        for(var i = 0; i < result.length; i++){
          locationStr += "<option value="+result[i]['LocationId']+">"+ result[i]["fName"] +"</option>\n";
        }
        res.render("Partner/locations", {countryList : countryStr, locationList : locationStr, error : "Fields Empty"});
      });
      
    }
    else{
      var countryStr=""; 
      var locationStr="";
  
      //insert new location
      var sql = "INSERT INTO location VALUES(?,?,?,?,?,?,?);"; 
      var query = db.query(sql, [null, req.session.partner[0]["accountId"], req.body.phoneNo, req.body.citySelect,
       req.body.countrySelect, req.body.locationName, req.session.partner[0]["username"]], function(err, result){
        if (err) throw err;         
        res.render("Register/resultPage", {message : 'Location Added', pageReturn : "/partnerLocations"});
      });
    }
      
  }
  else{
    res.redirect(loginPage);
  }
});

//============================================================================//
//                                DELETE LOCATION                             //
//============================================================================//
app.post("/deleteLocation", function(req, res){
  if(req.session.partner){

    var countryStr="";
    var locationStr="";
    console.log(req.body.locationSelect);
    if(req.body.locationSelect == undefined || req.body.enterPassword == ''){
      //get dropdown message
      sql = "SELECT * FROM country;";
      var query = db.query(sql, req.session.partner[0]["accountId"], function(err, result){
      if (err) throw err;
        for(var i = 0; i < result.length; i++){
          countryStr += "<option value="+result[i]["countryId"]+">"+ result[i]["countryName"] +"</option>\n";
        }
      });
  
      //get dropdown message
      sql = "SELECT * FROM location WHERE accountId = ?;";
      var query = db.query(sql, req.session.partner[0]["accountId"], function(err, result){
      if (err) throw err;
        for(var i = 0; i < result.length; i++){
          locationStr += "<option value="+result[i]['LocationId']+">"+ result[i]["fName"] +"</option>\n";
        }
        res.render("Partner/locations", {countryList : countryStr, locationList : locationStr, error : "Fields Empty"});
      });
      
    }
    else{
      //delete location
      sql = "DELETE FROM location WHERE locationId = ? and accountId = ?;";
      if (req.session.partner[0]["password"]==md5(req.body.enterPassword)) {
        var query = db.query(sql, [req.body.locationSelect, req.session.partner[0]["accountId"]], function(err, result){
          if (err) throw err;
          res.render("Register/resultPage", {message : 'Location Deleted', pageReturn : "/partnerLocations"});
        });
      }
    }  
  } 
  else {
    res.redirect(loginPage);
  }
});

//============================================================================//
//                                 VIEW LOCATIONS                             //
//============================================================================//
app.post('/viewLocations', function(req, res){
  if(req.session.partner){
    var str = '';
    var sql = "SELECT LocationId, AccountId, phoneNo, city, countryName, fName, lName" +
    " FROM location, country WHERE AccountId = ? AND country.countryId = location.countryId";

    var query = db.query(sql, req.session.partner[0]['accountId'], function(err, result){
      if (err) throw err;

      for(var i = 0; i < result.length; i++){
        console.log(result[i]["city"]);

        str += "<tr><th scope='row'>" + result[i]["LocationId"] +"</th><td>" +
                result[i]["AccountId"] + "</td><td>" + result[i]["phoneNo"] +"</td><td>" 
                + result[i]["city"] + "</td><td>" + result[i]["countryName"] + "</td><td>" 
                + result[i]["fName"] + "</td><td>" + result[i]["lName"] + "</td></tr>"; 
      }
      res.render('Partner/viewLocations', {locationList: str});

    });
  }
  else{
    res.redirect(loginPage);
  }
});

//============================================================================//
//                               MY ACCOUNT                                   //
//============================================================================//

app.get('/partnerAccount', function(req, res){
  if(req.session.partner){
    updateSession(req, res, req.session.partner[0]['username']);
    var user = req.session.partner[0];
    var sql = "select CurrencyName from currency where CurrencyName =" + req.session.partner[0]['currencyId'] + ";";
    var query = db.query(sql, function(err, result){
      if (err) throw err;
      res.render('Partner/myAccount', {balance : user['balance'].toFixed(2), 
                                  currency : result[0]['CurrencyName'],
                                  username : user['username'],
                                  email : user['email']});
    });  
  }
  else{
    res.redirect(loginPage);
  }
});

app.post('/partnerAccount', function(req, res){
  if(req.session.partner){
    updateSession(req, res, req.session.partner[0]['username']);
    var user = req.session.partner[0];
    var sql = "select CurrencyName from currency where CurrencyId =?;";
    var query = db.query(sql, req.session.partner[0]['currencyId'],function(err, result){
      if (err) throw err;
      res.render('Partner/myAccount', {balance : user['balance'].toFixed(2), 
                                  currency : result[0]['CurrencyName'],
                                  username : user['username'],
                                  email : user['email']});
    });
  }
  else{
    res.redirect(loginPage);
  }
});

//==============change email=================//
app.post('/partnerChangeEmail', function(req, res){
  if(req.session.partner){
    res.render('Partner/changeEmail');
  }
  else{
    res.redirect(loginPage);
  }
});

app.post('/partnerSubmitChangeEmail', function(req, res){
  if(req.session.partner){
    console.log(req.body.email);
    updateUser(req.session.partner[0]['accountId'], 'email', req.body.email);
    res.render('Register/resultPage',  {message: 'Email Changed, this might take a minute to be changed on your account page', pageReturn: '/partnerAccount'});
  }
  else{
    res.redirect(loginPage);
  }
});

//==============change currency=================//
app.post('/partnerChangeCurrency', function(req, res){
  if(req.session.partner){
    var sql = "SELECT * FROM currency;"; 
    var query = db.query(sql, function(err, result){
      if (err) throw err;
      // format the results and display then on the page
      var str = '';
      for(var i = 0; i < result.length; i++){
        str+="<option value="+result[i]['CurrencyId']+">"+ result[i]['CurrencyName'] +"</option>\n"
      }
      res.render('Partner/changeCurrency', {currencyOptions: str});
    });
  }
  else{
    res.redirect(loginPage);
  }
});

app.post('/partnerSubmitChangeCurrency', function(req, res){
  if(req.session.partner){
    if(req.body.currency != undefined){
      var sql = "SELECT c1.FromUSD as c1Rate, c2.FromUSD as c2Rate FROM currency as c1, currency as c2 WHERE c1.CurrencyId = ? AND c2.CurrencyId = ?;"; 
      var query = db.query(sql, [req.session.partner[0]['currencyId'], req.body.currency],function(err, result){
        if (err) throw err;
        var newBalance = req.session.partner[0]['balance'] * (result[0]['c1Rate']/result[0]['c2Rate']); 
        updateUser(req.session.partner[0]['accountId'], 'balance', newBalance);
        console.log(req.body.currency);
        updateUser(req.session.partner[0]['accountId'], 'currencyId', req.body.currency);
        res.render('Register/resultPage',  {message: 'Currency Changed, this might take a minute to be changed on your account page', pageReturn: '/partnerAccount'});
      });
    }
    else{
      var sql = "SELECT * FROM currency;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
        // format the results and display then on the page
        var str = '';
        for(var i = 0; i < result.length; i++){
          str+="<option value="+result[i]['CurrencyId']+">"+ result[i]['CurrencyName'] +"</option>\n"
        }
        res.render('Partner/changeCurrency', {currencyOptions: str});
      });
    }
  }
  else{
    res.redirect(loginPage);
  }
});

//==============Reset Password=================//
app.post('/partnerResetPassword', function(req, res){
  if(req.session.partner){
    res.render('Partner/resetPassword');
  }
  else{
    res.redirect(loginPage);
  }
});

app.get('/partnerResetPassword', function(req, res){
  if(req.session.partner){
      res.render('partner/resetPassword');
  }
  else{
      res.redirect(loginPage);
  }
  });
  

app.post('/partnerSubmitChangePassword', function(req, res){
  if(req.session.partner){
    if(md5(req.body.oldPass) == req.session.partner[0]['password']){
      updateUser(req.session.partner[0]['accountId'], 'password', md5(req.body.newPass));
      res.render('Register/resultPage',  {message: 'Password Changed', pageReturn: '/partnerAccount'});
    }
    else{
      res.redirect('partner/resetPassword');
    }
    
  }
  else{
    res.redirect(loginPage);
  }
});


//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//================================ADMIN CODE==================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//


//============================================================================//
//                                  ACCOUNT                                   //
//============================================================================//
app.post('/editAccounts', function(req, res){
  if(req.session.admin){
      //get dropdown message
      sql = "SELECT * FROM account;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
        var str = '';
        for(var i = 0; i < result.length; i++){
            str += "<option value="+result[i]['accountId']+">"+ result[i]['fName'] + ' ' +result[i]['lName'] + " ( " + result[i]['username'] + " ) " +"</option>\n";
        }
        var tranStr = '';
        var sql = "SELECT * FROM account, currency WHERE account.currencyId = currency.CurrencyId;";
        var query = db.query(sql, [req.session.admin[0]['accountId'],req.session.admin[0]['accountId']], function(err, result){
          if (err) throw err;
          for(var i = 0; i < result.length; i++){
            tranStr += "<tr><th scope='row'>" + result[i]['accountId'] +"</th><td>" +
                      result[i]['fName'] + "</td><td>" + result[i]['lName'] +"</td><td>" 
                      + result[i]['balance'].toFixed(2) + "</td><td>" + result[i]['CurrencyName'] + "</td><td>" + accountType(result[i]['type']) +"</td></tr>"; 
          }
          var currStr = '';
          var sql = "SELECT * FROM currency";
          var query = db.query(sql, [req.session.admin[0]['accountId'],req.session.admin[0]['accountId']], function(err, result){
            if (err) throw err;
            for(var i = 0; i < result.length; i++){
              currStr += "<option value="+result[i]['CurrencyId']+">"+ result[i]['CurrencyName'] +"</option>\n";
            }
            res.render('admin/account', {currencyOptions: currStr, transactionList: tranStr, options : str});
          });
        });
      });
  }
  else{
      res.redirect(loginPage);
  }
});

app.get('/editAccounts', function(req, res){
  if(req.session.admin){
      //get dropdown message
      sql = "SELECT * FROM account;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
        var str = '';
        for(var i = 0; i < result.length; i++){
            str += "<option value="+result[i]['accountId']+">"+ result[i]['fName'] + ' ' +result[i]['lName'] + " ( " + result[i]['username'] + " ) " +"</option>\n";
        }
        var tranStr = '';
        var sql = "SELECT * FROM account, currency WHERE account.currencyId = currency.CurrencyId;";
        var query = db.query(sql, [req.session.admin[0]['accountId'],req.session.admin[0]['accountId']], function(err, result){
          if (err) throw err;
          for(var i = 0; i < result.length; i++){
            tranStr += "<tr><th scope='row'>" + result[i]['accountId'] +"</th><td>" +
                      result[i]['fName'] + "</td><td>" + result[i]['lName'] +"</td><td>" 
                      + result[i]['balance'].toFixed(2) + "</td><td>" + result[i]['CurrencyName'] + "</td><td>" + accountType(result[i]['type']) +"</td></tr>"; 
          }
          var currStr = '';
          var sql = "SELECT * FROM currency";
          var query = db.query(sql, [req.session.admin[0]['accountId'],req.session.admin[0]['accountId']], function(err, result){
            if (err) throw err;
            for(var i = 0; i < result.length; i++){
              currStr += "<option value="+result[i]['CurrencyId']+">"+ result[i]['CurrencyName'] +"</option>\n";
            }
            res.render('admin/account', {currencyOptions: currStr, transactionList: tranStr, options : str});
          });
        });
      });
  }
  else{
      res.redirect(loginPage);
  }
});

app.post("/addAccount", function(req, res){ 
  if(req.session.admin){
    if(!(req.body.email == '' || req.body.fName == '' || req.body.lName == '' || req.body.DOB == '' || req.body.password == '' || req.body.type == undefined || req.body.email == undefined)){
      sql = "SELECT * FROM account where username = ?;"; 
      var query = db.query(sql, [req.body.username], function(err, result){
        if (err) throw err;
        if(!result.length){
          var sql = "INSERT INTO account VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"; 
          var query = db.query(sql, [null, req.body.email, req.body.username, req.body.fName, req.body.lName, req.body.DOB, md5(req.body.password), req.body.type, req.body.currency, 0], function(err, result){
            if (err) throw err;         
            res.render("Register/resultPage", {message : "account: " + req.body.username + " added", pageReturn: "/editAccounts"});
            sql = "SELECT * FROM account WHERE username=? AND password=?;"; 
            var query = db.query(sql, [req.body.username, md5(req.body.password)], function(err, result){
              if (err) throw err;
              //add to respective table
              if(req.body.type == 1){
                sql = "insert into user values(?, ?);"; 
                var query = db.query(sql, [result[0]['accountId'], req.body.phone], function(err, result){
                  if (err) throw err;
                });
              }
              else if(req.body.type == 2){
                sql = "insert into partner values(?);";
                var query = db.query(sql, result[0]['accountId'], function(err, result){
                  if (err) throw err;
                });
              }
              else if(req.body.type == 3){
                sql = "insert into admin values(?);"; 
                var query = db.query(sql, result[0]['accountId'], function(err, result){
                  if (err) throw err;
                });
              }
            });
          });
        }
        else{
          res.redirect('/editAccounts');
        }
      });
    }
    else{
      res.redirect('/editAccounts');
    }
  }
  else{
      res.redirect(loginPage);
  }   
});

app.post('/deleteAccount', function(req, res){
  if(req.session.admin){
      if(req.session.admin[0]['password'] == md5(req.body.password) && req.body.accountSelect != undefined){
          sql = "DELETE FROM account where accountId = ?;"; 
          var query = db.query(sql, req.body.accountSelect, function(err, result){
          if (err) throw err;
            res.render("Register/resultPage", {message : "account number " + req.body.accountSelect + " Removed", pageReturn: "/editAccounts"});
          });
      }
      else{
        res.redirect('/editAccount');
      }
  }
  else{
      res.redirect(loginPage);
  }
});

//============================================================================//
//                                  CURRENCY                                  //
//============================================================================//
app.post('/editCurrency', function(req, res){
  if(req.session.admin){
      //get dropdown message
      sql = "SELECT * FROM currency;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
        var str = '';
        for(var i = 0; i < result.length; i++){
            str += "<option value="+result[i]['CurrencyId']+">" + result[i]['CurrencyName'] + "</option>\n";
        }
        var currStr = '';
        var sql = "SELECT * FROM currency;";
        var query = db.query(sql, function(err, result){
          if (err) throw err;
          for(var i = 0; i < result.length; i++){
            currStr += "<tr><th scope='row'>" + result[i]['CurrencyId'] +"</th><td>" +
                      result[i]['CurrencyName'] +"</td></tr>"; 
          }
          res.render('admin/currency', {currencyOptions: str, transactionList : currStr});
        });
      });
  }
  else{
      res.redirect(loginPage);
  }
});

app.get('/editCurrency', function(req, res){
  if(req.session.admin){
      //get dropdown message
      sql = "SELECT * FROM currency;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
        var str = '';
        for(var i = 0; i < result.length; i++){
            str += "<option value="+result[i]['CurrencyId']+">" + result[i]['CurrencyName'] + "</option>\n";
        }
        var currStr = '';
        var sql = "SELECT * FROM currency;";
        var query = db.query(sql, function(err, result){
          if (err) throw err;
          for(var i = 0; i < result.length; i++){
            currStr += "<tr><th scope='row'>" + result[i]['CurrencyId'] +"</th><td>" +
                      result[i]['CurrencyName'] +"</td></tr>"; 
          }
          res.render('admin/currency', {currencyOptions: str, transactionList : currStr});
        });
      });
  }
  else{
      res.redirect(loginPage);
  }
});

app.post("/addCurrency", function(req, res){ 
  if(req.session.admin){
    if(!(req.body.name == '' || req.body.fromUSD == '')){
      sql = "SELECT * FROM currency where CurrencyId = ?;"; 
      var query = db.query(sql, [req.body.currency], function(err, result){
        if (err) throw err;
        if(!result.length){
          var sql = "INSERT INTO currency VALUES(?, ?, ?);"; 
          var query = db.query(sql, [null, req.body.name, req.body.fromUSD], function(err, result){
            if (err) throw err;         
            res.render("Register/resultPage", {message : "Currency: " + req.body.name + " added", pageReturn: "/editCurrency"});
          });
        }
        else{
          res.redirect('/editCurrency');
        }
      });
    }
    else{
      res.redirect('/editCurrency');
    }
  }
  else{
      res.redirect(loginPage);
  }   
});

app.post('/deleteCurrency', function(req, res){
  if(req.session.admin){
      if(req.session.admin[0]['password'] == md5(req.body.password) && req.body.currency != undefined){
          sql = "DELETE FROM currency where CurrencyId = ?;"; 
          var query = db.query(sql, req.body.currency, function(err, result){
          if (err) throw err;
            res.render("Register/resultPage", {message : "currency number " + req.body.currency + " Removed", pageReturn: "/editCurrency"});
          });
      }
      else{
        res.redirect('/editCurrency');
      }
  }
  else{
      res.redirect(loginPage);
  }
});

//============================================================================//
//                                  COUNTRY                                   //
//============================================================================//
app.post('/editCountry', function(req, res){
  if(req.session.admin){
      //get dropdown message
      sql = "SELECT * FROM country;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
        var str = '';
        for(var i = 0; i < result.length; i++){
            str += "<option value="+result[i]['countryId']+">" + result[i]['countryName'] + "</option>\n";
        }
        var ctryStr = '';
        var sql = "SELECT * FROM country;";
        var query = db.query(sql, function(err, result){
          if (err) throw err;
          for(var i = 0; i < result.length; i++){
            ctryStr += "<tr><th scope='row'>" + result[i]['countryId'] +"</th><td>" +
                      result[i]['countryName'] +"</td></tr>"; 
          }
          sql = "SELECT * FROM currency;"; 
          var query = db.query(sql, function(err, result){
            if (err) throw err;
            var currStr = '';
            for(var i = 0; i < result.length; i++){
                currStr += "<option value="+result[i]['CurrencyId']+">" + result[i]['CurrencyName'] + "</option>\n";
            }
            res.render('admin/country', {countryOptions: str, currencyOptions: currStr, transactionList : ctryStr});
          });
        });
      });
  }
  else{
      res.redirect(loginPage);
  }
});

app.get('/editCountry', function(req, res){
  if(req.session.admin){
      //get dropdown message
      sql = "SELECT * FROM country;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
        var str = '';
        for(var i = 0; i < result.length; i++){
            str += "<option value="+result[i]['countryId']+">" + result[i]['countryName'] + "</option>\n";
        }
        var ctryStr = '';
        var sql = "SELECT * FROM country;";
        var query = db.query(sql, function(err, result){
          if (err) throw err;
          for(var i = 0; i < result.length; i++){
            ctryStr += "<tr><th scope='row'>" + result[i]['countryId'] +"</th><td>" +
                      result[i]['countryName'] +"</td></tr>"; 
          }
          sql = "SELECT * FROM currency;"; 
          var query = db.query(sql, function(err, result){
            if (err) throw err;
            var currStr = '';
            for(var i = 0; i < result.length; i++){
                currStr += "<option value="+result[i]['CurrencyId']+">" + result[i]['CountryName'] + "</option>\n";
            }
            res.render('admin/country', {countryOptions: str, currencyOptions: currStr, transactionList : ctryStr});
          });
        });
      });
  }
  else{
      res.redirect(loginPage);
  }
});

//add get later

app.post("/addCountry", function(req, res){ 
  if(req.session.admin){
    if(!(req.body.name == '' || req.body.currency == '' )){
      sql = "SELECT * FROM country where countryName = ?;"; 
      var query = db.query(sql, [req.body.name], function(err, result){
        if (err) throw err;
        if(!result.length){
          var sql = "INSERT INTO country VALUES(?, ?, ?);"; 
          var query = db.query(sql, [null, req.body.name, req.body.currency], function(err, result){
            if (err) throw err;         
            res.render("Register/resultPage", {message : "Country: " + req.body.name + " added", pageReturn: "/editCountry"});
          });
        }
        else{
          res.redirect('/editCountry');
        }
      });
    }
    else{
      res.redirect('/editCountry');
    }
  }
  else{
      res.redirect(loginPage);
  }   
});

app.post('/deleteCountry', function(req, res){
  if(req.session.admin){
      if(req.session.admin[0]['password'] == md5(req.body.password) && req.body.country != undefined){
          sql = "DELETE FROM country where countryId = ?;"; 
          var query = db.query(sql, req.body.country, function(err, result){
          if (err) throw err;
            res.render("Register/resultPage", {message : "Country number " + req.body.country + " Removed", pageReturn: "/editCountry"});
          });
      }
      else{
        res.redirect('/editCountry');
      }
  }
  else{
      res.redirect(loginPage);
  }
});

//============================================================================//
//                                  FEE                                       //
//============================================================================//
app.post('/editFees', function(req, res){
  if(req.session.admin){
      //get dropdown message
      sql = "SELECT * FROM fee;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
        var str = '';
        for(var i = 0; i < result.length; i++){
            str += "<option value="+result[i]['FeeId']+">" + result[i]['FeeName'] + "</option>\n";
        }
        var feeStr = '';
        var sql = "SELECT * FROM Fee,country WHERE fee.countryId = country.countryId;";
        var query = db.query(sql, function(err, result){
          if (err) throw err;
          for(var i = 0; i < result.length; i++){
            feeStr += "<tr><th scope='row'>" + result[i]['FeeId'] +"</th><td>" +
            result[i]['FeeName'] + "</th><td>" + result[i]['FeeRate'] + "</th><td>" + result[i]['countryName'] + "</th><td>" + result[i]['transactionType'] +"</td></tr>"; 
          }
          sql = "SELECT * FROM country;"; 
          var query = db.query(sql, function(err, result){
            if (err) throw err;
            var currStr = '';
            for(var i = 0; i < result.length; i++){
                currStr += "<option value="+result[i]['countryId']+">" + result[i]['countryName'] + "</option>\n";
            }
            res.render('admin/fees', {feeOptions: str, countryOptions: currStr, transactionList : feeStr});
          });
        });
      });
  }
  else{
      res.redirect(loginPage);
  }
});

app.get('/editFees', function(req, res){
  if(req.session.admin){
      //get dropdown message
      sql = "SELECT * FROM fee;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
        var str = '';
        for(var i = 0; i < result.length; i++){
            str += "<option value="+result[i]['FeeId']+">" + result[i]['FeeName'] + "</option>\n";
        }
        var feeStr = '';
        var sql = "SELECT * FROM Fee,country WHERE fee.countryId = country.countryId;";
        var query = db.query(sql, function(err, result){
          if (err) throw err;
          for(var i = 0; i < result.length; i++){
            feeStr += "<tr><th scope='row'>" + result[i]['FeeId'] +"</th><td>" +
            result[i]['FeeName'] + "</th><td>" + result[i]['FeeRate'] + "</th><td>" + result[i]['countryName'] + "</th><td>" + result[i]['transactionType'] +"</td></tr>"; 
          }
          sql = "SELECT * FROM country;"; 
          var query = db.query(sql, function(err, result){
            if (err) throw err;
            var currStr = '';
            for(var i = 0; i < result.length; i++){
                currStr += "<option value="+result[i]['countryId']+">" + result[i]['countryName'] + "</option>\n";
            }
            res.render('admin/fees', {feeOptions: str, countryOptions: currStr, transactionList : feeStr});
          });
        });
      });
  }
  else{
      res.redirect(loginPage);
  }
});

//add get later

app.post("/addFee", function(req, res){ 
  if(req.session.admin){
    if(!(req.body.name == '' || req.body.rate == '' || req.body.country == undefined || req.body.type == '')){
      sql = "SELECT * FROM fee where FeeName = ?;"; 
      var query = db.query(sql, [req.body.name], function(err, result){
        if (err) throw err;
        if(!result.length){
          var sql = "INSERT INTO fee VALUES(?, ?, ?, ?, ?);"; 
          var query = db.query(sql, [null, req.body.name, req.body.rate, req.body.country, req.body.type], function(err, result){
            if (err) throw err;         
            res.render("Register/resultPage", {message : "fee: " + req.body.name + " added", pageReturn: "/editFees"});
          });
        }
        else{
          res.redirect('/editFees');
        }
      });
    }
    else{
      res.redirect('/editFees');
    }
  }
  else{
      res.redirect(loginPage);
  }   
});

app.post('/deleteFee', function(req, res){
  if(req.session.admin){
      if(req.session.admin[0]['password'] == md5(req.body.password) && req.body.fee != undefined){
          sql = "DELETE FROM fee where FeeId = ?;"; 
          var query = db.query(sql, req.body.fee, function(err, result){
          if (err) throw err;
            res.render("Register/resultPage", {message : "Fee number " + req.body.currency + " Removed", pageReturn: "/editFees"});
          });
      }
      else{
        res.redirect('/editFees');
      }
  }
  else{
      res.redirect(loginPage);
  }
});
//============================================================================//
//                                   REWARD -add partner reward               //
//============================================================================//
app.post('/editRewards', function(req, res){
  if(req.session.admin){
      //get dropdown message
      sql = "SELECT * FROM userReward;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
        var str = '';
        for(var i = 0; i < result.length; i++){
            str += "<option value="+result[i]['rewardId']+">" + result[i]['rewardName'] + "</option>\n";
        }
        var rewardStr = '';
        var sql = "SELECT * FROM userReward;";
        var query = db.query(sql, function(err, result){
          if (err) throw err;
          for(var i = 0; i < result.length; i++){
            rewardStr += "<tr><th scope='row'>" + result[i]['rewardId'] +"</th><td>" +
            result[i]['rewardName'] + "</th><td>" + result[i]['rewardPoints'] + "</th><td>" + result[i]['rewardLevel']  + "</td></tr>"; 
          }
          res.render('admin/reward', {rewardOptions: str, transactionList : rewardStr});
        });
      });
  }
  else{
      res.redirect(loginPage);
  }
});

app.get('/editRewards', function(req, res){
  if(req.session.admin){
      //get dropdown message
      sql = "SELECT * FROM userReward;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
        var str = '';
        for(var i = 0; i < result.length; i++){
            str += "<option value="+result[i]['rewardId']+">" + result[i]['rewardName'] + "</option>\n";
        }
        var rewardStr = '';
        var sql = "SELECT * FROM userReward;";
        var query = db.query(sql, function(err, result){
          if (err) throw err;
          for(var i = 0; i < result.length; i++){
            rewardStr += "<tr><th scope='row'>" + result[i]['rewardId'] +"</th><td>" +
            result[i]['rewardName'] + "</th><td>" + result[i]['rewardPoints'] + "</th><td>" + result[i]['rewardLevel']  + "</td></tr>"; 
          }
          res.render('admin/reward', {rewardOptions: str, transactionList : rewardStr});
        });
      });
  }
  else{
      res.redirect(loginPage);
  }
});

app.post("/addReward", function(req, res){ 
  if(req.session.admin){
    if(!(req.body.name == '' || req.body.points == ''|| req.level == '')){
      sql = "SELECT * FROM userReward where rewardName = ?;"; 
      var query = db.query(sql, [req.body.name], function(err, result){
        if (err) throw err;
        console.log(result);
        if(!result.length){
          var sql = "INSERT INTO userReward VALUES(?, ?, ?, ?);"; 
          var query = db.query(sql, [null, req.body.name, req.body.points, req.body.level], function(err, result){
            if (err) throw err;         
            res.render("Register/resultPage", {message : "reward: " + req.body.name + " added", pageReturn: "/editRewards"});
          });
        }
        else{
          res.redirect('/editRewards');
        }
      });
    }
    else{
      res.redirect('/editRewards');
    }
  }
  else{
      res.redirect(loginPage);
  }   
});

app.post('/deleteReward', function(req, res){
  if(req.session.admin){
      if(req.session.admin[0]['password'] == md5(req.body.password) && req.body.reward != undefined){
          sql = "DELETE FROM userReward where rewardId = ?;"; 
          var query = db.query(sql, req.body.reward, function(err, result){
          if (err) throw err;
            res.render("Register/resultPage", {message : "Reward number " + req.body.reward + " Removed", pageReturn: "/editRewards"});
          });
      }
      else{
        res.redirect('/editRewards');
      }
  }
  else{
      res.redirect(loginPage);
  }
});

//============================================================================//
//                                 MY ACCOUNT                                 //
//============================================================================//

app.get('/adminAccount', function(req, res){
  if(req.session.admin){
    updateSession(req, res, req.session.admin[0]['username']);
    var user = req.session.admin[0];
    var sql = "select CurrencyName from currency where CurrencyName =" + req.session.admin[0]['currencyId'] + ";";
    var query = db.query(sql, function(err, result){
      if (err) throw err;
      res.render('ADMIN/myAccount', {balance : user['balance'].toFixed(2), 
                                  currency : result[0]['CurrencyName'],
                                  username : user['username'],
                                  email : user['email']});
    });  
  }
  else{
    res.redirect(loginPage);
  }
});

app.post('/adminAccount', function(req, res){
  if(req.session.admin){
    updateSession(req, res, req.session.admin[0]['username']);
    console.log(req.session.admin[0]['currencyId']);
    var user = req.session.admin[0];
    var sql = "select CurrencyName from currency where CurrencyId =" + req.session.admin[0]['currencyId'] + ";";
    var query = db.query(sql, function(err, result){
      if (err) throw err;
      res.render('ADMIN/myAccount', {balance : user['balance'].toFixed(2), 
                                  currency : result[0]['CurrencyName'],
                                  username : user['username'],
                                  email : user['email']});
    });
  }
  else{
    res.redirect(loginPage);
  }
});

//==============change email=================//
app.post('/adminChangeEmail', function(req, res){
  if(req.session.admin){
    res.render('ADMIN/changeEmail');
  }
  else{
    res.redirect(loginPage);
  }
});

app.post('/adminSubmitChangeEmail', function(req, res){
  if(req.session.admin){
    if(req.body.email != ''){
      updateUser(req.session.admin[0]['accountId'], 'email', req.body.email);
      res.render('Register/resultPage',  {message: 'Email Changed, this might take a minute to be changed on your account page', pageReturn: '/adminAccount'});
    }
    else{
      res.render('ADMIN/changeEmail');
    }
  }
  else{
    res.redirect(loginPage);
  }
});

//==============change currency=================//
app.post('/adminChangeCurrency', function(req, res){
  if(req.session.admin){
    var sql = "SELECT * FROM currency;"; 
    var query = db.query(sql, function(err, result){
      if (err) throw err;
      // format the results and display then on the page
      var str = '';
      for(var i = 0; i < result.length; i++){
        str+="<option value="+result[i]['CurrencyId']+">"+ result[i]['CurrencyName'] +"</option>\n"
      }
      res.render('ADMIN/changeCurrency', {currencyOptions: str});
    });
  }
  else{
    res.redirect(loginPage);
  }
});

app.post('/adminSubmitChangeCurrency', function(req, res){
  if(req.session.admin){
    if(req.body.currency != undefined){
      
      var sql = "SELECT c1.FromUSD as c1Rate, c2.FromUSD as c2Rate FROM currency as c1, currency as c2 WHERE c1.CurrencyId = ? AND c2.CurrencyId = ?;"; 
      var query = db.query(sql, [req.session.admin[0]['currencyId'], req.body.currency],function(err, result){
        if (err) throw err;
        var newBalance = req.session.admin[0]['balance'] * (result[0]['c1Rate']/result[0]['c2Rate']); 
        updateUser(req.session.admin[0]['accountId'], 'balance', newBalance);
        updateUser(req.session.admin[0]['accountId'], 'currencyId', req.body.currency);
        res.render('Register/resultPage',  {message: 'Currency Changed, this might take a minute to be changed on your account page', pageReturn: '/adminAccount'});
      });
    }
    else{
      var sql = "SELECT * FROM currency;"; 
      var query = db.query(sql, function(err, result){
        if (err) throw err;
        // format the results and display then on the page
        var str = '';
        for(var i = 0; i < result.length; i++){
          str+="<option value="+result[i]['CurrencyId']+">"+ result[i]['CurrencyName'] +"</option>\n"
        }
        res.render('ADMIN/changeCurrency', {currencyOptions: str});
      });
    }
  }
  else{
    res.redirect(loginPage);
  }
});

//==============Reset Password=================//
app.post('/adminResetPassword', function(req, res){
  if(req.session.admin){
    res.render('ADMIN/resetPassword');
  }
  else{
    res.redirect(loginPage);
  }
});

app.post('/adminSubmitChangePassword', function(req, res){
  if(req.session.admin){
    if(md5(req.body.oldPass) == req.session.admin[0]['password']){
      updateUser(req.session.admin[0]['accountId'], 'password', md5(req.body.newPass));
      res.render('Register/resultPage',  {message: 'Password Changed', pageReturn: '/adminAccount'});
    }
    else{
      res.render('ADMIN/resetPassword');
    }
    
  }
  else{
    res.redirect(loginPage);
  }
});




//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//=================================EXTRA CODE=================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//
//============================================================================//




//============================================================================//
//                            LISTENER                                        //
//============================================================================//
app.listen(3000, function(){
  console.log("running on port 3000");
});

//============================================================================//
//                           HELPER FUNCTIONS                                 //
//============================================================================//
//from https://stackoverflow.com/questions/3231459/create-unique-id-with-javascript
const uid = function(){
  return Date.now().toString(36) + Math.random().toString(36);
}

function createTransaction(sendId, recId, value, sendCurr, recCurr, sendType, recType, fee){
  transaction.sender = sendId;
  transaction.receiver = recId;
  transaction.value = value;
  transaction.sendCurr = sendCurr;
  transaction.recCurr = recCurr;
  transaction.transType = sendType + "" + recType;
  transaction.fee = fee;
 
}

var transaction = {
  sender: 0,
  receiver: 0,
  value: 0,
  sendCurr: 0,
  recCurr: 0,
  transType: 0,
  fee: 0,

};

function updateTransactions(){
  var t = transaction;
  var sql = "insert into transactions(SenderId, ReceiverId, Value, CurrencyFromSender, CurrencyToReceiver, FeeId) values(?, ?, ?, ?, ?, ?);"; 
  var query = db.query(sql, [t.sender, t.receiver, t.value, t.sendCurr, t.recCurr, t.fee], function(err, result){
  if (err) throw err;
  });
}

function updateUser(id, field, newValue){
   var sql = "update account set "+field+"=? where accountID='" + id + "';"; 
   var query = db.query(sql, [newValue], function(err, result){
    if (err) throw err;
   });
}

function updateBalance(id, field, value){
  var sql = "SELECT * FROM account WHERE accountId=?;"; 
  var query = db.query(sql, id, function(err, result){
    if (err) throw err;
    
    var newBalance = result[0]['balance'] + value;
    console.log(newBalance);
    var sql = "update account set "+field+"=? where accountID='" + id + "';"; 
    var query = db.query(sql, newBalance, function(err, result){
      if (err) throw err;
    });
  });
}

function countriesDropdown(){
  var returnString = '';

  console.log(returnString);;
  return returnString;
   
}

var accountType = function(type){
  switch(type){
    case '1': 
      return 'user';
    case '2': 
      return 'partner';
    case '3': 
      return 'admin';
    default:
      return;
  }
}

function UpdateAccountsBalance(value, currFrom, currTo, sender, receiver, fee){
  var sql = "SELECT * FROM currency WHERE CurrencyId=? ;"; 
  var query = db.query(sql, [currFrom], function(err, result){
    if (err) throw err;
    var currFrom_FromUSD = result[0]['FromUSD'];
    var sql = "SELECT * FROM currency WHERE CurrencyId=? ;"; 
    var query = db.query(sql, [currTo], function(err, result){
      if (err) throw err;
      var currTo_FromUSD = result[0]['FromUSD']; 
      //calculate conversion rate and fees
      var conversionRate = 1/currFrom_FromUSD * currTo_FromUSD;
      var sql = "SELECT * FROM fee WHERE FeeId=? ;"; 
      var query = db.query(sql, [fee], function(err, result){
        if (err) throw err;
        //calculate new value
        transactionValue = (value * conversionRate );
        var transactionValueWithFee = transactionValue + (transactionValue * (parseFloat(result[0]['FeeRate'])));
        console.log('transaction complete');
        updateBalance(sender, 'balance', (-1 * transactionValueWithFee));
        updateBalance(receiver, 'balance', transactionValue);
      });
    });
  });
}

function updateSession(req, res, username){
  var sql = "SELECT * FROM account WHERE username=?;"; 
  var query = db.query(sql, username, function(err, result){
    if (err) throw err;
    if(!result.length){
      res.render("Register/logIn");
    }
    else{
      if(result[0]['type'] == 1){
        req.session.user = result;
      }
      else if(result[0]['type'] == 2){
        req.session.partner = result;
      }
      else if(result[0]['type'] == 3){
        req.session.admin = result;
      }
    }
  });
}
