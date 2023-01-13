
const express = require('express');
var jwt = require('jsonwebtoken');

const jwtKey = "my_secret_key"
const jwtExpirySeconds = 300

var auth = function(req, res) {
    try {
        var cookie = req.headers.cookie;
        var token = String(cookie).replace("token=", "");
        jwt.verify(token, jwtKey);

        res.status(200);
        
        return true;
    } catch (err) {
        res.status(401);
        res.end();
        return false;
    }
}

module.exports = auth;