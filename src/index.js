const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post("/api/v1/scissors", (req, res, next) => {
  try {
    console.log(req.body);
    return res.json({ message: "scissors responding", success: true });
  } catch (error) {
    next(error);
  }
});

app.use("*", (req, res, next) => {
  next({ code: 400, message: "Resource not found" });
});

app.use((err, req, res, next) => {
  return res.status(err.code || 500).send({
    success: false,
    message: err.message || "Oops! Something went wrong. Please try again later.",
    data: {},
  });
});

app.listen(PORT, () => console.log("Server is running on port " + PORT));
