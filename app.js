const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listing = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require('express-session');

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const MONGO_URL = "mongodb+srv://ashumaurya2511:ashutosh21@cluster0.kv1amsz.mongodb.net/"


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

const sessionOptions = {
  secret: "mysecretcode",
  resave: false,
  saveUninitialized: true
};

app.use(session(sessionOptions));


app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.use("/listings", listing); 
app.use("/listings/:id/reviews", reviews)

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.render("error.ejs", { message });
})

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

