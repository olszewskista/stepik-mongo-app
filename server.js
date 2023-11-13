const express = require("express");
const app = express();
const cors = require("cors");
// require("dotenv").config();
const port = process.env.PORT || 3000;
const db = require("./db/conn");
const routes = require("./routes/record");

app.use(express.json());
app.use(cors())

db.connectToDatabase();

app.use("/stepik", routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
