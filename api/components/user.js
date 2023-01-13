const { values, result } = require('lodash');
var mysql = require('mysql');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
const express = require('express');
const jwt = require("jsonwebtoken");

const jwtKey = "my_secret_key"
const jwtExpirySeconds = 300

const slatRounds = 3;

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

  function insterRegistration(connection, req)
  {
    user_name = req.body.user_name;
    email = req.body.email;

    bcrypt.genSalt(slatRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hashed_password) {
            var sql = "INSERT INTO user (user_name, email, password) VALUES ?";
            var values = [[user_name,email, hashed_password]];
                    
            connection.query(sql, [values], function(err, result) {
                if (err) throw err;
                console.log("records inserted");
            });
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


class User {
    async login(req, res)
    {
        let connection = handleDisconnect(req, res);

        selectUserData(req, connection, function(err, user_data){
    
            bcrypt.compare(req.body.password, user_data[0].password, function(err, result) 
            {    
                if (result == false) 
                {
                    res.send(401);
                } else if(result == true)
                {
                    var userName = req.body.user_name;
                    var userId = user_data[0].user_id;
                    const token = jwt.sign({userName, userId}, jwtKey, {
                        algorithm: "HS256",
                        expiresIn: jwtExpirySeconds
                    });

                    res.cookie("token", token, {maxAge: jwtExpirySeconds * 1000})
                    res.send(200);
                }
            });
        });
    }

    register(req, res)
    {
        let connection = handleDisconnect(req, res);
        insterRegistration(connection, req);
        res.send(200);
    }
}

module.exports = User;