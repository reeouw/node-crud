const https = require("https");
const fs = require('fs');
const express = require("express");
const cors = require("cors");
const app = express();

const dotenv = require('dotenv');

dotenv.config();

global.__basedir = __dirname;


var corsOptions = {
  origin: "https://www.mobilku.biz"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome." });
});

// require("./app/routes/vehicle.route.js")(app);
require("./app/routes/mobilku.route.js")(app);

// Function to serve all static files
// inside resources directory. 
app.use(express.static('resources'));

// set port, listen for requests
const PORT = process.env.PORT;
https
  .createServer({
    key: fs.readFileSync("cert/key.pem"),
    cert: fs.readFileSync("cert/cert.pem"),
  },app)
  .listen(PORT, () => {
  console.log(`Server is running on port https://localhost:${PORT}.`);
});
