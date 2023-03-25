const express = require("express");
const cors = require("cors"); 
const app = express();

const dotenv = require('dotenv');

dotenv.config();

global.__basedir = __dirname;


var corsOptions = {
  origin: "http://localhost:8081"
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
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}.`);
});
