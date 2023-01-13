const express = require('express');
const coffeeMaker = require('../components/coffeeMaker');
const coffee = require('../components/coffee');
const user = require('../components/user');
const router = express.Router();
const auth = require("../auth/auth");

//======user page
router.post("/register", (req, res) => {
    new user().register(req, res);
});

router.get("/login", (req, res) => {
    new user().login(req,res);
});

//=======coffee page
router.post("/bindCoffee", (req, res) => {
    if(auth(req, res))
    {
        new coffee().bindCoffee(req, res);
    }
});


router.get("/getCoffee", (req, res) => {
    if(auth(req, res))
    {
        new coffee().getCoffeeParameters(req, res);
    }
});

router.get("/coffeeExplore", (req, res) => {
    if(auth(req, res))
    {
        new coffee().coffeeExporer();
    }
});

//=======coffee maker
router.post("/brewCoffee", (req, res) => {
    if(auth(req, res))
    {
        new coffeeMaker().brewCoffee(req, res);

        res.send(200);
    }
    
});

module.exports = router;