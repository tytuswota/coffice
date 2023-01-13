const coffee = require("./coffee")

class CoffeeMaker
{

    brewCoffee(coffeeId)
    {
        new coffee().getCoffeeParameters(coffeeId);
        console.log(coffeeId);
        console.log("brew coffee");
        //connect to the coffeeMaker esp and make some coffee
    }

}

module.exports = CoffeeMaker;