var express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  app = express(),
  passport = require("passport"),
  passportLocal = require("passport-local"),
  flash = require("connect-flash"),
  session = require("express-session"),
  methodOverride = require("method-override");

//connecting to mongodb server  ,u've to put your username and password at place of  <dbuser> and <dbpassword>
mongoose.connect(
  "mongodb+srv://<dbuser>:<dbpassword>@cluster0-fxzpf.mongodb.net/test?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  }
);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
var Review = require("./models/review");
var Car = require("./models/car");
var User = require("./models/user");
var BookingInfo = require("./models/bookingInfo");

var reviewRoutes = require("./routes/review"),
  carRoutes = require("./routes/car"),
  indexRoutes = require("./routes/index");

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// app.use(cookieParser("secret"));
app.use(
  require("express-session")({
    secret: "Marriam@2444",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

Car.find({}, function (err, allCars) {
  if (err) {
    console.log("why is everything");
    console.log(err);
  } else {
    allCars.forEach(function (car) {
      car.isAvailable = true;
      car.save();
    });
  }
});

app.use("/", indexRoutes);
app.use("/cars", carRoutes);
app.use("/cars/:id/review", reviewRoutes);

app.listen(process.env.PORT, process.env.IP, function () {
  console.log("Car Rental Server Started");
});
