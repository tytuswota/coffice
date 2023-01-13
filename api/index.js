const fs = require("fs/promises");
const express = require("express");
const cors = require("cors");
const router = require("./middleware/router");


const app = express();

app.use(express.json())
app.use("/", router)

app.listen(3000, () => console.log("API Server is running ..."))