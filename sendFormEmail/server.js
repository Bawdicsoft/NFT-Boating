// Chunk 1
require("dotenv").config()
const express = require("express")
const path = require("path")
const sendMail = require("./mail")
const { log } = console
const app = express()
var cors = require("cors")

const PORT = process.env.PORT || 8080

let corsOptions = {
  origin: [
    "https://nftboating.io",
    "http://nftboating.io",
    "http://localhost:3010",
    "http://localhost:3000",
  ],
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
// Data parsing
app.use(
  express.urlencoded({
    extended: false,
  })
)
app.use(express.json())

app.get("/", function (req, res) {
  res.send("Hello World")
})

// email, subject, text
app.post("/email", function (req, res) {
  const { fromName, from, to, subject, text, html } = req.body
  log("Data: ", req.body)

  sendMail(fromName, from, to, subject, text, html)
    .then((result) => {
      log("Email sent...", result)
      res.json({ msg: "Email sent..." })
    })
    .catch((error) => {
      console.log(error.message)
      res.json({ msg: "Email not sent..." })
    })
})

// Start server
app.listen(PORT, () => log("Server is starting on PORT, ", PORT))
