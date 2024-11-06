const express = require("express");
const app = express();
const Restaurant = require("../models/index")
const db = require("../db/connection");
const router = require("./routes/restaurants");

app.use(express.json())
app.use(express.urlencoded())
app.use('/restaurants', router)

module.exports = app;