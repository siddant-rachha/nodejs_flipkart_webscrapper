const express = require("express")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const cors = require("cors")

dotenv.config();

//route imports
const scrapper = require('./routes/scrapper.js')



const app = express();

app.use(cors());
app.use(bodyParser.json())

app.use("/test", (req, res) => { return res.send("test") })
app.use("/", scrapper)


//server listen
app.listen(process.env.PORT || 5000, () => {
    console.log("server is running")
})