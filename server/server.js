const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const db = require("./db/conn");
const routes = require("./routes/record");

app.use(express.json());

// Connect to the database
db.connectToDatabase();

// Use the routes
app.use("/stepik", routes);

// Start the Express.js server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
