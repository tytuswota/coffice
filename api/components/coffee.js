const express = require('express');

var mysql = require('mysql');

var jwt = require('jsonwebtoken');

const jwtKey = "my_secret_key"

var db_config = {
    host: "localhost",
    port: "6033",
    user: "root",
    password: "my_secret_password",
    database: "Coffice"
  };
  
  var connection;
  
  function handleDisconnect(req, res) {
    connection = mysql.createConnection(db_config);
  
    connection.connect(function(err) 
    {
      if(err) {
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); 
      }else{
        console.log("no error everything fine!");
      }                  
    });  

    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') 
      {
        handleDisconnect(); 
      } else 
      {          
        throw err; 
      }
    });

    console.log("Connected!");

    return connection;
  }

  function insterCoffee(connection, req)
  {
    coffee_name = req.body.coffee_name;
    params = req.body.params;
    nfc_id = req.body.nfc_id;

    var cookie = req.headers.cookie;
    var token = String(cookie).replace("token=", "");
    var decoded = jwt.verify(token, jwtKey);
    var userId = decoded.userId;
    var insertedId = 0;

    var sql = "INSERT INTO coffee (name, params) VALUES ?";
  
    var values = [[coffee_name,params]];
    
    console.log("before connection");

    connection.query(sql, [values], function(err, result) {
      //console.log("in the query things");
      if (err) throw err;
      insertedId = result.insertId;

      var sql = "INSERT INTO NFC (nfc_id, coffee_id, user_id) VALUES ?";
      
      var values = [[nfc_id,insertedId,userId]];

      connection.query(sql, [values], function(err, result) {
        if (err) throw err;
      });
    });

    
  }

function selectUserData(req, connection, callback)
{
    connection.query("SELECT * FROM user WHERE user_name = "  + mysql.escape(req.body.user_name), function (err, result) {
        if (err) throw err;
  
        callback(null, result);
    });
}




class Coffee {
    //There are two options bind NFCid to coffee with or without userID
    //You bind a coffee to the NFC via the app with or without an account
    bindCoffee(req, res)
    {
        //bind scand cup to the user
        insterCoffee(handleDisconnect(req, res), req);
        res.send(200);
    }

    myCoffee(req, res)
    {
        
        //shows list of coffee's made by the user
    }

    coffeeExplorer(req)
    {
        console.log("hello from the coffee explorer");
        //shows a list off all the public coffee's
    }

    getCoffeeParameters(req, res)
    {
        
        res.send("getting the coffee params for you bby");

        //coffeeParameters = {};    
        return {};
    }
}

module.exports = Coffee;